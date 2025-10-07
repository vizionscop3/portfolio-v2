/**
 * React hooks for Level of Detail (LOD) system integration
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { getLODSystem, LODConfiguration, LODSystem } from '../utils/lodSystem';

/**
 * Hook to initialize and manage the LOD system
 */
export const useLODSystem = (options?: {
  enableAutoOptimization?: boolean;
  performanceThreshold?: number;
  enableDebugMode?: boolean;
}) => {
  const [lodSystem] = useState(() => getLODSystem(options));
  const [isInitialized, setIsInitialized] = useState(false);
  const [statistics, setStatistics] = useState({
    totalObjects: 0,
    visibleObjects: 0,
    totalPolygons: 0,
    currentQuality: 'high' as 'high' | 'medium' | 'low',
    frustumCulled: 0,
    occlusionCulled: 0,
  });

  const initialize = useCallback(
    (camera: THREE.Camera, scene: THREE.Scene) => {
      lodSystem.initialize(camera, scene);
      setIsInitialized(true);
    },
    [lodSystem]
  );

  const registerObject = useCallback(
    (config: LODConfiguration) => {
      lodSystem.registerObject(config);
    },
    [lodSystem]
  );

  const setQualityLevel = useCallback(
    (quality: 'high' | 'medium' | 'low') => {
      lodSystem.setQualityLevel(quality);
      const stats = lodSystem.getStatistics();
      setStatistics({
        ...stats,
        currentQuality: stats.currentQuality as 'high' | 'medium' | 'low',
      });
    },
    [lodSystem]
  );

  const update = useCallback(() => {
    if (isInitialized) {
      lodSystem.update();
      const stats = lodSystem.getStatistics();
      setStatistics({
        ...stats,
        currentQuality: stats.currentQuality as 'high' | 'medium' | 'low',
      });
    }
  }, [lodSystem, isInitialized]);

  const getObjectDebugInfo = useCallback(
    (objectId: string) => {
      return lodSystem.getObjectDebugInfo(objectId);
    },
    [lodSystem]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      lodSystem.dispose();
    };
  }, [lodSystem]);

  return {
    lodSystem,
    isInitialized,
    statistics,
    initialize,
    registerObject,
    setQualityLevel,
    update,
    getObjectDebugInfo,
  };
};

/**
 * Hook for automatic LOD updates in render loop
 */
export const useLODUpdater = (
  lodSystem: LODSystem,
  enabled: boolean = true
) => {
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const updateLoop = () => {
      lodSystem.update();
      animationFrameRef.current = requestAnimationFrame(updateLoop);
    };

    animationFrameRef.current = requestAnimationFrame(updateLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [lodSystem, enabled]);
};

/**
 * Hook for managing LOD configuration for a specific object
 */
export const useLODObject = (
  objectId: string,
  baseModel: THREE.Object3D | null,
  lodSystem?: LODSystem,
  options?: {
    enableFrustumCulling?: boolean;
    enableOcclusionCulling?: boolean;
    minimumScreenSize?: number;
    distances?: number[];
    hysteresis?: number;
  }
) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    if (!baseModel || !lodSystem || isRegistered) return;

    const distances = options?.distances || [10, 25, 50, 100];

    const config: LODConfiguration = {
      objectId,
      baseModel,
      levels: distances.map((distance, index) => ({
        distance,
        visible: false,
        polygonCount: 1000 * (distances.length - index), // Estimated
        priority: index === 0 ? 'high' : index === 1 ? 'medium' : 'low',
      })),
      enableFrustumCulling: options?.enableFrustumCulling ?? true,
      enableOcclusionCulling: options?.enableOcclusionCulling ?? false,
      minimumScreenSize: options?.minimumScreenSize ?? 10,
      hysteresis: options?.hysteresis ?? 5,
    };

    try {
      lodSystem.registerObject(config);
      setIsRegistered(true);
    } catch (error) {
      console.error(`Failed to register LOD object ${objectId}:`, error);
    }
  }, [objectId, baseModel, lodSystem, isRegistered, options]);

  // Update debug info periodically
  useEffect(() => {
    if (!isRegistered || !lodSystem) return;

    const interval = setInterval(() => {
      setDebugInfo(lodSystem.getObjectDebugInfo(objectId));
    }, 500);

    return () => clearInterval(interval);
  }, [isRegistered, lodSystem, objectId]);

  return {
    isRegistered,
    debugInfo,
  };
};

/**
 * Hook for LOD statistics monitoring
 */
export const useLODStatistics = (
  lodSystem: LODSystem,
  updateInterval: number = 1000
) => {
  const [statistics, setStatistics] = useState({
    totalObjects: 0,
    visibleObjects: 0,
    totalPolygons: 0,
    currentQuality: 'high' as 'high' | 'medium' | 'low',
    frustumCulled: 0,
    occlusionCulled: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const stats = lodSystem.getStatistics();
      setStatistics({
        ...stats,
        currentQuality: stats.currentQuality as 'high' | 'medium' | 'low',
      });
    }, updateInterval);

    return () => clearInterval(interval);
  }, [lodSystem, updateInterval]);

  return statistics;
};

/**
 * Hook for performance-aware LOD quality management
 */
export const usePerformanceLOD = (
  lodSystem: LODSystem,
  targetFPS: number = 60,
  enabled: boolean = true
) => {
  const [currentQuality, setCurrentQuality] = useState<
    'high' | 'medium' | 'low'
  >('high');
  const fpsHistoryRef = useRef<number[]>([]);
  const lastAdjustmentRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;

    const checkPerformance = () => {
      // Simple FPS calculation
      const now = Date.now();
      fpsHistoryRef.current.push(now);

      // Keep only last second of data
      fpsHistoryRef.current = fpsHistoryRef.current.filter(
        time => now - time < 1000
      );

      const currentFPS = fpsHistoryRef.current.length;
      const timeSinceLastAdjustment = now - lastAdjustmentRef.current;

      // Only adjust quality if enough time has passed
      if (timeSinceLastAdjustment < 3000) return;

      let newQuality = currentQuality;

      if (currentFPS < targetFPS * 0.7) {
        // Performance is poor
        if (currentQuality === 'high') {
          newQuality = 'medium';
        } else if (currentQuality === 'medium') {
          newQuality = 'low';
        }
      } else if (currentFPS > targetFPS * 0.9) {
        // Performance is good
        if (currentQuality === 'low') {
          newQuality = 'medium';
        } else if (currentQuality === 'medium') {
          newQuality = 'high';
        }
      }

      if (newQuality !== currentQuality) {
        lodSystem.setQualityLevel(newQuality);
        setCurrentQuality(newQuality);
        lastAdjustmentRef.current = now;
      }
    };

    const interval = setInterval(checkPerformance, 200);
    return () => clearInterval(interval);
  }, [lodSystem, targetFPS, currentQuality, enabled]);

  const manualSetQuality = useCallback(
    (quality: 'high' | 'medium' | 'low') => {
      lodSystem.setQualityLevel(quality);
      setCurrentQuality(quality);
      lastAdjustmentRef.current = Date.now();
    },
    [lodSystem]
  );

  return {
    currentQuality,
    setQuality: manualSetQuality,
  };
};
