import { ITCTopic } from "@/libs/quiz/models";
import { useState } from "react";

interface IUseConfigTopics {
  selectedTopics: Set<ITCTopic>;
  isAllSelected: boolean;
  handleToggleAll: () => void;
  handleToggleTopic: (topic: ITCTopic, available: boolean) => void;
}

export function useConfigTopics(): IUseConfigTopics {
  const [selectedTopics, setSelectedTopics] = useState<Set<ITCTopic>>(new Set());
  const [isAllSelected, setIsAllSelected] = useState<boolean>(true);

  const handleToggleAll = (): void => {
    setIsAllSelected(true);
    setSelectedTopics(new Set());
  };

  const handleToggleTopic = (topic: ITCTopic, available: boolean): void => {
    if (!available) return;

    setIsAllSelected(false);
    setSelectedTopics((prev) => {
      const updatedSelection = new Set(prev);
      if (updatedSelection.has(topic)) {
        updatedSelection.delete(topic);
        if (updatedSelection.size === 0) setIsAllSelected(true);
      } else {
        updatedSelection.add(topic);
      }
      return updatedSelection;
    });
  };

  return {
    selectedTopics,
    isAllSelected,
    handleToggleAll,
    handleToggleTopic,
  };
}