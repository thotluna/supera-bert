import { AuthService } from "@/libs/auth/services/auth.service";
import { AuthRepositorySupabase } from "../auth/repository/auth-repository";
import { QuizService } from "../quiz/services/quiz.service";


export class Factory {
  static getAuthService() {
    const authRepository = new AuthRepositorySupabase();
    return new AuthService(authRepository);
  }

  static async getQuizService() {

    const jsonDataSource = process.env.QUESTIONS_REPO_PATH || "data-source-json";
    const repoModule = await import(`../quiz/repository/${jsonDataSource}`);
    const Implementation = repoModule.JSONDataSource;
    const questionsRepository = new Implementation();


    const answersDataSource = process.env.ANSWERS_REPO_PATH || "answers-data-source";
    const repoModuleAnswers = await import(`../quiz/repository/${answersDataSource}`);
    const ImplementationAnswers = repoModuleAnswers.AnswersDataSource;
    const answersRepository = new ImplementationAnswers();

    const quizzesDataSource = process.env.QUIZZES_REPO_PATH || "quizzes-data-source";
    const repoModuleQuizzes = await import(`../quiz/repository/${quizzesDataSource}`);
    const ImplementationQuizzes = repoModuleQuizzes.QuizzesDataSource;
    const quizzesRepository = new ImplementationQuizzes();


    return new QuizService(questionsRepository, quizzesRepository, answersRepository);
  }
}