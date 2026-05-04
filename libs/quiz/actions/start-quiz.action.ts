import { DomainResponse } from "@/libs/shape/auth/types";
import { Quiz, QuizCreate } from "../domain/quiz";
import { QuizService } from "../services/quiz.service";

export class StartQuizAction {
  constructor(private readonly quizService: QuizService) {}

  async execute(quiz: QuizCreate): Promise<DomainResponse<Quiz>> {
    return this.quizService.start(quiz);
  }
}
