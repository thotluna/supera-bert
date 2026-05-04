"use client"

import { ConfigQuiz, Question } from "@/libs/quiz/models"
import { useQuizStore } from "@/libs/stores/quiz-store"
import { useEffect } from "react"

interface Props {
  config: ConfigQuiz
  questions: Question[]
}

export function Initialization({ config, questions }: Props) {
  const initialize = useQuizStore(state => state.initialize)

  useEffect(() => {
    initialize(questions, config)
  }, [initialize, config, questions])


  return null
}
