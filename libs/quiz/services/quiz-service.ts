import { TopicOption, Option, Question } from "../models";
import { QuestionRepository } from "../repository/question-repository";

export class QuizService {
  constructor(private readonly repository: QuestionRepository) { }

  async getTopics(): Promise<TopicOption[]> {
    return this.repository.getTopicsAvailability();
  }

  async validateAnswer(questionId: string, answerId: number): Promise<boolean> {
    return this.repository.checkAnswer(questionId, answerId);
  }

  async getQuestionById(id: string): Promise<Question | null> {
    const questions = await this.repository.getCorrectAnswer([id]);
    return questions[0] ?? null;
  }

  async getValidatedOptions(questionId: string, selectedIds: number[]): Promise<Option[]> {
    const question = await this.getQuestionById(questionId);
    if (!question) return [];

    return question.options.filter(opt => selectedIds.includes(opt.id));
  }
}
