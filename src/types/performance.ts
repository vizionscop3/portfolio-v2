import { Vector3 } from 'three';

// Performance Monitoring Types
export interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  drawCalls: number;
  triangles: number;
  geometries: number;
  textures: number;
  timestamp: number;
}

export interface WebGLCapabilities {
  supported: boolean;
  version: string;
  renderer: string;
  vendor: string;
  maxTextureSize: number;
  maxVertexUniforms: number;
  maxFragmentUniforms: number;
  extensions: string[];
}

export interface PerformanceThresholds {
  minFPS: number;
  maxMemoryUsage: number;
  maxDrawCalls: number;
  degradationSteps: PerformanceDegradation[];
}

export interface PerformanceDegradation {
  condition: 'fps' | 'memory' | 'drawCalls';
  threshold: number;
  action:
    | 'reduceLOD'
    | 'disableShadows'
    | 'disablePostProcessing'
    | 'fallbackTo2D';
}

export interface UserPreferences {
  enableParticles: boolean;
  enableShadows: boolean;
  enablePostProcessing: boolean;
  audioEnabled: boolean;
  reducedMotion: boolean;
  performanceMode: 'auto' | 'high' | 'medium' | 'low';
}

// Asset Management Types
export interface AssetLibrary {
  models: {
    room: ModelAsset;
    furniture: ModelAsset[];
    decorative: ModelAsset[];
    interactive: ModelAsset[];
  };
  textures: {
    walls: TextureAsset[];
    floors: TextureAsset[];
    materials: TextureAsset[];
  };
  audio: {
    ambient: AudioAsset[];
    interactions: AudioAsset[];
    transitions: AudioAsset[];
  };
}

export interface ModelAsset {
  id: string;
  path: string;
  format: 'gltf' | 'fbx' | 'obj';
  size: number;
  optimized: boolean;
  lodLevels: LODLevel[];
}

export interface TextureAsset {
  id: string;
  path: string;
  format: 'jpg' | 'png' | 'webp' | 'ktx2';
  size: number;
  resolution: { width: number; height: number };
  compressed: boolean;
}

export interface AudioAsset {
  id: string;
  path: string;
  format: 'mp3' | 'ogg' | 'wav';
  size: number;
  duration: number;
}

export interface LODLevel {
  distance: number;
  triangles: number;
  path: string;
}

// Scene State Management
export interface SceneState {
  currentSection: SectionId;
  cameraPosition: Vector3;
  cameraTarget: Vector3;
  hoveredObject: string | null;
  selectedObject: string | null;
  isTransitioning: boolean;
  performanceMode: 'high' | 'medium' | 'low';
  userPreferences: UserPreferences;
  loadingProgress: number;
  assetsLoaded: boolean;
}

export type SectionId = 'about' | 'tech' | 'blog' | 'fashion' | 'merch';
