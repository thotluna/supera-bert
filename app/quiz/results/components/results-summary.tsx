import { Quiz } from "@/libs/quiz/domain/quiz";
import { CheckCircle2, XCircle, Trophy } from "lucide-react";
import { JSX } from "react";

interface ResultsSummaryProps {
  quiz: Quiz;
  correctCount: number;
  incorrectCount: number;
  percentage: number;
}

import { QuizScore } from "@/libs/quiz/domain/score";

export function ResultsSummary({ quiz, correctCount, incorrectCount, percentage }: ResultsSummaryProps): JSX.Element {
  const feedback = QuizScore.getFeedback(percentage);
  const strokeDasharray = 553;
  const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;

  return (
    <section className="bg-subface/40 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-10 shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px] -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -ml-20 -mb-20" />

      <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
        {/* Circular Score */}
        <div className="relative w-56 h-56 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90 drop-shadow-[0_0_15px_rgba(var(--accent-rgb),0.2)]">
            <circle
              cx="112"
              cy="112"
              r="100"
              stroke="currentColor"
              strokeWidth="14"
              fill="transparent"
              className="text-white/5"
            />
            <circle
              cx="112"
              cy="112"
              r="100"
              stroke="currentColor"
              strokeWidth="14"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className={`transition-all duration-[1.5s] ease-out ${percentage > 80 ? 'text-accent' : percentage === 80 ? 'text-yellow-400' : 'text-error'}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center animate-in zoom-in duration-1000 delay-500">
            <span className="text-6xl font-black italic tracking-tighter tabular-nums">{percentage}%</span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/40 font-black mt-1">Efectividad</span>
          </div>
        </div>

        {/* Message and Quick Stats */}
        <div className="flex-1 text-center lg:text-left">
          <h2 className={`text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-3 drop-shadow-neon-sm ${feedback.color}`}>
            {feedback.title}
          </h2>
          <p className="text-lg text-foreground/50 font-medium mb-8 max-w-lg leading-relaxed">
            {feedback.sub}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
            <div className="bg-white/5 rounded-3xl p-5 border border-white/10 hover:bg-white/10 transition-colors duration-300">
              <div className="flex items-center gap-2 text-success mb-2">
                <CheckCircle2 size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">Aciertos</span>
              </div>
              <span className="text-2xl font-black italic">{correctCount}</span>
            </div>
            
            <div className="bg-white/5 rounded-3xl p-5 border border-white/10 hover:bg-white/10 transition-colors duration-300">
              <div className="flex items-center gap-2 text-error mb-2">
                <XCircle size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">Fallos</span>
              </div>
              <span className="text-2xl font-black italic">{incorrectCount}</span>
            </div>

            <div className="bg-white/5 rounded-3xl p-5 border border-white/10 hover:bg-white/10 transition-colors duration-300 col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 text-accent mb-2">
                <Trophy size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">Puntos</span>
              </div>
              <span className="text-2xl font-black italic tabular-nums">{quiz.totalScore.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
