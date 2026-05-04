import { DomainResponse } from "@/libs/shape/auth/types";
import { QuizAnswer, QuizAnswerCreate } from "../domain/quiz";
import { AnswersRepository } from "../repository/answers-repository";

export class AnswerService {
  constructor(private readonly repository: AnswersRepository) {}

  async record(answer: QuizAnswerCreate): Promise<DomainResponse<QuizAnswer>> {
    return this.repository.create(answer);
  }

  async getHistory(quizId: string): Promise<DomainResponse<QuizAnswer[]>> {
    return this.repository.getByQuizId(quizId);
  }
}
