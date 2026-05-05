import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { QuizTopicsView } from '../app/components/config/topics-quiz/quiz-topics-view';
import { ITCTopic, TopicOption } from '@/libs/quiz/models';

const mockTopics: TopicOption[] = [
  { name: 'ITC-BT-01' as ITCTopic, available: true },
  { name: 'ITC-BT-02' as ITCTopic, available: true },
  { name: 'ITC-BT-03' as ITCTopic, available: false },
  { name: 'ITC-BT-04' as ITCTopic, available: true },
  { name: 'ITC-BT-05' as ITCTopic, available: true },
  { name: 'ITC-BT-06' as ITCTopic, available: true },
  { name: 'ITC-BT-07' as ITCTopic, available: false },
  { name: 'ITC-BT-08' as ITCTopic, available: true },
  { name: 'ITC-BT-09' as ITCTopic, available: true },
  { name: 'ITC-BT-10' as ITCTopic, available: true },
  { name: 'ITC-BT-11' as ITCTopic, available: true },
];

const meta: Meta<typeof QuizTopicsView> = {
  title: 'Config/QuizTopics',
  component: QuizTopicsView,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof QuizTopicsView>;

export const Default: Story = {
  args: {
    topics: mockTopics,
    selectedTopics: new Set(),
    isAllSelected: true,
    handleToggleAll: () => alert('Toggle All'),
    handleToggleTopic: (topic) => alert(`Toggle Topic: ${topic}`),
  },
};

export const SomeSelected: Story = {
  args: {
    topics: mockTopics,
    selectedTopics: new Set(['ITC-BT-01' as ITCTopic, 'ITC-BT-02' as ITCTopic]),
    isAllSelected: false,
    handleToggleAll: () => {},
    handleToggleTopic: () => {},
  },
};
