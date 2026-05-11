import { verifyUser } from "@/libs/auth/actions/verify-user";
import { createConfig } from "@/libs/quiz/actions/create-config";
import { getAllQuestions } from "@/libs/quiz/actions/get-all-questions";
import { ModeQuiz, ITCTopic, Question } from "@/libs/quiz/models";
import { redirect } from "next/navigation";
import { JSX } from "react";
import { Header } from "./components/header";
import { QuestionsText } from "./components/questions-text";
import { MultipleChoiceAnswer } from "./components/multiple-choice-answer";
import { SimpleChoiceAnswers } from "./components/simple-choice-answer";
import { QuizFooter } from "./components/footer";
import { Initialization } from "./components/initialization";
import { VisibilityTracker } from "./components/visibility-tracker";

interface QuizPageProps {
  searchParams: Promise<{
    mode?: string;
    topics?: string | string[];
  }>;
}

export default async function QuizPage({ searchParams }: QuizPageProps): Promise<JSX.Element> {
  const { data, error } = await verifyUser()

  if (!data || error) {
    redirect("/")
  }

  const userId = data.id;
  const params = await searchParams;
  if (!params.mode || !params.topics) {
    redirect("/")
  }

  const mode: ModeQuiz = params.mode as ModeQuiz;
  const topics = params.topics

  const topicsArray = (() => {
    if (!topics || topics === 'all') return [] as ITCTopic[];
    if (Array.isArray(topics)) return topics as ITCTopic[];
    return topics.split(',').filter(Boolean) as ITCTopic[];
  })();

  const config = createConfig({
    userId,
    mode: mode as ModeQuiz,
    topics: topicsArray
  })

  const questions: Question[] = await getAllQuestions(topicsArray, config.questionCount)

  return (
    <>
      <Initialization config={config} questions={questions} />
      <VisibilityTracker />
      <main className="w-full md:max-w-5xl md:max-h-[98vh] flex flex-col p-4 md:p-6 bg-subface/40 backdrop-blur-xl border border-foreground/10 rounded-2xl md:rounded-3xl shadow-2xl overflow-y-auto md:overflow-hidden">
        <Header />

        <section className="flex flex-col gap-1 mt-4">
          <QuestionsText />
          <div className="space-y-2">
            <SimpleChoiceAnswers />
            <MultipleChoiceAnswer />
          </div>
        </section>

        <QuizFooter />
      </main>
    </>
  );
}
