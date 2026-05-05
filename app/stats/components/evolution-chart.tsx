import { DailyEvolution } from "@/libs/quiz/domain/stats";
import { JSX } from "react";

interface EvolutionChartProps {
  data: DailyEvolution[];
}

export function EvolutionChart({ data }: EvolutionChartProps): JSX.Element {
  if (data.length < 2) {
    return (
      <div className="bg-subface/40 backdrop-blur-xl border border-white/10 p-6 rounded-3xl w-full flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.3em] leading-relaxed">
            Se necesitan al menos 2 días de datos<br />para mostrar la evolución
          </p>
        </div>
      </div>
    );
  }

  const scores = data.map(d => d.averageScore);
  const maxScore = Math.max(...scores, 10);
  const minScore = Math.min(...scores, 0);
  const range = (maxScore - minScore) || 1;

  const width = 1000;
  const height = 400;
  const paddingX = 60;
  const paddingY = 60;

  const getX = (index: number): number => (index / (data.length - 1)) * (width - paddingX * 2) + paddingX;
  const getY = (score: number): number => height - ((score - minScore) / range) * (height - paddingY * 2) - paddingY;

  const points = data.map((d, i) => `${getX(i)},${getY(d.averageScore)}`).join(' ');

  return (
    <div className="bg-subface/40 backdrop-blur-xl border border-white/10 p-6 rounded-3xl w-full overflow-hidden">
      <header className="flex items-center gap-3 mb-8">
        <h3 className="text-sm font-black uppercase tracking-widest text-foreground/70 italic">Evolución de Rendimiento</h3>
        <div className="h-px flex-1 bg-linear-to-r from-white/10 to-transparent" />
      </header>
      
      <div className="aspect-2.5/1 w-full relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible drop-shadow-2xl" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chart-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-primary)" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
            <linearGradient id="area-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="15" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid lines (horizontal) */}
          {[0, 0.25, 0.5, 0.75, 1].map((p) => {
            const val = minScore + range * p;
            const y = getY(val);
            return (
              <g key={p}>
                <line 
                  x1={paddingX} y1={y} x2={width - paddingX} y2={y} 
                  stroke="white" strokeOpacity="0.03" strokeWidth="1" 
                />
                <text x={paddingX - 10} y={y + 4} textAnchor="end" className="fill-foreground/20 text-[20px] font-bold tabular-nums">
                  {val.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* Area */}
          <path
            d={`M ${getX(0)},${height - paddingY} L ${points} L ${getX(data.length - 1)},${height - paddingY} Z`}
            fill="url(#area-gradient)"
          />

          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke="url(#chart-gradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
          />

          {/* Data Points */}
          {data.map((d, i) => (
            <g key={i} className="group/dot">
              <circle
                cx={getX(i)}
                cy={getY(d.averageScore)}
                r="10"
                className="fill-primary stroke-background stroke-[4px] shadow-xl group-hover/dot:r-14 transition-all duration-300"
              />
              <circle
                cx={getX(i)}
                cy={getY(d.averageScore)}
                r="20"
                className="fill-transparent cursor-pointer"
              >
                <title>{`${d.date}: ${d.averageScore}`}</title>
              </circle>
            </g>
          ))}
        </svg>
      </div>

      <div className="flex justify-between mt-6 px-2">
        <span className="text-[10px] font-black text-foreground/30 uppercase tracking-widest">{data[0].date}</span>
        <span className="text-[10px] font-black text-foreground/30 uppercase tracking-widest">{data[data.length - 1].date}</span>
      </div>
    </div>
  );
}
