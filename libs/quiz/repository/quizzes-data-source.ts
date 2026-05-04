import { createClient } from "@/libs/shape/supabase/server";
import { DomainResponse } from "@/libs/shape/auth/types";
import { Quiz, QuizCreate, QuizFinish } from "../domain/quiz";
import { QuizzesRepository } from "./quizzes-repository";
import { QuizzesMapper } from "./quizzes-mapper";
import { QuizResponseDto } from "../dtos/dtos";

export class QuizzesDataSource implements QuizzesRepository {
  async create(quiz: QuizCreate): Promise<DomainResponse<Quiz>> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("quizzes")
      .insert({
        user_id: quiz.userId,
        mode: quiz.mode,
        itc_codes: quiz.itcCodes,
        total_questions: quiz.totalQuestions,
      })
      .select()
      .single();

    if (error) return { data: null, error: new Error(error.message) };
    return { data: QuizzesMapper.toQuiz(data as QuizResponseDto), error: null };
  }

  async finish(id: string, data: QuizFinish): Promise<DomainResponse<Quiz>> {
    const supabase = await createClient();

    const { data: updated, error } = await supabase
      .from("quizzes")
      .update({
        total_score: data.totalScore,
        finished_at: data.finishedAt,
        is_completed: data.isCompleted,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) return { data: null, error: new Error(error.message) };
    return {
      data: QuizzesMapper.toQuiz(updated as QuizResponseDto),
      error: null,
    };
  }
}
