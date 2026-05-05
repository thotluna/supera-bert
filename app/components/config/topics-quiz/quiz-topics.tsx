'use client';

import { useConfigTopics } from "@/libs/quiz/hooks/use-config-topics";
import { TopicOption } from "@/libs/quiz/models";
import { JSX } from "react";
import { QuizTopicsView } from "./quiz-topics-view";

interface QuizTopicsProps {
  topics: TopicOption[];
}

export function QuizTopics({ topics }: QuizTopicsProps): JSX.Element {
  const state = useConfigTopics();

  return (
    <QuizTopicsView 
      topics={topics}
      {...state}
    />
  );
}
