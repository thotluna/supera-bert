"use client"

import { useQuizStore } from "@/libs/stores/quiz-store";
import { ChevronRight, LogOut, SkipForward } from "lucide-react";

export function QuizFooter() {
  const nextQuestion = useQuizStore(state => state.nextQuestion)
  const skipQuestion = useQuizStore(state => state.skipQuestion)
  const finish = useQuizStore(state => state.finish)
  const isFeedbacking = useQuizStore(state => state.isFeedbacking)

  return (
    <footer className="w-full flex justify-between items-center pt-4 mt-4 border-t border-foreground/5 gap-2">
      <button
        type="button"
        onClick={() => finish()}
        disabled={isFeedbacking}
        className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 rounded-xl text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all text-[10px] md:text-xs font-bold uppercase tracking-wider disabled:opacity-30 disabled:pointer-events-none"
      >
        <LogOut className="w-4 h-4 md:w-4 md:h-4" />
        <span className="hidden sm:inline">Terminar</span>
      </button>

      <div className="flex items-center gap-2 md:gap-3">
        <button
          type="button"
          onClick={() => skipQuestion()}
          disabled={isFeedbacking}
          className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 rounded-xl text-foreground/40 hover:text-foreground/80 hover:bg-foreground/5 transition-all text-[10px] md:text-xs font-bold uppercase tracking-wider disabled:opacity-30 disabled:pointer-events-none"
        >
          <SkipForward className="w-4 h-4 md:w-4 md:h-4" />
          <span className="hidden sm:inline">Saltar</span>
        </button>

        <button
          type="button"
          onClick={() => nextQuestion()}
          disabled={isFeedbacking}
          className="flex items-center gap-1.5 md:gap-2 px-4 md:px-6 py-2 rounded-xl bg-accent text-accent-foreground hover:opacity-90 transition-all text-[10px] md:text-xs font-black uppercase tracking-widest shadow-lg shadow-accent/20 disabled:opacity-30 disabled:pointer-events-none"
        >
          {isFeedbacking ? 'Validando...' : 'Siguiente'}
          <ChevronRight className="w-4 h-4 md:w-4 md:h-4" />
        </button>
      </div>
    </footer>
  );
}
