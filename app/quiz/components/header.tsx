"use client"
import { useQuizStore } from "@/libs/stores/quiz-store";
import { CircleCheckBig, CircleQuestionMark, Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  variant?: 'default' | 'accent';
}

interface InfoBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent';
}

export function Header() {
  const config = useQuizStore(state => state.config);
  const answers = useQuizStore(state => state.answers);
  const currentQuestion = useQuizStore(state => state.currentQuestion);
  const expiresAt = useQuizStore(state => state.expiresAt);
  const finish = useQuizStore(state => state.finish);
  const isFeedbacking = useQuizStore(state => state.isFeedbacking);

  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!expiresAt) return;

    const updateTimer = () => {
      if (isFeedbacking) return; // Congelamos el reloj visualmente

      const now = Date.now();
      const diff = Math.max(0, Math.floor((expiresAt - now) / 1000));
      setTimeLeft(diff);
      
      if (diff === 0) {
        finish();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, finish, isFeedbacking]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')} min`;
  };

  const topicsLabel = config?.topics.length === 0 ? 'Todo el reglamento' : config?.topics.join(', ');
  const progress = answers.length + (currentQuestion ? 1 : 0);
  const totalPoints = Number(answers.reduce((acc, curr) => acc + (curr.points || 0), 0).toFixed(2));

  return (
    <header className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-foreground/5">
      <section className="flex flex-col gap-1.5 w-full md:w-auto">
        <h1 className="text-2xl md:text-4xl font-black tracking-tighter uppercase text-transparent bg-clip-text bg-linear-to-r from-foreground to-foreground/50 italic leading-none">
          Simulacro
        </h1>
        <div className="flex items-center gap-1.5 flex-wrap max-w-full md:max-w-md">
          <InfoBadge variant="accent">{config?.mode}</InfoBadge>
          <InfoBadge>{topicsLabel}</InfoBadge>
        </div>
      </section>

      <section className="grid grid-cols-2 md:flex items-center gap-2 w-full md:w-auto" aria-label="Estadísticas del simulacro">
        <MetricCard
          icon={<Clock className="w-4 h-4" />}
          label="Tiempo"
          value={formatTime(timeLeft)}
          variant="accent"
        />
        <MetricCard
          icon={<CircleQuestionMark className="w-4 h-4" />}
          label="Progreso"
          value={`${progress} / ${config?.questionCount || 0}`}
        />
        <div className="col-span-2 md:col-span-1">
          <MetricCard
            icon={<CircleCheckBig className="w-4 h-4" />}
            label="Puntos"
            value={totalPoints.toLocaleString()}
          />
        </div>
      </section>
    </header>
  );
}

function MetricCard({ icon, label, value, variant = 'default' }: MetricCardProps) {
  const isAccent = variant === 'accent';

  return (
    <article className={`
      flex items-center rounded-xl p-1 pr-3 gap-2 border transition-colors
      ${isAccent
        ? 'bg-accent/5 border-accent/20'
        : 'bg-foreground/5 border-foreground/10'}
    `}>
      <div className={`p-1.5 rounded-lg ${isAccent ? 'bg-accent/10 text-accent' : 'bg-foreground/5 text-foreground/40'}`}>
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-[8px] text-foreground/40 font-bold uppercase tracking-tight">{label}</span>
        <span className="text-xs font-black text-foreground/80 tracking-tight">{value}</span>
      </div>
    </article>
  );
}

function InfoBadge({ children, variant = 'default' }: InfoBadgeProps) {
  const isAccent = variant === 'accent';

  return (
    <span className={`
      px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider border
      ${isAccent
        ? 'bg-accent/10 border-accent/20 text-accent'
        : 'bg-foreground/5 border-foreground/10 text-foreground/40'}
    `}>
      {children}
    </span>
  );
}