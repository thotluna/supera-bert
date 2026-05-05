import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useQuizStore } from './quiz-store';
import { Question, ConfigQuiz } from '../quiz/models';

// Mock server action to avoid actual redirection and network calls
vi.mock('../quiz/actions/save-and-redirect', () => ({
  saveAndRedirect: vi.fn().mockResolvedValue({ data: { id: 'test-result-id' } }),
}));

describe('QuizStore Navigation Logic (Issue #24)', () => {
  beforeEach(() => {
    // Reset store state before each test
    useQuizStore.getState().reset();
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  it('should maintain the current question during feedback period on the last question', async () => {
    const questions: Question[] = [
      {
        id: 'q-last',
        question: '¿Es esta la última pregunta?',
        type: 'simple',
        options: [{ id: 1, answer: 'Sí', isCorrect: true, explanation: 'Correcto' }],
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

    // Verificamos estado inicial
    expect(useQuizStore.getState().currentQuestion?.id).toBe('q-last');
    expect(useQuizStore.getState().isFeedbacking).toBe(false);

    // Seleccionamos la opción
    store.toggleOption(questions[0].options[0]);

    // Ejecutamos nextQuestion
    const nextPromise = store.nextQuestion();

    // ERROR DEMONSTRATION:
    // En la versión con error, finish() se llama inmediatamente.
    // finish() llama a reset(), por lo que currentQuestion pasa a ser null instantáneamente.
    
    const stateAfterCall = useQuizStore.getState();
    
    // Verificación del bug 11/10 (en este caso 2/1 porque hay 1 pregunta)
    const progress = stateAfterCall.isFeedbacking 
      ? stateAfterCall.answers.length 
      : stateAfterCall.answers.length + (stateAfterCall.currentQuestion ? 1 : 0);
    
    expect(progress, 'El progreso excedió el total (Bug 11/10)').toBe(1);
    expect(stateAfterCall.isFeedbacking).toBe(true);
    expect(stateAfterCall.currentQuestion?.id).toBe('q-last');
    expect(stateAfterCall.currentQuestion?.question).toBe('¿Es esta la última pregunta?');

    // Avanzamos el tiempo 3 segundos
    vi.advanceTimersByTime(3000);
    
    // 6. Verificamos que ahora esté marcado como finalizado pero SIGA VISIBLE
    const stateAfterFeedback = useQuizStore.getState();
    expect(stateAfterFeedback.currentQuestion).not.toBeNull();
    expect(stateAfterFeedback.isFinished).toBe(true);
    expect(stateAfterFeedback.currentQuestion?.id).toBe('q-last');
    
    await nextPromise;
  });
});
