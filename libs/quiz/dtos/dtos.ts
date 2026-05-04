import { Tables } from "@/libs/shape/supabase/database.types";

/**
 * Data Transfer Objects (DTOs) for Quiz Operations.
 * We follow camelCase for application code and map to snake_case in repositories.
 */

// --- Quizzes ---

export interface CreateQuizDto {
  userId: string;
  mode: string;
  itcCodes: string[];
  totalQuestions: number;
}

export interface FinishQuizDto {
  totalScore: number;
  finishedAt: string;
  isCompleted: boolean;
}

export type QuizResponseDto = Tables<"quizzes">;

// --- Quiz Answers ---

export interface CreateQuizAnswerDto {
  quizId: string;
  questionId: number;
  itcCode: string;
  selectedOptionIds: number[];
  isCorrect: boolean;
  points: number;
  timeMs: number;
}

export type QuizAnswerResponseDto = Tables<"quiz_answers">;

// --- User ITC Stats ---

export type UserItcStatsResponseDto = Tables<"user_itc_stats">;
