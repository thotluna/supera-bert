"use client"

import { ConfigQuiz, QuestionClient } from "@/libs/quiz/models"
import { useQuizStore } from "@/libs/stores/quiz-store"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface Props {
  config: ConfigQuiz
  questions: QuestionClient[]
}

export function Initialization({ config, questions }: Props) {
  const initialize = useQuizStore(state => state.initialize)
  const isFinished = useQuizStore(state => state.isFinished)
  const router = useRouter()

  useEffect(() => {
    initialize(questions, config)
  }, [initialize, config, questions])

  useEffect(() => {
    if (isFinished) {
      router.push("/result")
    }
  }, [isFinished, router])

  return null
}
