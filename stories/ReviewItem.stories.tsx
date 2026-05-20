import type { Meta, StoryObj } from '@storybook/react';
import { ReviewItem } from '../app/quiz/results/components/review-item';
import { Question } from '@/libs/quiz/models';
import { QuizAnswer } from '@/libs/quiz/domain/quiz';

const mockQuestion: Question = {
  id: 'q1',
  question: '¿Cuál es la sección mínima para conductores de cobre en instalaciones fijas interiores?',
  type: 'simple',
  itc: 'ITC-BT-19',
  options: [
    { id: 1, answer: '1.5 mm²', isCorrect: true, explanation: 'Según la ITC-BT-19, la sección mínima de los conductores será de 1.5 mm² para alumbrado.' },
    { id: 2, answer: '2.5 mm²', isCorrect: false, explanation: 'Esta sección se utiliza para tomas de corriente generales.' },
    { id: 3, answer: '4 mm²', isCorrect: false, explanation: 'Esta sección se utiliza para circuitos de cocina u horno.' },
  ]
};

const mockCorrectAnswer: QuizAnswer = {
  questionId: 'q1',
  selectedOptionIds: [1],
  isCorrect: true,
  points: 1,
  id: 'a1',
  quizId: 'quiz1',
  itcCode: 'ITC-BT-19',
  timeMs: 1000,
  createdAt: new Date().toISOString()
};

const mockIncorrectAnswer: QuizAnswer = {
  questionId: 'q1',
  selectedOptionIds: [2],
  isCorrect: false,
  points: 0,
  id: 'a2',
  quizId: 'quiz1',
  itcCode: 'ITC-BT-19',
  timeMs: 1000,
  createdAt: new Date().toISOString()
};

const meta: Meta<typeof ReviewItem> = {
  title: 'Quiz/Results/ReviewItem',
  component: ReviewItem,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof ReviewItem>;

export const Correct: Story = {
  args: {
    question: mockQuestion,
    answer: mockCorrectAnswer,
    index: 0,
    isExpanded: true,
    onToggle: () => {},
  },
};

export const Incorrect: Story = {
  args: {
    question: mockQuestion,
    answer: mockIncorrectAnswer,
    index: 5,
    isExpanded: true,
    onToggle: () => {},
  },
};

export const Collapsed: Story = {
  args: {
    question: mockQuestion,
    answer: mockCorrectAnswer,
    index: 2,
    isExpanded: false,
    onToggle: () => {},
  },
};

export const Unanswered: Story = {
  args: {
    question: mockQuestion,
    answer: undefined,
    index: 3,
    isExpanded: true,
    onToggle: () => {},
  },
};

