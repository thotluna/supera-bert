"use client"

import { Button } from "@/app/components/ui/button";
import { Quiz, QuizAnswer } from "@/libs/quiz/domain/quiz";
import { Question } from "@/libs/quiz/models";
import { Clock, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useState, JSX } from "react";
import { ReviewItem } from "../components/review-item";
import { ResultsSummary } from "../components/results-summary";
import { RadarChart } from "@/app/components/radar-chart";

interface ResultsContentProps {
  quiz: Quiz;
  answers: QuizAnswer[];
  questions: Question[];
}

export function ResultsContent({ quiz, answers, questions }: ResultsContentProps): JSX.Element {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const correctAnswers = answers.filter(a => a.isCorrect).length;
  const incorrectAnswers = answers.length - correctAnswers;
  const unansweredCount = questions.length - answers.length;
  const percentage = Math.round((quiz.totalScore / (quiz.totalQuestions * 1)) * 100) || 0; 
  const scorePercentage = Math.min(100, Math.max(0, percentage));

  const times = answers.map(a => a.timeMs).filter(t => typeof t === 'number' && t > 0);
  const avgTimeMs = times.length ? times.reduce((a, b) => a + b, 0) / times.length : 0;
  const maxTimeMs = times.length ? Math.max(...times) : 0;
  const minTimeMs = times.length ? Math.min(...times) : 0;

  const formatTime = (ms: number): string => {
    if (ms === 0) return "0s";
    const totalSeconds = ms / 1000;
    if (totalSeconds < 60) return `${totalSeconds.toFixed(1)}s`;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes}m ${seconds}s`;
  };

  const topicMap = new Map<string, { total: number; correct: number }>();
  
  questions.forEach(q => {
    const itc = q.itc || "ITC-BT-GEN";
    const answer = answers.find(a => a.questionId === q.id);
    const isCorrect = answer?.isCorrect || false;

    const current = topicMap.get(itc) || { total: 0, correct: 0 };
    topicMap.set(itc, {
      total: current.total + 1,
      correct: current.correct + (isCorrect ? 1 : 0),
    });
  });

  const topicData = Array.from(topicMap.entries()).map(([itcCode, stats]) => ({
    itcCode,
    totalQuestions: stats.total,
    correctAnswers: stats.correct,
    datasetSize: stats.total,
  }));

  return (
    <div className="flex flex-col gap-12 animate-in fade-in duration-1000">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <ResultsSummary 
            quiz={quiz}
            correctCount={correctAnswers}
            incorrectCount={incorrectAnswers}
            unansweredCount={unansweredCount}
            percentage={scorePercentage}
            avgTime={formatTime(avgTimeMs)}
            maxTime={formatTime(maxTimeMs)}
            minTime={formatTime(minTimeMs)}
          />
        </div>
        <div className="lg:col-span-1">
          <RadarChart data={topicData} mode="results" />
        </div>
      </div>

      {/* Detailed Review */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-4">
            <span className="w-10 h-10 rounded-2xl bg-accent/20 flex items-center justify-center text-accent shadow-neon-sm shadow-accent/20!">
              <Clock size={20} />
            </span>
            Revisión Detallada
          </h3>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30 px-4 py-2 border border-white/5 rounded-full">
            {questions.length} Preguntas Analizadas
          </span>
        </div>

        <div className="flex flex-col gap-4">
          {questions.map((question, index) => (
            <ReviewItem
              key={`${question.id}-${index}`}
              question={question}
              answer={answers.find(a => a.questionId === question.id)}
              index={index}
              isExpanded={expandedId === question.id}
              onToggle={() => setExpandedId(expandedId === question.id ? null : question.id)}
            />
          ))}
        </div>
      </section>

      {/* Final Actions */}
      <div className="flex items-center justify-center py-12 border-t border-white/5">
        <Button
          as={Link}
          href="/"
          variant="primary"
          size="lg"
          leftIcon={<RotateCcw size={20} />}
          className="w-full sm:w-auto px-12 h-16 text-lg rounded-2xl shadow-neon shadow-primary/20!"
        >
          Nuevo Simulacro
        </Button>
      </div>
    </div>
  );
}
