import { JSX } from "react";

// Nueva interfaz alineada con la visión pedagógica de Conquista
interface TopicData {
  itcCode: string;
  totalQuestions: number; // Cobertura (Cuántas preguntas diferentes ha intentado)
  correctAnswers: number; // Dominio (Cuántas preguntas diferentes sabe/acertó)
  datasetSize: number;    // Universo (Total de preguntas que existen en el tema)
}

interface RadarChartProps {
  data: TopicData[];
  mode?: 'dashboard' | 'results'; // Mantenemos el modo por si necesitamos ajustes visuales
}

export function RadarChart({ data, mode = 'dashboard' }: RadarChartProps): JSX.Element {
  // 1. Procesamiento: Transformamos los valores brutos en porcentajes relativos al Dataset Total
  const processed = data
    .map(item => {
      // Evitamos divisiones por cero y aseguramos que el tope sea el datasetSize
      const dSize = Math.max(1, item.datasetSize);
      
      // La línea verde representa cuánto del dataset ha "descubierto"
      const coverage = Math.min(100, (item.totalQuestions / dSize) * 100);
      
      // El área azul representa cuánto del dataset "domina"
      const mastery = Math.min(100, (item.correctAnswers / dSize) * 100);

      return {
        label: item.itcCode.replace(/itc-bt-/gi, "").replace(/ree-general/gi, "GEN"),
        coverage, // Radio para el polígono verde (Dashed)
        mastery   // Radio para el polígono azul (Solid)
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label));

  if (processed.length < 3) {
    return (
      <div className="bg-subface/40 backdrop-blur-xl border border-white/10 p-6 rounded-3xl w-full flex items-center justify-center min-h-[300px]">
        <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.3em] text-center">
          {mode === 'results' 
            ? "Datos insuficientes para el mapa de este quiz"
            : "Se necesitan al menos 3 tópicos con datos para el radar"}
        </p>
      </div>
    );
  }

  const size = 400;
  const center = size / 2;
  const radius = size * 0.35;
  const totalAxes = processed.length;

  const getX = (val: number, i: number, r: number = radius): number => {
    return center + (r * (val / 100)) * Math.cos((2 * Math.PI * i) / totalAxes - Math.PI / 2);
  };

  const getY = (val: number, i: number, r: number = radius): number => {
    return center + (r * (val / 100)) * Math.sin((2 * Math.PI * i) / totalAxes - Math.PI / 2);
  };

  const masteryPoints = processed.map((p, i) => `${getX(p.mastery, i)},${getY(p.mastery, i)}`).join(" ");
  const coveragePoints = processed.map((p, i) => `${getX(p.coverage, i)},${getY(p.coverage, i)}`).join(" ");

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

          {/* Guías circulares (REBT Total) */}
          {[25, 50, 75, 100].map((tick) => (
            <circle key={tick} cx={center} cy={center} r={(radius * tick) / 100} fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth="1" className="text-foreground" />
          ))}

          {/* Ejes radiales */}
          {processed.map((_, i) => (
            <line key={i} x1={center} y1={center} x2={getX(100, i)} y2={getY(100, i)} stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" className="text-foreground" />
          ))}

          {/* Polígono de Cobertura (Verde - Territorio Explorador) */}
          <polygon 
            points={coveragePoints} 
            fill="#10b981" 
            fillOpacity="0.1" 
            stroke="#10b981" 
            strokeWidth="1.5" 
            strokeOpacity="0.5" 
            strokeDasharray="4 2" 
            className="transition-all duration-1000 ease-out"
          />

          {/* Polígono de Dominio (Azul - Territorio Conquistado) */}
          <polygon 
            points={masteryPoints} 
            fill="url(#radar-gradient)" 
            stroke="var(--color-primary)" 
            strokeWidth="2.5" 
            className="drop-shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.5)] transition-all duration-1000 ease-out" 
          />

          {/* Etiquetas */}
          {processed.map((p, i) => (
            <text key={i} x={getX(115, i)} y={getY(115, i)} textAnchor="middle" dominantBaseline="middle" className="fill-foreground/40 text-[11px] font-black uppercase tracking-widest">
              {p.label}
            </text>
          ))}
        </svg>
      </div>

      <div className="mt-8 flex flex-col items-center gap-3">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#10b981]/20 border border-[#10b981]/50 border-dashed" />
            <span className="text-[8px] font-black text-foreground/40 uppercase tracking-widest">Cobertura</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary/40 border border-primary" />
            <span className="text-[8px] font-black text-foreground/40 uppercase tracking-widest">Maestría</span>
          </div>
        </div>
      </div>
    </div>
  );
}
