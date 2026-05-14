import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { QuizService } from './quiz.service';
import { QuestionRepository } from '../repository/question-repository';
import { QuizzesRepository } from '../repository/quizzes-repository';
import { AnswersRepository } from '../repository/answers-repository';
import { ResponseQuestion, ConfigQuiz } from '../models';

describe('QuizService Scoring Integration', () => {
  let service: QuizService;
  let mockQuestionsRepo: QuestionRepository;
  let mockQuizzesRepo: QuizzesRepository;
  let mockAnswersRepo: AnswersRepository;

  beforeEach(() => {
    mockQuestionsRepo = {
      getCorrectAnswer: vi.fn(),
    } as unknown as QuestionRepository;
    
    mockQuizzesRepo = {
      create: vi.fn(),
      finish: vi.fn(),
    } as unknown as QuizzesRepository;
    
    mockAnswersRepo = {
      createMany: vi.fn(),
    } as unknown as AnswersRepository;

    service = new QuizService(
      mockQuestionsRepo,
      mockQuizzesRepo,
      mockAnswersRepo
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

    (mockQuestionsRepo.getCorrectAnswer as Mock).mockResolvedValue([mockQuestion]);
    (mockQuizzesRepo.create as Mock).mockResolvedValue({ data: { id: 'quiz-123' }, error: null });
    (mockAnswersRepo.createMany as Mock).mockResolvedValue({ data: [], error: null });
    (mockQuizzesRepo.finish as Mock).mockResolvedValue({ data: {}, error: null });

    const sessionData = {
      answers: [
        {
          id: 'q1',
          selectedOptions: [{ id: 1 }, { id: 3 }], // 1 correct (of 2), 1 incorrect (of 1)
          time: 1000,
        },
      ] as unknown as ResponseQuestion[],
      config: {
        userId: 'u1',
        mode: 'standard',
        topics: ['ITC-BT-01'],
        questionCount: 1,
      } as unknown as ConfigQuiz,
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
