'use server'
import { redirect } from "next/navigation"
import { ConfigQuiz, QuestionClient, ResponseQuestion } from "../models"
import { Factory } from "@/libs/shape/factory"

export async function saveAndRedirect({ answers, config, score }: {
  questions: QuestionClient[]
  answers: ResponseQuestion[]
  config: ConfigQuiz | null
  startTime: number | null
  expiresAt: number | null
  score: number
}) {

  const service = Factory.getQuizService();
  
  const result = await service.persistFullSession({
    answers,
    config,
    score
  });

  if (result.error || !result.data) {
    console.error("Error saving quiz session:", result.error);
    return;
  }

  redirect(`/quiz/results/${result.data.id}`)
}