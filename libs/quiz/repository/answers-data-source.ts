import { createClient } from "@/libs/shape/supabase/server";
import { DomainResponse } from "@/libs/shape/auth/types";
import { QuizAnswer, QuizAnswerCreate } from "../domain/quiz";
import { AnswersRepository } from "./answers-repository";
import { AnswersMapper } from "./answers-mapper";
import { QuizAnswerResponseDto } from "../dtos/dtos";

export class AnswersDataSource implements AnswersRepository {
  async create(answer: QuizAnswerCreate): Promise<DomainResponse<QuizAnswer>> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("quiz_answers")
      .insert({
        quiz_id: answer.quizId,
        question_id: answer.questionId as unknown as number, // Cast temporal hasta regenerar tipos
        itc_code: answer.itcCode,
        selected_option_ids: answer.selectedOptionIds,
        is_correct: answer.isCorrect,
        points: answer.points,
        time_ms: answer.timeMs,
      })
      .select()
      .single();

    if (error) return { data: null, error: new Error(error.message) };
    return { data: AnswersMapper.toAnswer(data as QuizAnswerResponseDto), error: null };
  }

  async createMany(answers: QuizAnswerCreate[]): Promise<DomainResponse<QuizAnswer[]>> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("quiz_answers")
      .insert(answers.map(answer => ({
        quiz_id: answer.quizId,
        question_id: answer.questionId as unknown as number, // Cast temporal hasta regenerar tipos
        itc_code: answer.itcCode,
        selected_option_ids: answer.selectedOptionIds,
        is_correct: answer.isCorrect,
        points: answer.points,
        time_ms: answer.timeMs,
      })))
      .select();

    if (error) return { data: null, error: new Error(error.message) };
    return {
      data: (data as QuizAnswerResponseDto[]).map(AnswersMapper.toAnswer),
      error: null,
    };
  }

  async getByQuizId(quizId: string): Promise<DomainResponse<QuizAnswer[]>> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("quiz_answers")
      .select()
      .eq("quiz_id", quizId);

    if (error) return { data: null, error: new Error(error.message) };
    return {
      data: (data as QuizAnswerResponseDto[]).map(AnswersMapper.toAnswer),
      error: null,
    };
  }

  async getByUserId(userId: string): Promise<DomainResponse<QuizAnswer[]>> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("quiz_answers")
      .select("*, quizzes!inner(user_id)")
      .eq("quizzes.user_id", userId);

    if (error) return { data: null, error: new Error(error.message) };

    return {
      data: (data as unknown as QuizAnswerResponseDto[]).map(AnswersMapper.toAnswer),
      error: null,
    };
  }
}
