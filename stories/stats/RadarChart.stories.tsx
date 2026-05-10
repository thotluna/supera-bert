import type { Meta, StoryObj } from '@storybook/react';
import { RadarChart } from '../../app/stats/components/radar-chart';
import { TopicStats } from '@/libs/quiz/domain/stats';

const mockTopicStats: TopicStats[] = [
  { itcCode: 'ITC-BT-01', totalQuestions: 5, correctAnswers: 4, averagePoints: 8.0, masteryScore: 20.0, accuracyScore: 80.0 },
  { itcCode: 'ITC-BT-03', totalQuestions: 0, correctAnswers: 0, averagePoints: 0, masteryScore: 0, accuracyScore: 0 },
  { itcCode: 'ITC-BT-04', totalQuestions: 0, correctAnswers: 0, averagePoints: 0, masteryScore: 0, accuracyScore: 0 },
  { itcCode: 'ITC-BT-05', totalQuestions: 0, correctAnswers: 0, averagePoints: 0, masteryScore: 0, accuracyScore: 0 },
  { itcCode: 'ITC-BT-06', totalQuestions: 0, correctAnswers: 0, averagePoints: 0, masteryScore: 0, accuracyScore: 0 },
  { itcCode: 'ITC-BT-07', totalQuestions: 15, correctAnswers: 6, averagePoints: 4.0, masteryScore: 30.0, accuracyScore: 40.0 },
  { itcCode: 'ITC-BT-08', totalQuestions: 0, correctAnswers: 0, averagePoints: 0, masteryScore: 0, accuracyScore: 0 },
  { itcCode: 'ITC-BT-09', totalQuestions: 10, correctAnswers: 9, averagePoints: 9.0, masteryScore: 45.0, accuracyScore: 90.0 },
  { itcCode: 'ITC-BT-10', totalQuestions: 20, correctAnswers: 18, averagePoints: 9.0, masteryScore: 90.0, accuracyScore: 90.0 },
];

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

export const Balanced: Story = {
  args: {
    stats: mockTopicStats.map(s => ({ ...s, correctAnswers: s.totalQuestions * 0.8, masteryScore: 80, accuracyScore: 80 })),
  },
};

export const Specialists: Story = {
  args: {
    stats: mockTopicStats,
  },
};

export const LowActivity: Story = {
  args: {
    stats: mockTopicStats.slice(0, 2).map(s => ({ ...s, totalQuestions: 2, masteryScore: 10, accuracyScore: 100 })),
  },
};
