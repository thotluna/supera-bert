import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Question, ResponseQuestion, ConfigQuiz, Option } from '../quiz/models';
import { saveAndRedirect } from '../quiz/actions/save-and-redirect';

interface QuizState {
  questions: Question[];
  currentQuestion: Question | null;
  currentSelection: Option[];
  answers: ResponseQuestion[];
  config: ConfigQuiz | null;
  startTime: number | null;
  expiresAt: number | null;
  isFeedbacking: boolean;
  score: number;
  isFinished: boolean;
  lastQuizState: {
    answers: ResponseQuestion[];
    config: ConfigQuiz | null;
    startTime: number | null;
    expiresAt: number | null;
    score: number;
  }
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
      isFeedbacking: false,
      score: 0,
      isFinished: false,
      lastQuizState: {
        answers: [],
        config: null,
        startTime: null,
        expiresAt: null,
        score: 0,
      },

      setQuestions: (questions) => set({ questions }),
      setConfig: (config) => set({ config }),

      initialize: (questions, config) => {
        const state = get();

        // Si hay una sesión activa, verificamos si es válida (no expirada)
        const isZombie = state.expiresAt && state.expiresAt < Date.now();

        if (state.currentQuestion && !state.isFinished && !isZombie) return;

        // Limpiamos cualquier estado previo antes de iniciar el nuevo
        state.reset();

        const firstQuestion = questions[0];
        const remainingQuestions = questions.slice(1);
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
        });
      },

      toggleOption: (option) => {
        const { currentSelection, currentQuestion, isFeedbacking } = get();
        if (isFeedbacking || !currentQuestion) return;

        if (currentQuestion.type === 'simple') {
          set({ currentSelection: [option] });
          return;
        }

        const isSelected = currentSelection.some(o => o.id === option.id);
        if (isSelected) {
          set({ currentSelection: currentSelection.filter(o => o.id !== option.id) });
        } else {
          set({ currentSelection: [...currentSelection, option] });
        }
      },

      nextQuestion: async () => {
        const { currentQuestion, currentSelection, answers, startTime, isFeedbacking } = get();
        if (!currentQuestion || !startTime || isFeedbacking) return;

        // Local Validation Logic
        const totalCorrectInQuestion = currentQuestion.options.filter(o => o.isCorrect).length;
        const selectedIds = currentSelection.map(o => o.id);
        const validatedOptions = currentQuestion.options.filter(opt => selectedIds.includes(opt.id));

        let points = 0;
        const correctSelected = validatedOptions.filter(o => o.isCorrect).length;
        const incorrectSelected = validatedOptions.filter(o => !o.isCorrect).length;

        if (totalCorrectInQuestion > 0) {
          points += (correctSelected * (1 / totalCorrectInQuestion));
        }
        points -= (incorrectSelected * 0.20);

        const isCorrect = correctSelected === totalCorrectInQuestion && incorrectSelected === 0;
        const finalPoints = Number(points.toFixed(2));

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

        setTimeout(() => {
          const { questions: currentQuestionsQueue, expiresAt: currentExpiresAt } = get();
          const nextQuestions = [...currentQuestionsQueue];
          const nextQuestion = nextQuestions.shift() ?? null;

          if (!nextQuestion) {
            get().finish();
            return;
          }

          set({
            questions: nextQuestions,
            currentQuestion: nextQuestion,
            currentSelection: [],
            isFeedbacking: false,
            startTime: Date.now(),
            expiresAt: currentExpiresAt ? currentExpiresAt + 3000 : null,
            isFinished: false,
          });
        }, 5000);
      },

      skipQuestion: () => {
        const { currentQuestion, questions } = get();
        if (!currentQuestion || questions.length === 0) return;

        const nextQuestions = [...questions];
        const nextQuestion = nextQuestions.shift() ?? null;
        const newQuestions = [...nextQuestions, currentQuestion];

        set({
          questions: newQuestions,
          currentQuestion: nextQuestion,
          currentSelection: [],
          startTime: Date.now(),
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
          currentQuestion: null,
        });

        await saveAndRedirect(snapshot);
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
      }),
    }),
    {
      name: 'quiz-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
