import { SectionId } from '@/types';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import {
  CameraPosition,
  TransitionConfig,
  TransitionState,
  TransitionStore,
} from './types';

const initialTransitionState: TransitionState = {
  isTransitioning: false,
  currentSection: null,
  targetSection: null,
  progress: 0,
  fadeOpacity: 0,
  loadingProgress: 0,
};

const defaultTransitionConfig: TransitionConfig = {
  duration: 2.0,
  easing: 'easeInOut',
  fadeOverlay: true,
  fadeOverlayColor: '#000000',
  fadeOverlayOpacity: 0.3,
};

export const useTransitionStore = create<TransitionStore>()(
  subscribeWithSelector((set, get) => ({
    transitionState: initialTransitionState,
    sectionCameraPositions: new Map<SectionId, CameraPosition>(),

    startTransition: (to: SectionId, config?: Partial<TransitionConfig>) => {
      const currentState = get().transitionState;

      // Don't start new transition if already transitioning to the same section
      if (currentState.isTransitioning && currentState.targetSection === to) {
        return;
      }

      const mergedConfig = { ...defaultTransitionConfig, ...config };

      set({
        transitionState: {
          ...currentState,
          isTransitioning: true,
          targetSection: to,
          progress: 0,
          fadeOpacity: 0,
          loadingProgress: 0,
        },
      });

      // Simulate loading progress for section content
      let loadingProgress = 0;
      const loadingInterval = setInterval(() => {
        loadingProgress += 0.1;
        if (loadingProgress >= 1) {
          clearInterval(loadingInterval);
          loadingProgress = 1;
        }

        set(state => ({
          transitionState: {
            ...state.transitionState,
            loadingProgress,
          },
        }));
      }, mergedConfig.duration * 100); // Complete loading during transition
    },

    updateTransitionProgress: (progress: number) => {
      set(state => ({
        transitionState: {
          ...state.transitionState,
          progress,
        },
      }));
    },

    completeTransition: () => {
      set(state => {
        const newCurrentSection = state.transitionState.targetSection;

        return {
          transitionState: {
            ...state.transitionState,
            isTransitioning: false,
            currentSection: newCurrentSection,
            targetSection: null,
            progress: 1,
            fadeOpacity: 0,
            loadingProgress: 1,
          },
        };
      });
    },

    setFadeOpacity: (opacity: number) => {
      set(state => ({
        transitionState: {
          ...state.transitionState,
          fadeOpacity: opacity,
        },
      }));
    },

    setLoadingProgress: (progress: number) => {
      set(state => ({
        transitionState: {
          ...state.transitionState,
          loadingProgress: progress,
        },
      }));
    },

    setSectionCameraPosition: (
      section: SectionId,
      position: CameraPosition
    ) => {
      set(state => {
        const newPositions = new Map(state.sectionCameraPositions);
        newPositions.set(section, position);
        return { sectionCameraPositions: newPositions };
      });
    },

    getSectionCameraPosition: (section: SectionId) => {
      return get().sectionCameraPositions.get(section);
    },
  }))
);
