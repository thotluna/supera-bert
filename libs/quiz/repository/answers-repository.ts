import { DomainResponse } from "@/libs/shape/auth/types";
import { QuizAnswer, QuizAnswerCreate } from "../domain/quiz";

export interface AnswersRepository {
  create(answer: QuizAnswerCreate): Promise<DomainResponse<QuizAnswer>>;

  getByQuizId(quizId: string): Promise<DomainResponse<QuizAnswer[]>>;
}
