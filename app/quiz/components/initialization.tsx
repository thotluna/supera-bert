"use client"

import { ConfigQuiz, QuestionClient } from "@/libs/quiz/models"
import { useQuizStore } from "@/libs/stores/quiz-store"
import { useEffect } from "react"

interface Props {
  config: ConfigQuiz
  questions: QuestionClient[]
}

export function Initialization({ config, questions }: Props) {
  const initialize = useQuizStore(state => state.initialize)

  useEffect(() => {
    initialize(config, questions)
  }, [initialize, config, questions])

  return null
}