import { ChartNoAxesColumn } from "lucide-react";
import Link from "next/link"

export function ButtonStats() {

  return (
    <Link
      href="/stats"
      aria-label="Ver estadísticas de entrenamiento"
      className="text-[9px] font-black text-foreground/70 hover:text-primary transition-colors uppercase tracking-widest px-2 py-1.5 rounded-lg hover:bg-primary/5 border border-transparent hover:border-primary/10"
    >
      <ChartNoAxesColumn className="w-4 h-4" />
    </Link>
  );
}