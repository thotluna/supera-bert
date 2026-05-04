import { DomainResponse } from "@/libs/shape/auth/types";
import { QuizAnswer, QuizAnswerCreate } from "../domain/quiz";
import { AnswerService } from "../services/answer.service";

export class SubmitAnswerAction {
  constructor(private readonly answerService: AnswerService) {}

  async execute(answer: QuizAnswerCreate): Promise<DomainResponse<QuizAnswer>> {
    return this.answerService.record(answer);
  }
}
