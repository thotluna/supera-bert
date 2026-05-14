import type { Meta, StoryObj } from '@storybook/react';
import { RadarChart } from '@/app/components/radar-chart';

const meta: Meta<typeof RadarChart> = {
  title: 'Stats/RadarChart',
  component: RadarChart,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RadarChart>;

export const QuizResults: Story = {
  args: {
    data: [
      { itcCode: 'ITC-BT-01', totalQuestions: 5, correctAnswers: 4, datasetSize: 5 }, // 100% Cobertura, 80% Maestría
      { itcCode: 'ITC-BT-03', totalQuestions: 1, correctAnswers: 1, datasetSize: 1 }, // 100% Cobertura, 100% Maestría
      { itcCode: 'ITC-BT-05', totalQuestions: 10, correctAnswers: 5, datasetSize: 10 }, // 100% Cobertura, 50% Maestría
    ],
    mode: 'results',
  },
};

export const GlobalProgressEarly: Story = {
  args: {
    data: [
      { itcCode: 'ITC-BT-01', totalQuestions: 10, correctAnswers: 10, datasetSize: 100 }, // 10% Cobertura, 10% Maestría (Conoce todo lo que ha visto)
      { itcCode: 'ITC-BT-03', totalQuestions: 5, correctAnswers: 5, datasetSize: 100 },   // 5% Cobertura
      { itcCode: 'ITC-BT-05', totalQuestions: 2, correctAnswers: 0, datasetSize: 100 },   // 2% Cobertura, 0% Maestría
      { itcCode: 'ITC-BT-07', totalQuestions: 0, correctAnswers: 0, datasetSize: 100 },
      { itcCode: 'ITC-BT-10', totalQuestions: 0, correctAnswers: 0, datasetSize: 100 },
    ],
    mode: 'dashboard',
  },
};

export const GlobalProgressAdvanced: Story = {
  args: {
    data: [
      { itcCode: 'ITC-BT-01', totalQuestions: 90, correctAnswers: 80, datasetSize: 100 }, // 90% Cobertura, 80% Maestría
      { itcCode: 'ITC-BT-03', totalQuestions: 70, correctAnswers: 30, datasetSize: 100 }, // 70% Cobertura, 30% Maestría
      { itcCode: 'ITC-BT-05', totalQuestions: 100, correctAnswers: 100, datasetSize: 100 }, // ¡CONQUISTADO!
      { itcCode: 'ITC-BT-07', totalQuestions: 40, correctAnswers: 10, datasetSize: 100 },
      { itcCode: 'ITC-BT-10', totalQuestions: 20, correctAnswers: 15, datasetSize: 100 },
    ],
    mode: 'dashboard',
  },
};
