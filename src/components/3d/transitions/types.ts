import { SectionId } from '@/types';
import { Euler, Vector3 } from 'three';

export interface CameraPosition {
  position: Vector3;
  target: Vector3;
  rotation?: Euler;
}

export interface TransitionConfig {
  duration: number;
  easing: 'linear' | 'easeInOut' | 'easeIn' | 'easeOut' | 'bounce';
  fadeOverlay?: boolean;
  fadeOverlayColor?: string;
  fadeOverlayOpacity?: number;
}

export interface SectionTransition {
  from: SectionId | null;
  to: SectionId;
  camera: CameraPosition;
  config: TransitionConfig;
}

export interface TransitionState {
  isTransitioning: boolean;
  currentSection: SectionId | null;
  targetSection: SectionId | null;
  progress: number;
  fadeOpacity: number;
  loadingProgress: number;
}

export interface TransitionStore {
  transitionState: TransitionState;
  sectionCameraPositions: Map<SectionId, CameraPosition>;

  // Actions
  startTransition: (to: SectionId, config?: Partial<TransitionConfig>) => void;
  updateTransitionProgress: (progress: number) => void;
  completeTransition: () => void;
  setFadeOpacity: (opacity: number) => void;
  setLoadingProgress: (progress: number) => void;
  setSectionCameraPosition: (
    section: SectionId,
    position: CameraPosition
  ) => void;
  getSectionCameraPosition: (section: SectionId) => CameraPosition | undefined;
}

export type EasingFunction = (t: number) => number;
