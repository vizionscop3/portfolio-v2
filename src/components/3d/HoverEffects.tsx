import { useFrame } from '@react-three/fiber';
import React, { useMemo, useRef } from 'react';
import { Color, Group } from 'three';

interface HoverEffectsProps {
  isHovered: boolean;
  glowIntensity: number;
  scaleMultiplier: number;
  rotationSpeed?: number;
  glowColor?: string;
  children: React.ReactNode;
}

export const HoverEffects: React.FC<HoverEffectsProps> = ({
  isHovered,
  glowIntensity,
  scaleMultiplier,
  rotationSpeed = 0.5,
  glowColor = '#4ade80',
  children,
}) => {
  const groupRef = useRef<Group>(null);
  const glowRef = useRef<Group>(null);

  // Create glow color
  const color = useMemo(() => new Color(glowColor), [glowColor]);

  // Animate rotation and scale on hover
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Rotation animation
      if (isHovered && rotationSpeed > 0) {
        groupRef.current.rotation.y += delta * rotationSpeed;
      }

      // Scale animation
      const targetScale = isHovered ? scaleMultiplier : 1;
      const currentScale = groupRef.current.scale.x;
      const newScale = currentScale + (targetScale - currentScale) * delta * 8;
      groupRef.current.scale.setScalar(newScale);
    }

    // Animate glow pulsing
    if (glowRef.current && glowIntensity > 0) {
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.1 + 0.9;
      glowRef.current.scale.setScalar(1 + glowIntensity * 0.1 * pulse);
    }
  });

  return (
    <group ref={groupRef}>
      {children}

      {/* Glow effect */}
      {glowIntensity > 0.01 && (
        <group ref={glowRef}>
          <mesh>
            <sphereGeometry args={[1.2, 16, 16]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={glowIntensity * 0.3}
              depthWrite={false}
            />
          </mesh>
        </group>
      )}
    </group>
  );
};
