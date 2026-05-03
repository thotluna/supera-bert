import { ModeQuiz, ITCTopic, ConfigQuiz } from "../models";

export function getConfigQuiz({ userId, mode, topics }: {
  userId: string,
  mode: ModeQuiz,
  topics: ITCTopic[]
}): ConfigQuiz {

  if (!userId) throw new Error('User ID is required');
  if (!topics) throw new Error('Topics are required');

  const modeSettings: Record<ModeQuiz, { time: number, questionCount: number }> = {
    timed: {
      time: 3 * 60,
      questionCount: 10
    },
    standard: {
      time: 2 * 60 * 60,
      questionCount: 50
    },
    untimed: {
      time: 0,
      questionCount: 0
    }
  };

  const settings = modeSettings[mode];

  if (!settings) {
    throw new Error(`El modo de juego "${mode}" no es válido.`);
  }

  return {
    userId,
    mode,
    topics,
    time: settings.time,
    questionCount: settings.questionCount
  };
}