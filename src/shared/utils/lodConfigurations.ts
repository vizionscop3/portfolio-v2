/**
 * LOD configurations for cyberpunk portfolio objects
 *
 * This file defines the Level of Detail configurations for all interactive objects
 * in the cyberpunk portfolio room, optimized for performance while maintaining
 * visual fidelity at appropriate viewing distances.
 */

import * as THREE from 'three';
import { LODConfiguration } from './lodSystem';

export interface CyberpunkLODConfig {
  holographicComputer: LODConfiguration;
  digitalCodex: LODConfiguration;
  neonWardrobePod: LODConfiguration;
  holographicMerchDisplay: LODConfiguration;
  audioEngineeringStation: LODConfiguration;
}

/**
 * Distance thresholds for different detail levels
 * These distances are optimized for the cyberpunk room scale
 */
export const LOD_DISTANCES = {
  // Very close - maximum detail for interaction
  CLOSE: 8,
  // Medium distance - good detail for viewing
  MEDIUM: 20,
  // Far distance - simplified but recognizable
  FAR: 40,
  // Very far - minimal detail, basic shape
  VERY_FAR: 80,
};

/**
 * Polygon count estimates for different detail levels
 */
export const POLYGON_COUNTS = {
  HIGH: 5000,
  MEDIUM: 2000,
  LOW: 800,
  MINIMAL: 200,
};

/**
 * Creates LOD configuration for holographic computer setup
 */
export const createHolographicComputerLOD = (
  baseModel: THREE.Object3D
): LODConfiguration => ({
  objectId: 'holographic-computer',
  baseModel,
  levels: [
    {
      distance: LOD_DISTANCES.CLOSE,
      visible: false,
      polygonCount: POLYGON_COUNTS.HIGH,
      priority: 'high',
    },
    {
      distance: LOD_DISTANCES.MEDIUM,
      visible: false,
      polygonCount: POLYGON_COUNTS.MEDIUM,
      priority: 'medium',
    },
    {
      distance: LOD_DISTANCES.FAR,
      visible: false,
      polygonCount: POLYGON_COUNTS.LOW,
      priority: 'low',
    },
    {
      distance: LOD_DISTANCES.VERY_FAR,
      visible: false,
      polygonCount: POLYGON_COUNTS.MINIMAL,
      priority: 'low',
    },
  ],
  enableFrustumCulling: true,
  enableOcclusionCulling: false,
  minimumScreenSize: 20,
  hysteresis: 3,
});

/**
 * Creates LOD configuration for digital codex/e-book
 */
export const createDigitalCodexLOD = (
  baseModel: THREE.Object3D
): LODConfiguration => ({
  objectId: 'digital-codex',
  baseModel,
  levels: [
    {
      distance: LOD_DISTANCES.CLOSE,
      visible: false,
      polygonCount: POLYGON_COUNTS.MEDIUM, // Books are less complex than computers
      priority: 'high',
    },
    {
      distance: LOD_DISTANCES.MEDIUM,
      visible: false,
      polygonCount: POLYGON_COUNTS.LOW,
      priority: 'medium',
    },
    {
      distance: LOD_DISTANCES.FAR,
      visible: false,
      polygonCount: POLYGON_COUNTS.MINIMAL,
      priority: 'low',
    },
  ],
  enableFrustumCulling: true,
  enableOcclusionCulling: false,
  minimumScreenSize: 15,
  hysteresis: 2,
});

/**
 * Creates LOD configuration for neon wardrobe pod
 */
export const createNeonWardrobePodLOD = (
  baseModel: THREE.Object3D
): LODConfiguration => ({
  objectId: 'neon-wardrobe-pod',
  baseModel,
  levels: [
    {
      distance: LOD_DISTANCES.CLOSE,
      visible: false,
      polygonCount: POLYGON_COUNTS.HIGH, // Complex geometry for clothing displays
      priority: 'high',
    },
    {
      distance: LOD_DISTANCES.MEDIUM,
      visible: false,
      polygonCount: POLYGON_COUNTS.MEDIUM,
      priority: 'medium',
    },
    {
      distance: LOD_DISTANCES.FAR,
      visible: false,
      polygonCount: POLYGON_COUNTS.LOW,
      priority: 'low',
    },
    {
      distance: LOD_DISTANCES.VERY_FAR,
      visible: false,
      polygonCount: POLYGON_COUNTS.MINIMAL,
      priority: 'low',
    },
  ],
  enableFrustumCulling: true,
  enableOcclusionCulling: true, // Can be occluded by other furniture
  minimumScreenSize: 25,
  hysteresis: 4,
});

/**
 * Creates LOD configuration for holographic merchandise display
 */
