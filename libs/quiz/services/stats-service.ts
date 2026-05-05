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

    // Get all available topics first to align stats
    const allTopics = await this.questionRepository.getTopicsAvailability();
    const availableITCs = allTopics.filter(t => t.available);

    // Aggregate by Topic (Pre-populate with all available to ensure they show in Radar)
    const topicMap = new Map<string, { total: number; correct: number; points: number }>();
    availableITCs.forEach(topic => {
      topicMap.set(topic.name, { total: 0, correct: 0, points: 0 });
    });

    answers.forEach((a) => {
      const current = topicMap.get(a.itcCode);
      if (current) {
        topicMap.set(a.itcCode, {
          total: current.total + 1,
          correct: current.correct + (a.isCorrect ? 1 : 0),
          points: current.points + a.points,
        });
      }
    });

    const byTopic: TopicStats[] = Array.from(topicMap.entries()).map(([itcCode, stats]) => {
      const accuracy = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0;
      // Umbral de confianza: 20 preguntas para tener 100% de confianza en el dato
      const confidenceThreshold = 20;
      const confidenceFactor = Math.min(1, stats.total / confidenceThreshold);
      
      return {
        itcCode,
        totalQuestions: stats.total,
        correctAnswers: stats.correct,
        averagePoints: stats.total > 0 ? Number((stats.points / stats.total).toFixed(2)) : 0,
        masteryScore: Number((accuracy * confidenceFactor).toFixed(2)),
        accuracyScore: Number(accuracy.toFixed(2)),
      };
    });

    // Aggregate by Day (Evolution)
    const dailyMap = new Map<string, { score: number; count: number }>();
    completedQuizzes.forEach((q) => {
      const date = q.finishedAt ? q.finishedAt.split("T")[0] : q.startedAt.split("T")[0];
      const current = dailyMap.get(date) || { score: 0, count: 0 };
      dailyMap.set(date, {
        score: current.score + q.totalScore,
        count: current.count + 1,
      });
    });

    const evolution: DailyEvolution[] = Array.from(dailyMap.entries())
      .map(([date, stats]) => ({
        date,
        averageScore: Number((stats.score / stats.count).toFixed(2)),
        quizzesCount: stats.count,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Recommendations (Least 10 advanced ITCs)
    const recommendations: RecommendedTopic[] = availableITCs
      .map(topic => {
        const stats = byTopic.find(t => t.itcCode === topic.name);
        const answered = stats?.totalQuestions || 0;
        
        return {
          itcCode: topic.name,
          questionsAnswered: answered,
          status: (answered === 0 ? 'ignored' : answered < 10 ? 'critical' : 'pending') as RecommendedTopic['status']
        };
      })
      .sort((a, b) => a.questionsAnswered - b.questionsAnswered)
      .slice(0, 5);

    return {
      data: {
        global,
        byTopic,
        evolution,
        recommendations,
      },
      error: null,
    };
  }
}
