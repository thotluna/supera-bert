import { DomainResponse } from "@/libs/shape/auth/types";
import { Quiz, QuizCreate, QuizFinish } from "../domain/quiz";
import { QuizzesRepository } from "../repository/quizzes-repository";
import { QuestionRepository } from "../repository/question-repository";
import { Option, Question, TopicOption } from "../models";

export class QuizService {
  constructor(private readonly questionsRepository: QuestionRepository, private readonly quizzesRepository: QuizzesRepository) { }

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
}
