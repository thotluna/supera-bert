import { DomainResponse } from "@/libs/shape/auth/types";
import { Quiz, QuizCreate, QuizFinish } from "../domain/quiz";

export interface QuizzesRepository {
  create(quiz: QuizCreate): Promise<DomainResponse<Quiz>>;

  finish(id: string, data: QuizFinish): Promise<DomainResponse<Quiz>>;
  findById(id: string): Promise<DomainResponse<Quiz>>;
}