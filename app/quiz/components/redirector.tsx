"use client";

import { useEffect, JSX } from "react";
import { useRouter } from "next/navigation";
import { useQuizStore } from "@/libs/stores/quiz-store";

export function QuizRedirector(): JSX.Element | null {
  const savedQuizId = useQuizStore((state) => state.savedQuizId);
  const router = useRouter();

  useEffect(() => {
    if (savedQuizId) {
      router.replace(`/quiz/results/${savedQuizId}`);
    }
  }, [savedQuizId, router]);

  return null;
}
