export interface UserStats {
  global: {
    totalQuizzes: number;
    averageScore: number;
    totalQuestionsAnswered: number;
    correctAnswers: number;
    totalTimeMs: number;
    byMode: {
      standard: number;
      timed: number;
      relaxed: number;
    };
  };
  byTopic: TopicStats[];
  evolution: DailyEvolution[];
  recommendations: RecommendedTopic[];
}

export interface RecommendedTopic {
  itcCode: string;
  questionsAnswered: number;
  status: 'critical' | 'ignored' | 'pending';
}

export interface TopicStats {
  itcCode: string;
  totalQuestions: number;
  correctAnswers: number;
  averagePoints: number;
  masteryScore: number;
  accuracyScore: number;
  datasetSize: number;
}

export interface DailyEvolution {
  date: string;
  averageScore: number;
  quizzesCount: number;
}
