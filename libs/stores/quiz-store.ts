import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Question, ResponseQuestion, ConfigQuiz, Option } from '../quiz/models';
import { saveAndRedirect } from '../quiz/actions/save-and-redirect';
import { shuffle } from '../quiz/utils/shuffle';
import { QuizScore } from '../quiz/domain/score';
import { PauseReason } from '../quiz/models';

interface QuizState {
  questions: Question[];
  currentQuestion: Question | null;
  currentSelection: Option[];
  answers: ResponseQuestion[];
  config: ConfigQuiz | null;
  startTime: number | null;
  expiresAt: number | null;
  pausedAt: number | null;
  isFeedbacking: boolean;
  isPaused: boolean;
  disabledNext: boolean;
  score: number;
  isFinished: boolean;
  lastQuizState: {
    answers: ResponseQuestion[];
    config: ConfigQuiz | null;
    startTime: number | null;
    expiresAt: number | null;
    score: number;
  }
  pauseReasons: PauseReason[];
}

interface QuizActions {
  setQuestions: (questions: Question[]) => void;
  setConfig: (config: ConfigQuiz) => void;
  initialize: (questions: Question[], config: ConfigQuiz) => void;
  toggleOption: (option: Option) => void;
  nextQuestion: () => Promise<void>;
  skipQuestion: () => void;
  finish: () => void;
  reset: () => void;
  setPaused: (paused: boolean) => void;
  requestPause: (reason: PauseReason) => void;
  requestResume: (reason: PauseReason) => void;
  excludeCurrentQuestion: () => Promise<void>;
}

