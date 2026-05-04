import { AuthService } from "@/libs/auth/services/auth.service";
import { AuthRepositorySupabase } from "../auth/repository/auth-repository";
import { QuizService } from "../quiz/services/quiz.service";

import { QuizzesDataSource } from "../quiz/repository/quizzes-data-source";
import { AnswersDataSource } from "../quiz/repository/answers-data-source";
import { JSONDataSource } from "../quiz/repository/data-source-json";




export class Factory {
  static getAuthService() {
    const authRepository = new AuthRepositorySupabase();
    return new AuthService(authRepository);
  }

  static getQuizService() {
    const quizzesRepository = new QuizzesDataSource();
    const questionsRepository = new JSONDataSource();
    const answersRepository = new AnswersDataSource();
    return new QuizService(questionsRepository, quizzesRepository, answersRepository);
  }




}