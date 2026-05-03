"use client";

import { useQuizStore } from "@/libs/stores/quiz-store";
import { CircleCheckBig, Clock, Target, Trophy } from "lucide-react";

export function SummarySection() {
  const score = useQuizStore((state) => state.score);
  const answers = useQuizStore((state) => state.answers);
  const config = useQuizStore((state) => state.config);

  const totalQuestions = config?.questionCount || 0;
  const correctAnswers = answers.filter((a) => a.isCorrect).length;
  const successPercentage = totalQuestions > 0 
    ? Math.round((correctAnswers / totalQuestions) * 100) 
    : 0;

  const totalTimeMs = answers.reduce((acc, curr) => acc + curr.time, 0);
  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}m`;
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
      {/* Main Score Card */}
      <article className="md:col-span-2 relative overflow-hidden bg-linear-to-br from-accent/20 to-accent/5 border border-accent/20 rounded-3xl p-8 flex flex-col justify-between group">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-accent/10 rounded-full blur-3xl group-hover:bg-accent/20 transition-colors duration-700" />
        
        <div className="flex justify-between items-start relative z-10">
          <div>
            <p className="text-accent font-black uppercase tracking-widest text-xs mb-1">Puntuación Final</p>
            <h2 className="text-6xl font-black italic tracking-tighter text-foreground">
              {score.toLocaleString()}
            </h2>
          </div>
          <div className="bg-accent/10 p-3 rounded-2xl text-accent">
            <Trophy className="w-8 h-8" />
          </div>
        </div>

        <div className="mt-8 relative z-10">
          <div className="flex justify-between items-end mb-2">
            <span className="text-foreground/40 text-xs font-bold uppercase">Efectividad</span>
            <span className="text-foreground font-black italic">{successPercentage}%</span>
          </div>
          <div className="w-full h-3 bg-foreground/5 rounded-full overflow-hidden border border-foreground/5">
            <div 
              className="h-full bg-accent rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${successPercentage}%` }}
            />
          </div>
        </div>
      </article>

      {/* Stats Cards */}
      <div className="md:col-span-2 grid grid-cols-2 gap-4">
        <StatCard 
          icon={<CircleCheckBig className="w-5 h-5" />}
          label="Correctas"
          value={correctAnswers.toString()}
          subValue={`de ${totalQuestions}`}
          color="text-emerald-500"
          bgColor="bg-emerald-500/10"
          borderColor="border-emerald-500/20"
        />
        <StatCard 
          icon={<Target className="w-5 h-5" />}
          label="Promedio"
          value={totalQuestions > 0 ? (score / totalQuestions).toFixed(1) : "0"}
          subValue="pts/pregunta"
          color="text-amber-500"
          bgColor="bg-amber-500/10"
          borderColor="border-amber-500/20"
        />
        <StatCard 
          icon={<Clock className="w-5 h-5" />}
          label="Tiempo Total"
          value={formatTime(totalTimeMs)}
          subValue="invertido"
          color="text-blue-500"
          bgColor="bg-blue-500/10"
          borderColor="border-blue-500/20"
        />
        <StatCard 
          icon={<Clock className="w-5 h-5" />}
          label="Velocidad"
          value={totalQuestions > 0 ? (totalTimeMs / totalQuestions / 1000).toFixed(1) + "s" : "0s"}
          subValue="por pregunta"
          color="text-purple-500"
          bgColor="bg-purple-500/10"
          borderColor="border-purple-500/20"
        />
      </div>
    </section>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

function StatCard({ icon, label, value, subValue, color, bgColor, borderColor }: StatCardProps) {
  return (
    <article className={`flex flex-col p-4 rounded-2xl border ${bgColor} ${borderColor} transition-transform hover:scale-[1.02] duration-300`}>
      <div className={`p-2 rounded-xl w-fit mb-3 ${color} bg-white/5`}>
        {icon}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/40">{label}</span>
      <div className="flex items-baseline gap-1.5">
        <span className={`text-2xl font-black italic tracking-tighter text-foreground`}>{value}</span>
        <span className="text-[10px] font-medium text-foreground/30 uppercase">{subValue}</span>
      </div>
    </article>
  );
}
