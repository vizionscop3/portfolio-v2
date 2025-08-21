import { Points } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import React, { useMemo, useRef } from 'react';
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  Mesh,
  MeshBasicMaterial,
} from 'three';

interface VisualFeedbackProps {
  isActive: boolean;
  intensity: number;
  color?: string;
  particleCount?: number;
  radius?: number;
}

export const VisualFeedback: React.FC<VisualFeedbackProps> = ({
  isActive,
  intensity,
  color = '#4ade80',
  particleCount = 50,
  radius = 2,
}) => {
  const pointsRef = useRef<ThreePoints>(null);
  const groupRef = useRef<Group>(null);

  // Create particle geometry
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const baseColor = new Color(color);

    for (let i = 0; i < particleCount; i++) {
      // Random spherical distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * Math.cbrt(Math.random());

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Vary particle colors slightly
      const colorVariation = 0.3;
      colors[i * 3] = baseColor.r + (Math.random() - 0.5) * colorVariation;
      colors[i * 3 + 1] = baseColor.g + (Math.random() - 0.5) * colorVariation;
      colors[i * 3 + 2] = baseColor.b + (Math.random() - 0.5) * colorVariation;
    }

    return { positions, colors };
  }, [particleCount, radius, color]);

  // Animate particles
  useFrame((state, delta) => {
    if (!pointsRef.current || !isActive) return;

    const geometry = pointsRef.current.geometry as BufferGeometry;
    const positionAttribute = geometry.getAttribute(
      'position'
    ) as BufferAttribute;
    const positions = positionAttribute.array as Float32Array;

    // Animate particles floating outward
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const time = state.clock.elapsedTime;

      // Add floating motion
      positions[i3] += Math.sin(time + i) * delta * 0.1;
      positions[i3 + 1] += Math.cos(time + i) * delta * 0.1;
      positions[i3 + 2] += Math.sin(time * 0.5 + i) * delta * 0.05;
    }

    positionAttribute.needsUpdate = true;

    // Rotate the entire particle system
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5 * intensity;
    }
  });

  if (!isActive) return null;

  return (
    <group ref={groupRef}>
      <Points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleCount}
            array={colors}
            itemSize={3}
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          transparent
          opacity={intensity * 0.8}
          vertexColors
          sizeAttenuation
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

interface RippleEffectProps {
  isActive: boolean;
  intensity: number;
  color?: string;
  maxRadius?: number;
}

export const RippleEffect: React.FC<RippleEffectProps> = ({
  isActive,
  intensity,
  color = '#4ade80',
  maxRadius = 3,
}) => {
  const ringRef = useRef<Group>(null);

  useFrame((state, _delta) => {
    if (!ringRef.current || !isActive) return;

    // Animate ripple expansion
    const time = state.clock.elapsedTime;
    const scale = (Math.sin(time * 4) * 0.5 + 0.5) * maxRadius * intensity;
    ringRef.current.scale.setScalar(scale);

    // Fade opacity based on scale
    const opacity = 1 - scale / maxRadius;
    if (ringRef.current.children[0]) {
      const material = (ringRef.current.children[0] as unknown).material;
      if (material) {
        material.opacity = opacity * intensity;
      }
    }
  });

  if (!isActive) return null;

  return (
    <group ref={ringRef}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.8, 1, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={intensity}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

interface PulseEffectProps {
  isActive: boolean;
  intensity: number;
  color?: string;
  pulseSpeed?: number;
}

export const PulseEffect: React.FC<PulseEffectProps> = ({
  isActive,
  intensity,
  color = '#4ade80',
  pulseSpeed = 2,
}) => {
  const sphereRef = useRef<Group>(null);

  useFrame(state => {
    if (!sphereRef.current || !isActive) return;

    const time = state.clock.elapsedTime;
    const pulse = Math.sin(time * pulseSpeed) * 0.5 + 0.5;
    const scale = 1 + pulse * intensity * 0.3;

    sphereRef.current.scale.setScalar(scale);

    // Update material opacity
    if (sphereRef.current.children[0]) {
      const mesh = sphereRef.current.children[0] as Mesh;
      const material = mesh.material as MeshBasicMaterial;
      if (material) {
        material.opacity = pulse * intensity * 0.5;
      }
    }
  });

  if (!isActive) return null;

  return (
    <group ref={sphereRef}>
      <mesh>
        <sphereGeometry args={[1.1, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={intensity * 0.3}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};
