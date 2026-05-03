"use server"

import { Factory } from "@/libs/shape/factory";
import { Option } from "../models";

export async function validateAnswer(questionId: string, selectedIds: number[]): Promise<{
  validatedOptions: Option[],
  isCorrect: boolean,
  points: number
}> {
  const service = Factory.getQuizService();
  
  // Obtenemos la pregunta completa para saber el total de opciones correctas
  const fullQuestion = await service.getQuestionById(questionId);
  if (!fullQuestion) {
    return { validatedOptions: [], isCorrect: false, points: 0 };
  }

  const totalCorrectInQuestion = fullQuestion.options.filter(o => o.isCorrect).length;
  const validatedOptions = fullQuestion.options.filter(opt => selectedIds.includes(opt.id));
  
  let points = 0;
  const correctSelected = validatedOptions.filter(o => o.isCorrect).length;
  const incorrectSelected = validatedOptions.filter(o => !o.isCorrect).length;

  // Lógica de puntos
  if (totalCorrectInQuestion > 0) {
    // Cada buena vale (1 / total de buenas)
    points += (correctSelected * (1 / totalCorrectInQuestion));
  }
  
  // Cada mala resta 0.20
  points -= (incorrectSelected * 0.20);

  // Consideramos la pregunta "correcta" globalmente solo si ha marcado TODAS las correctas y NINGUNA incorrecta
  const isCorrect = correctSelected === totalCorrectInQuestion && incorrectSelected === 0;

  return {
    validatedOptions,
    isCorrect,
    points: Number(points.toFixed(2)) // Redondeamos a 2 decimales para evitar problemas de coma flotante
  };
}