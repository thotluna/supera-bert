import { describe, it, expect } from 'vitest';
import { QuizScore } from './score';

describe('QuizScore', () => {
  describe('calculateQuestionPoints', () => {
    it('should return 1.0 for a perfect simple answer', () => {
      const points = QuizScore.calculateQuestionPoints(1, 3, 1, 0);
      expect(points).toBe(1.0);
    });

    it('should return -0.20 for an incorrect simple answer', () => {
      const points = QuizScore.calculateQuestionPoints(1, 3, 0, 1);
      expect(points).toBe(-0.07); // 0.20 / 3 * 1 = 0.0666... -> 0.07 (loss)
      // Wait, if n=3, 0.20/3 = 0.0666. 
      // result = 0 - 0.0666 = -0.0666 -> -0.07
    });

    it('should return 0.50 for partial correct answer (1 of 2)', () => {
      const points = QuizScore.calculateQuestionPoints(2, 2, 1, 0);
      expect(points).toBe(0.50);
    });

    it('should return 0.40 for 1 correct and 1 incorrect (2 total each)', () => {
      // gain = 1/2 = 0.5
      // loss = 1/2 * 0.20 = 0.10
      // total = 0.40
      const points = QuizScore.calculateQuestionPoints(2, 2, 1, 1);
      expect(points).toBe(0.40);
    });

    it('should return -0.20 when all incorrect are selected', () => {
      const points = QuizScore.calculateQuestionPoints(1, 3, 0, 3);
      expect(points).toBe(-0.20);
    });

    it('should return 0.80 when all correct and all incorrect are selected', () => {
      // gain = 1.0
      // loss = 0.20
      const points = QuizScore.calculateQuestionPoints(2, 2, 2, 2);
      expect(points).toBe(0.80);
    });
  });

  describe('isPassed', () => {
    it('should return true if score is strictly greater than 80%', () => {
      expect(QuizScore.isPassed(8.1, 10)).toBe(true);
    });

    it('should return false if score is exactly 80%', () => {
      expect(QuizScore.isPassed(8.0, 10)).toBe(false);
    });

    it('should return false if score is less than 80%', () => {
      expect(QuizScore.isPassed(7.9, 10)).toBe(false);
    });
  });
});
