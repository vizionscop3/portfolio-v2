/**
 * LOD Manager Component for 3D Portfolio
 * 
 * This component integrates the Level of Detail system with the React Three Fiber scene,
 * automatically managing performance optimization and object detail switching.
 */

import React, { useEffect, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { useLODSystem, useLODUpdater, usePerformanceLOD } from '../../hooks/useLODSystem';
import { usePerformanceMonitor } from '../../hooks/usePerformanceMonitor';

interface LODManagerProps {
  enableAutoOptimization?: boolean;
  performanceThreshold?: number;
  enableDebugMode?: boolean;
  enableDebugUI?: boolean;
  targetFPS?: number;
  children?: React.ReactNode;
}

/**
 * LOD Manager component that handles automatic level-of-detail optimization
 */
export const LODManager: React.FC<LODManagerProps> = ({
  enableAutoOptimization = true,
  performanceThreshold = 45,
  enableDebugMode = false,
  enableDebugUI = false,
  targetFPS = 60,
  children
}) => {
  const { camera, scene } = useThree();
  const initRef = useRef(false);
  
  // Initialize LOD system
  const {
    lodSystem,
    isInitialized,
    statistics,
    initialize,
    setQualityLevel
  } = useLODSystem({
    enableAutoOptimization,
    performanceThreshold,
    enableDebugMode
  });

  // Performance monitoring integration
  const { mode: currentPerformanceMode } = usePerformanceMonitor();
  
  // Automatic LOD updates
  useLODUpdater(lodSystem, isInitialized);
  
  // Performance-aware quality management
  const { currentQuality } = usePerformanceLOD(
    lodSystem,
    targetFPS,
    enableAutoOptimization
  );

  // Initialize LOD system with camera and scene
  useEffect(() => {
    if (!initRef.current && camera && scene) {
      initialize(camera, scene);
      initRef.current = true;
    }
  }, [camera, scene, initialize]);

  // Sync with performance monitor
  useEffect(() => {
    if (!isInitialized) return;

    const qualityMap: Record<string, 'high' | 'medium' | 'low'> = {
      'high': 'high',
      'medium': 'medium',
      'low': 'low'
    };

    const lodQuality = qualityMap[currentPerformanceMode];
    if (lodQuality && lodQuality !== currentQuality) {
      setQualityLevel(lodQuality);
    }
  }, [currentPerformanceMode, currentQuality, setQualityLevel, isInitialized]);

  return (
    <>
      {children}
      {enableDebugUI && isInitialized && (
        <LODDebugUI
          statistics={statistics}
          currentQuality={currentQuality}
          onQualityChange={setQualityLevel}
        />
      )}
    </>
  );
};

/**
 * Debug UI component for LOD statistics and controls
 */
interface LODDebugUIProps {
  statistics: {
    totalObjects: number;
    visibleObjects: number;
    totalPolygons: number;
    currentQuality: string;
    frustumCulled: number;
    occlusionCulled: number;
  };
  currentQuality: 'high' | 'medium' | 'low';
  onQualityChange: (quality: 'high' | 'medium' | 'low') => void;
}

const LODDebugUI: React.FC<LODDebugUIProps> = ({
  statistics,
  currentQuality,
  onQualityChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed top-20 right-4 bg-black/80 text-cyan-300 p-4 rounded-lg border border-cyan-500/30 z-50 font-mono text-sm">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="text-cyan-400 font-semibold">LOD System</span>
        <span className="text-cyan-300">
          {isExpanded ? '▼' : '▶'}
        </span>
      </div>

      {isExpanded && (
        <div className="mt-3 space-y-2">
          {/* Quality Controls */}
          <div className="border-b border-cyan-500/30 pb-2">
            <div className="text-cyan-400 mb-1">Quality Level</div>
            <div className="flex gap-1">
              {(['high', 'medium', 'low'] as const).map((quality) => (
                <button
                  key={quality}
                  onClick={() => onQualityChange(quality)}
                  className={`px-2 py-1 text-xs rounded ${
                    currentQuality === quality
                      ? 'bg-cyan-500 text-black'
                      : 'bg-gray-700 text-cyan-300 hover:bg-gray-600'
                  }`}
                >
                  {quality.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Statistics */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Objects:</span>
              <span className="text-green-400">
                {statistics.visibleObjects}/{statistics.totalObjects}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span>Polygons:</span>
              <span className="text-yellow-400">
                {statistics.totalPolygons.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Quality:</span>
              <span className={
                currentQuality === 'high' ? 'text-green-400' :
                currentQuality === 'medium' ? 'text-yellow-400' : 'text-red-400'
              }>
                {currentQuality.toUpperCase()}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Culled:</span>
              <span className="text-gray-400">
                F:{statistics.frustumCulled} O:{statistics.occlusionCulled}
              </span>
            </div>
          </div>

          {/* Performance Indicator */}
          <div className="border-t border-cyan-500/30 pt-2">
            <div className="flex items-center gap-2">
              <span>Status:</span>
              <div className={`w-2 h-2 rounded-full ${
                statistics.totalPolygons < 10000 ? 'bg-green-400' :
                statistics.totalPolygons < 25000 ? 'bg-yellow-400' : 'bg-red-400'
              }`} />
              <span className="text-xs">
                {statistics.totalPolygons < 10000 ? 'Optimal' :
                 statistics.totalPolygons < 25000 ? 'Good' : 'Heavy'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LODManager;