export const createHolographicMerchDisplayLOD = (
  baseModel: THREE.Object3D
): LODConfiguration => ({
  objectId: 'holographic-merch-display',
  baseModel,
  levels: [
    {
      distance: LOD_DISTANCES.CLOSE,
      visible: false,
      polygonCount: POLYGON_COUNTS.MEDIUM, // Moderate complexity for product displays
      priority: 'high',
    },
    {
      distance: LOD_DISTANCES.MEDIUM,
      visible: false,
      polygonCount: POLYGON_COUNTS.LOW,
      priority: 'medium',
    },
    {
      distance: LOD_DISTANCES.FAR,
      visible: false,
      polygonCount: POLYGON_COUNTS.MINIMAL,
      priority: 'low',
    },
  ],
  enableFrustumCulling: true,
  enableOcclusionCulling: false,
  minimumScreenSize: 18,
  hysteresis: 2,
});

/**
 * Creates LOD configuration for audio engineering station
 */
export const createAudioEngineeringStationLOD = (
  baseModel: THREE.Object3D
): LODConfiguration => ({
  objectId: 'audio-engineering-station',
  baseModel,
  levels: [
    {
      distance: LOD_DISTANCES.CLOSE,
      visible: false,
      polygonCount: POLYGON_COUNTS.HIGH, // Complex mixing console with many details
      priority: 'high',
    },
    {
      distance: LOD_DISTANCES.MEDIUM,
      visible: false,
      polygonCount: POLYGON_COUNTS.MEDIUM,
      priority: 'medium',
    },
    {
      distance: LOD_DISTANCES.FAR,
      visible: false,
      polygonCount: POLYGON_COUNTS.LOW,
      priority: 'low',
    },
    {
      distance: LOD_DISTANCES.VERY_FAR,
      visible: false,
      polygonCount: POLYGON_COUNTS.MINIMAL,
      priority: 'low',
    },
  ],
  enableFrustumCulling: true,
  enableOcclusionCulling: true,
  minimumScreenSize: 22,
  hysteresis: 3,
});

/**
 * Creates LOD configuration for room environment (walls, floor, ceiling)
 */
export const createRoomEnvironmentLOD = (
  baseModel: THREE.Object3D
): LODConfiguration => ({
  objectId: 'room-environment',
  baseModel,
  levels: [
    {
      distance: LOD_DISTANCES.CLOSE,
      visible: false,
      polygonCount: POLYGON_COUNTS.MEDIUM, // Room doesn't need ultra-high detail
      priority: 'high',
    },
    {
      distance: LOD_DISTANCES.VERY_FAR,
      visible: false,
      polygonCount: POLYGON_COUNTS.LOW,
      priority: 'low',
    },
  ],
  enableFrustumCulling: false, // Room should always be visible
  enableOcclusionCulling: false,
  minimumScreenSize: 0, // Never cull the room
  hysteresis: 5,
});

/**
 * Factory function to create all LOD configurations
 */
export const createAllLODConfigurations = (models: {
  holographicComputer?: THREE.Object3D;
  digitalCodex?: THREE.Object3D;
  neonWardrobePod?: THREE.Object3D;
  holographicMerchDisplay?: THREE.Object3D;
  audioEngineeringStation?: THREE.Object3D;
  roomEnvironment?: THREE.Object3D;
}): LODConfiguration[] => {
  const configurations: LODConfiguration[] = [];

  if (models.holographicComputer) {
    configurations.push(
      createHolographicComputerLOD(models.holographicComputer)
    );
  }

  if (models.digitalCodex) {
    configurations.push(createDigitalCodexLOD(models.digitalCodex));
  }

  if (models.neonWardrobePod) {
    configurations.push(createNeonWardrobePodLOD(models.neonWardrobePod));
  }

  if (models.holographicMerchDisplay) {
    configurations.push(
      createHolographicMerchDisplayLOD(models.holographicMerchDisplay)
    );
  }

  if (models.audioEngineeringStation) {
    configurations.push(
      createAudioEngineeringStationLOD(models.audioEngineeringStation)
    );
  }

  if (models.roomEnvironment) {
    configurations.push(createRoomEnvironmentLOD(models.roomEnvironment));
  }

  return configurations;
};

/**
 * Performance-based LOD distance multipliers
 * These adjust the LOD distances based on current performance
 */
export const getPerformanceDistanceMultiplier = (
  performanceMode: 'high' | 'medium' | 'low'
): number => {
  switch (performanceMode) {
    case 'high':
      return 1.0; // Full distances
    case 'medium':
      return 0.7; // Closer LOD switches for better performance
    case 'low':
      return 0.5; // Much closer switches for maximum performance
    default:
      return 1.0;
  }
};

/**
 * Adjusts LOD configuration based on current performance mode
 */
export const adjustLODForPerformance = (
  config: LODConfiguration,
  performanceMode: 'high' | 'medium' | 'low'
): LODConfiguration => {
  const multiplier = getPerformanceDistanceMultiplier(performanceMode);

  return {
    ...config,
    levels: config.levels.map(level => ({
      ...level,
      distance: level.distance * multiplier,
    })),
  };
};
