import { create } from 'zustand';
import { ConfigQuiz, QuestionClient, ResponseQuestion, OptionClient } from "../quiz/models";
import { validateAnswer } from "../quiz/actions/validate-answer";

interface QuizState {
  config: ConfigQuiz | null;
  questions: QuestionClient[];
  currentQuestion: QuestionClient | null;
  answers: ResponseQuestion[];
  currentSelection: OptionClient[];
  startTime: number | null;
  expiresAt: number | null; // Timestamp de finalización
  isFeedbacking: boolean;
  score: number;
  isFinished: boolean;
}

interface QuizActions {
  initialize: (config: ConfigQuiz, questions: QuestionClient[]) => void;
  toggleOption: (option: OptionClient, isMultiple: boolean) => void;
  nextQuestion: () => Promise<void>;
  skipQuestion: () => void;
  finish: () => void;
}

export const useQuizStore = create<QuizState & QuizActions>()((set, get) => ({
  // State inicial
  config: null,
  questions: [],
  currentQuestion: null,
  answers: [],
  currentSelection: [],
  startTime: null,
  expiresAt: null,
  isFeedbacking: false,
  score: 0,
  isFinished: false,

  // Acciones
  initialize: (config: ConfigQuiz, questions: QuestionClient[]) => {
    const questionsCopy = [...questions];
    const firstQuestion = questionsCopy.shift() ?? null;
    
    set({
      config,
      questions: questionsCopy,
      currentQuestion: firstQuestion,
      answers: [],
      currentSelection: [],
      startTime: Date.now(),
      expiresAt: Date.now() + (config.time || 1800) * 1000,
      isFinished: false,
    });
  },

  toggleOption: (option: OptionClient, isMultiple: boolean) => {
    const { currentSelection } = get();
    
    if (!isMultiple) {
      set({ currentSelection: [option] });
      return;
    }

    const isSelected = currentSelection.some((o: OptionClient) => o.id === option.id);
    const newSelection = isSelected
      ? currentSelection.filter((o: OptionClient) => o.id !== option.id)
      : [...currentSelection, option];
    
    set({ currentSelection: newSelection });
  },

  nextQuestion: async () => {
    const { currentQuestion, currentSelection, startTime, answers, isFeedbacking } = get();
    
    if (!currentQuestion || !startTime || isFeedbacking) return;

    // 1. Validar en el servidor
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

    // 2. Activar feedback y guardar respuesta
    // Inyectamos las opciones validadas en la pregunta actual para el feedback visual
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

    // 3. Esperar 3 segundos antes de pasar a la siguiente
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
  },

  skipQuestion: () => {
    const { currentQuestion, questions } = get();
    
    if (!currentQuestion) return;

    const nextQuestions = [...questions, currentQuestion];
    const nextQuestion = nextQuestions.shift() ?? null;

    set({
      questions: nextQuestions,
      currentQuestion: nextQuestion,
      currentSelection: [],
      startTime: Date.now(),
    });
  },


  finish: () => set({ isFinished: true, currentQuestion: null }),
}));