import { useFrame } from '@react-three/fiber';
import React, { useMemo, useRef } from 'react';
import { Color, Group } from 'three';

interface AudioEngineeringStationProps {
  position?: [number, number, number];
  scale?: number;
  isActive?: boolean;
}

export const AudioEngineeringStation: React.FC<
  AudioEngineeringStationProps
> = ({ position = [0, 0, 0], scale = 1, isActive = false }) => {
  const groupRef = useRef<Group>(null);
  const consoleRef = useRef<Group>(null);
  const waveformsRef = useRef<Group>(null);
  const ledsRef = useRef<Group>(null);

  // Cyberpunk lime green and cyan colors
  const limeGreenColor = useMemo(() => new Color('#00FF41'), []);
  const cyanColor = useMemo(() => new Color('#00FFFF'), []);
  const darkMetalColor = useMemo(() => new Color('#1C1C1C'), []);

  useFrame(state => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;

    // Subtle floating animation
    groupRef.current.position.y = Math.sin(time * 0.3) * 0.02;

    // Console slight rotation
    if (consoleRef.current && isActive) {
      consoleRef.current.rotation.y = Math.sin(time * 0.2) * 0.02;
    }

    // Animated waveforms
    if (waveformsRef.current) {
      waveformsRef.current.rotation.z = Math.sin(time * 2) * 0.1;
    }

    // LED pulsing
    if (ledsRef.current) {
      const pulse = Math.sin(time * 3) * 0.2 + 0.8;
      ledsRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Main console base */}
      <group ref={consoleRef}>
        {/* Console desk */}
        <mesh position={[0, -0.3, 0]}>
          <boxGeometry args={[1.2, 0.1, 0.8]} />
          <meshStandardMaterial
            color={darkMetalColor}
            metalness={0.9}
            roughness={0.1}
            emissive={limeGreenColor}
            emissiveIntensity={isActive ? 0.1 : 0.05}
          />
        </mesh>

        {/* Main mixing console */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.0, 0.4, 0.6]} />
          <meshStandardMaterial
            color="#2C2C2C"
            metalness={0.8}
            roughness={0.2}
            emissive={darkMetalColor}
            emissiveIntensity={isActive ? 0.08 : 0.04}
          />
        </mesh>

        {/* Fader channels */}
        {Array.from({ length: 8 }, (_, i) => (
          <group key={i} position={[-0.35 + i * 0.1, 0.25, 0]}>
            {/* Fader track */}
            <mesh>
              <boxGeometry args={[0.02, 0.3, 0.02]} />
              <meshStandardMaterial
                color={darkMetalColor}
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>

            {/* Fader handle */}
            <mesh position={[0, Math.sin(i + Date.now() * 0.001) * 0.05, 0]}>
              <boxGeometry args={[0.04, 0.03, 0.03]} />
              <meshStandardMaterial
                color={limeGreenColor}
                emissive={limeGreenColor}
                emissiveIntensity={isActive ? 0.4 : 0.2}
              />
            </mesh>
          </group>
        ))}

        {/* Knobs and controls */}
        {Array.from({ length: 12 }, (_, i) => {
          const row = Math.floor(i / 4);
          const col = i % 4;
          return (
            <mesh key={i} position={[-0.3 + col * 0.2, 0.05 - row * 0.1, 0.25]}>
              <cylinderGeometry args={[0.03, 0.03, 0.02, 16]} />
              <meshStandardMaterial
                color={
                  i % 3 === 0
                    ? limeGreenColor
                    : i % 3 === 1
                      ? cyanColor
                      : '#FF8C00'
                }
                emissive={
                  i % 3 === 0
                    ? limeGreenColor
                    : i % 3 === 1
                      ? cyanColor
                      : '#FF8C00'
                }
                emissiveIntensity={isActive ? 0.3 : 0.15}
              />
            </mesh>
          );
        })}
      </group>

      {/* Holographic waveform displays */}
      <group ref={waveformsRef} position={[0, 0.6, 0]}>
        {/* Main waveform display */}
        <mesh>
          <planeGeometry args={[0.8, 0.4]} />
          <meshBasicMaterial
            color={limeGreenColor}
            transparent
            opacity={isActive ? 0.6 : 0.3}
            depthWrite={false}
          />
        </mesh>

        {/* Waveform lines */}
        {Array.from({ length: 20 }, (_, i) => {
          const height = Math.sin(i * 0.5 + Date.now() * 0.005) * 0.15 + 0.15;
          return (
            <mesh key={i} position={[-0.35 + i * 0.04, 0, 0.01]}>
              <boxGeometry args={[0.02, height, 0.01]} />
              <meshBasicMaterial
                color={limeGreenColor}
                transparent
                opacity={isActive ? 0.8 : 0.4}
              />
            </mesh>
          );
        })}

        {/* Frequency analyzer */}
        <mesh position={[0, -0.3, 0]}>
          <planeGeometry args={[0.6, 0.2]} />
          <meshBasicMaterial
            color={cyanColor}
            transparent
            opacity={isActive ? 0.4 : 0.2}
            depthWrite={false}
          />
        </mesh>

        {/* Frequency bars */}
        {Array.from({ length: 15 }, (_, i) => {
          const height = Math.random() * 0.08 + 0.02;
          return (
            <mesh key={i} position={[-0.25 + i * 0.035, -0.3, 0.01]}>
              <boxGeometry args={[0.02, height, 0.01]} />
              <meshBasicMaterial
                color={cyanColor}
                transparent
                opacity={isActive ? 0.7 : 0.35}
              />
            </mesh>
          );
        })}
      </group>

      {/* LED strip lighting */}
      <group ref={ledsRef}>
        {/* Top edge LEDs */}
        <mesh position={[0, 0.5, 0.3]}>
          <boxGeometry args={[1.0, 0.02, 0.02]} />
          <meshBasicMaterial
            color={limeGreenColor}
            transparent
            opacity={isActive ? 0.8 : 0.4}
          />
        </mesh>

        {/* Side edge LEDs */}
        <mesh position={[-0.5, 0, 0.3]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.8, 0.02, 0.02]} />
          <meshBasicMaterial
            color={cyanColor}
            transparent
            opacity={isActive ? 0.8 : 0.4}
          />
        </mesh>

        <mesh position={[0.5, 0, 0.3]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.8, 0.02, 0.02]} />
          <meshBasicMaterial
            color={cyanColor}
            transparent
            opacity={isActive ? 0.8 : 0.4}
          />
        </mesh>

        {/* Bottom console LEDs */}
        {Array.from({ length: 6 }, (_, i) => (
          <mesh key={i} position={[-0.25 + i * 0.1, -0.35, 0.3]}>
            <cylinderGeometry args={[0.01, 0.01, 0.02, 8]} />
            <meshBasicMaterial
              color={i % 2 === 0 ? limeGreenColor : '#FF8C00'}
              transparent
              opacity={isActive ? 0.9 : 0.5}
            />
          </mesh>
        ))}
      </group>

      {/* Speakers */}
      <group>
        {/* Left speaker */}
        <mesh position={[-0.8, 0.2, -0.5]}>
          <boxGeometry args={[0.2, 0.4, 0.15]} />
          <meshStandardMaterial
            color={darkMetalColor}
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>

        {/* Left speaker cone */}
        <mesh position={[-0.8, 0.2, -0.42]}>
          <cylinderGeometry args={[0.08, 0.06, 0.05, 16]} />
          <meshStandardMaterial
            color="#333333"
            metalness={0.1}
            roughness={0.8}
          />
        </mesh>

        {/* Right speaker */}
        <mesh position={[0.8, 0.2, -0.5]}>
          <boxGeometry args={[0.2, 0.4, 0.15]} />
          <meshStandardMaterial
            color={darkMetalColor}
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>

        {/* Right speaker cone */}
        <mesh position={[0.8, 0.2, -0.42]}>
          <cylinderGeometry args={[0.08, 0.06, 0.05, 16]} />
          <meshStandardMaterial
            color="#333333"
            metalness={0.1}
            roughness={0.8}
          />
        </mesh>
      </group>

      {/* Headphones */}
      <mesh position={[0.4, 0.3, 0.3]} rotation={[0, Math.PI / 4, 0]}>
        <torusGeometry args={[0.08, 0.02, 8, 16]} />
        <meshStandardMaterial
          color={limeGreenColor}
          emissive={limeGreenColor}
          emissiveIntensity={isActive ? 0.3 : 0.15}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>

      {/* Microphone */}
      <group position={[-0.3, 0.4, 0.2]}>
        {/* Mic stand */}
        <mesh>
          <cylinderGeometry args={[0.01, 0.01, 0.3, 8]} />
          <meshStandardMaterial
            color={darkMetalColor}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Mic capsule */}
        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshStandardMaterial
            color={cyanColor}
            emissive={cyanColor}
            emissiveIntensity={isActive ? 0.4 : 0.2}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Holographic aura effect */}
      {isActive && (
        <mesh>
          <boxGeometry args={[2.5, 1.5, 1.5]} />
          <meshBasicMaterial
            color={limeGreenColor}
            transparent
            opacity={0.05}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
};
