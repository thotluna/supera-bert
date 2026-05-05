import { LucideIcon } from "lucide-react";
import { JSX } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  featured?: boolean;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function MetricCard({ title, value, icon: Icon, description, trend, featured }: MetricCardProps): JSX.Element {
  return (
    <div className={`bg-subface/40 backdrop-blur-xl border border-white/10 p-6 rounded-4xl flex flex-col justify-between hover:border-primary/30 transition-all duration-500 group relative overflow-hidden ${featured ? 'md:col-span-2 min-h-[160px]' : 'min-h-[140px]'}`}>
      {featured && <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] -mr-16 -mt-16 rounded-full group-hover:bg-primary/10 transition-all duration-700" />}
      
      <div className="flex justify-between items-start relative z-10">
        <div className={`p-2.5 rounded-xl transition-colors ${featured ? 'bg-primary/20 group-hover:bg-primary/30' : 'bg-primary/10 group-hover:bg-primary/20'}`}>
          <Icon className={`${featured ? 'w-6 h-6' : 'w-5 h-5'} text-primary`} />
        </div>
        {trend && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${trend.isPositive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
            {trend.isPositive ? '+' : '-'}{trend.value}%
          </span>
        )}
      </div>

      <div className="relative z-10 mt-4">
        <p className={`font-bold text-foreground/40 uppercase tracking-[0.2em] ${featured ? 'text-xs' : 'text-[9px]'}`}>{title}</p>
        <h3 className={`font-black tracking-tighter mt-1 leading-none ${featured ? 'text-4xl md:text-5xl text-primary' : 'text-2xl'}`}>{value}</h3>
        {description && <p className="text-[9px] font-bold text-foreground/20 uppercase tracking-widest mt-2">{description}</p>}
      </div>
    </div>
  );
}
