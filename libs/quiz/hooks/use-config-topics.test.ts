import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useConfigTopics } from './use-config-topics';
import { ITCTopic } from '../models';

describe('useConfigTopics Hook', () => {
  it('should initialize with "All" selected and no specific topics', () => {
    const { result } = renderHook(() => useConfigTopics());
    
    expect(result.current.isAllSelected).toBe(true);
    expect(result.current.selectedTopics.size).toBe(0);
  });

  it('should uncheck "All" when a specific topic is selected', () => {
    const { result } = renderHook(() => useConfigTopics());
    
    act(() => {
      result.current.handleToggleTopic('ITC-BT-01' as ITCTopic, true);
    });
    
    expect(result.current.isAllSelected).toBe(false);
    expect(result.current.selectedTopics.has('ITC-BT-01' as ITCTopic)).toBe(true);
  });

  it('should clear specific topics when "All" is selected', () => {
    const { result } = renderHook(() => useConfigTopics());
    
    act(() => {
      result.current.handleToggleTopic('ITC-BT-01' as ITCTopic, true);
      result.current.handleToggleTopic('ITC-BT-02' as ITCTopic, true);
    });
    
    expect(result.current.selectedTopics.size).toBe(2);
    
    act(() => {
      result.current.handleToggleAll();
    });
    
    expect(result.current.isAllSelected).toBe(true);
    expect(result.current.selectedTopics.size).toBe(0);
  });

  it('should return to "All" if the last topic is unselected', () => {
    const { result } = renderHook(() => useConfigTopics());
    
    act(() => {
      result.current.handleToggleTopic('ITC-BT-01' as ITCTopic, true);
    });
    
    expect(result.current.isAllSelected).toBe(false);
    
    act(() => {
      result.current.handleToggleTopic('ITC-BT-01' as ITCTopic, true);
    });
    
    expect(result.current.isAllSelected).toBe(true);
    expect(result.current.selectedTopics.size).toBe(0);
  });

  it('should not allow selecting unavailable topics', () => {
    const { result } = renderHook(() => useConfigTopics());
    
    act(() => {
      result.current.handleToggleTopic('ITC-BT-01' as ITCTopic, false);
    });
    
    expect(result.current.isAllSelected).toBe(true);
    expect(result.current.selectedTopics.size).toBe(0);
  });

  it('should handle multiple topic selections', () => {
    const { result } = renderHook(() => useConfigTopics());
    
    act(() => {
      result.current.handleToggleTopic('ITC-BT-01' as ITCTopic, true);
      result.current.handleToggleTopic('ITC-BT-02' as ITCTopic, true);
      result.current.handleToggleTopic('ITC-BT-03' as ITCTopic, true);
    });
    
    expect(result.current.selectedTopics.size).toBe(3);
    expect(result.current.isAllSelected).toBe(false);
  });
});
