import { Option } from "@/libs/quiz/models";
import { JSX } from "react";

interface ChoiceAnswerViewProps {
  options: Option[];
  selectedIds: Set<number>;
  isMultiple: boolean;
  isFeedbacking: boolean;
  onSelect: (option: Option) => void;
}

export function ChoiceAnswerView({
  options,
  selectedIds,
  isMultiple,
  isFeedbacking,
  onSelect
}: ChoiceAnswerViewProps): JSX.Element {
  return (
    <div className="w-full flex flex-col gap-3">
      {options.map((option) => {
        const isSelected = selectedIds.has(option.id);

        // Base styles
        let containerStyles = "border-foreground/10 bg-subface/40 hover:bg-subface/60 hover:border-accent/30";
        let indicatorStyles = isSelected ? 'border-accent bg-accent/20 shadow-neon-sm' : 'border-foreground/20 bg-transparent';
        let checkStyles = isMultiple ? 'text-accent' : 'bg-accent shadow-neon-sm';
        let textStyles = isSelected ? 'text-foreground font-bold' : 'text-foreground/70 group-hover:text-foreground';

        // Feedback override
        if (isFeedbacking && isSelected) {
          if (option.isCorrect) {
            containerStyles = "border-success/50 bg-success-bg/30 border-2 shadow-neon-sm !shadow-success/20";
            indicatorStyles = "border-success bg-success/20";
            checkStyles = isMultiple ? "text-success" : "bg-success shadow-neon-sm !shadow-success";
            textStyles = "text-success-foreground font-bold";
          } else {
            containerStyles = "border-error/50 bg-error-bg/30 border-2 shadow-neon-sm !shadow-error/20";
            indicatorStyles = "border-error bg-error/20";
            checkStyles = isMultiple ? "text-error" : "bg-error shadow-neon-sm !shadow-error";
            textStyles = "text-error-foreground font-bold";
          }
        } else if (isSelected) {
          containerStyles = "border-accent bg-accent/5 border-2 shadow-neon-sm";
        }

        return (
          <label
            key={option.id}
            className={`
              group relative flex flex-col gap-2 p-5 rounded-2xl border backdrop-blur-md transition-all duration-500
              ${containerStyles}
              ${isFeedbacking ? 'cursor-default' : 'cursor-pointer active:scale-[0.98]'}
            `}
          >
            <input
              className="sr-only"
              type={isMultiple ? "checkbox" : "radio"}
              name="quiz-answer"
              checked={isSelected}
              disabled={isFeedbacking}
              onChange={() => onSelect(option)}
            />

            <div className="flex items-center gap-4">
              {/* Custom Indicator */}
              <div className={`
                shrink-0 w-6 h-6 border-2 flex items-center justify-center transition-all duration-300
                ${isMultiple ? 'rounded-lg' : 'rounded-full'}
                ${indicatorStyles}
              `}>
                {isMultiple ? (
                  <svg
                    className={`w-4 h-4 ${checkStyles} transition-all duration-500 ${isSelected ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={4}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <div className={`w-2.5 h-2.5 rounded-full ${checkStyles} transition-all duration-500 ${isSelected ? 'scale-100' : 'scale-0'}`} />
                )}
              </div>

              <span className={`text-base md:text-lg leading-tight transition-colors duration-300 ${textStyles}`}>
                {option.answer}
              </span>
            </div>

            {/* Explanation / Feedback */}
            {/* {isFeedbacking && isSelected && option.explanation && (
              <div className="pl-10 mt-1 animate-in fade-in slide-in-from-top-2 duration-700">
                <div className={`h-px w-12 mb-3 ${option.isCorrect ? 'bg-success/30' : 'bg-error/30'}`} />
                <p className={`text-sm italic leading-relaxed font-medium ${option.isCorrect ? 'text-success-foreground/90' : 'text-error-foreground/90'}`}>
                  {option.explanation}
                </p>
              </div>
            )} */}
          </label>
        );
      })}
    </div>
  );
}
