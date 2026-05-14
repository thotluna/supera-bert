import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QuizService } from './quiz.service';
import { QuizScore } from '../domain/score';
import { QuestionRepository } from '../repository/question-repository';
import { QuizzesRepository } from '../repository/quizzes-repository';
import { AnswersRepository } from '../repository/answers-repository';

describe('QuizService Scoring Integration', () => {
  let service: QuizService;
  let mockQuestionsRepo: any;
  let mockQuizzesRepo: any;
  let mockAnswersRepo: any;

  beforeEach(() => {
    mockQuestionsRepo = {
      getCorrectAnswer: vi.fn(),
    };
    mockQuizzesRepo = {
      create: vi.fn(),
      finish: vi.fn(),
    };
    mockAnswersRepo = {
      createMany: vi.fn(),
    };

    service = new QuizService(
      mockQuestionsRepo as any,
      mockQuizzesRepo as any,
      mockAnswersRepo as any
    );
  });

  it('should correctly recalculate score using QuizScore domain in persistFullSession', async () => {
    const mockQuestion = {
      id: 'q1',
      options: [
        { id: 1, isCorrect: true },
        { id: 2, isCorrect: true },
        { id: 3, isCorrect: false },
      ],
    };

    mockQuestionsRepo.getCorrectAnswer.mockResolvedValue([mockQuestion]);
    mockQuizzesRepo.create.mockResolvedValue({ data: { id: 'quiz-123' }, error: null });
    mockAnswersRepo.createMany.mockResolvedValue({ data: [], error: null });
    mockQuizzesRepo.finish.mockResolvedValue({ data: {}, error: null });

    const sessionData = {
      answers: [
        {
          id: 'q1',
          selectedOptions: [{ id: 1 }, { id: 3 }], // 1 correct (of 2), 1 incorrect (of 1)
          time: 1000,
        },
      ] as any,
      config: {
        userId: 'u1',
        mode: 'standard',
        topics: ['ITC-BT-01'],
        questionCount: 1,
      } as any,
      score: 0,
    };

    await service.persistFullSession(sessionData);

    // Points calculation:
    // gain = 1/2 = 0.5
    // loss = 1/1 * 0.2 = 0.2
    // total = 0.3
    expect(mockQuizzesRepo.finish).toHaveBeenCalledWith('quiz-123', expect.objectContaining({
      totalScore: 0.3
    }));
  });
});
