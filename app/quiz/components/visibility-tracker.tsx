"use client";

import { useEffect } from "react";
import { useQuizStore } from "@/libs/stores/quiz-store";

export function VisibilityTracker() {
  const requestPause = useQuizStore((state) => state.requestPause);
  const requestResume = useQuizStore((state) => state.requestResume);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        requestPause("visibility");
      } else {
        requestResume("visibility");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [requestPause, requestResume]);

  return null;
}
