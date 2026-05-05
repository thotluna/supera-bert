"use client"

import { useQuizStore } from "@/libs/stores/quiz-store"

export function MultipleChoiceAnswer() {
  const currentQuestion = useQuizStore(state => state.currentQuestion);
  const currentSelection = useQuizStore(state => state.currentSelection);
  const toggleOption = useQuizStore(state => state.toggleOption);
  const isFeedbacking = useQuizStore(state => state.isFeedbacking);

  if (!currentQuestion || currentQuestion.type !== 'multiple') return null;

  return (
    <article className="w-full flex flex-col gap-2">
      {currentQuestion.options.map((option) => {
        const isSelected = currentSelection.some(o => o.id === option.id);
        
        let feedbackStyles = "border-foreground/10 bg-foreground/5 hover:bg-foreground/10";
        if (isFeedbacking && isSelected) {
          feedbackStyles = option.isCorrect 
            ? "border-green-500/50 bg-green-500/10" 
            : "border-red-500/50 bg-red-500/10";
        } else if (isSelected) {
          feedbackStyles = "border-accent bg-accent/5";
        }

        return (
          <label
            key={option.id}
            className={`group relative flex flex-col gap-2 p-4 rounded-xl border backdrop-blur-md cursor-pointer transition-all duration-300 ${feedbackStyles} ${isFeedbacking ? 'cursor-default' : ''}`}
          >
            <input
              className="peer sr-only"
              type="checkbox"
              name="answer"
              checked={isSelected}
              disabled={isFeedbacking}
              onChange={() => toggleOption(option)}
            />

            <div className="flex items-center gap-3">
              <div className={`shrink-0 w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${isSelected ? 'border-accent bg-accent/20' : 'border-foreground/20'}`}>
                <svg
                  className={`w-3.5 h-3.5 text-accent transition-transform duration-200 ${isSelected ? 'scale-100' : 'scale-0'}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={4}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <span className={`text-base md:text-lg font-medium transition-all duration-200 ${isSelected ? 'text-foreground font-bold' : 'text-foreground/70 group-hover:text-foreground'}`}>
                {option.answer}
              </span>
            </div>

            {isFeedbacking && isSelected && option.explanation && (
              <div className="pl-8 animate-in fade-in slide-in-from-top-1 duration-500">
                <p className={`text-sm italic leading-relaxed ${option.isCorrect ? 'text-green-200/70' : 'text-red-200/70'}`}>
                  {option.explanation}
                </p>
              </div>
            )}

            {isSelected && !isFeedbacking && (
              <div className="absolute inset-0 rounded-xl pointer-events-none border-2 border-accent/50" />
            )}
          </label>
        );
      })}
    </article>
  );
}
