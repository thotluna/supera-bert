import { DomainResponse } from "@/libs/shape/auth/types";
import { Quiz, QuizCreate, QuizFinish } from "../domain/quiz";
import { QuizzesRepository } from "../repository/quizzes-repository";
import { QuestionRepository } from "../repository/question-repository";
import { ConfigQuiz, Option, Question, ResponseQuestion, TopicOption } from "../models";
import { AnswersRepository } from "../repository/answers-repository";

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

    // 1. Crear la cabecera del examen
    const quizResult = await this.quizzesRepository.create({
      userId: data.config.userId,
      mode: data.config.mode,
      itcCodes: data.config.topics,
      totalQuestions: data.config.questionCount,
    });

    if (quizResult.error || !quizResult.data) return quizResult;

    const quizId = quizResult.data.id;

    // 2. Guardar todas las respuestas en lote
    const answersToCreate = data.answers.map(ans => ({
      quizId,
      questionId: ans.id,
      itcCode: ans.itc || "",
      selectedOptionIds: ans.selectedOptions.map(o => o.id),
      isCorrect: ans.isCorrect,
      points: ans.points,
      timeMs: ans.time,
    }));

    const answersResult = await this.answersRepository.createMany(answersToCreate);
    if (answersResult.error) return { data: null, error: answersResult.error };

    // 3. Finalizar el examen con el score real
    return this.quizzesRepository.finish(quizId, {
      totalScore: data.score,
      finishedAt: new Date().toISOString(),
      isCompleted: true,
    });
  }
}
