import type { Meta, StoryObj } from '@storybook/react';
import { EvolutionChart } from '../../app/stats/components/evolution-chart';
import { DailyEvolution } from '@/libs/quiz/domain/stats';

const mockEvolutionData: DailyEvolution[] = [
  { date: '2024-05-01', averageScore: 4.5, quizzesCount: 2 },
  { date: '2024-05-02', averageScore: 5.2, quizzesCount: 3 },
  { date: '2024-05-03', averageScore: 6.8, quizzesCount: 1 },
  { date: '2024-05-04', averageScore: 6.5, quizzesCount: 4 },
  { date: '2024-05-05', averageScore: 8.1, quizzesCount: 2 },
  { date: '2024-05-06', averageScore: 7.9, quizzesCount: 5 },
  { date: '2024-05-07', averageScore: 9.2, quizzesCount: 3 },
];

const meta: Meta<typeof EvolutionChart> = {
  title: 'Stats/EvolutionChart',
  component: EvolutionChart,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof EvolutionChart>;

export const Default: Story = {
  args: {
    data: mockEvolutionData,
  },
};

export const LimitedData: Story = {
  args: {
    data: mockEvolutionData.slice(0, 2),
  },
};

export const Empty: Story = {
  args: {
    data: [],
  },
};
