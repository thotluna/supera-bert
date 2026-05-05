import { DomainResponse } from "@/libs/shape/auth/types";
import { QuizAnswer, QuizAnswerCreate } from "../domain/quiz";
import { AnswersRepository } from "./answers-repository";


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
          itcCode: "ITC-BT-01",
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
          itcCode: "ITC-BT-01",
          selectedOptionIds: [1, 2],
          isCorrect: true,
          points: 1,
          timeMs: 8000,
          createdAt: new Date().toISOString(),
        },
        {
          id: "ans-3",
          quizId,
          questionId: "q3",
          itcCode: "ITC-BT-01",
          selectedOptionIds: [2],
          isCorrect: false,
          points: 0,
          timeMs: 4000,
          createdAt: new Date().toISOString(),
        },
        {
          id: "ans-4",
          quizId,
          questionId: "q4",
          itcCode: "ITC-BT-01",
          selectedOptionIds: [1, 3],
          isCorrect: false,
          points: 0,
          timeMs: 12000,
          createdAt: new Date().toISOString(),
        },
        {
          id: "ans-5",
          quizId,
          questionId: "q5",
          itcCode: "ITC-BT-01",
          selectedOptionIds: [],
          isCorrect: false,
          points: 0,
          timeMs: 0,
          createdAt: new Date().toISOString(),
        }
      ],
      error: null,
    };
  }
}
