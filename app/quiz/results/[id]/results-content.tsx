"use client"

import { Quiz, QuizAnswer } from "@/libs/quiz/domain/quiz";
import { Question } from "@/libs/quiz/models";
import { CheckCircle2, XCircle, Clock, Trophy, RotateCcw, ChevronDown, ChevronUp, Check, X } from "lucide-react";
import Link from "next/link";
import { useState, JSX } from "react";

interface ResultsContentProps {
  quiz: Quiz;
  answers: QuizAnswer[];
  questions: Question[];
}

export function ResultsContent({ quiz, answers, questions }: ResultsContentProps): JSX.Element {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const correctAnswers = answers.filter(a => a.isCorrect).length;
  const incorrectAnswers = answers.length - correctAnswers;
  const percentage = Math.round((quiz.totalScore / (quiz.totalQuestions * 1)) * 100) || 0; // Assuming 1pt per question average
  
  // Adjusted percentage calculation based on actual data
  const scorePercentage = Math.min(100, Math.max(0, percentage));

  const getFeedbackMessage = () => {
    if (scorePercentage >= 90) return { title: "¡Excelencia Pura!", sub: "Estás más que listo para el examen oficial.", color: "text-green-400" };
    if (scorePercentage >= 70) return { title: "¡Buen Trabajo!", sub: "Tienes los conceptos claros, pero no bajes la guardia.", color: "text-blue-400" };
    if (scorePercentage >= 50) return { title: "Aprobado Justo", sub: "Necesitas reforzar algunos tópicos para asegurar el éxito.", color: "text-yellow-400" };
    return { title: "Sigue Practicando", sub: "No te rindas, el REBT requiere constancia y estudio.", color: "text-red-400" };
  };

  const feedback = getFeedbackMessage();

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700">
      {/* Header Summary */}
      <section className="bg-subface/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-32 -mt-32" />
        
        <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
          {/* Circular Score */}
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-white/5"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={553}
                strokeDashoffset={553 - (553 * scorePercentage) / 100}
                className={`transition-all duration-1000 ease-out ${scorePercentage >= 70 ? 'text-accent' : scorePercentage >= 50 ? 'text-yellow-500' : 'text-red-500'}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-5xl font-black italic tracking-tighter">{scorePercentage}%</span>
              <span className="text-xs uppercase tracking-widest text-foreground/40 font-bold">Efectividad</span>
            </div>
          </div>

          {/* Message and Quick Stats */}
          <div className="flex-1 text-center md:text-left">
            <h2 className={`text-3xl md:text-4xl font-black uppercase italic tracking-tighter mb-2 ${feedback.color}`}>
              {feedback.title}
            </h2>
            <p className="text-foreground/60 mb-6 max-w-md">{feedback.sub}</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                <div className="flex items-center gap-2 text-green-400 mb-1">
                  <CheckCircle2 size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Aciertos</span>
                </div>
                <span className="text-xl font-bold">{correctAnswers}</span>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                <div className="flex items-center gap-2 text-red-400 mb-1">
                  <XCircle size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Fallos</span>
                </div>
                <span className="text-xl font-bold">{incorrectAnswers}</span>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5 col-span-2 sm:col-span-1">
                <div className="flex items-center gap-2 text-accent mb-1">
                  <Trophy size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Puntos</span>
                </div>
                <span className="text-xl font-bold">{quiz.totalScore.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Review */}
      <section className="flex flex-col gap-4">
        <h3 className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
            <Clock size={18} />
          </span>
          Revisión Detallada
        </h3>

        <div className="flex flex-col gap-3">
          {questions.map((question, index) => {
            const answer = answers.find(a => a.questionId === question.id);
            const isExpanded = expandedId === question.id;

            return (
              <div 
                key={question.id}
                className={`group border rounded-2xl transition-all duration-300 overflow-hidden ${
                  answer?.isCorrect 
                    ? 'border-green-500/20 bg-green-500/5' 
                    : 'border-red-500/20 bg-red-500/5'
                }`}
              >
                <button 
                  onClick={() => setExpandedId(isExpanded ? null : question.id)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <div className="flex items-center gap-4">
                    <span className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${
                      answer?.isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {index + 1}
                    </span>
                    <p className="text-sm md:text-base font-medium line-clamp-1">{question.question}</p>
                  </div>
                  {isExpanded ? <ChevronUp size={20} className="text-foreground/20" /> : <ChevronDown size={20} className="text-foreground/20" />}
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 animate-in slide-in-from-top-2 duration-300">
                    <div className="space-y-4 pt-2 border-t border-white/5">
                      <div className="grid gap-2">
                        {question.options.map((opt) => {
                          const isSelected = answer?.selectedOptionIds.includes(opt.id);
                          const isCorrect = opt.isCorrect;

                          let statusStyles = "border-white/5 bg-white/5 text-foreground/40";
                          if (isSelected && isCorrect) {
                            statusStyles = "border-green-500 bg-green-500/20 text-green-200 shadow-[0_0_15px_rgba(34,197,94,0.1)]";
                          } else if (isSelected && !isCorrect) {
                            statusStyles = "border-red-500 bg-red-500/20 text-red-200";
                          } else if (!isSelected && isCorrect) {
                            statusStyles = "border-green-500/30 bg-transparent text-green-400/50 border-dashed";
                          }

                          return (
                            <div 
                              key={opt.id}
                              className={`group relative p-4 rounded-xl border text-sm flex items-center justify-between transition-all duration-300 ${statusStyles}`}
                            >
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                  <span>{opt.answer}</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center">
                                {isCorrect && !isSelected && (
                                  <Check size={20} className="text-green-500/20" />
                                )}
                                
                                {isSelected && (
                                  <div className="flex items-center animate-in zoom-in duration-300">
                                    {isCorrect 
                                      ? <Check size={32} strokeWidth={3} className="text-green-400" /> 
                                      : <X size={32} strokeWidth={3} className="text-red-400" />
                                    }
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {question.options.find(o => o.isCorrect)?.explanation && (
                        <div className="bg-accent/5 rounded-xl p-4 border border-accent/10">
                          <span className="text-[10px] font-black uppercase tracking-widest text-accent mb-2 block">Explicación REBT</span>
                          <p className="text-sm text-foreground/70 leading-relaxed italic">
                            {question.options.find(o => o.isCorrect)?.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Final Actions */}
      <div className="flex items-center justify-center py-10">
        <Link 
          href="/"
          className="w-full sm:w-auto px-12 py-4 rounded-2xl bg-accent text-white hover:bg-accent/90 transition-all flex items-center justify-center gap-3 font-black uppercase tracking-widest text-sm shadow-neon-sm shadow-accent/40"
        >
          <RotateCcw size={18} />
          Nuevo Simulacro
        </Link>
      </div>
    </div>
  );
}
