import { AuthService } from "@/libs/auth/services/auth.service"
import { AuthRepositorySupabase } from "../auth/repository/auth-repository"
import { JSONDataSource } from "../quiz/repository/data-source-json"
import { QuizService } from "../quiz/services/quiz-service"
import { QuestionRepository } from "../quiz/repository/question-repository"

export class Factory {

  static getAuthService() {
    const authRepository: AuthRepositorySupabase = new AuthRepositorySupabase()
    return new AuthService(authRepository)
  }

  static getQuizService() {
    const dataSource: QuestionRepository = new JSONDataSource()
    return new QuizService(dataSource)
  }
}