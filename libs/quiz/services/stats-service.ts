import { DomainResponse } from "@/libs/shape/auth/types";
import { UserStats, TopicStats, DailyEvolution, RecommendedTopic } from "../domain/stats";
import { QuizzesRepository } from "../repository/quizzes-repository";
import { AnswersRepository } from "../repository/answers-repository";
import { QuestionRepository } from "../repository/question-repository";

export class StatsService {
  constructor(
    private readonly quizzesRepository: QuizzesRepository,
    private readonly answersRepository: AnswersRepository,
    private readonly questionRepository: QuestionRepository
  ) {}

  async getUserStats(userId: string): Promise<DomainResponse<UserStats>> {
    const [quizzesResult, answersResult] = await Promise.all([
      this.quizzesRepository.getByUserId(userId),
      this.answersRepository.getByUserId(userId),
    ]);

    if (quizzesResult.error || !quizzesResult.data) {
      return { data: null, error: quizzesResult.error || new Error("Failed to fetch quizzes") };
    }

    if (answersResult.error || !answersResult.data) {
      return { data: null, error: answersResult.error || new Error("Failed to fetch answers") };
    }

    const quizzes = quizzesResult.data;
    const answers = answersResult.data;

    const completedQuizzes = quizzes.filter((q) => q.isCompleted);
    const totalScore = completedQuizzes.reduce((acc, q) => acc + q.totalScore, 0);
    const totalTimeMs = answers.reduce((acc, a) => acc + a.timeMs, 0);

    const global = {
      totalQuizzes: completedQuizzes.length,
      averageScore: completedQuizzes.length > 0 ? Number((totalScore / completedQuizzes.length).toFixed(2)) : 0,
      totalQuestionsAnswered: answers.length,
      correctAnswers: answers.filter((a) => a.isCorrect).length,
      totalTimeMs,
      byMode: {
        standard: completedQuizzes.filter((q) => q.mode === "standard").length,
        timed: completedQuizzes.filter((q) => q.mode === "timed").length,
        relaxed: completedQuizzes.filter((q) => q.mode === "relaxed").length,
      },
    };

    const allTopics = await this.questionRepository.getTopicsAvailability();
    const availableITCs = allTopics.filter(t => t.available);

    const latestAnswersMap = new Map<string, { isCorrect: boolean; itcCode: string; points: number }>();
    
    [...answers].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).forEach((a) => {
      latestAnswersMap.set(a.questionId, { 
        isCorrect: a.isCorrect, 
        itcCode: a.itcCode, 
        points: a.points 
      });
    });

    const topicMap = new Map<string, { uniqueSeen: number; uniqueCorrect: number; totalPoints: number }>();
    availableITCs.forEach(topic => {
      topicMap.set(topic.name, { uniqueSeen: 0, uniqueCorrect: 0, totalPoints: 0 });
    });

    latestAnswersMap.forEach((val) => {
      const current = topicMap.get(val.itcCode);
      if (current) {
        topicMap.set(val.itcCode, {
          uniqueSeen: current.uniqueSeen + 1,
          uniqueCorrect: current.uniqueCorrect + (val.isCorrect ? 1 : 0),
          totalPoints: current.totalPoints + val.points,
        });
      }
    });

    const byTopic: TopicStats[] = Array.from(topicMap.entries()).map(([itcCode, stats]) => {
      const datasetSize = 50; 
      const accuracy = stats.uniqueSeen > 0 ? (stats.uniqueCorrect / stats.uniqueSeen) * 100 : 0;
      
      return {
        itcCode,
        totalQuestions: stats.uniqueSeen,
        correctAnswers: stats.uniqueCorrect,
        datasetSize,
        averagePoints: stats.uniqueSeen > 0 ? Number((stats.totalPoints / stats.uniqueSeen).toFixed(2)) : 0,
        masteryScore: Number(((stats.uniqueCorrect / datasetSize) * 100).toFixed(2)),
        accuracyScore: Number(accuracy.toFixed(2)),
      };
    });

    const evolutionMap = new Map<string, { score: number; count: number }>();
    completedQuizzes.forEach((q) => {
      const date = new Date(q.startedAt).toISOString().split("T")[0];
      const current = evolutionMap.get(date) || { score: 0, count: 0 };
      evolutionMap.set(date, {
        score: current.score + q.totalScore,
        count: current.count + 1,
      });
    });

    const dailyEvolution: DailyEvolution[] = Array.from(evolutionMap.entries())
      .map(([date, stats]) => ({
        date,
        averageScore: Number((stats.score / stats.count).toFixed(2)),
        quizzesCount: stats.count,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const recommendations: RecommendedTopic[] = byTopic
      .filter((t) => t.totalQuestions > 0 && t.accuracyScore < 70)
      .sort((a, b) => a.accuracyScore - b.accuracyScore)
      .slice(0, 3)
      .map((t) => ({
        itcCode: t.itcCode,
        questionsAnswered: t.totalQuestions,
        status: t.accuracyScore < 40 ? 'critical' : 'ignored',
      }));

    return {
      data: {
        global,
        byTopic,
        evolution: dailyEvolution,
        recommendations,
      },
      error: null,
    };
  }
}
