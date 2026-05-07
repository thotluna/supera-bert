import { getUserStatsAction } from "@/libs/quiz/actions/get-user-stats";
import { MetricCard } from "./components/metric-card";
import { TopicPerformance } from "./components/topic-performance";
import { EvolutionChart } from "./components/evolution-chart";
import { RadarChart } from "./components/radar-chart";
import { StudyRecommendations } from "./components/study-recommendations";
import { Trophy, Target, Clock, Zap, BookOpen, ArrowLeft, Timer, Coffee } from "lucide-react";
import Link from "next/link";
import { JSX } from "react";
import { NavigationGuard } from "@/app/components/navigation-guard";

export default async function StatsPage(): Promise<JSX.Element> {
  const { data: stats, error } = await getUserStatsAction();

  if (error || !stats) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-subface/40 backdrop-blur-3xl border border-white/10 rounded-3xl min-h-[400px]">
        <NavigationGuard />
        <div className="p-4 bg-red-500/10 rounded-full mb-4">
          <Zap className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-black uppercase italic tracking-tighter text-red-500">Acceso Denegado o Error</h2>
        <p className="text-sm font-bold text-foreground/40 mt-2 uppercase tracking-widest">
          {error?.message || "No se pudieron cargar las estadísticas"}
        </p>
        <Link
          href="/"
          className="mt-8 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all"
        >
          Volver al Inicio
        </Link>
      </div>
    );
  }

  const { global, byTopic, evolution, recommendations } = stats;

  return (
    <div className="w-full max-w-5xl flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out p-4 md:p-0">
      <NavigationGuard />
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 hover:text-primary transition-colors group w-fit"
          >
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            Volver
          </Link>
          <div className="flex flex-col gap-1">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic text-transparent bg-clip-text bg-linear-to-r from-foreground via-foreground to-foreground/80 drop-shadow-sm">
              Dashboard <span className="text-primary text-3xl md:text-4xl ml-2">Stats</span>
            </h1>
            <p className="text-[10px] md:text-xs font-black text-foreground/30 uppercase tracking-[0.4em] ml-1">
              Tu progreso hacia la excelencia profesional
            </p>
          </div>
        </div>
        <div className="h-1 md:h-px flex-1 bg-linear-to-r from-transparent via-white/10 to-transparent hidden md:block mx-8" />
      </header>

      {/* Global Metrics Grid - Asymmetric Bento Layout */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Promedio"
          value={global.averageScore}
          icon={Trophy}
          description="Score medio"
          featured
        />
        <MetricCard
          title="Estándar"
          value={global.byMode.standard}
          icon={BookOpen}
          description="Base"
        />
        <MetricCard
          title="Cronometrado"
          value={global.byMode.timed}
          icon={Timer}
          description="Presión"
        />
        <MetricCard
          title="Relajado"
          value={global.byMode.relaxed}
          icon={Coffee}
          description="Libre"
        />
        <MetricCard
          title="Tiempo"
          value={`${Math.round(global.totalTimeMs / 60000)}m`}
          icon={Clock}
          description="Total"
        />
        <MetricCard
          title="Efectividad"
          value={`${((global.correctAnswers / (global.totalQuestionsAnswered || 1)) * 100).toFixed(0)}%`}
          icon={Target}
          description="Acierto real"
          featured
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Area (2/3) */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <EvolutionChart data={evolution} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <RadarChart stats={byTopic} />
            <StudyRecommendations recommendations={recommendations} />
          </div>
        </div>

        {/* Right Column (1/3) */}
        <div className="lg:col-span-1">
          <TopicPerformance stats={byTopic} />
        </div>
      </div>
    </div>
  );
}
