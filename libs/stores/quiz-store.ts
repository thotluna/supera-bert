import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { QuestionClient, ResponseQuestion, ConfigQuiz, OptionClient } from '../quiz/models';
import { validateAnswer } from '../quiz/actions/validate-answer';
import { saveAndRedirect } from '../quiz/actions/save-and-redirect';

interface QuizState {
  questions: QuestionClient[];
  currentQuestion: QuestionClient | null;
  currentSelection: OptionClient[];
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
  setQuestions: (questions: QuestionClient[]) => void;
  setConfig: (config: ConfigQuiz) => void;
  initialize: (questions: QuestionClient[], config: ConfigQuiz) => void;
  toggleOption: (option: OptionClient) => void;
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
        if (state.currentQuestion || state.answers.length > 0) return;

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
        const { currentSelection, isFeedbacking } = get();
        if (isFeedbacking) return;

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

        const { validatedOptions, isCorrect, points } = await validateAnswer(
          currentQuestion.id,
          currentSelection.map(o => o.id)
        );

        const timeTaken = Date.now() - startTime;

        const response: ResponseQuestion = {
          id: currentQuestion.id,
          question: currentQuestion.question,
          selectedOptions: validatedOptions,
          time: timeTaken,
          points,
          isCorrect,
          itc: currentQuestion.itc,
        };

        const updatedQuestion = currentQuestion ? {
          ...currentQuestion,
          options: currentQuestion.options.map(opt => {
            const validated = validatedOptions.find(v => v.id === opt.id);
            return validated ? { ...opt, isCorrect: validated.isCorrect, explanation: validated.explanation } : opt;
          })
        } : null;

        set({
          isFeedbacking: true,
          currentQuestion: updatedQuestion,
          answers: [...answers, response],
          score: Number((get().score + points).toFixed(2))
        });

        setTimeout(() => {
          const { questions: currentQuestionsQueue, expiresAt: currentExpiresAt } = get();
          const nextQuestions = [...currentQuestionsQueue];
          const nextQuestion = nextQuestions.shift() ?? null;

          set({
            questions: nextQuestions,
            currentQuestion: nextQuestion,
            currentSelection: [],
            isFeedbacking: false,
            startTime: nextQuestion ? Date.now() : null,
            expiresAt: currentExpiresAt ? currentExpiresAt + 3000 : null,
            isFinished: !nextQuestion,
          });
        }, 3000);

        const { questions } = get()
        if (questions.length === 0) {
          const { finish } = get()
          finish()
        }
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
          isFinished: true
        });

        state.reset();

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
