import { Question } from "@/libs/quiz/models";
import { QuizAnswer } from "@/libs/quiz/domain/quiz";
import { Check, X, ChevronDown } from "lucide-react";
import { JSX } from "react";
import { ReportButton } from "../../components/report-button";

interface ReviewItemProps {
  question: Question;
  answer?: QuizAnswer;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}

export function ReviewItem({
  question,
  answer,
  index,
  isExpanded,
  onToggle
}: ReviewItemProps): JSX.Element {
  const isUnanswered = !answer;
  const isCorrect = answer?.isCorrect ?? false;

  return (
    <div
      className={`
        group border rounded-3xl transition-all duration-500 overflow-hidden backdrop-blur-md
        ${isUnanswered 
          ? 'border-zinc-500/20 bg-zinc-500/5 hover:border-zinc-500/40'
          : isCorrect
            ? 'border-success/20 bg-success-bg/5 hover:border-success/40'
            : 'border-error/20 bg-error-bg/5 hover:border-error/40'
        }
        ${isExpanded ? 'ring-2 ring-inset ring-white/5 shadow-2xl' : ''}
      `}
    >
      <button
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-controls={`review-content-${question.id}`}
        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
      >
        <div className="flex items-center gap-5">
          <span className={`
            shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black transition-transform duration-500
            ${isUnanswered 
              ? 'bg-zinc-500/20 text-zinc-400 shadow-neon-sm shadow-zinc-500/20!' 
              : isCorrect 
                ? 'bg-success/20 text-success shadow-neon-sm shadow-success/20!' 
                : 'bg-error/20 text-error shadow-neon-sm shadow-error/20!'}
            ${isExpanded ? 'scale-110' : 'group-hover:scale-105'}
          `}>
            {index + 1}
          </span>
          <div className="flex flex-col gap-1 items-start text-left">
            <p className="text-base md:text-lg font-bold tracking-tight text-foreground/90 leading-tight">
              {question.question}
            </p>
            {isUnanswered && (
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 bg-zinc-500/10 border border-zinc-500/20 px-2 py-0.5 rounded-md mt-1">
                Sin responder / Reportada
              </span>
            )}
          </div>
        </div>
        <div className={`
          p-2 rounded-xl bg-white/5 text-foreground/20 transition-all duration-300
          ${isExpanded ? 'rotate-180 text-foreground/50 bg-white/10' : 'group-hover:text-foreground/40'}
        `}>
          <ChevronDown size={20} />
        </div>
      </button>

      {isExpanded && (
        <div 
          id={`review-content-${question.id}`}
          className="px-6 pb-6 animate-in slide-in-from-top-4 fade-in duration-500"
        >
          <div className="space-y-4 pt-6 border-t border-white/10">
            <div className="grid gap-3">
              {question.options.map((opt) => {
                const isSelected = answer?.selectedOptionIds.includes(opt.id);
                const isCorrectOption = opt.isCorrect;

                let statusStyles = "border-white/10 bg-white/5 text-foreground/70";
                
                if (isSelected && isCorrectOption) {
                  statusStyles = "border-success bg-success-bg/20 text-success shadow-neon-sm shadow-success/20! opacity-100! border-2";
                } else if (isSelected && !isCorrectOption) {
                  statusStyles = "border-error bg-error-bg/20 text-error shadow-neon-sm shadow-error/20! opacity-100! border-2";
                } else if (!isSelected && isCorrectOption) {
                  statusStyles = "border-success/40 bg-transparent text-success border-dashed";
                }

                return (
                  <div
                    key={opt.id}
                    className={`
                      group relative p-4 rounded-2xl border text-sm md:text-base flex items-center justify-between transition-all duration-300
                      ${statusStyles}
                    `}
                  >
                    <span className="font-medium pr-8">{opt.answer}</span>

                    <div className="flex items-center shrink-0">
                      {isCorrectOption && !isSelected && (
                        <div className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-success/80">
                          <span>Correcta</span>
                          <Check size={18} strokeWidth={3} />
                        </div>
                      )}

                      {isSelected && (
                        <div className="flex items-center animate-in zoom-in duration-500">
                          {isCorrectOption
                            ? <Check size={28} strokeWidth={4} className="text-success drop-shadow-neon" />
                            : <X size={28} strokeWidth={4} className="text-error drop-shadow-neon" />
                          }
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {question.options.find(o => o.isCorrect)?.explanation && (
              <div className="mt-6 bg-subface/60 rounded-2xl p-5 border border-white/10 shadow-inner relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-accent/30" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 block text-accent/80">
                  Fundamento Técnico REBT
                </span>
                <p className="text-sm text-foreground/70 leading-relaxed italic font-medium">
                  {question.options.find(o => o.isCorrect)?.explanation}
                </p>
              </div>
            )}

            {question.itc && (
              <div className="flex justify-end pt-4">
                <ReportButton 
                  questionId={question.id} 
                  itcCode={question.itc} 
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
