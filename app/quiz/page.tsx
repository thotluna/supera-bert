import { JSX } from "react";

interface QuizPageProps {
  searchParams: Promise<{
    mode?: string;
    topics?: string;
  }>;
}

export default async function QuizPage({ searchParams }: QuizPageProps): Promise<JSX.Element> {
  const { mode, topics } = await searchParams;

  return (
    <main className="w-full max-w-5xl p-10 bg-subface/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl">
      <header className="mb-8">
        <h1 className="text-4xl font-black tracking-tighter uppercase text-accent italic">
          Simulacro Iniciado
        </h1>
        <p className="text-foreground/50 font-medium uppercase tracking-widest text-[10px] mt-2">
          Modo: <span className="text-foreground">{mode}</span> | Tópicos: <span className="text-foreground">{topics}</span>
        </p>
      </header>

      <div className="grid gap-6">
        <section className="p-8 border border-white/5 bg-background/20 rounded-2xl">
          <p className="text-foreground/70 italic text-lg text-center">
            Cargando el banco de preguntas para {topics === 'all' ? 'todo el reglamento' : `las ITCs: ${topics}`}...
          </p>
        </section>
      </div>
    </main>
  );
}