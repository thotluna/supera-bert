import { createClient } from "@/libs/shape/supabase/server";
import { DomainResponse } from "@/libs/shape/auth/types";
import { UserItcStats } from "../domain/progress";
import { ProgressRepository } from "./progress-repository";
import { ProgressMapper } from "./progress-mapper";
import { UserItcStatsResponseDto } from "@/libs/quiz/dtos/dtos";

export class ProgressDataSource implements ProgressRepository {
  async getAllStats(userId: string): Promise<DomainResponse<UserItcStats[]>> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("user_itc_stats")
      .select()
      .eq("user_id", userId);

    if (error) return { data: null, error: new Error(error.message) };
    return {
      data: (data as UserItcStatsResponseDto[]).map(ProgressMapper.toStats),
      error: null,
    };
  }

  async getStatsByItc(
    userId: string,
    itcCode: string
  ): Promise<DomainResponse<UserItcStats>> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("user_itc_stats")
      .select()
      .eq("user_id", userId)
      .eq("itc_code", itcCode)
      .single();

    if (error) return { data: null, error: new Error(error.message) };
    return { data: ProgressMapper.toStats(data as UserItcStatsResponseDto), error: null };
  }
}
