import { SectionId } from '@/types';
import { useFrame, useThree } from '@react-three/fiber';
import React, { useEffect, useRef } from 'react';
import { Vector3 } from 'three';
import { easingFunctions, interpolateVector3 } from './easingFunctions';
import { useTransitionStore } from './store';
import { CameraPosition, TransitionConfig } from './types';

interface TransitionManagerProps {
  children?: React.ReactNode;
}

export const TransitionManager: React.FC<TransitionManagerProps> = ({
  children,
}) => {
  const { camera, clock } = useThree();
  const {
    transitionState,
    sectionCameraPositions,
    updateTransitionProgress,
    completeTransition,
    setFadeOpacity,
  } = useTransitionStore();

  const startTimeRef = useRef<number>(0);
  const startCameraRef = useRef<CameraPosition | null>(null);
  const targetCameraRef = useRef<CameraPosition | null>(null);
  const configRef = useRef<TransitionConfig | null>(null);

  // Initialize default camera positions for each section
  useEffect(() => {
    const { setSectionCameraPosition } = useTransitionStore.getState();

    // Define camera positions for each portfolio section
    const defaultPositions: Record<SectionId, CameraPosition> = {
      about: {
        position: new Vector3(-1, 2, 3),
        target: new Vector3(-1, 0.8, -1.2), // Focus on desk area with personal items
      },
      tech: {
        position: new Vector3(-3, 2.5, 1),
        target: new Vector3(-2, 0.8, -1), // Focus on holographic computer
      },
      blog: {
        position: new Vector3(3, 2, 2),
        target: new Vector3(2, 0.6, 1), // Focus on digital codex/book
      },
      fashion: {
        position: new Vector3(-4, 2, 3),
        target: new Vector3(-3, 1, 2), // Focus on neon wardrobe pod
      },
      merch: {
        position: new Vector3(4, 3, -1),
        target: new Vector3(3, 1.5, -2), // Focus on holographic merchandise display
      },
    };

    Object.entries(defaultPositions).forEach(([section, position]) => {
      setSectionCameraPosition(section as SectionId, position);
    });
  }, []);

  // Handle transition animation
  useFrame(state => {
    if (!transitionState.isTransitioning || !configRef.current) return;

    const elapsed = state.clock.elapsedTime - startTimeRef.current;
    const progress = Math.min(elapsed / configRef.current.duration, 1);

    // Apply easing function
    const easingFn =
      easingFunctions[configRef.current.easing] || easingFunctions.easeInOut;
    const easedProgress = easingFn(progress);

    // Update transition progress
    updateTransitionProgress(easedProgress);

    // Interpolate camera position and target
    if (startCameraRef.current && targetCameraRef.current) {
      const newPosition = interpolateVector3(
        startCameraRef.current.position,
        targetCameraRef.current.position,
        easedProgress
      );

      const newTarget = interpolateVector3(
        startCameraRef.current.target,
        targetCameraRef.current.target,
        easedProgress
      );

      // Apply camera position
      camera.position.copy(newPosition);
      camera.lookAt(newTarget);
    }

    // Handle fade overlay
    if (configRef.current.fadeOverlay) {
      const fadeProgress =
        progress < 0.5
          ? progress * 2 // Fade in during first half
          : (1 - progress) * 2; // Fade out during second half

      setFadeOpacity(
        fadeProgress * (configRef.current.fadeOverlayOpacity || 0.8)
      );
    }

    // Complete transition when done
    if (progress >= 1) {
      completeTransition();
      startCameraRef.current = null;
      targetCameraRef.current = null;
      configRef.current = null;
    }
  });

  // Listen for transition start
  useEffect(() => {
    const unsubscribe = useTransitionStore.subscribe(
      state => state.transitionState,
      (transitionState, prevTransitionState) => {
        if (
          transitionState.isTransitioning &&
          !prevTransitionState.isTransitioning &&
          transitionState.targetSection
        ) {
          // Start new transition
          const targetPosition = sectionCameraPositions.get(
            transitionState.targetSection
          );

          if (targetPosition) {
            startTimeRef.current = clock.elapsedTime;

            // Store current camera state as start position
            startCameraRef.current = {
              position: camera.position.clone(),
              target: new Vector3(0, 0, 0), // Default target, could be improved
            };

            targetCameraRef.current = targetPosition;

            // Default transition config
            configRef.current = {
              duration: 2.0,
              easing: 'easeInOut',
              fadeOverlay: true,
              fadeOverlayColor: '#000000',
              fadeOverlayOpacity: 0.3,
            };
          }
        }
      }
    );

    return unsubscribe;
  }, [camera, sectionCameraPositions, clock.elapsedTime]);

  return <>{children}</>;
};

export default TransitionManager;
