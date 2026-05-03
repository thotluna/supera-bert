"use server"

import { Factory } from "@/libs/shape/factory";
import { ResponseOption } from "../models";

export async function validateAnswer(questionId: string, selectedIds: number[]): Promise<{
  options: ResponseOption[],
  isCorrect: boolean,
  points: number
}> {
  const service = Factory.getQuizService();
  
  const fullQuestion = await service.getQuestionById(questionId);
  if (!fullQuestion) {
    return { options: [], isCorrect: false, points: 0 };
  }

  const totalCorrectInQuestion = fullQuestion.options.filter(o => o.isCorrect).length;
  
  const options: ResponseOption[] = fullQuestion.options.map(opt => ({
    ...opt,
    selected: selectedIds.includes(opt.id)
  }));
  
  let points = 0;
  const correctSelected = options.filter(o => o.selected && o.isCorrect).length;
  const incorrectSelected = options.filter(o => o.selected && !o.isCorrect).length;

  if (totalCorrectInQuestion > 0) {
    points += (correctSelected * (1 / totalCorrectInQuestion));
  }
  
  points -= (incorrectSelected * 0.20);

  const isCorrect = correctSelected === totalCorrectInQuestion && incorrectSelected === 0;

  return {
    options,
    isCorrect,
    points: Number(points.toFixed(2))
  };
}
