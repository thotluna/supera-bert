export class QuizScore {
  private static readonly PASSING_PERCENTAGE = 0.8;
  private static readonly MAX_QUESTION_POINTS = 1;
  private static readonly MAX_PENALTY = 0.2;

  /**
   * Calculates the points for a single question based on the prorated logic.
   * Formula: (SelectedCorrect / TotalCorrect) * 1.0 - (SelectedIncorrect / TotalIncorrect) * 0.20
   */
  static calculateQuestionPoints(
    totalCorrectOptions: number,
    totalIncorrectOptions: number,
    selectedCorrectCount: number,
    selectedIncorrectCount: number
  ): number {
    const gain = totalCorrectOptions > 0 
      ? (selectedCorrectCount / totalCorrectOptions) * this.MAX_QUESTION_POINTS 
      : 0;

    const loss = totalIncorrectOptions > 0 
      ? (selectedIncorrectCount / totalIncorrectOptions) * this.MAX_PENALTY 
      : 0;

    const result = gain - loss;
    
    // Ensures rounding to 2 decimal places to avoid floating point issues
    return Number(result.toFixed(2));
  }

  /**
   * Determines if a quiz has been passed based on the total score and question count.
   * Requirement: Total score must be strictly greater than 80% of total questions.
   */
  static isPassed(totalScore: number, totalQuestions: number): boolean {
    if (totalQuestions === 0) return false;
    const threshold = totalQuestions * this.PASSING_PERCENTAGE;
    return totalScore > threshold;
  }

  /**
   * Calculates the percentage score (0-100).
   */
  static calculatePercentage(totalScore: number, totalQuestions: number): number {
    if (totalQuestions === 0) return 0;
    const percentage = (totalScore / totalQuestions) * 100;
    return Number(percentage.toFixed(2));
  }

  /**
   * Evaluates the status of a topic based on accuracy.
   */
  static getTopicStatus(accuracyScore: number): 'critical' | 'ignored' | 'pending' {
    if (accuracyScore < 40) return 'critical';
    if (accuracyScore < 70) return 'ignored';
    return 'pending';
  }

  /**
   * Returns a feedback message based on the percentage score.
   * Passing threshold is strictly > 80%.
   */
  static getFeedback(percentage: number) {
    if (percentage >= 95) {
      return {
        title: "¡Excelencia Pura!",
        sub: "Estás más que listo para el examen oficial.",
        color: "text-success",
        shadow: "shadow-success/20"
      };
    }
    if (percentage > 80) {
      return {
        title: "¡Aprobado!",
        sub: "Has superado el simulacro con éxito. ¡Buen trabajo!",
        color: "text-accent",
        shadow: "shadow-accent/20"
      };
    }
    if (percentage === 80) {
      return {
        title: "Casi Aprobado",
        sub: "Has alcanzado el 80%, pero necesitas superar esa cifra para aprobar.",
        color: "text-yellow-400",
        shadow: "shadow-yellow-400/20"
      };
    }
    return {
      title: "Sigue Practicando",
      sub: "No has alcanzado el 80% necesario para superar este simulacro.",
      color: "text-error",
      shadow: "shadow-error/20"
    };
  }
}
