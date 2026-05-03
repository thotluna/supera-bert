"use client";

import { useQuizStore } from "@/libs/stores/quiz-store";
import { Check, X, ChevronDown, ChevronUp, BookOpen, Info } from "lucide-react";
import { useState } from "react";
import { ResponseQuestion, ResponseOption } from "@/libs/quiz/models";

export function ReviewSection() {
  const answers = useQuizStore((state) => state.answers);

  if (answers.length === 0) return null;

  return (
    <section className="flex flex-col gap-6 w-full mt-12">
      <header className="flex items-center gap-3">
        <div className="h-px grow bg-foreground/5" />
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-foreground/30 italic">Revisión Detallada</h3>
        <div className="h-px grow bg-foreground/5" />
      </header>

      <div className="flex flex-col gap-3">
        {answers.map((answer, index) => (
          <QuestionReviewCard key={answer.id} answer={answer} index={index} />
        ))}
      </div>
    </section>
  );
}

function QuestionReviewCard({ answer, index }: { answer: ResponseQuestion; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <article 
      className={`
        group flex flex-col rounded-2xl border transition-all duration-300
        ${answer.isCorrect 
          ? 'bg-emerald-500/2 border-emerald-500/10 hover:border-emerald-500/30' 
          : 'bg-rose-500/2 border-rose-500/10 hover:border-rose-500/30'}
      `}
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-4 p-5 text-left w-full"
      >
        <span className={`
          flex items-center justify-center w-8 h-8 rounded-lg text-xs font-black
          ${answer.isCorrect ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}
        `}>
          {index + 1}
        </span>
        
        <div className="flex flex-col grow">
          <p className="text-sm font-bold text-foreground/80 line-clamp-1 group-hover:line-clamp-none transition-all">
            {answer.question}
          </p>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-[9px] font-bold uppercase tracking-tight text-foreground/30">{answer.itc}</span>
            <span className="w-1 h-1 rounded-full bg-foreground/10" />
            <span className="text-[9px] font-bold uppercase tracking-tight text-foreground/30">
              {answer.points.toFixed(1)} pts
            </span>
          </div>
        </div>

        <div className={`p-2 rounded-xl transition-colors ${answer.isCorrect ? 'text-emerald-500' : 'text-rose-500'}`}>
          {answer.isCorrect ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </div>

        <div className="text-foreground/20">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="px-5 pb-5 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="h-px bg-foreground/5 mb-5" />
          
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-1">Opciones de la Pregunta</p>
              {answer.options.map((opt) => (
                <OptionReviewRow key={opt.id} option={opt} />
              ))}
            </div>

            {!answer.isCorrect && (
              <div className="flex items-start gap-3 p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[11px] font-medium text-amber-700/80 leading-relaxed italic">
                  No has completado todas las respuestas correctas o has seleccionado alguna incorrecta. 
                  Revisa las opciones marcadas en verde para aprender la respuesta oficial.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </article>
  );
}

function OptionReviewRow({ option }: { option: ResponseOption }) {
  // Determine state
  const isSelected = option.selected;
  const isCorrect = option.isCorrect;
  
  // Scenarios:
  // 1. Correctly Selected: selected=true, isCorrect=true -> Success
  // 2. Incorrectly Selected: selected=true, isCorrect=false -> Error
  // 3. Missed Correct: selected=false, isCorrect=true -> Warning/Info (Should have selected)
  // 4. Correctly Unselected: selected=false, isCorrect=false -> Neutral

  let statusStyles = "bg-foreground/5 border-foreground/5 opacity-60";
  let Icon = null;

  if (isSelected && isCorrect) {
    statusStyles = "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 font-bold";
    Icon = <Check className="w-3.5 h-3.5" />;
  } else if (isSelected && !isCorrect) {
    statusStyles = "bg-rose-500/10 border-rose-500/20 text-rose-600 font-bold";
    Icon = <X className="w-3.5 h-3.5" />;
  } else if (!isSelected && isCorrect) {
    statusStyles = "bg-emerald-500/3 border-emerald-500/30 text-emerald-600/70 border-dashed";
    Icon = <div className="w-3.5 h-3.5 rounded-full border-2 border-current opacity-40" />;
  }

  return (
    <div className={`flex flex-col gap-2 p-3 rounded-xl border text-xs transition-colors ${statusStyles}`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">
          {Icon}
        </div>
        <div className="flex flex-col gap-1.5 grow">
          <span>{option.answer}</span>
          {isSelected && !isCorrect && (
            <span className="text-[9px] uppercase font-black tracking-tight opacity-60">Selección incorrecta</span>
          )}
          {!isSelected && isCorrect && (
            <span className="text-[9px] uppercase font-black tracking-tight opacity-60">Opción correcta omitida</span>
          )}
        </div>
      </div>
      
      {isCorrect && option.explanation && (
        <div className="flex items-start gap-2 pt-2 border-t border-current/10">
          <BookOpen className="w-3 h-3 shrink-0 mt-0.5" />
          <p className="italic opacity-80 text-[11px] leading-relaxed">{option.explanation}</p>
        </div>
      )}
    </div>
  );
}
