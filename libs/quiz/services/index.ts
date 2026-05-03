import { ModeQuiz, ITCTopic, ConfigQuiz } from "../models";

export function getConfigQuiz({ userId, mode, topic }: {
  userId: string,
  mode: ModeQuiz,
  topic: ITCTopic
}): ConfigQuiz {

  if (!userId) throw new Error('User ID is required');
  if (!topic) throw new Error('Topic is required');

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
    topic,
    time: settings.time,
    questionCount: settings.questionCount
  };
}