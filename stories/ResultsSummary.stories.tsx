import type { Meta, StoryObj } from '@storybook/react';
import { ResultsSummary } from '../app/quiz/results/components/results-summary';
import { Quiz } from '@/libs/quiz/domain/quiz';

const mockQuiz: Quiz = {
  id: 'quiz1',
  userId: 'user1',
  mode: 'standard',
  itcCodes: ['ITC-BT-19'],
  totalQuestions: 10,
  totalScore: 8.5,
  startedAt: new Date(Date.now() - 600000).toISOString(),
  finishedAt: new Date().toISOString(),
  isCompleted: true
};

const meta: Meta<typeof ResultsSummary> = {
  title: 'Quiz/Results/Summary',
  component: ResultsSummary,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof ResultsSummary>;

export const HighPerformance: Story = {
  args: {
    quiz: mockQuiz,
    correctCount: 9,
    incorrectCount: 1,
    unansweredCount: 0,
    percentage: 90,
    avgTime: '12.4s',
    maxTime: '34.2s',
    minTime: '5.1s',
  },
};

export const MidPerformance: Story = {
  args: {
    quiz: { ...mockQuiz, totalScore: 6 },
    correctCount: 6,
    incorrectCount: 4,
    unansweredCount: 0,
    percentage: 60,
    avgTime: '18.9s',
    maxTime: '52.0s',
    minTime: '6.3s',
  },
};

export const LowPerformance: Story = {
  args: {
    quiz: { ...mockQuiz, totalScore: 3 },
    correctCount: 3,
    incorrectCount: 5,
    unansweredCount: 2,
    percentage: 30,
    avgTime: '24.1s',
    maxTime: '1m 15s',
    minTime: '8.7s',
  },
};

