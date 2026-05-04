import { Tables } from "@/libs/shape/supabase/database.types";
import { Quiz } from "../domain/quiz";

export class QuizzesMapper {
  static toQuiz(row: Tables<"quizzes">): Quiz {
    return {
      id: row.id,
      userId: row.user_id,
      mode: row.mode,
      itcCodes: row.itc_codes,
      totalQuestions: row.total_questions,
      totalScore: Number(row.total_score),
      startedAt: row.started_at,
      finishedAt: row.finished_at,
      isCompleted: row.is_completed ?? false,
    };
  }
}
