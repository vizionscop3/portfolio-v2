import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import React, { useMemo, useRef } from 'react';
import { Color, Group } from 'three';

interface HolographicComputerProps {
  position?: [number, number, number];
  scale?: number;
  isActive?: boolean;
}

export const HolographicComputer: React.FC<HolographicComputerProps> = ({
  position = [0, 0, 0],
  scale = 1,
  isActive = false,
}) => {
  const groupRef = useRef<Group>(null);
  const screenRef = useRef<Group>(null);
  const particlesRef = useRef<Group>(null);
  const codeTextRef = useRef<Group>(null);

  // Cyberpunk cyan color
  const cyanColor = useMemo(() => new Color('#00FFFF'), []);
  const blueColor = useMemo(() => new Color('#0080FF'), []);

  // Animated code text lines
  const codeLines = [
    'const portfolio = {',
    '  skills: ["React", "Three.js"],',
    '  projects: [...],',
    '  experience: "5+ years"',
    '};',
  ];

  useFrame(state => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;

    // Floating animation
    groupRef.current.position.y = Math.sin(time * 0.5) * 0.05;

    // Screen glow pulsing
    if (screenRef.current) {
      const pulse = Math.sin(time * 2) * 0.1 + 0.9;
      screenRef.current.scale.setScalar(pulse);
    }

    // Particle rotation
    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.3;
      particlesRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
    }

    // Code text scrolling effect
    if (codeTextRef.current) {
      codeTextRef.current.rotation.y = Math.sin(time * 0.1) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Base computer structure */}
      <group>
        {/* Main computer base */}
        <mesh position={[0, -0.3, 0]}>
          <boxGeometry args={[0.8, 0.1, 0.6]} />
          <meshStandardMaterial
            color="#1A0B2E"
            emissive={cyanColor}
            emissiveIntensity={isActive ? 0.1 : 0.05}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Holographic screens */}
        <group ref={screenRef}>
          {/* Main screen */}
          <mesh position={[0, 0.2, 0]} rotation={[0, 0, 0]}>
            <planeGeometry args={[1.2, 0.8]} />
            <meshBasicMaterial
              color={cyanColor}
              transparent
              opacity={isActive ? 0.7 : 0.3}
              depthWrite={false}
            />
          </mesh>

          {/* Side screens */}
          <mesh position={[-0.7, 0.1, 0.2]} rotation={[0, Math.PI / 6, 0]}>
            <planeGeometry args={[0.6, 0.4]} />
            <meshBasicMaterial
              color={blueColor}
              transparent
              opacity={isActive ? 0.5 : 0.2}
              depthWrite={false}
            />
          </mesh>

          <mesh position={[0.7, 0.1, 0.2]} rotation={[0, -Math.PI / 6, 0]}>
            <planeGeometry args={[0.6, 0.4]} />
            <meshBasicMaterial
              color={blueColor}
              transparent
              opacity={isActive ? 0.5 : 0.2}
              depthWrite={false}
            />
          </mesh>
        </group>

        {/* Holographic code text */}
        <group ref={codeTextRef} position={[0, 0.2, 0.01]}>
          {codeLines.map((line, index) => (
            <Text
              key={index}
              position={[-0.5, 0.3 - index * 0.12, 0]}
              fontSize={0.08}
              color={cyanColor}
              anchorX="left"
              anchorY="middle"
              material-transparent={true}
              material-opacity={isActive ? 0.8 : 0.4}
            >
              {line}
            </Text>
          ))}
        </group>

        {/* Floating data particles */}
        <group ref={particlesRef}>
          {Array.from({ length: 20 }, (_, i) => {
            const angle = (i / 20) * Math.PI * 2;
            const radius = 1.5;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const y = (Math.random() - 0.5) * 0.5;

            return (
              <mesh key={i} position={[x, y, z]}>
                <sphereGeometry args={[0.02, 8, 8]} />
                <meshBasicMaterial
                  color={cyanColor}
                  transparent
                  opacity={isActive ? 0.6 : 0.3}
                />
              </mesh>
            );
          })}
        </group>

        {/* Neon edge lighting */}
        <group>
          {/* Top edge */}
          <mesh position={[0, 0.6, 0]}>
            <boxGeometry args={[1.4, 0.02, 0.02]} />
            <meshBasicMaterial
              color={cyanColor}
              transparent
              opacity={isActive ? 0.8 : 0.4}
            />
          </mesh>

          {/* Side edges */}
          <mesh position={[-0.7, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.8, 0.02, 0.02]} />
            <meshBasicMaterial
              color={cyanColor}
              transparent
              opacity={isActive ? 0.8 : 0.4}
            />
          </mesh>

          <mesh position={[0.7, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.8, 0.02, 0.02]} />
            <meshBasicMaterial
              color={cyanColor}
              transparent
              opacity={isActive ? 0.8 : 0.4}
            />
          </mesh>
        </group>

        {/* Holographic glow effect */}
        {isActive && (
          <mesh>
            <sphereGeometry args={[2, 16, 16]} />
            <meshBasicMaterial
              color={cyanColor}
              transparent
              opacity={0.1}
              depthWrite={false}
            />
          </mesh>
        )}
      </group>
    </group>
  );
};
