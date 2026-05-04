import { Tables } from "@/libs/shape/supabase/database.types";
import { UserItcStats } from "../domain/progress";

export class ProgressMapper {
  static toStats(row: Tables<"user_itc_stats">): UserItcStats {
    return {
      userId: row.user_id,
      itcCode: row.itc_code,
      totalAttempts: row.total_attempts ?? 0,
      correctAnswers: row.correct_answers ?? 0,
      accuracyRate: Number(row.accuracy_rate),
      avgTimeMs: row.avg_time_ms ?? 0,
      lastPracticedAt: row.last_practiced_at ?? new Date().toISOString(),
    };
  }
}
