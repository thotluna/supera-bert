import type { Meta, StoryObj } from '@storybook/react';
import { TopicPerformance } from '../../app/stats/components/topic-performance';
import { TopicStats } from '@/libs/quiz/domain/stats';

const mockTopicStats: TopicStats[] = [
  { itcCode: 'ITC-BT-19', totalQuestions: 45, correctAnswers: 40, averagePoints: 8.8, masteryScore: 88.8, accuracyScore: 88.8 },
  { itcCode: 'ITC-BT-01', totalQuestions: 30, correctAnswers: 15, averagePoints: 5.0, masteryScore: 50.0, accuracyScore: 50.0 },
  { itcCode: 'ITC-BT-24', totalQuestions: 50, correctAnswers: 48, averagePoints: 9.6, masteryScore: 96.0, accuracyScore: 96.0 },
  { itcCode: 'ITC-BT-07', totalQuestions: 20, correctAnswers: 18, averagePoints: 9.0, masteryScore: 90.0, accuracyScore: 90.0 },
  { itcCode: 'ITC-BT-10', totalQuestions: 15, correctAnswers: 5, averagePoints: 3.3, masteryScore: 33.3, accuracyScore: 33.3 },
];

const meta: Meta<typeof TopicPerformance> = {
  title: 'Stats/TopicPerformance',
  component: TopicPerformance,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TopicPerformance>;

export const Default: Story = {
  args: {
    stats: mockTopicStats,
  },
};

export const Empty: Story = {
  args: {
    stats: [],
  },
};
