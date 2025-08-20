import { Vector3 } from 'three';

// 3D Scene Types
export interface SceneManagerProps {
  activeSection: SectionId;
  onSectionChange: (section: SectionId) => void;
  performanceMode: PerformanceMode;
}

export interface SceneConfig {
  lighting: LightingConfig;
  environment: EnvironmentConfig;
  camera: CameraConfig;
  postProcessing: PostProcessingConfig;
}

export interface LightingConfig {
  ambient: {
    intensity: number;
    color: string;
  };
  directional: {
    intensity: number;
    color: string;
    position: Vector3;
    castShadow: boolean;
  };
  point: {
    intensity: number;
    color: string;
    position: Vector3;
    distance: number;
  }[];
}

export interface EnvironmentConfig {
  background: string;
  environment: string;
  fog?: {
    color: string;
    near: number;
    far: number;
  };
}

export interface CameraConfig {
  position: Vector3;
  target: Vector3;
  fov: number;
  near: number;
  far: number;
}

export interface PostProcessingConfig {
  enabled: boolean;
  bloom: {
    intensity: number;
    threshold: number;
    smoothWidth: number;
  };
  depthOfField: {
    enabled: boolean;
    focusDistance: number;
    focalLength: number;
    bokehScale: number;
  };
  colorGrading: {
    enabled: boolean;
    exposure: number;
    contrast: number;
    saturation: number;
  };
}

export type PerformanceMode = 'high' | 'medium' | 'low';
export type SectionId = 'about' | 'tech' | 'blog' | 'fashion' | 'merch';
