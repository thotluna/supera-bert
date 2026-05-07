import { TopicStats } from "@/libs/quiz/domain/stats";
import { JSX } from "react";

interface RadarChartProps {
  stats: TopicStats[];
}

export function RadarChart({ stats }: RadarChartProps): JSX.Element {
  // Mostramos hasta 15 tópicos para dar una visión amplia sin saturar.
  // Priorizamos mostrar aquellos que tienen actividad, pero permitimos que se vean los "vacíos"
  // para que el usuario sepa que existen y debe estudiarlos.
  const displayStats = [...stats]
    .sort((a, b) => {
      // Primero los que tienen actividad, luego alfabéticamente
      if (a.totalQuestions > 0 && b.totalQuestions === 0) return -1;
      if (a.totalQuestions === 0 && b.totalQuestions > 0) return 1;
      return a.itcCode.localeCompare(b.itcCode);
    })
  // .slice(0, 15);

  if (displayStats.length < 3) {
    return (
      <div className="bg-subface/40 backdrop-blur-xl border border-white/10 p-6 rounded-3xl w-full flex items-center justify-center min-h-[300px]">
        <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.3em] text-center">
          Se necesitan al menos 3 tópicos<br />con datos para el radar
        </p>
      </div>
    );
  }

  const size = 400;
  const center = size / 2;
  const radius = size * 0.35;
  const totalAxes = displayStats.length;

  // Funciones para calcular coordenadas
  const getX = (val: number, i: number, r: number = radius): number => {
    return center + (r * (val / 100)) * Math.cos((2 * Math.PI * i) / totalAxes - Math.PI / 2);
  };

  const getY = (val: number, i: number, r: number = radius): number => {
    return center + (r * (val / 100)) * Math.sin((2 * Math.PI * i) / totalAxes - Math.PI / 2);
  };

  // Generar puntos del polígono de Maestría (Consolidado)
  const masteryPoints = displayStats.map((s, i) => {
    return `${getX(s.masteryScore, i)},${getY(s.masteryScore, i)}`;
  }).join(" ");

  // Generar puntos del polígono de Precisión (Potencial)
  const accuracyPoints = displayStats.map((s, i) => {
    return `${getX(s.accuracyScore, i)},${getY(s.accuracyScore, i)}`;
  }).join(" ");

  return (
    <div className="bg-subface/40 backdrop-blur-xl border border-white/10 p-8 rounded-[3rem] w-full flex flex-col items-center group relative overflow-hidden">
      <header className="w-full flex items-center gap-3 mb-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-foreground/70 italic">Mapa de Maestría</h3>
        <div className="h-px flex-1 bg-linear-to-r from-white/10 to-transparent" />
      </header>

      <div className="relative w-full aspect-square max-w-[280px]">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full overflow-visible drop-shadow-2xl">
          <defs>
            <radialGradient id="radar-gradient">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.1" />
            </radialGradient>
          </defs>

          {/* Background Grid (Concentric Circles) */}
          {[25, 50, 75, 100].map((tick) => (
            <circle
              key={tick}
              cx={center}
              cy={center}
              r={(radius * tick) / 100}
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.15"
              strokeWidth="1"
              className="text-foreground"
            />
          ))}

          {/* Axes */}
          {displayStats.map((_, i) => (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={getX(100, i)}
              y2={getY(100, i)}
              stroke="currentColor"
              strokeOpacity="0.3"
              strokeWidth="1"
              className="text-foreground"
            />
          ))}

          {/* Accuracy Polygon (Potential - Verde Esmeralda) */}
          <polygon
            points={accuracyPoints}
            fill="#10b981"
            fillOpacity="0.12"
            stroke="#10b981"
            strokeWidth="1.5"
            strokeOpacity="0.5"
            strokeDasharray="4 2"
            className="transition-all duration-1000"
          />

          {/* Mastery Polygon (Consolidated - Azul Eléctrico) */}
          <polygon
            points={masteryPoints}
            fill="url(#radar-gradient)"
            stroke="var(--color-primary)"
            strokeWidth="2.5"
            className="drop-shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.3)] transition-all duration-1000"
          />

          {/* Labels */}
          {displayStats.map((s, i) => {
            const x = getX(112, i);
            const y = getY(112, i);
            return (
              <text
                key={i}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-foreground/30 text-[10px] font-black uppercase tracking-widest transition-colors group-hover:fill-foreground/60"
              >
                {s.itcCode.replace("ITC-BT-", "")}
              </text>
            );
          })}

          {/* Center Point */}
          <circle cx={center} cy={center} r="4" fill="var(--color-primary)" fillOpacity="0.5" />
        </svg>
      </div>

      <div className="mt-8 flex flex-col items-center gap-3">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#10b981]/20 border border-[#10b981]/50 border-dashed" />
            <span className="text-[8px] font-black text-foreground/40 uppercase tracking-widest">Potencial</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary/40 border border-primary" />
            <span className="text-[8px] font-black text-foreground/40 uppercase tracking-widest">Consolidado</span>
          </div>
        </div>
        <p className="text-[9px] font-bold text-foreground/25 uppercase tracking-wider text-center max-w-[240px] leading-relaxed italic">
          El área sólida crece con la práctica constante hasta llenar tu potencial de precisión.
        </p>
      </div>
    </div>
  );
}
