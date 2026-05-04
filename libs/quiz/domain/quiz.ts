export interface Quiz {
  id: string;
  userId: string;
  mode: string;
  itcCodes: string[];
  totalQuestions: number;
  totalScore: number;
  startedAt: string;
  finishedAt: string | null;
  isCompleted: boolean;
}

export type QuizCreate = Pick<Quiz, "userId" | "mode" | "itcCodes" | "totalQuestions">;

export type QuizFinish = Pick<Quiz, "totalScore" | "finishedAt" | "isCompleted">;

export interface QuizAnswer {
  id: string;
  quizId: string;
  questionId: string;
  itcCode: string;
  selectedOptionIds: number[];
  isCorrect: boolean;
  points: number;
  timeMs: number;
  createdAt: string;
}

export type QuizAnswerCreate = Omit<QuizAnswer, "id" | "createdAt">;
