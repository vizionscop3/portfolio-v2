import { useFrame } from '@react-three/fiber';
import React, { useMemo, useRef } from 'react';
import { Color, Group } from 'three';

interface NeonWardrobePodProps {
  position?: [number, number, number];
  scale?: number;
  isActive?: boolean;
}

export const NeonWardrobePod: React.FC<NeonWardrobePodProps> = ({
  position = [0, 0, 0],
  scale = 1,
  isActive = false,
}) => {
  const groupRef = useRef<Group>(null);
  const podRef = useRef<Group>(null);
  const clothingRef = useRef<Group>(null);
  const ledStripRef = useRef<Group>(null);

  // Cyberpunk cyan and metallic colors
  const cyanColor = useMemo(() => new Color('#00FFFF'), []);
  const metallicColor = useMemo(() => new Color('#C0C0C0'), []);
  const darkMetalColor = useMemo(() => new Color('#2C2C2C'), []);

  // Clothing items for display
  const clothingItems = [
    {
      type: 'jacket',
      color: '#FF1493',
      position: [0, 0.3, 0] as [number, number, number],
    },
    {
      type: 'shirt',
      color: '#00FF41',
      position: [0.2, 0, 0] as [number, number, number],
    },
    {
      type: 'pants',
      color: '#FF8C00',
      position: [-0.2, -0.3, 0] as [number, number, number],
    },
    {
      type: 'shoes',
      color: '#8B5CF6',
      position: [0, -0.6, 0] as [number, number, number],
    },
  ];

  useFrame(state => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;

    // Subtle floating animation
    groupRef.current.position.y = Math.sin(time * 0.4) * 0.03;

    // Pod rotation
    if (podRef.current && isActive) {
      podRef.current.rotation.y = Math.sin(time * 0.5) * 0.05;
    }

    // Rotating clothing display
    if (clothingRef.current) {
      clothingRef.current.rotation.y = time * 0.3;
    }

    // LED strip pulsing
    if (ledStripRef.current) {
      const pulse = Math.sin(time * 4) * 0.3 + 0.7;
      ledStripRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Main pod structure */}
      <group ref={podRef}>
        {/* Cylindrical base */}
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.8, 0.9, 0.2, 16]} />
          <meshStandardMaterial
            color={darkMetalColor}
            metalness={0.9}
            roughness={0.1}
            emissive={cyanColor}
            emissiveIntensity={isActive ? 0.1 : 0.05}
          />
        </mesh>

        {/* Main cylindrical pod */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.7, 0.8, 2, 16]} />
          <meshStandardMaterial
            color={metallicColor}
            metalness={0.8}
            roughness={0.2}
            transparent
            opacity={0.3}
          />
        </mesh>

        {/* Pod frame */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.72, 0.82, 2.1, 16]} />
          <meshStandardMaterial
            color={darkMetalColor}
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.8}
          />
        </mesh>

        {/* Top cap */}
        <mesh position={[0, 1.1, 0]}>
          <cylinderGeometry args={[0.6, 0.7, 0.2, 16]} />
          <meshStandardMaterial
            color={darkMetalColor}
            metalness={0.9}
            roughness={0.1}
            emissive={cyanColor}
            emissiveIntensity={isActive ? 0.15 : 0.08}
          />
        </mesh>
      </group>

      {/* Rotating clothing display */}
      <group ref={clothingRef}>
        {clothingItems.map((item, index) => (
          <group key={index} position={item.position}>
            {/* Clothing item representation */}
            {item.type === 'jacket' && (
              <mesh>
                <boxGeometry args={[0.4, 0.3, 0.1]} />
                <meshStandardMaterial
                  color={item.color}
                  emissive={item.color}
                  emissiveIntensity={isActive ? 0.3 : 0.1}
                  transparent
                  opacity={0.8}
                />
              </mesh>
            )}

            {item.type === 'shirt' && (
              <mesh>
                <boxGeometry args={[0.3, 0.25, 0.08]} />
                <meshStandardMaterial
                  color={item.color}
                  emissive={item.color}
                  emissiveIntensity={isActive ? 0.3 : 0.1}
                  transparent
                  opacity={0.8}
                />
              </mesh>
            )}

            {item.type === 'pants' && (
              <mesh>
                <boxGeometry args={[0.25, 0.4, 0.08]} />
                <meshStandardMaterial
                  color={item.color}
                  emissive={item.color}
                  emissiveIntensity={isActive ? 0.3 : 0.1}
                  transparent
                  opacity={0.8}
                />
              </mesh>
            )}

            {item.type === 'shoes' && (
              <mesh>
                <boxGeometry args={[0.2, 0.1, 0.15]} />
                <meshStandardMaterial
                  color={item.color}
                  emissive={item.color}
                  emissiveIntensity={isActive ? 0.3 : 0.1}
                  transparent
                  opacity={0.8}
                />
              </mesh>
            )}

            {/* Holographic hanger */}
            <mesh position={[0, 0.2, 0]}>
              <cylinderGeometry args={[0.01, 0.01, 0.3, 8]} />
              <meshBasicMaterial
                color={cyanColor}
                transparent
                opacity={isActive ? 0.6 : 0.3}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* LED strip lighting */}
      <group ref={ledStripRef}>
        {/* Vertical LED strips */}
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const x = Math.cos(angle) * 0.75;
          const z = Math.sin(angle) * 0.75;

          return (
            <mesh key={i} position={[x, 0, z]} rotation={[0, angle, 0]}>
              <boxGeometry args={[0.02, 2, 0.05]} />
              <meshBasicMaterial
                color={cyanColor}
                transparent
                opacity={isActive ? 0.8 : 0.5}
              />
            </mesh>
          );
        })}

        {/* Horizontal LED rings */}
        {Array.from({ length: 5 }, (_, i) => (
          <mesh
            key={i}
            position={[0, -0.8 + i * 0.4, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <ringGeometry args={[0.7, 0.72, 32]} />
            <meshBasicMaterial
              color={cyanColor}
              transparent
              opacity={isActive ? 0.6 : 0.3}
            />
          </mesh>
        ))}
      </group>

      {/* Glass panels */}
      <group>
        {Array.from({ length: 4 }, (_, i) => {
          const angle = (i / 4) * Math.PI * 2;
          const x = Math.cos(angle) * 0.65;
          const z = Math.sin(angle) * 0.65;

          return (
            <mesh key={i} position={[x, 0, z]} rotation={[0, angle, 0]}>
              <planeGeometry args={[0.8, 1.8]} />
              <meshStandardMaterial
                color={cyanColor}
                transparent
                opacity={isActive ? 0.15 : 0.08}
                metalness={0.1}
                roughness={0.1}
              />
            </mesh>
          );
        })}
      </group>

      {/* Control panel */}
      <mesh position={[0.8, 0.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[0.3, 0.2, 0.05]} />
        <meshStandardMaterial
          color={darkMetalColor}
          emissive={cyanColor}
          emissiveIntensity={isActive ? 0.2 : 0.1}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Control panel buttons */}
      {Array.from({ length: 3 }, (_, i) => (
        <mesh
          key={i}
          position={[0.82, 0.55 - i * 0.08, 0]}
          rotation={[0, -Math.PI / 2, 0]}
        >
          <cylinderGeometry args={[0.02, 0.02, 0.02, 8]} />
          <meshBasicMaterial
            color={i === 0 ? '#FF1493' : i === 1 ? '#00FF41' : '#FF8C00'}
            transparent
            opacity={isActive ? 0.9 : 0.6}
          />
        </mesh>
      ))}

      {/* Holographic aura effect */}
      {isActive && (
        <mesh>
          <cylinderGeometry args={[1.5, 1.5, 2.5, 16]} />
          <meshBasicMaterial
            color={cyanColor}
            transparent
            opacity={0.05}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
};
