import { AuthService } from "@/libs/auth/services/auth.service";
import { AuthRepositorySupabase } from "../auth/repository/auth-repository";
import { QuizService } from "../quiz/services/quiz.service";
import { StatsService } from "../quiz/services/stats-service";
import { ReportService } from "../quiz/services/report-service";

export class Factory {
  static getAuthService(): AuthService {
    const authRepository = new AuthRepositorySupabase();
    return new AuthService(authRepository);
  }

  static async getQuizService(): Promise<QuizService> {
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

  private static async getQuestionRepository() {
    const jsonDataSource = process.env.QUESTIONS_REPO_PATH || "data-source-json";
    const repoModule = await import(`../quiz/repository/${jsonDataSource}`);
    const Implementation = repoModule.JSONDataSource;
    return new Implementation();
  }

  static async getStatsService(): Promise<StatsService> {
    const answersDataSource = process.env.ANSWERS_REPO_PATH || "answers-data-source";
    const repoModuleAnswers = await import(`../quiz/repository/${answersDataSource}`);
    const ImplementationAnswers = repoModuleAnswers.AnswersDataSource;
    const answersRepository = new ImplementationAnswers();

    const quizzesDataSource = process.env.QUIZZES_REPO_PATH || "quizzes-data-source";
    const repoModuleQuizzes = await import(`../quiz/repository/${quizzesDataSource}`);
    const ImplementationQuizzes = repoModuleQuizzes.QuizzesDataSource;
    const quizzesRepository = new ImplementationQuizzes();

    const questionRepository = await this.getQuestionRepository();
    return new StatsService(quizzesRepository, answersRepository, questionRepository);
  }

  static async getReportService(): Promise<ReportService> {
    const reportDataSource = process.env.REPORT_REPO_PATH || "report-data-source";
    const repoModule = await import(`../quiz/repository/${reportDataSource}`);
    const Implementation = repoModule.ReportDataSource;
    const reportRepository = new Implementation();
    return new ReportService(reportRepository);
  }
}