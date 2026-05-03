"use client";

import { useQuizStore } from "@/libs/stores/quiz-store";
import { useRouter } from "next/navigation";
import { RefreshCcw, Home, Share2 } from "lucide-react";

export function ResultActions() {
  const reset = useQuizStore((state) => state.reset);
  const router = useRouter();

  const handleRetry = () => {
    reset();
    router.push("/");
  };

  const handleGoHome = () => {
    reset();
    router.push("/");
  };

  return (
    <footer className="flex flex-col md:flex-row items-center justify-center gap-4 mt-12 pb-12 w-full">
      <button 
        onClick={handleRetry}
        className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-accent text-white font-black italic uppercase tracking-tighter rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 w-full md:w-auto"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        <RefreshCcw className="w-5 h-5 relative z-10 group-hover:rotate-180 transition-transform duration-500" />
        <span className="relative z-10">Nuevo Intento</span>
      </button>

      <button 
        onClick={handleGoHome}
        className="flex items-center justify-center gap-3 px-8 py-4 bg-foreground/5 text-foreground/60 font-bold uppercase tracking-widest text-xs rounded-2xl border border-foreground/10 transition-all hover:bg-foreground/10 w-full md:w-auto"
      >
        <Home className="w-4 h-4" />
        <span>Volver al Inicio</span>
      </button>

      <button 
        className="flex items-center justify-center gap-3 px-6 py-4 text-foreground/40 font-bold uppercase tracking-widest text-[10px] transition-all hover:text-accent w-full md:w-auto"
      >
        <Share2 className="w-4 h-4" />
        <span>Compartir Resultado</span>
      </button>
    </footer>
  );
}
