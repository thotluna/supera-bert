import { DomainResponse } from "@/libs/shape/auth/types";
import { QuizAnswer, QuizAnswerCreate } from "../domain/quiz";

export interface TopicMetric {
  itcCode: string;
  uniqueSeen: number;
  uniqueCorrect: number;
  totalPoints: number;
}

export interface AnswersRepository {
  create(answer: QuizAnswerCreate): Promise<DomainResponse<QuizAnswer>>;
  createMany(answers: QuizAnswerCreate[]): Promise<DomainResponse<QuizAnswer[]>>;
  getByQuizId(quizId: string): Promise<DomainResponse<QuizAnswer[]>>;
  getByUserId(userId: string): Promise<DomainResponse<QuizAnswer[]>>;
  getUserTopicMetrics(userId: string): Promise<DomainResponse<TopicMetric[]>>;
}
