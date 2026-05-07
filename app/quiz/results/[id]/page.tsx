import { Factory } from "@/libs/shape/factory";
import { notFound } from "next/navigation";
import { ResultsContent } from "@/app/quiz/results/[id]/results-content";
import { NavigationGuard } from "@/app/components/navigation-guard";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ResultsPage({ params }: PageProps) {
  const { id } = await params;
  const quizService = await Factory.getQuizService();
  const result = await quizService.getQuizResult(id);

  if (result.error || !result.data) {
    notFound();
  }

  return (
    <div className="w-full max-w-5xl py-6 px-4 md:px-0">
      <NavigationGuard />
      <ResultsContent 
        quiz={result.data.quiz} 
        answers={result.data.answers} 
        questions={result.data.questions} 
      />
    </div>
  );
}
