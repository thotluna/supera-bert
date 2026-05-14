import { DomainResponse } from "@/libs/shape/auth/types";
import { QuizAnswer, QuizAnswerCreate } from "../domain/quiz";
import { AnswersRepository, TopicMetric } from "./answers-repository";


export class AnswersDataSource implements AnswersRepository {
  async create(answer: QuizAnswerCreate): Promise<DomainResponse<QuizAnswer>> {
    const newAnswer: QuizAnswer = {
      ...answer,
      id: `mock-answer-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    return { data: newAnswer, error: null };
  }

  async createMany(answers: QuizAnswerCreate[]): Promise<DomainResponse<QuizAnswer[]>> {
    const newAnswers = answers.map(ans => ({
      ...ans,
      id: `mock-answer-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    }));
    return {
      data: newAnswers,
      error: null,
    };
  }

  async getByQuizId(quizId: string): Promise<DomainResponse<QuizAnswer[]>> {
    return {
      data: [
        {
          id: "ans-1",
          quizId,
          questionId: "q1",
          itcCode: "ITC-BT-19",
          selectedOptionIds: [1],
          isCorrect: true,
          points: 1,
          timeMs: 5000,
          createdAt: new Date().toISOString(),
        },
        {
          id: "ans-2",
          quizId,
          questionId: "q2",
          itcCode: "ITC-BT-19",
          selectedOptionIds: [1, 2],
          isCorrect: true,
          points: 1,
          timeMs: 8000,
          createdAt: new Date().toISOString(),
        }
      ],
      error: null,
    };
  }

  async getByUserId(_userId: string): Promise<DomainResponse<QuizAnswer[]>> {
    return {
      data: [
        {
          id: "ans-1",
          quizId: "q1",
          questionId: "q1",
          itcCode: "ITC-BT-19",
          selectedOptionIds: [1],
          isCorrect: true,
          points: 1,
          timeMs: 5000,
          createdAt: new Date().toISOString(),
        }
      ],
      error: null,
    };
  }

  async getUserTopicMetrics(_userId: string): Promise<DomainResponse<TopicMetric[]>> {
    return {
      data: [
        {
          itcCode: "ITC-BT-19",
          uniqueSeen: 1,
          uniqueCorrect: 1,
          totalPoints: 1
        }
      ],
      error: null
    };
  }
}
