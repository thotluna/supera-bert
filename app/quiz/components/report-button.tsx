"use client";

import { useState } from "react";
import { Flag, AlertTriangle, Loader2, X } from "lucide-react";
import { reportQuestion } from "@/libs/quiz/actions/report-question";
import { useQuizStore } from "@/libs/stores/quiz-store";

interface ReportButtonProps {
  questionId: string;
  itcCode: string;
  showText?: boolean;
  defaultOpen?: boolean;
}

export function ReportButton({ questionId, itcCode, showText = true, defaultOpen = false }: ReportButtonProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isPending, setIsPending] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const requestPause = useQuizStore(state => state.requestPause);
  const requestResume = useQuizStore(state => state.requestResume);
  const excludeCurrentQuestion = useQuizStore(state => state.excludeCurrentQuestion);

  const toggleModal = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      requestPause("modal");
    } else {
      requestResume("modal");
    }
  };

  const handleReport = async () => {
    setIsPending(true);
    setStatus(null);

    const result = await reportQuestion({ questionId, itcCode });

    if (result.success) {
      setStatus({ type: "success", message: "Reporte enviado con éxito." });
      setTimeout(async () => {
        await excludeCurrentQuestion();
        toggleModal(false);
        setStatus(null);
      }, 2000);
    } else {
      setStatus({ type: "error", message: result.error || "Error al enviar el reporte." });
    }
    setIsPending(false);
  };

  return (
    <>
      <button
        onClick={() => toggleModal(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-red-500/10 text-foreground/75 hover:text-red-400 transition-all duration-300 group border border-transparent hover:border-red-500/20"
        title="Reportar error en la pregunta"
      >

        <Flag size={16} className="group-hover:animate-pulse" />
        {showText && <span className="text-xs font-semibold uppercase tracking-wider">Reportar</span>}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-card p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => toggleModal(false)}
              aria-label="Cerrar modal"
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/5 text-foreground/60 hover:text-foreground transition-colors"
            >
              <X size={20} />
            </button>


            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 rounded-2xl bg-red-500/10 text-red-500">
                <AlertTriangle size={40} />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Reportar Pregunta</h2>
                <p className="text-sm text-foreground/70">ID: {questionId}</p>
              </div>

              <div className="w-full p-4 rounded-2xl bg-white/5 border border-white/5 text-left">
                <p className="text-sm text-foreground/90 leading-relaxed">
                  Estás a punto de reportar esta pregunta por <span className="text-red-500 font-semibold">errores técnicos, de contenido o fallos en el planteamiento normativo.</span>
                </p>
                <div className="mt-4 flex items-start gap-2 text-xs text-foreground/60">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1 shrink-0" />
                  <p>Al confirmar, el reporte se enviará para revisión y la pregunta será saltada automáticamente.</p>
                </div>
              </div>

              {status && (
                <div className={`w-full p-3 rounded-xl text-sm font-medium ${
                  status.type === "success" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                }`}>
                  {status.message}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 w-full pt-4">
                <button
                  onClick={() => toggleModal(false)}
                  disabled={isPending}
                  className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-foreground font-bold transition-all disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleReport}
                  disabled={isPending}
                  className="relative px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-600/20 transition-all disabled:opacity-50 overflow-hidden"
                >

                  {isPending ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 size={18} className="animate-spin" />
                      <span>Enviando...</span>
                    </div>
                  ) : (
                    "Confirmar Reporte"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
