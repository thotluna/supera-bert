"use client";

import { useQuizStore } from "@/libs/stores/quiz-store";
import { ReportButton } from "./report-button";

export function QuestionsText() {
  const currentQuestion = useQuizStore((state) => state.currentQuestion);
  return (
    <div className="w-full py-2 flex justify-between items-start gap-4">
      <h3 className="flex-1 text-lg md:text-2xl font-bold text-foreground leading-tight tracking-tight">
        {currentQuestion?.question}
      </h3>
      
      {currentQuestion && currentQuestion.id && currentQuestion.itc && (
        <ReportButton 
          questionId={currentQuestion.id} 
          itcCode={currentQuestion.itc} 
        />
      )}
    </div>
  )
}