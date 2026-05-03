'use client';

import { useFormStatus } from "react-dom";
import { Play, Loader2 } from "lucide-react";
import { JSX } from "react";

export function SubmitQuizButton(): JSX.Element {
  const { pending } = useFormStatus();

  return (
    <div className="md:relative md:bottom-0 fixed bottom-0 left-0 md:left-auto md:translate-x-0 w-full md:w-auto z-50 p-4 md:p-0 bg-background/80 md:bg-transparent backdrop-blur-lg md:backdrop-blur-none border-t border-white/5 md:border-none">
      <button
        type="submit"
        disabled={pending}
        className={`
          relative w-full md:w-64 h-12 flex items-center justify-center gap-3 rounded-xl font-black uppercase tracking-[0.2em] transition-all duration-300
          ${pending
            ? 'bg-foreground/10 text-foreground/40 cursor-wait'
            : 'bg-accent text-slate-950 hover:bg-accent/90 shadow-neon hover:scale-[1.02] active:scale-[0.98]'
          }
        `}
      >
        {pending ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-[10px]">Preparando...</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4 fill-current" />
            <span className="text-[10px]">Iniciar Simulacro</span>
          </>
        )}
      </button>
    </div>
  );
}
