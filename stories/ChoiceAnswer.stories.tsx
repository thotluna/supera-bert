import type { Meta, StoryObj } from '@storybook/react';
import { ChoiceAnswerView } from '../app/quiz/components/choice-answer-view';
import { Option } from '@/libs/quiz/models';

const mockOptions: Option[] = [
  { 
    id: 1, 
    answer: 'Los conductores de protección deben ser de color verde-amarillo.', 
    isCorrect: true, 
    explanation: 'Según la ITC-BT-19, la identificación de los conductores se realizará por los colores de su aislamiento.' 
  },
  { 
    id: 2, 
    answer: 'Los conductores de neutro pueden ser de color negro.', 
    isCorrect: false, 
    explanation: 'El conductor neutro debe ser obligatoriamente de color azul claro.' 
  },
  { 
    id: 3, 
    answer: 'La sección mínima de los conductores de fase será de 1.5 mm².', 
    isCorrect: true, 
    explanation: 'Para circuitos de alumbrado, la sección mínima es de 1.5 mm².' 
  },
  { 
    id: 4, 
    answer: 'Se permite el uso de conductores de aluminio en viviendas.', 
    isCorrect: false, 
    explanation: 'En instalaciones interiores de viviendas solo se permite el uso de conductores de cobre.' 
  },
];

const meta: Meta<typeof ChoiceAnswerView> = {
  title: 'Quiz/ChoiceAnswer',
  component: ChoiceAnswerView,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ChoiceAnswerView>;

export const SingleChoice: Story = {
  args: {
    options: mockOptions,
    selectedIds: new Set([1]),
    isMultiple: false,
    isFeedbacking: false,
    onSelect: (opt) => alert(`Selected: ${opt.answer}`),
  },
};

export const MultipleChoice: Story = {
  args: {
    options: mockOptions,
    selectedIds: new Set([1, 3]),
    isMultiple: true,
    isFeedbacking: false,
    onSelect: (opt) => alert(`Selected: ${opt.answer}`),
  },
};

export const CorrectFeedback: Story = {
  args: {
    options: mockOptions,
    selectedIds: new Set([1]),
    isMultiple: false,
    isFeedbacking: true,
    onSelect: () => {},
  },
};

export const IncorrectFeedback: Story = {
  args: {
    options: mockOptions,
    selectedIds: new Set([2]),
    isMultiple: false,
    isFeedbacking: true,
    onSelect: () => {},
  },
};
