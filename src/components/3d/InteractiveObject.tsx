import { useFrame, useThree } from '@react-three/fiber';
import React, { useCallback, useRef, useState } from 'react';
import { Group, Vector3 } from 'three';
import { HoverEffects, PulseEffect, RippleEffect, VisualFeedback } from '.';
import { useInteractiveStore } from './store';
import { InteractiveObjectProps, ObjectState } from './types';

export const InteractiveObject: React.FC<InteractiveObjectProps> = ({
  id,
  position,
  rotation,
  scale = new Vector3(1, 1, 1),
  tooltip,
  section: _section,
  children,
  onClick,
  onHover,
}) => {
  const groupRef = useRef<Group>(null);
  const { camera, gl } = useThree();
  const [objectState, setObjectState] = useState<ObjectState>({
    isHovered: false,
    isClicked: false,
    glowIntensity: 0,
    scale: 1,
  });

  const { setHoveredObject, setTooltip } = useInteractiveStore();

  // Convert screen coordinates to world coordinates for tooltip positioning
  const getScreenPosition = useCallback(
    (worldPosition: Vector3) => {
      const vector = worldPosition.clone();
      vector.project(camera);

      const x = (vector.x * 0.5 + 0.5) * gl.domElement.clientWidth;
      const y = (vector.y * -0.5 + 0.5) * gl.domElement.clientHeight;

      return { x, y };
    },
    [camera, gl]
  );

  const handlePointerEnter = useCallback(() => {
    if (!groupRef.current) return;

    setObjectState(prev => ({ ...prev, isHovered: true }));
    setHoveredObject(id);

    // Get screen position for tooltip
    const screenPos = getScreenPosition(position);
    setTooltip({
      text: tooltip,
      position: screenPos,
      visible: true,
    });

    // Change cursor to pointer
    gl.domElement.style.cursor = 'pointer';

    onHover?.(true);
  }, [
    id,
    position,
    tooltip,
    setHoveredObject,
    setTooltip,
    getScreenPosition,
    gl,
    onHover,
  ]);

  const handlePointerLeave = useCallback(() => {
    setObjectState(prev => ({ ...prev, isHovered: false }));
    setHoveredObject(null);
    setTooltip({
      text: '',
      position: { x: 0, y: 0 },
      visible: false,
    });

    // Reset cursor
    gl.domElement.style.cursor = 'auto';

    onHover?.(false);
  }, [setHoveredObject, setTooltip, gl, onHover]);

  const handleClick = useCallback(() => {
    setObjectState(prev => ({ ...prev, isClicked: true }));

    // Reset click state after animation
    setTimeout(() => {
      setObjectState(prev => ({ ...prev, isClicked: false }));
    }, 200);

    onClick?.();
  }, [onClick]);

  // Animation frame for smooth hover effects
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Animate glow intensity
    const targetGlow = objectState.isHovered ? 1 : 0;
    setObjectState(prev => ({
      ...prev,
      glowIntensity:
        prev.glowIntensity + (targetGlow - prev.glowIntensity) * delta * 8,
    }));

    // Animate scale for hover effect
    const targetScale = objectState.isHovered
      ? 1.05
      : objectState.isClicked
        ? 0.95
        : 1;
    setObjectState(prev => ({
      ...prev,
      scale: prev.scale + (targetScale - prev.scale) * delta * 10,
    }));

    // Apply scale to the group
    groupRef.current.scale.setScalar(objectState.scale);
  });

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
    >
      <HoverEffects
        isHovered={objectState.isHovered}
        glowIntensity={objectState.glowIntensity}
        scaleMultiplier={1.05}
        rotationSpeed={0.3}
        glowColor="#4ade80"
      >
        {children}
      </HoverEffects>

      {/* Advanced visual feedback effects */}
      <VisualFeedback
        isActive={objectState.isHovered}
        intensity={objectState.glowIntensity}
        color="#4ade80"
        particleCount={30}
        radius={1.5}
      />

      <RippleEffect
        isActive={objectState.isClicked}
        intensity={1}
        color="#4ade80"
        maxRadius={2}
      />

      <PulseEffect
        isActive={objectState.isHovered}
        intensity={objectState.glowIntensity}
        color="#4ade80"
        pulseSpeed={2}
      />
    </group>
  );
};
