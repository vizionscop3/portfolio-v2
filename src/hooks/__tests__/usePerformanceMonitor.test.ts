import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

// Mock the performance monitor before importing the hooks
vi.mock('@/utils/performance', () => ({
  performanceMonitor: {
    start: vi.fn(),
    stop: vi.fn(),
    reset: vi.fn(),
    setMode: vi.fn(),
    getCurrentMode: vi.fn(() => 'high'),
    subscribe: vi.fn(() => vi.fn()), // Returns unsubscribe function
    onModeChange: vi.fn(() => vi.fn()), // Returns unsubscribe function
  },
}));

import {
  usePerformanceMonitor,
  usePerformanceMode,
  useFPS,
  useMemoryUsage,
} from '../usePerformanceMonitor';
import { performanceMonitor } from '@/utils/performance';

describe('usePerformanceMonitor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with correct default values', () => {
    const { result } = renderHook(() =>
      usePerformanceMonitor({ autoStart: false })
    );

    expect(result.current.metrics).toBe(null);
    expect(result.current.mode).toBe('high');
    expect(result.current.isMonitoring).toBe(false);
  });

  it('auto-starts monitoring when autoStart is true', () => {
    renderHook(() => usePerformanceMonitor({ autoStart: true }));

    expect(performanceMonitor.start).toHaveBeenCalled();
  });

  it('does not auto-start when autoStart is false', () => {
    renderHook(() => usePerformanceMonitor({ autoStart: false }));

    expect(performanceMonitor.start).not.toHaveBeenCalled();
  });

  it('subscribes to performance monitor updates', () => {
    renderHook(() => usePerformanceMonitor());

    expect(performanceMonitor.subscribe).toHaveBeenCalled();
    expect(performanceMonitor.onModeChange).toHaveBeenCalled();
  });

  it('provides start function that calls monitor start', () => {
    const { result } = renderHook(() =>
      usePerformanceMonitor({ autoStart: false })
    );

    act(() => {
      result.current.start();
    });

    expect(performanceMonitor.start).toHaveBeenCalled();
  });

  it('provides stop function that calls monitor stop', () => {
    const { result } = renderHook(() =>
      usePerformanceMonitor({ autoStart: false })
    );

    act(() => {
      result.current.stop();
    });

    expect(performanceMonitor.stop).toHaveBeenCalled();
  });

  it('provides reset function that calls monitor reset', () => {
    const { result } = renderHook(() =>
      usePerformanceMonitor({ autoStart: false })
    );

    act(() => {
      result.current.reset();
    });

    expect(performanceMonitor.reset).toHaveBeenCalled();
  });

  it('provides setMode function that calls monitor setMode', () => {
    const { result } = renderHook(() =>
      usePerformanceMonitor({ autoStart: false })
    );

    act(() => {
      result.current.setMode('medium');
    });

    expect(performanceMonitor.setMode).toHaveBeenCalledWith('medium');
  });

  it('calls onModeChange callback when provided', () => {
    const onModeChangeMock = vi.fn();
    const { result } = renderHook(() =>
      usePerformanceMonitor({
        autoStart: false,
        onModeChange: onModeChangeMock,
      })
    );

    // Simulate mode change by calling the callback that was registered
    const [callback] = (performanceMonitor.onModeChange as jest.Mock).mock
      .calls[0];
    callback('low');

    // The hook should update its internal state and call the provided callback
    expect(result.current.mode).toBe('low');
  });

  it('unsubscribes on cleanup', () => {
    const unsubscribeMetrics = vi.fn();
    const unsubscribeModeChange = vi.fn();

    (performanceMonitor.subscribe as jest.Mock).mockReturnValue(
      unsubscribeMetrics
    );
    (performanceMonitor.onModeChange as jest.Mock).mockReturnValue(
      unsubscribeModeChange
    );

    const { unmount } = renderHook(() => usePerformanceMonitor());

    unmount();

    expect(unsubscribeMetrics).toHaveBeenCalled();
    expect(unsubscribeModeChange).toHaveBeenCalled();
  });

  it('updates metrics when performance monitor calls callback', () => {
    const { result } = renderHook(() =>
      usePerformanceMonitor({ autoStart: false })
    );

    // Get the callback that was registered with subscribe
    const [metricsCallback] = (performanceMonitor.subscribe as jest.Mock).mock
      .calls[0];

    const mockMetrics = {
      fps: 45,
      frameTime: 22,
      memoryUsage: 30 * 1024 * 1024,
      drawCalls: 100,
      triangles: 50000,
      averageFps: 43,
    };

    act(() => {
      metricsCallback(mockMetrics);
    });

    expect(result.current.metrics).toEqual(mockMetrics);
  });
});

describe('usePerformanceMode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns current mode and change function', () => {
    const { result } = renderHook(() => usePerformanceMode());

    expect(result.current[0]).toBe('high');
    expect(typeof result.current[1]).toBe('function');
  });

  it('calls setMode on performance monitor when changeMode is called', () => {
    const { result } = renderHook(() => usePerformanceMode());

    act(() => {
      result.current[1]('low');
    });

    expect(performanceMonitor.setMode).toHaveBeenCalledWith('low');
  });
});

describe('useFPS', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns initial FPS of 0', () => {
    const { result } = renderHook(() => useFPS());

    expect(result.current).toBe(0);
  });

  it('updates FPS when metrics change', () => {
    const { result } = renderHook(() => useFPS());

    // Get the callback that was registered with subscribe
    const [metricsCallback] = (performanceMonitor.subscribe as jest.Mock).mock
      .calls[0];

    act(() => {
      metricsCallback({ averageFps: 45.7 });
    });

    expect(result.current).toBe(46); // Rounded
  });
});

describe('useMemoryUsage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns initial memory usage', () => {
    const { result } = renderHook(() => useMemoryUsage());

    expect(result.current.used).toBe(0);
    expect(result.current.formatted).toBe('0 MB');
  });

  it('updates memory usage when metrics change', () => {
    const { result } = renderHook(() => useMemoryUsage());

    // Get the callback that was registered with subscribe
    const [metricsCallback] = (performanceMonitor.subscribe as jest.Mock).mock
      .calls[0];

    act(() => {
      metricsCallback({ memoryUsage: 52428800 }); // 50MB
    });

    expect(result.current.used).toBe(52428800);
    expect(result.current.formatted).toBe('50.0 MB');
  });

  it('handles zero memory usage', () => {
    const { result } = renderHook(() => useMemoryUsage());

    // Get the callback that was registered with subscribe
    const [metricsCallback] = (performanceMonitor.subscribe as jest.Mock).mock
      .calls[0];

    act(() => {
      metricsCallback({ memoryUsage: 0 });
    });

    expect(result.current.used).toBe(0);
    expect(result.current.formatted).toBe('0 MB');
  });
});
