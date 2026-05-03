import { SummarySection } from "./components/summary-section";
import { ReviewSection } from "./components/review-section";
import { ResultActions } from "./components/result-actions";

export const metadata = {
  title: "Resultados del Simulacro | Supera BERT",
  description: "Revisa tu desempeño, puntuación y estadísticas detalladas del simulacro de examen.",
};

export default function ResultPage() {
  return (
    <main className="min-h-screen max-w-5xl mx-auto px-4 pt-12 md:pt-20 flex flex-col items-center">
      {/* Structural Header (Server side) */}
      <div className="w-full mb-12 text-center md:text-left">
        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-linear-to-r from-foreground to-foreground/40 mb-2">
          Misión Cumplida
        </h1>
        <p className="text-foreground/40 font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs">
          Análisis detallado de tu rendimiento en el simulacro
        </p>
      </div>

      {/* Client Components for dynamic data */}
      <SummarySection />
      
      <ReviewSection />
      
      <ResultActions />

      {/* Background Decor (Server side) */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full" />
      </div>
    </main>
  );
}
