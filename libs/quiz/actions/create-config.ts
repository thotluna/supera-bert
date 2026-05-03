import { ITCTopic, ModeQuiz } from "../models";
import { getConfigQuiz } from "../services/config-quiz";

export function createConfig({ mode, topics, userId }: { mode: ModeQuiz, topics: ITCTopic[], userId: string }) {
  return getConfigQuiz({ userId, mode, topics })

}