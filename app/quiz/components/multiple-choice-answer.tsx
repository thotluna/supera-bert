"use client"

import { useQuizStore } from "@/libs/stores/quiz-store"
import { ChoiceAnswerView } from "./choice-answer-view";
import { JSX } from "react";

export function MultipleChoiceAnswer(): JSX.Element | null {
  const currentQuestion = useQuizStore(state => state.currentQuestion);
  const currentSelection = useQuizStore(state => state.currentSelection);
  const toggleOption = useQuizStore(state => state.toggleOption);
  const isFeedbacking = useQuizStore(state => state.isFeedbacking);

  if (!currentQuestion || currentQuestion.type !== 'multiple') return null;

  const selectedIds = new Set(currentSelection.map(o => o.id));

  return (
    <ChoiceAnswerView
      options={currentQuestion.options}
      selectedIds={selectedIds}
      isMultiple={true}
      isFeedbacking={isFeedbacking}
      onSelect={toggleOption}
    />
  );
}
