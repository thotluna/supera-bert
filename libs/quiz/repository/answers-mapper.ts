import { Tables } from "@/libs/shape/supabase/database.types";
import { QuizAnswer } from "../domain/quiz";

export class AnswersMapper {
  static toAnswer(row: Tables<"quiz_answers">): QuizAnswer {
    return {
      id: row.id,
      quizId: row.quiz_id,
      questionId: row.question_id,
      itcCode: row.itc_code,
      selectedOptionIds: row.selected_option_ids,
      isCorrect: row.is_correct,
      points: Number(row.points),
      timeMs: row.time_ms,
      createdAt: row.created_at,
    };
  }
}
