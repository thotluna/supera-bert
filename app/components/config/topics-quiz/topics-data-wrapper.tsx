import { getTopics } from "@/libs/quiz/actions/get-options-topics";
import { QuizTopics } from "./quiz-topics";
import { JSX } from "react";

export async function TopicsDataWrapper(): Promise<JSX.Element> {
  const topics = await getTopics();
  
  return <QuizTopics topics={topics} />;
}
