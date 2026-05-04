import { DomainResponse } from "@/libs/shape/auth/types";
import { Quiz, QuizFinish } from "../domain/quiz";
import { QuizService } from "../services/quiz.service";

export class FinishQuizAction {
  constructor(private readonly quizService: QuizService) {}

  async execute(id: string, data: QuizFinish): Promise<DomainResponse<Quiz>> {
    return this.quizService.complete(id, data);
  }
}
