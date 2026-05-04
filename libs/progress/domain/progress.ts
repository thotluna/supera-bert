export interface UserItcStats {
  userId: string;
  itcCode: string;
  totalAttempts: number;
  correctAnswers: number;
  accuracyRate: number;
  avgTimeMs: number;
  lastPracticedAt: string;
}
