import { JSX } from "react";

export function QuizTopicsSkeleton(): JSX.Element {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-2 animate-pulse">
      <div className="col-span-2 h-9 rounded-lg bg-foreground/5 border border-foreground/10" />

      {Array.from({ length: 52 }).map((_, i) => (
        <div
          key={i}
          className="h-9 rounded-lg bg-foreground/5 border border-foreground/5"
        />
      ))}
    </div>
  );
}
