"use client";

import { useQuizStore } from "@/libs/stores/quiz-store";
import { ReportButton } from "./report-button";

export function QuestionsText() {
  const currentQuestion = useQuizStore((state) => state.currentQuestion);
  return (
    <div className="w-full py-4 flex flex-col md:flex-row items-start md:justify-between gap-4">
      <div className="flex-1 min-w-0">
        <h3 className="text-xl md:text-3xl font-extrabold text-foreground leading-[1.1] tracking-tight">
          {currentQuestion?.question}
        </h3>
      </div>
      
      {currentQuestion && currentQuestion.id && currentQuestion.itc && (
        <div className="shrink-0">
          <ReportButton 
            questionId={currentQuestion.id} 
            itcCode={currentQuestion.itc} 
          />
        </div>
      )}
    </div>
  )
}