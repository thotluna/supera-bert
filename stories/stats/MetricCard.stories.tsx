import type { Meta, StoryObj } from '@storybook/react';
import { MetricCard } from '../../app/stats/components/metric-card';
import { Trophy, Target, Clock, BookOpen } from 'lucide-react';

const meta: Meta<typeof MetricCard> = {
  title: 'Stats/MetricCard',
  component: MetricCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MetricCard>;

export const Score: Story = {
  args: {
    title: 'Promedio General',
    value: 8.45,
    icon: Trophy,
    description: 'Puntuación media por examen',
    trend: {
      value: 12,
      isPositive: true,
    },
  },
};

export const Effectiveness: Story = {
  args: {
    title: 'Efectividad',
    value: '84%',
    icon: Target,
    description: 'Ratio de respuestas correctas',
    trend: {
      value: 5,
      isPositive: true,
    },
  },
};

export const Time: Story = {
  args: {
    title: 'Tiempo Total',
    value: '124m',
    icon: Clock,
    description: 'Invertidos en formación',
  },
};

export const Quizzes: Story = {
  args: {
    title: 'Exámenes',
    value: 42,
    icon: BookOpen,
    description: 'Simulacros completados',
    trend: {
      value: 2,
      isPositive: false,
    },
  },
};
