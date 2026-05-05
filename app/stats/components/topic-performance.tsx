import { TopicStats } from "@/libs/quiz/domain/stats";
import { JSX } from "react";

interface TopicPerformanceProps {
  stats: TopicStats[];
}

export function TopicPerformance({ stats }: TopicPerformanceProps): JSX.Element {
  return (
    <div className="bg-subface/40 backdrop-blur-xl border border-white/10 p-6 rounded-3xl w-full">
      <header className="flex items-center gap-3 mb-6">
        <h3 className="text-sm font-black uppercase tracking-widest text-foreground/70 italic">Rendimiento por Tópico</h3>
        <div className="h-[2px] flex-1 bg-white/5 rounded-full" />
      </header>
      <div className="grid gap-4">
        {stats
          .sort((a, b) => b.totalQuestions - a.totalQuestions)
          .slice(0, 6)
          .map((topic) => {
            const percentage = topic.totalQuestions > 0 
              ? (topic.correctAnswers / topic.totalQuestions) * 100 
              : 0;
              
            return (
              <div key={topic.itcCode} className="flex flex-col gap-1.5 group">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold uppercase tracking-wider group-hover:text-primary transition-colors">
                    {topic.itcCode}
                  </span>
                  <span className="text-[10px] font-black tabular-nums">
                    {percentage.toFixed(0)}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-linear-to-r from-primary to-cyan-400 transition-all duration-700 ease-in-out relative"
                    style={{ width: `${percentage}%` }}
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] animate-shimmer" />
                  </div>
                </div>
                <div className="flex justify-between text-[8px] text-foreground/30 font-bold uppercase tracking-tighter">
                  <span>{topic.correctAnswers} Aciertos</span>
                  <span>{topic.totalQuestions} Q.</span>
                </div>
              </div>
            );
          })}
        {stats.length === 0 && (
          <p className="text-center py-10 text-xs font-bold text-foreground/30 uppercase tracking-[0.2em]">
            No hay datos suficientes
          </p>
        )}
      </div>
    </div>
  );
}
