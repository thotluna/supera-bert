import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuizTopics } from './quiz-topics';
import { useConfigTopics } from '@/libs/quiz/hooks/use-config-topics';
import { TopicOption } from '@/libs/quiz/models';

// Mock del hook para controlar el estado en los tests de renderizado
vi.mock('@/libs/quiz/hooks/use-config-topics', () => ({
  useConfigTopics: vi.fn()
}));

const mockTopics: TopicOption[] = [
  { name: 'ITC-BT-01', available: true },
  { name: 'ITC-BT-02', available: false },
  { name: 'ITC-BT-03', available: true },
];

describe('QuizTopics Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all topics provided', () => {
    (useConfigTopics as Mock).mockReturnValue({
      selectedTopics: new Set(),
      isAllSelected: true,
      handleToggleAll: vi.fn(),
      handleToggleTopic: vi.fn(),
    });

    render(<QuizTopics topics={mockTopics} />);
    
    expect(screen.getByText('Todo REBT')).toBeDefined();
    expect(screen.getByText('ITC-BT-01')).toBeDefined();
    expect(screen.getByText('ITC-BT-02')).toBeDefined();
    expect(screen.getByText('ITC-BT-03')).toBeDefined();
  });

  it('should show disabled state for unavailable topics', () => {
    (useConfigTopics as Mock).mockReturnValue({
      selectedTopics: new Set(),
      isAllSelected: true,
      handleToggleAll: vi.fn(),
      handleToggleTopic: vi.fn(),
    });

    render(<QuizTopics topics={mockTopics} />);
    
    const disabledTopic = screen.getByText('ITC-BT-02').closest('label');
    expect(disabledTopic?.className).toContain('opacity-20');
    expect(disabledTopic?.className).toContain('cursor-not-allowed');
  });

  it('should highlight selected topics', () => {
    (useConfigTopics as Mock).mockReturnValue({
      selectedTopics: new Set(['ITC-BT-01']),
      isAllSelected: false,
      handleToggleAll: vi.fn(),
      handleToggleTopic: vi.fn(),
    });

    render(<QuizTopics topics={mockTopics} />);
    
    const selectedTopic = screen.getByText('ITC-BT-01').closest('label');
    expect(selectedTopic?.className).toContain('border-accent');
    expect(selectedTopic?.className).toContain('bg-accent/20');
  });

  it('should call handleToggleTopic when a topic is clicked', () => {
    const handleToggleTopic = vi.fn();
    (useConfigTopics as Mock).mockReturnValue({
      selectedTopics: new Set(),
      isAllSelected: true,
      handleToggleAll: vi.fn(),
      handleToggleTopic,
    });

    render(<QuizTopics topics={mockTopics} />);
    
    fireEvent.click(screen.getByText('ITC-BT-01'));
    expect(handleToggleTopic).toHaveBeenCalledWith('ITC-BT-01', true);
  });

  it('should call handleToggleAll when "Todo REBT" is clicked', () => {
    const handleToggleAll = vi.fn();
    (useConfigTopics as any).mockReturnValue({
      selectedTopics: new Set(['ITC-BT-01']),
      isAllSelected: false,
      handleToggleAll,
      handleToggleTopic: vi.fn(),
    });

    render(<QuizTopics topics={mockTopics} />);
    
    fireEvent.click(screen.getByText('Todo REBT'));
    expect(handleToggleAll).toHaveBeenCalled();
  });
});
