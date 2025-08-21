import { useFrame } from '@react-three/fiber';
import React, { useMemo, useRef } from 'react';
import { Color, Group } from 'three';

interface CyberpunkEffectsProps {
  isActive: boolean;
  intensity: number;
  color?: string;
  effectType?: 'hologram' | 'neon' | 'particle' | 'scan';
}

export const CyberpunkEffects: React.FC<CyberpunkEffectsProps> = ({
  isActive,
  intensity,
  color = '#00FFFF',
  effectType = 'hologram',
}) => {
  const groupRef = useRef<Group>(null);
  const effectColor = useMemo(() => new Color(color), [color]);

  useFrame(state => {
    if (!groupRef.current || !isActive) return;

    const time = state.clock.elapsedTime;

    switch (effectType) {
      case 'hologram': {
        // Holographic flickering effect
        const flicker = Math.sin(time * 20) * 0.1 + 0.9;
        groupRef.current.scale.setScalar(flicker * intensity);
        break;
      }

      case 'neon': {
        // Neon pulsing effect
        const pulse = Math.sin(time * 3) * 0.2 + 0.8;
        groupRef.current.scale.setScalar(pulse * intensity);
        break;
      }

      case 'particle': {
        // Particle swirling effect
        groupRef.current.rotation.y = time * 0.5;
        groupRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
        break;
      }

      case 'scan': {
        // Scanning line effect
        const scan = (Math.sin(time * 4) + 1) * 0.5;
        groupRef.current.position.y = scan * 2 - 1;
        break;
      }
    }
  });

  if (!isActive) return null;

  return (
    <group ref={groupRef}>
      {effectType === 'hologram' && (
        <HologramEffect color={effectColor} intensity={intensity} />
      )}
      {effectType === 'neon' && (
        <NeonEffect color={effectColor} intensity={intensity} />
      )}
      {effectType === 'particle' && (
        <ParticleStreamEffect color={effectColor} intensity={intensity} />
      )}
      {effectType === 'scan' && (
        <ScanLineEffect color={effectColor} intensity={intensity} />
      )}
    </group>
  );
};

const HologramEffect: React.FC<{ color: Color; intensity: number }> = ({
  color,
  intensity,
}) => {
  return (
    <>
      {/* Holographic distortion planes */}
      {Array.from({ length: 5 }, (_, i) => (
        <mesh key={i} position={[0, i * 0.2 - 0.4, 0]}>
          <planeGeometry args={[2, 0.05]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={intensity * 0.3 * (1 - i * 0.15)}
            depthWrite={false}
          />
        </mesh>
      ))}
    </>
  );
};

const NeonEffect: React.FC<{ color: Color; intensity: number }> = ({
  color,
  intensity,
}) => {
  return (
    <>
      {/* Neon glow rings */}
      {Array.from({ length: 3 }, (_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5 + i * 0.3, 0.6 + i * 0.3, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={intensity * 0.4 * (1 - i * 0.2)}
            depthWrite={false}
          />
        </mesh>
      ))}
    </>
  );
};

const ParticleStreamEffect: React.FC<{ color: Color; intensity: number }> = ({
  color,
  intensity,
}) => {
  const particleCount = 50;

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 0.5 + Math.random() * 1.5;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 2;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return pos;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color={color}
        transparent
        opacity={intensity * 0.8}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};

const ScanLineEffect: React.FC<{ color: Color; intensity: number }> = ({
  color,
  intensity,
}) => {
  return (
    <mesh>
      <planeGeometry args={[3, 0.02]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={intensity * 0.8}
        depthWrite={false}
      />
    </mesh>
  );
};
