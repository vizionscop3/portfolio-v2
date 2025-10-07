import { useEffect, useState, useCallback } from 'react';
import {
  PerformanceMetrics,
  PerformanceMode,
  performanceMonitor,
} from '@/utils/performance';
import { useDevice } from './useMobile';

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
  const device = useDevice();

  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [mode, setModeState] = useState<PerformanceMode>(() => {
    // Initialize with mobile-appropriate performance mode
    if (device.isMobile) {
      return device.performanceLevel === 'high' ? 'medium' : 'low';
    }
    return 'high';
  });
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

/**
 * Mobile-specific performance optimization hook
 */
export const useMobilePerformanceOptimization = () => {
  const device = useDevice();
  const { mode, setMode } = usePerformanceMonitor();

  useEffect(() => {
    // Auto-adjust performance based on device capabilities
    if (device.isMobile) {
      // Aggressive optimization for mobile devices
      if (device.performanceLevel === 'low') {
        setMode('low');
      } else if (device.performanceLevel === 'medium') {
        setMode('medium');
      } else {
        // Even high-performance mobile devices should use medium mode
        setMode('medium');
      }
    } else if (device.isTablet) {
      // Balanced optimization for tablets
      setMode(device.performanceLevel === 'high' ? 'high' : 'medium');
    }
  }, [device, setMode]);

  const optimizations = useCallback(() => {
    return {
      // Rendering optimizations
      maxLights: device.isMobile ? 2 : device.isTablet ? 4 : 8,
      shadowQuality: device.performanceLevel,
      antialiasing: device.performanceLevel !== 'low',
      postProcessing: device.performanceLevel === 'high' && !device.isMobile,

      // Texture optimizations
      textureSize: device.isMobile ? 512 : device.isTablet ? 1024 : 2048,
      mipmaps: device.performanceLevel !== 'low',

      // LOD optimizations
      maxDistance: device.isMobile ? 50 : device.isTablet ? 75 : 100,
      lodBias: device.isMobile ? 0.5 : device.isTablet ? 0.75 : 1.0,

      // Animation optimizations
      reducedMotion:
        device.isMobile &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      maxParticles: device.isMobile ? 25 : device.isTablet ? 50 : 100,

      // Memory optimizations
      garbageCollectionThreshold: device.isMobile ? 30 : 60, // seconds
      textureMemoryLimit: device.isMobile ? 64 : device.isTablet ? 128 : 256, // MB
    };
  }, [device]);

  return {
    mode,
    device,
    optimizations: optimizations(),
    setMode,
  };
};
