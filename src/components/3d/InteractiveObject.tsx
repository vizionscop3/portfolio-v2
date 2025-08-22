import { useFrame, useThree } from '@react-three/fiber';
import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Group, Vector3 } from 'three';
import { HoverEffects, PulseEffect, RippleEffect, VisualFeedback } from '.';
import { useInteractiveStore } from './store';
import { InteractiveObjectProps, ObjectState } from './types';
import { useKeyboardAccessibility } from '../accessibility/KeyboardAccessibilityProvider';
import { useElementAccessibility } from '../../hooks/useAccessibility';

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
  onRef,
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
  const { registerObject, unregisterObject, updateObject, currentFocus } =
    useKeyboardAccessibility();
  const { announceAction } = useElementAccessibility(id, tooltip);

  // Check if this object is currently focused via keyboard
  const isKeyboardFocused = currentFocus === id;

  // Register object with keyboard navigation system
  useEffect(() => {
    registerObject({
      id,
      position: { x: position.x, y: position.y, z: position.z },
      section: _section,
      tooltip,
      priority: 1,
      isVisible: true,
      isInteractable: true,
      ariaLabel: tooltip,
      ariaDescription: `Navigate to ${_section} section. ${tooltip}`,
    });

    return () => {
      unregisterObject(id);
    };
  }, [
    id,
    position.x,
    position.y,
    position.z,
    _section,
    tooltip,
    registerObject,
    unregisterObject,
  ]);

  // Update object properties when they change
  useEffect(() => {
    updateObject(id, {
      position: { x: position.x, y: position.y, z: position.z },
      tooltip,
      isVisible: true,
      isInteractable: true,
    });
  }, [id, position.x, position.y, position.z, tooltip, updateObject]);

  // Pass ref to parent for LOD system registration
  useEffect(() => {
    if (onRef && groupRef.current) {
      onRef(groupRef.current);
    }
    return () => {
      if (onRef) {
        onRef(null);
      }
    };
  }, [onRef]);

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

    // Announce hover for screen readers
    announceAction('hover', `Interactive ${tooltip} in ${_section} section`);

    onHover?.(true);
  }, [
    id,
    position,
    tooltip,
    _section,
    setHoveredObject,
    setTooltip,
    getScreenPosition,
    gl,
    onHover,
    announceAction,
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

    // Announce activation for screen readers
    announceAction('activate', `Navigating to ${_section} section`);

    onClick?.();
  }, [onClick, announceAction, _section]);

  // Animation frame for smooth hover effects
  useFrame((_state, delta) => {
    if (!groupRef.current) return;

    // Check if object should show as active (hovered or keyboard focused)
    const isActive = objectState.isHovered || isKeyboardFocused;

    // Animate glow intensity
    const targetGlow = isActive ? 1 : 0;
    setObjectState(prev => ({
      ...prev,
      glowIntensity:
        prev.glowIntensity + (targetGlow - prev.glowIntensity) * delta * 8,
    }));

    // Animate scale for hover effect
    const targetScale = isActive ? 1.05 : objectState.isClicked ? 0.95 : 1;
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
      // Add ARIA attributes for screen readers
      userData={{
        'aria-label': tooltip,
        'aria-describedby': `object-desc-${id}`,
        role: 'button',
        tabIndex: isKeyboardFocused ? 0 : -1,
      }}
    >
      <HoverEffects
        isHovered={objectState.isHovered || isKeyboardFocused}
        glowIntensity={objectState.glowIntensity}
        scaleMultiplier={1.05}
        rotationSpeed={0.3}
        glowColor={isKeyboardFocused ? '#FF00FF' : '#00FFFF'} // Magenta for keyboard focus
      >
        {children}
      </HoverEffects>

      {/* Advanced visual feedback effects */}
      <VisualFeedback
        isActive={objectState.isHovered || isKeyboardFocused}
        intensity={objectState.glowIntensity}
        color={isKeyboardFocused ? '#FF00FF' : '#00FFFF'} // Different color for keyboard focus
        particleCount={isKeyboardFocused ? 50 : 30} // More particles for keyboard focus
        radius={1.5}
      />

      <RippleEffect
        isActive={objectState.isClicked}
        intensity={1}
        color={isKeyboardFocused ? '#FF00FF' : '#00FFFF'}
        maxRadius={2}
      />

      <PulseEffect
        isActive={objectState.isHovered || isKeyboardFocused}
        intensity={objectState.glowIntensity}
        color={isKeyboardFocused ? '#FF00FF' : '#00FFFF'}
        pulseSpeed={isKeyboardFocused ? 3 : 2} // Faster pulse for keyboard focus
      />
    </group>
  );
};
