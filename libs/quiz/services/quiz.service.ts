import { DomainResponse } from "@/libs/shape/auth/types";
import { Quiz, QuizCreate, QuizFinish } from "../domain/quiz";
import { QuizzesRepository } from "../repository/quizzes-repository";

export class QuizService {
  constructor(private readonly repository: QuizzesRepository) {}

  async start(quiz: QuizCreate): Promise<DomainResponse<Quiz>> {
    return this.repository.create(quiz);
  }

  async complete(id: string, data: QuizFinish): Promise<DomainResponse<Quiz>> {
    return this.repository.finish(id, data);
  }
}
