import { useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion-3d';
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

  // Animate rotation on hover
  useFrame((state, delta) => {
    if (groupRef.current && isHovered && rotationSpeed > 0) {
      groupRef.current.rotation.y += delta * rotationSpeed;
    }

    // Animate glow pulsing
    if (glowRef.current && glowIntensity > 0) {
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.1 + 0.9;
      glowRef.current.scale.setScalar(1 + glowIntensity * 0.1 * pulse);
    }
  });

  return (
    <motion.group
      ref={groupRef}
      animate={{
        scale: isHovered ? scaleMultiplier : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
    >
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
    </motion.group>
  );
};
