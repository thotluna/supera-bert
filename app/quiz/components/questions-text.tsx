"use client";

import { useQuizStore } from "@/libs/stores/quiz-store";

export function QuestionsText() {
  const currentQuestion = useQuizStore((state) => state.currentQuestion);
  return (
    <div className="w-full py-2">
      <h3 className="w-full text-lg md:text-2xl font-bold text-foreground leading-tight tracking-tight">
        {currentQuestion?.question}
      </h3>
    </div>
  )
}