"use server";

import { Factory } from "@/libs/shape/factory";
import { verifyUser } from "@/libs/auth/actions/verify-user";

interface ReportQuestionParams {
  questionId: string;
  itcCode: string;
}

export async function reportQuestion({ questionId, itcCode }: ReportQuestionParams): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: user } = await verifyUser();
    
    if (!user) {
      return { success: false, error: "Debes estar autenticado para reportar preguntas" };
    }

    const service = await Factory.getReportService();
    return await service.reportQuestion({
      questionId,
      itcCode,
      userId: user.id,
    });
  } catch (error) {
    console.error("[reportQuestionAction]", error);
    
    return { 
      success: false, 
      error: "No se pudo enviar el reporte. Por favor, inténtalo de nuevo más tarde." 
    };
  }
}
