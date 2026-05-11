import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useQuizStore } from './quiz-store';
import { Question, ConfigQuiz } from '../quiz/models';

describe('QuizStore - Centralized Pause System', () => {
  const mockConfig: ConfigQuiz = {
    userId: 'test-user',
    mode: 'timed',
    time: 60, // 60 seconds
    questionCount: 2,
    topics: ['ITC-BT-01']
  };

  const mockQuestions: Question[] = [
    { id: 'q1', type: 'simple', question: 'Q1', options: [{ id: 1, answer: 'A1', isCorrect: true, explanation: '' }] },
    { id: 'q2', type: 'simple', question: 'Q2', options: [{ id: 2, answer: 'A2', isCorrect: true, explanation: '' }] }
  ];

  beforeEach(() => {
    vi.useFakeTimers();
    useQuizStore.getState().reset();
    useQuizStore.getState().initialize(mockQuestions, mockConfig);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should maintain pause if at least one reason exists (Overlapping Case)', () => {
    const store = useQuizStore.getState();
    
    // 1. Open Modal
    store.requestPause('modal');
    expect(useQuizStore.getState().isPaused).toBe(true);
    expect(useQuizStore.getState().pauseReasons).toContain('modal');

    // 2. Change Tab (Visibility hidden)
    store.requestPause('visibility');
    expect(useQuizStore.getState().isPaused).toBe(true);
    expect(useQuizStore.getState().pauseReasons).toHaveLength(2);

    // 3. Return to Tab (Visibility visible)
    store.requestResume('visibility');
    
    // CRITICAL CHECK: Should STILL be paused because modal is open
    expect(useQuizStore.getState().isPaused).toBe(true);
    expect(useQuizStore.getState().pauseReasons).toEqual(['modal']);

    // 4. Close Modal
    store.requestResume('modal');
    expect(useQuizStore.getState().isPaused).toBe(false);
    expect(useQuizStore.getState().pauseReasons).toHaveLength(0);
  });

  it('should handle feedback pause correctly', async () => {
    const store = useQuizStore.getState();
    
    // Mock selecting an option and going to next question
    store.toggleOption(mockQuestions[0].options[0]);
    await store.nextQuestion(); // This triggers requestPause('feedback')

    expect(useQuizStore.getState().isPaused).toBe(true);
    expect(useQuizStore.getState().pauseReasons).toContain('feedback');

    // Wait for feedback timer (900ms)
    vi.advanceTimersByTime(1000);

    // After timeout, it should be resumed
    expect(useQuizStore.getState().isPaused).toBe(false);
    expect(useQuizStore.getState().pauseReasons).not.toContain('feedback');
  });

  it('should accurately extend expiresAt by total pause duration', () => {
    const store = useQuizStore.getState();
    const initialExpiresAt = useQuizStore.getState().expiresAt!;

    // Pause for 5 seconds
    store.requestPause('manual');
    vi.advanceTimersByTime(5000);
    store.requestResume('manual');

    const finalExpiresAt = useQuizStore.getState().expiresAt!;
    
    // Must have extended exactly 5000ms
    expect(finalExpiresAt - initialExpiresAt).toBe(5000);
  });

  it('should not double-extend time if multiple reasons overlap', () => {
    const store = useQuizStore.getState();
    const initialExpiresAt = useQuizStore.getState().expiresAt!;

    // Reason A starts at T=0
    store.requestPause('modal');
    
    // Reason B starts at T=2s
    vi.advanceTimersByTime(2000);
    store.requestPause('visibility');

    // Reason A ends at T=5s
    vi.advanceTimersByTime(3000);
    store.requestResume('modal');

    // Reason B ends at T=7s
    vi.advanceTimersByTime(2000);
    store.requestResume('visibility');

    const finalExpiresAt = useQuizStore.getState().expiresAt!;
    
    // Total pause duration from first pause to last resume was 7s.
    // Time should be extended by exactly 7000ms, not 7+5 or anything else.
    expect(finalExpiresAt - initialExpiresAt).toBe(7000);
  });
});
