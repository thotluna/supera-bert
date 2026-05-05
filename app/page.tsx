import { SubmitQuizButton } from "./components/config/submit-quiz-button";
import { JSX, Suspense } from "react";
import SectionConfig from "./components/config/section-config";
import { startQuizAction } from "./actions";
import ModeConfig from "./components/config/mode-quiz/mode-config";
import { TopicsDataWrapper } from "./components/config/topics-quiz/topics-data-wrapper";
import { QuizTopicsSkeleton } from "./components/config/topics-quiz/quiz-topics-skeleton";

export default async function Home(): Promise<JSX.Element> {
  return (
    <main className="w-full max-w-5xl bg-subface/40 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-3xl md:rounded-[2.5rem] p-4 md:px-10 md:py-6 shadow-2xl shadow-black/5">
      <form action={startQuizAction} className="flex flex-col gap-6">
        <header className="mb-1">
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter uppercase italic text-transparent bg-clip-text bg-linear-to-r from-foreground via-foreground to-foreground/50">
            Configuración del Quiz
          </h1>
          <div className="h-1 w-20 bg-accent/30 rounded-full mt-2" />
        </header>

        <SectionConfig title="Modos de Entrenamiento" className="order-1">
          <ModeConfig />
        </SectionConfig>

        <SectionConfig title="Tópicos de Entrenamiento" className="order-3 md:order-2">
          <Suspense fallback={<QuizTopicsSkeleton />}>
            <TopicsDataWrapper />
          </Suspense>
        </SectionConfig>

        <div className="flex order-2 md:order-3 justify-center mt-2">
          <SubmitQuizButton />
        </div>


      </form>
    </main>
  );
}
