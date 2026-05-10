import { createClient } from "@/libs/shape/supabase/server";
import { ReportRepository } from "./report-repository";

export interface CreateReportDto {
  questionId: string;
  itcCode: string;
  userId: string;
}

export interface ReportResponse {
  success: boolean;
  error?: string;
}

export class ReportError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = "ReportError";
  }
}

export class ReportDataSource implements ReportRepository {

  async create(dto: CreateReportDto): Promise<ReportResponse> {
    const supabase = await createClient();

    const { error } = await supabase
      .from("question_reports")
      .insert({
        question_id: dto.questionId,
        itc_code: dto.itcCode,
        user_id: dto.userId,
        status: "pending"
      });

    if (error) {
      console.error(`[ReportDataSource] ${error.code}: ${error.message}`);
      
      return {
        success: false,
        error: "Ocurrió un error al procesar el reporte. Por favor, inténtalo más tarde."
      };
    }

    return { success: true };
  }
}
