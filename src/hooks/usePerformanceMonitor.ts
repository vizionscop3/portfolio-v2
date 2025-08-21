import { useEffect, useState, useCallback } from 'react';
import {
  PerformanceMetrics,
  PerformanceMode,
  performanceMonitor,
} from '@/utils/performance';

export interface UsePerformanceMonitorOptions {
  autoStart?: boolean;
  trackMemory?: boolean;
  onModeChange?: (mode: PerformanceMode) => void;
}

export interface UsePerformanceMonitorReturn {
  metrics: PerformanceMetrics | null;
  mode: PerformanceMode;
  isMonitoring: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
  setMode: (mode: PerformanceMode) => void;
}

export const usePerformanceMonitor = (
  options: UsePerformanceMonitorOptions = {}
): UsePerformanceMonitorReturn => {
  const { autoStart = true, onModeChange } = options;

  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [mode, setModeState] = useState<PerformanceMode>('high');
  const [isMonitoring, setIsMonitoring] = useState(false);

  const start = useCallback(() => {
    performanceMonitor.start();
    setIsMonitoring(true);
  }, []);

  const stop = useCallback(() => {
    performanceMonitor.stop();
    setIsMonitoring(false);
  }, []);

  const reset = useCallback(() => {
    performanceMonitor.reset();
    setMetrics(null);
  }, []);

  const setMode = useCallback((newMode: PerformanceMode) => {
    performanceMonitor.setMode(newMode);
    setModeState(newMode);
  }, []);

  useEffect(() => {
    // Subscribe to metrics updates
    const unsubscribeMetrics = performanceMonitor.subscribe(newMetrics => {
      setMetrics(newMetrics);
    });

    // Subscribe to mode changes
    const unsubscribeModeChange = performanceMonitor.onModeChange(newMode => {
      setModeState(newMode);
      onModeChange?.(newMode);
    });

    // Auto-start if enabled
    if (autoStart) {
      start();
    }

    // Set initial mode
    setModeState(performanceMonitor.getCurrentMode());

    return () => {
      unsubscribeMetrics();
      unsubscribeModeChange();
      if (isMonitoring) {
        stop();
      }
    };
  }, [autoStart, start, stop, onModeChange, isMonitoring]);

  return {
    metrics,
    mode,
    isMonitoring,
    start,
    stop,
    reset,
    setMode,
  };
};

// Additional utility hooks
export const usePerformanceMode = (): [
  PerformanceMode,
  (mode: PerformanceMode) => void,
] => {
  const [mode, setMode] = useState<PerformanceMode>(
    performanceMonitor.getCurrentMode()
  );

  useEffect(() => {
    const unsubscribe = performanceMonitor.onModeChange(setMode);
    return unsubscribe;
  }, []);

  const changeMode = useCallback((newMode: PerformanceMode) => {
    performanceMonitor.setMode(newMode);
  }, []);

  return [mode, changeMode];
};

export const useFPS = (): number => {
  const [fps, setFps] = useState(0);

  useEffect(() => {
    const unsubscribe = performanceMonitor.subscribe(metrics => {
      setFps(Math.round(metrics.averageFps));
    });
    return unsubscribe;
  }, []);

  return fps;
};

export const useMemoryUsage = (): { used: number; formatted: string } => {
  const [memory, setMemory] = useState({ used: 0, formatted: '0 MB' });

  useEffect(() => {
    const unsubscribe = performanceMonitor.subscribe(metrics => {
      const used = metrics.memoryUsage;
      const formatted =
        used > 0 ? `${(used / (1024 * 1024)).toFixed(1)} MB` : '0 MB';

      setMemory({ used, formatted });
    });
    return unsubscribe;
  }, []);

  return memory;
};
