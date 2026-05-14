import { DomainResponse } from "@/libs/shape/auth/types";
import { Quiz, QuizAnswer, QuizCreate, QuizFinish } from "../domain/quiz";
import { QuizzesRepository } from "../repository/quizzes-repository";
import { QuestionRepository } from "../repository/question-repository";
import { ConfigQuiz, ITCTopic, Option, Question, ResponseQuestion, TopicOption } from "../models";
import { AnswersRepository } from "../repository/answers-repository";
import { QuizScore } from "../domain/score";

export class QuizService {
  constructor(
    private readonly questionsRepository: QuestionRepository,
    private readonly quizzesRepository: QuizzesRepository,
    private readonly answersRepository: AnswersRepository
  ) { }

  async start(quiz: QuizCreate): Promise<DomainResponse<Quiz>> {
    return this.quizzesRepository.create(quiz);
  }

  async complete(id: string, data: QuizFinish): Promise<DomainResponse<Quiz>> {
    return this.quizzesRepository.finish(id, data);
  }

  async getTopics(): Promise<TopicOption[]> {
    return this.questionsRepository.getTopicsAvailability();
  }

  async getAll(topics: ITCTopic[], count: number, userId?: string): Promise<Question[]> {
    let excludeIds: string[] = [];

    if (userId) {
      const answersResult = await this.answersRepository.getByUserId(userId);
      if (answersResult.data) {
        const latestAnswersMap = new Map<string, boolean>();
        
        [...answersResult.data]
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
          .forEach((a) => {
            latestAnswersMap.set(a.questionId, a.isCorrect);
          });

        excludeIds = Array.from(latestAnswersMap.entries())
          .filter(([, isCorrect]) => isCorrect)
          .map(([id]) => id);
      }
    }

    return this.questionsRepository.getAll(topics, count, excludeIds);
  }

  async validateAnswer(questionId: string, answerId: number): Promise<boolean> {
    return this.questionsRepository.checkAnswer(questionId, answerId);
  }

  async getQuestionById(id: string): Promise<Question | null> {
    const questions = await this.questionsRepository.getCorrectAnswer([id]);
    return questions[0] ?? null;
  }

  async getValidatedOptions(questionId: string, selectedIds: number[]): Promise<Option[]> {
    const question = await this.getQuestionById(questionId);
    if (!question) return [];

    return question.options.filter(opt => selectedIds.includes(opt.id));
  }

  async persistFullSession(data: {
    answers: ResponseQuestion[]
    config: ConfigQuiz | null
    score: number
  }): Promise<DomainResponse<Quiz>> {
    if (!data.config) {
      return { data: null, error: new Error("No configuration found for persistence") };
    }

    // 1. Obtener las preguntas originales para validación de integridad
    const questionIds = data.answers.map(a => a.id);
    const fullQuestions = await this.questionsRepository.getCorrectAnswer(questionIds);
    
    let totalRecalculatedScore = 0;

    // 2. Crear la cabecera del examen
    const quizResult = await this.quizzesRepository.create({
      userId: data.config.userId,
      mode: data.config.mode,
      itcCodes: data.config.topics,
      totalQuestions: data.config.questionCount,
    });

    if (quizResult.error || !quizResult.data) return quizResult;

    const quizId = quizResult.data.id;

    // 3. Preparar respuestas con validación de servidor
    const answersToCreate = data.answers.map(ans => {
      const originalQuestion = fullQuestions.find(q => q.id === ans.id);
      
      let finalPoints = 0;
      let finalIsCorrect = false;

      if (originalQuestion) {
        const totalCorrectInQuestion = originalQuestion.options.filter(o => o.isCorrect).length;
        const totalIncorrectInQuestion = originalQuestion.options.length - totalCorrectInQuestion;
        
        const selectedIds = ans.selectedOptions.map(o => o.id);
        const correctSelected = originalQuestion.options.filter(o => o.isCorrect && selectedIds.includes(o.id)).length;
        const incorrectSelected = originalQuestion.options.filter(o => !o.isCorrect && selectedIds.includes(o.id)).length;

        finalPoints = QuizScore.calculateQuestionPoints(
          totalCorrectInQuestion,
          totalIncorrectInQuestion,
          correctSelected,
          incorrectSelected
        );

        finalIsCorrect = correctSelected === totalCorrectInQuestion && incorrectSelected === 0;
        totalRecalculatedScore += finalPoints;
      }

      return {
        quizId,
        questionId: ans.id,
        itcCode: ans.itc || "",
        selectedOptionIds: ans.selectedOptions.map(o => o.id),
        isCorrect: finalIsCorrect,
        points: finalPoints,
        timeMs: ans.time,
      };
    });

    const answersResult = await this.answersRepository.createMany(answersToCreate);
    if (answersResult.error) return { data: null, error: answersResult.error };

    // 4. Finalizar el examen con el score RECALCULADO (no confiamos en el cliente)
    return this.quizzesRepository.finish(quizId, {
      totalScore: Number(totalRecalculatedScore.toFixed(2)),
      finishedAt: new Date().toISOString(),
      isCompleted: true,
    });
  }

  async getQuizResult(id: string): Promise<DomainResponse<{
    quiz: Quiz;
    answers: QuizAnswer[];
    questions: Question[];
  }>> {
    const quizResult = await this.quizzesRepository.findById(id);
    if (quizResult.error || !quizResult.data) {
      return { data: null, error: quizResult.error || new Error("Quiz not found") };
    }

    const answersResult = await this.answersRepository.getByQuizId(id);
    if (answersResult.error) {
      return { data: null, error: answersResult.error };
    }

    const questionIds = answersResult.data?.map(a => a.questionId) || [];
    const questions = await this.questionsRepository.getCorrectAnswer(questionIds);

    return {
      data: {
        quiz: quizResult.data,
        answers: answersResult.data || [],
        questions
      },
      error: null
    };
  }
}
