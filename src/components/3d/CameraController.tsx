import { OrbitControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { SectionId } from '../../types/scene';

interface CameraPosition {
  position: THREE.Vector3;
  target: THREE.Vector3;
  fov?: number;
}

interface CameraControllerProps {
  activeSection: SectionId;
  onSectionChange?: (section: SectionId) => void;
  enableControls?: boolean;
  transitionDuration?: number;
}

// Predefined camera positions for each section
const CAMERA_POSITIONS: Record<SectionId, CameraPosition> = {
  about: {
    position: new THREE.Vector3(0, 5, 10),
    target: new THREE.Vector3(0, 2, 0),
    fov: 75,
  },
  tech: {
    position: new THREE.Vector3(-3, 3, -2),
    target: new THREE.Vector3(-3, 1.5, -4),
    fov: 60,
  },
  blog: {
    position: new THREE.Vector3(3, 2.5, 4),
    target: new THREE.Vector3(3, 1.2, 2),
    fov: 65,
  },
  fashion: {
    position: new THREE.Vector3(6, 4, -2),
    target: new THREE.Vector3(4, 2, -4),
    fov: 70,
  },
  merch: {
    position: new THREE.Vector3(-4, 3, 4),
    target: new THREE.Vector3(-4, 1.5, 2),
    fov: 65,
  },
};

const CameraController: React.FC<CameraControllerProps> = ({
  activeSection,
  onSectionChange,
  enableControls = true,
  transitionDuration = 2.0,
}) => {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();
  const perspectiveCamera = camera as THREE.PerspectiveCamera;
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [targetPosition, setTargetPosition] = useState<CameraPosition | null>(
    null
  );
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [startPosition, setStartPosition] = useState<CameraPosition | null>(
    null
  );

  // Initialize camera position
  useEffect(() => {
    const initialPosition = CAMERA_POSITIONS[activeSection];
    perspectiveCamera.position.copy(initialPosition.position);
    perspectiveCamera.lookAt(initialPosition.target);
    if (initialPosition.fov) {
      perspectiveCamera.fov = initialPosition.fov;
      perspectiveCamera.updateProjectionMatrix();
    }
  }, []);

  // Handle section changes
  useEffect(() => {
    const newPosition = CAMERA_POSITIONS[activeSection];

    if (!isTransitioning) {
      // Start transition
      setStartPosition({
        position: perspectiveCamera.position.clone(),
        target:
          controlsRef.current?.target?.clone() || new THREE.Vector3(0, 0, 0),
        fov: perspectiveCamera.fov,
      });
      setTargetPosition(newPosition);
      setIsTransitioning(true);
      setTransitionProgress(0);

      // Disable controls during transition
      if (controlsRef.current) {
        controlsRef.current.enabled = false;
      }
    }
  }, [activeSection, isTransitioning, camera]);

  // Smooth camera transitions
  useFrame((_state, delta) => {
    if (isTransitioning && targetPosition && startPosition) {
      const progress = Math.min(
        transitionProgress + delta / transitionDuration,
        1
      );
      setTransitionProgress(progress);

      // Easing function (ease-in-out cubic)
      const easeInOutCubic = (t: number) => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };

      const easedProgress = easeInOutCubic(progress);

      // Interpolate camera position
      perspectiveCamera.position.lerpVectors(
        startPosition.position,
        targetPosition.position,
        easedProgress
      );

      // Interpolate camera target (look-at point)
      const currentTarget = new THREE.Vector3().lerpVectors(
        startPosition.target,
        targetPosition.target,
        easedProgress
      );

      // Interpolate FOV
      if (targetPosition.fov && startPosition.fov) {
        perspectiveCamera.fov = THREE.MathUtils.lerp(
          startPosition.fov,
          targetPosition.fov,
          easedProgress
        );
        perspectiveCamera.updateProjectionMatrix();
      }

      // Update controls target
      if (controlsRef.current) {
        controlsRef.current.target.copy(currentTarget);
        controlsRef.current.update();
      }

      // Complete transition
      if (progress >= 1) {
        setIsTransitioning(false);
        setTransitionProgress(0);
        setTargetPosition(null);
        setStartPosition(null);

        // Re-enable controls
        if (controlsRef.current) {
          controlsRef.current.enabled = enableControls;
        }
      }
    }
  });

  // Handle manual camera movement (when user controls are enabled)
  const handleControlsChange = () => {
    if (!isTransitioning && controlsRef.current && onSectionChange) {
      // Check if camera is close to any section's position
      const currentPosition = perspectiveCamera.position;
      const threshold = 3; // Distance threshold for section detection

      for (const [sectionId, sectionPosition] of Object.entries(
        CAMERA_POSITIONS
      )) {
        const distance = currentPosition.distanceTo(sectionPosition.position);
        if (distance < threshold && sectionId !== activeSection) {
          onSectionChange(sectionId as SectionId);
          break;
        }
      }
    }
  };

  return (
    <OrbitControls
      ref={controlsRef}
      enabled={enableControls && !isTransitioning}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minDistance={2}
      maxDistance={20}
      minPolarAngle={0}
      maxPolarAngle={Math.PI / 2.2} // Prevent camera from going below floor
      dampingFactor={0.05}
      enableDamping={true}
      target={CAMERA_POSITIONS[activeSection].target}
      onChange={handleControlsChange}
      // Keyboard controls
      keys={{
        LEFT: 'ArrowLeft',
        UP: 'ArrowUp',
        RIGHT: 'ArrowRight',
        BOTTOM: 'ArrowDown',
      }}
      mouseButtons={{
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN,
      }}
      touches={{
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN,
      }}
    />
  );
};

export default CameraController;