export const useQuizStore = create<QuizState & QuizActions>()(
  persist(
    (set, get) => ({
      questions: [],
      currentQuestion: null,
      currentSelection: [],
      answers: [],
      config: null,
      startTime: null,
      expiresAt: null,
      pausedAt: null,
      isFeedbacking: false,
      isPaused: false,
      score: 0,
      isFinished: false,
      disabledNext: true,
      lastQuizState: {
        answers: [],
        config: null,
        startTime: null,
        expiresAt: null,
        score: 0,
      },
      pauseReasons: [],

      setQuestions: (questions) => set({ questions }),
      setConfig: (config) => set({ config }),

      initialize: (questions, config) => {
        const state = get();

        // Check if config has changed to force re-initialization
        const configChanged = JSON.stringify(state.config) !== JSON.stringify(config);
        const isZombie = state.expiresAt && state.expiresAt < Date.now();

        if (state.currentQuestion && !state.isFinished && !isZombie && !configChanged) return;

        // Reset state before starting new quiz
        set({
          questions: [],
          currentQuestion: null,
          currentSelection: [],
          answers: [],
          config: null,
          startTime: null,
          expiresAt: null,
          isFeedbacking: false,
          score: 0,
          isFinished: false,
          disabledNext: true,
        });

        const firstQuestion = {
          ...questions[0],
          options: shuffle(questions[0].options)
        };
        const remainingQuestions = questions.slice(1).map(q => ({
          ...q,
          options: shuffle(q.options)
        }));
        const now = Date.now();
        const duration = (config.time || 0) * 1000;

        set({
          questions: remainingQuestions,
          currentQuestion: firstQuestion,
          config,
          startTime: now,
          expiresAt: duration > 0 ? now + duration : null,
          answers: [],
          score: 0,
          isFinished: false,
          isPaused: false,
          disabledNext: true,
        });
      },

      setPaused: (paused) => {
        const { isPaused, expiresAt, pausedAt } = get();
        if (isPaused === paused) return;

        const now = Date.now();

        if (paused) {
          set({ isPaused: true, pausedAt: now });
        } else {
          const pauseDuration = now - (pausedAt || now);
          set({ 
            isPaused: false, 
            expiresAt: expiresAt ? expiresAt + pauseDuration : null,
            pausedAt: null
          });
        }
      },

      requestPause: (reason) => {
        const { pauseReasons, setPaused } = get();
        if (pauseReasons.includes(reason)) return;
        
        const newReasons = [...pauseReasons, reason];
        set({ pauseReasons: newReasons });
        
        if (newReasons.length === 1) {
          setPaused(true);
        }
      },

      requestResume: (reason) => {
        const { pauseReasons, setPaused } = get();
        if (!pauseReasons.includes(reason)) return;

        const newReasons = pauseReasons.filter(r => r !== reason);
        set({ pauseReasons: newReasons });
        
        if (newReasons.length === 0) {
          setPaused(false);
        }
      },

      toggleOption: (option) => {
        const { currentSelection, currentQuestion, isFeedbacking } = get();
        if (isFeedbacking || !currentQuestion) return;

        if (currentQuestion.type === 'simple') {
          set({
            currentSelection: [option],
            disabledNext: false
          });
          return;
        }

        const isSelected = currentSelection.some(o => o.id === option.id);
        const newSelection = isSelected
          ? currentSelection.filter(o => o.id !== option.id)
          : [...currentSelection, option];

        set({
          currentSelection: newSelection,
          disabledNext: newSelection.length === 0
        });
      },

      nextQuestion: async () => {
        const { currentQuestion, currentSelection, answers, startTime, isFeedbacking } = get();
        if (!currentQuestion || !startTime || isFeedbacking) return;

        // Local Validation Logic
        const totalCorrectInQuestion = currentQuestion.options.filter(o => o.isCorrect).length;
        const totalIncorrectInQuestion = currentQuestion.options.length - totalCorrectInQuestion;
        const selectedIds = currentSelection.map(o => o.id);
        const validatedOptions = currentQuestion.options.filter(opt => selectedIds.includes(opt.id));

        const correctSelected = validatedOptions.filter(o => o.isCorrect).length;
        const incorrectSelected = validatedOptions.filter(o => !o.isCorrect).length;

        const finalPoints = QuizScore.calculateQuestionPoints(
          totalCorrectInQuestion,
          totalIncorrectInQuestion,
          correctSelected,
          incorrectSelected
        );

        const isCorrect = correctSelected === totalCorrectInQuestion && incorrectSelected === 0;

        const timeTaken = Date.now() - startTime;

        const response: ResponseQuestion = {
          id: currentQuestion.id,
          question: currentQuestion.question,
          selectedOptions: validatedOptions,
          time: timeTaken,
          points: finalPoints,
          isCorrect,
          itc: currentQuestion.itc,
        };

        set({
          isFeedbacking: true,
          currentQuestion: { ...currentQuestion }, // No need to map anymore as it already has everything
          answers: [...answers, response],
          score: Number((get().score + finalPoints).toFixed(2))
        });

        get().requestPause('feedback');

        setTimeout(() => {
          const { questions: currentQuestionsQueue, expiresAt: currentExpiresAt } = get();
          const nextQuestions = [...currentQuestionsQueue];
          const nextQuestion = nextQuestions.shift() ?? null;

          if (!nextQuestion) {
            get().requestResume('feedback');
            get().finish();
            return;
          }

          nextQuestion.options = shuffle(nextQuestion.options);

          set({
            questions: nextQuestions,
            currentQuestion: nextQuestion,
            currentSelection: [],
            isFeedbacking: false,
            startTime: Date.now(),
            expiresAt: currentExpiresAt,
            isFinished: false,
            disabledNext: true,
          });

          get().requestResume('feedback');
        }, 900);
      },

      skipQuestion: () => {
        const { currentQuestion, questions } = get();
        if (!currentQuestion || questions.length === 0) return;

        const nextQuestions = [...questions];
        const nextQuestion = nextQuestions.shift() ?? null;
        if (nextQuestion) {
          nextQuestion.options = shuffle(nextQuestion.options);
        }
        const newQuestions = [...nextQuestions, currentQuestion];

        set({
          questions: newQuestions,
          currentQuestion: nextQuestion,
          currentSelection: [],
          startTime: Date.now(),
          disabledNext: true,
        });
      },

      finish: async () => {
        const state = get();

        const snapshot = {
          questions: [...state.questions],
          answers: [...state.answers],
          config: state.config ? { ...state.config } : null,
          startTime: state.startTime,
          expiresAt: state.expiresAt,
          score: state.score,
        };

        set({
          lastQuizState: {
            answers: snapshot.answers,
            config: snapshot.config,
            startTime: snapshot.startTime,
            expiresAt: snapshot.expiresAt,
            score: snapshot.score,
          },
          isFinished: true,
          expiresAt: null, // Evitamos que timers huérfanos se activen
          startTime: null,
        });

        await saveAndRedirect(snapshot);
      },
      excludeCurrentQuestion: async () => {
        const { questions, finish } = get();
        const nextQuestions = [...questions];
        const nextQuestion = nextQuestions.shift() ?? null;

        if (nextQuestion) {
          nextQuestion.options = shuffle(nextQuestion.options);
          set({
            questions: nextQuestions,
            currentQuestion: nextQuestion,
            currentSelection: [],
            isFeedbacking: false,
            startTime: Date.now(),
            disabledNext: true,
          });
        } else {
          await finish();
        }
      },
      reset: () => set({
        questions: [],
        currentQuestion: null,
        currentSelection: [],
        answers: [],
        config: null,
        startTime: null,
        expiresAt: null,
        isFeedbacking: false,
        score: 0,
        isFinished: false,
        disabledNext: true,
      }),
    }),
    {
      name: 'quiz-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
