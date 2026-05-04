import { AuthService } from "@/libs/auth/services/auth.service";
import { AuthRepositorySupabase } from "../auth/repository/auth-repository";
import { QuizService } from "../quiz/services/quiz.service";
import { AnswerService } from "../quiz/services/answer.service";
import { QuizzesDataSource } from "../quiz/repository/quizzes-data-source";
import { AnswersDataSource } from "../quiz/repository/answers-data-source";
import { JSONDataSource } from "../quiz/repository/data-source-json";
import { StartQuizAction } from "../quiz/actions/start-quiz.action";
import { SubmitAnswerAction } from "../quiz/actions/submit-answer.action";
import { FinishQuizAction } from "../quiz/actions/finish-quiz.action";

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

  static getAnswerService() {
    const repository = new AnswersDataSource();
    return new AnswerService(repository);
  }

  static getStartQuizAction() {
    return new StartQuizAction(this.getQuizService());
  }

  static getSubmitAnswerAction() {
    return new SubmitAnswerAction(this.getAnswerService());
  }

  static getFinishQuizAction() {
    return new FinishQuizAction(this.getQuizService());
  }
}