import { DomainResponse } from "@/libs/shape/auth/types";
import { Quiz, QuizCreate, QuizFinish } from "../domain/quiz";
import { QuizzesRepository } from "./quizzes-repository";

export class QuizzesDataSource implements QuizzesRepository {
  async create(quiz: QuizCreate): Promise<DomainResponse<Quiz>> {
    const newQuiz: Quiz = {
      ...quiz,
      id: `mock-quiz-${Math.random().toString(36).substr(2, 9)}`,
      startedAt: new Date().toISOString(),
      finishedAt: null,
      isCompleted: false,
      totalScore: 0
    };
    return { data: newQuiz, error: null };
  }

  async finish(id: string, data: QuizFinish): Promise<DomainResponse<Quiz>> {
    return {
      data: {
        id,
        userId: "mock-user-id",
        mode: "timed",
        itcCodes: ["ITC-BT-01"],
        totalQuestions: 5,
        startedAt: new Date(Date.now() - 60000).toISOString(),
        finishedAt: data.finishedAt,
        isCompleted: data.isCompleted,
        totalScore: data.totalScore
      },
      error: null,
    };
  }

  async findById(id: string): Promise<DomainResponse<Quiz>> {
    return { 
      data: {
        id,
        userId: "mock-user-id",
        mode: "timed",
        itcCodes: ["ITC-BT-01"],
        totalQuestions: 5,
        startedAt: new Date(Date.now() - 120000).toISOString(),
        finishedAt: new Date(Date.now() - 60000).toISOString(),
        isCompleted: true,
        totalScore: 40
      }, 
      error: null 
    };
  }
}
