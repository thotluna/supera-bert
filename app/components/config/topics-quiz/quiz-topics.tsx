'use client';

import { useConfigTopics } from "@/libs/quiz/hooks/use-config-topics";
import { TopicOption } from "@/libs/quiz/models";
import { JSX } from "react";

interface QuizTopicsProps {
  topics: TopicOption[];
}

export function QuizTopics({ topics }: QuizTopicsProps): JSX.Element {
  const { selectedTopics, isAllSelected, handleToggleAll, handleToggleTopic } = useConfigTopics();

  return (
    <article className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-2">
      <label
        className={`col-span-2 h-9 flex items-center justify-center gap-3 px-4 rounded-lg border transition-all duration-300 cursor-pointer text-[10px] font-bold uppercase tracking-widest ${isAllSelected
          ? 'border-accent bg-accent/20 shadow-neon-sm text-foreground'
          : 'border-foreground/10 bg-subface hover:border-accent/50 text-foreground/70'
          }`}
      >
        <input
          type="radio"
          name="topics"
          value="all"
          checked={isAllSelected}
          onChange={handleToggleAll}
          className="sr-only"
        />
        <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${isAllSelected ? 'bg-accent shadow-[0_0_8px_var(--neon-color)]' : 'bg-foreground/40'}`} />
        Todo REBT
      </label>

      {topics.map((topic) => {
        const isSelected = selectedTopics.has(topic.name);

        return (
          <label
            key={topic.name}
            className={`
              relative h-9 flex items-center justify-center rounded-lg border text-[9px] font-bold transition-all duration-300
              ${!topic.available
                ? 'opacity-20 cursor-not-allowed border-dashed border-foreground/20 bg-transparent'
                : isSelected && !isAllSelected
                  ? 'border-accent bg-accent/20 text-foreground shadow-neon-sm scale-105 z-10'
                  : 'border-foreground/10 bg-subface hover:border-accent/40 text-foreground/70 hover:text-foreground cursor-pointer'
              }
            `}
          >
            <input
              type="checkbox"
              name="topics"
              value={topic.name}
              checked={isSelected && !isAllSelected}
              disabled={!topic.available}
              onChange={() => handleToggleTopic(topic.name, topic.available)}
              className="sr-only"
            />
            {topic.name}

            {topic.available && !isSelected && !isAllSelected && (
              <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-accent/30" />
            )}
          </label>
        );
      })}
    </article>
  );
}
