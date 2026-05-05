import { RecommendedTopic } from "@/libs/quiz/domain/stats";
import { AlertCircle, BookOpen, Clock, ChevronRight } from "lucide-react";

interface Props {
  recommendations: RecommendedTopic[];
}

export function StudyRecommendations({ recommendations }: Props) {
  if (recommendations.length === 0) return null;

  return (
    <div className="bg-subface/40 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 flex flex-col gap-6 group overflow-hidden relative h-full w-full">
      {/* Abstract Background Blur */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] -mr-32 -mt-32 rounded-full" />
      
      <header className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-xl">
            <BookOpen className="w-4 h-4 text-primary" />
          </div>
          <h3 className="text-sm font-black uppercase tracking-widest text-foreground/70 italic">
            Plan de Acción Recomendado
          </h3>
        </div>
        <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest ml-11">
          Prioridades de estudio según tu actividad reciente
        </p>
      </header>

      <div className="flex flex-col gap-2 relative z-10">
        {recommendations.map((rec, i) => (
          <div 
            key={rec.itcCode}
            className="flex items-center justify-between p-3 bg-white/2 hover:bg-white/5 border border-white/5 rounded-xl transition-all group/item cursor-default"
          >
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-black text-foreground/15 w-4">
                {(i + 1).toString().padStart(2, '0')}
              </span>
              <div className="flex flex-col">
                <span className="text-xs font-black tracking-tight text-foreground/80 group-hover/item:text-primary transition-colors">
                  {rec.itcCode}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                   <Clock className="w-2.5 h-2.5 text-foreground/15" />
                   <span className="text-[8px] font-bold text-foreground/25 uppercase tracking-tighter">
                     {rec.questionsAnswered} rpta.
                   </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`px-2 py-0.5 rounded-full border text-[7px] font-black uppercase tracking-widest ${
                rec.status === 'ignored' 
                  ? 'bg-red-500/10 border-red-500/20 text-red-500/60' 
                  : rec.status === 'critical'
                  ? 'bg-orange-500/10 border-orange-500/20 text-orange-500/60'
                  : 'bg-primary/10 border-primary/20 text-primary/60'
              }`}>
                {rec.status === 'ignored' ? 'Sin iniciar' : rec.status === 'critical' ? 'Refuerzo' : 'En progreso'}
              </div>
              <ChevronRight className="w-3 h-3 text-white/5 group-hover/item:text-white/20 transition-colors" />
            </div>
          </div>
        ))}
      </div>

      <footer className="mt-4 pt-6 border-t border-white/5 flex justify-center relative z-10">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-3 h-3 text-primary/40" />
          <p className="text-[9px] font-bold text-foreground/20 uppercase tracking-widest">
            Focalízate en las ITCs con estado <span className="text-red-500/40">Sin iniciar</span> para un balance óptimo
          </p>
        </div>
      </footer>
    </div>
  );
}
