import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useQuizStore } from './quiz-store';
import { Question, ConfigQuiz } from '../quiz/models';

describe('QuizStore - Scoring Integration', () => {
  beforeEach(() => {
    useQuizStore.getState().reset();
    vi.useFakeTimers();
  });

  it('should calculate real-time score correctly using the new prorated logic', async () => {
    const questions: Question[] = [
      {
        id: 'q1',
        question: 'Q1',
        type: 'multiple',
        options: [
          { id: 1, answer: 'C1', isCorrect: true, explanation: '' },
          { id: 2, answer: 'C2', isCorrect: true, explanation: '' },
          { id: 3, answer: 'I1', isCorrect: false, explanation: '' },
        ],
        itc: 'ITC-BT-01'
      }
    ];

    const config: ConfigQuiz = {
      userId: 'user-123',
      mode: 'standard',
      topics: ['ITC-BT-01'],
      questionCount: 1
    };

    const store = useQuizStore.getState();
    store.initialize(questions, config);

    // Seleccionamos 1 correcta y 1 incorrecta
    // Ganancia: 1/2 = 0.5
    // Perdida: 1/1 * 0.2 = 0.2
    // Total esperado: 0.3
    store.toggleOption(questions[0].options[0]); // ID 1 (Correct)
    store.toggleOption(questions[0].options[2]); // ID 3 (Incorrect)

    await store.nextQuestion();

    expect(useQuizStore.getState().score).toBe(0.3);
    expect(useQuizStore.getState().answers[0].points).toBe(0.3);
    expect(useQuizStore.getState().answers[0].isCorrect).toBe(false);
  });

  it('should mark question as correct only if ALL correct and NO incorrect are selected', async () => {
    const questions: Question[] = [
      {
        id: 'q1',
        question: 'Q1',
        type: 'multiple',
        options: [
          { id: 1, answer: 'C1', isCorrect: true, explanation: '' },
          { id: 2, answer: 'C2', isCorrect: true, explanation: '' },
        ],
        itc: 'ITC-BT-01'
      }
    ];

    const store = useQuizStore.getState();
    store.initialize(questions, { userId: 'u', mode: 'standard', topics: ['ITC-BT-01'], questionCount: 1 });

    store.toggleOption(questions[0].options[0]); // Solo 1 de 2 correctas
    await store.nextQuestion();

    expect(useQuizStore.getState().score).toBe(0.5);
    expect(useQuizStore.getState().answers[0].isCorrect).toBe(false);
  });
});
