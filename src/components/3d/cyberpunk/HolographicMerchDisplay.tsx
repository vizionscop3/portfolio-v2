import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import React, { useMemo, useRef } from 'react';
import { Color, Group } from 'three';

interface HolographicMerchDisplayProps {
  position?: [number, number, number];
  scale?: number;
  isActive?: boolean;
}

export const HolographicMerchDisplay: React.FC<
  HolographicMerchDisplayProps
> = ({ position = [0, 0, 0], scale = 1, isActive = false }) => {
  const groupRef = useRef<Group>(null);
  const displayRef = useRef<Group>(null);
  const productsRef = useRef<Group>(null);
  const priceTagsRef = useRef<Group>(null);

  // Cyberpunk hot pink and orange colors
  const hotPinkColor = useMemo(() => new Color('#FF1493'), []);
  const orangeColor = useMemo(() => new Color('#FF8C00'), []);
  const transparentColor = useMemo(() => new Color('#00FFFF'), []);

  // Merchandise items for display
  const merchItems = [
    {
      name: 'Cyber Tee',
      price: '$29.99',
      color: '#FF1493',
      position: [0, 0.3, 0] as [number, number, number],
      rotation: [0, 0, 0] as [number, number, number],
    },
    {
      name: 'Neon Hoodie',
      price: '$59.99',
      color: '#FF8C00',
      position: [0.4, 0, 0] as [number, number, number],
      rotation: [0, Math.PI / 4, 0] as [number, number, number],
    },
    {
      name: 'Tech Mug',
      price: '$19.99',
      color: '#00FFFF',
      position: [-0.4, -0.2, 0] as [number, number, number],
      rotation: [0, -Math.PI / 4, 0] as [number, number, number],
    },
    {
      name: 'Code Sticker',
      price: '$4.99',
      color: '#8B5CF6',
      position: [0, -0.4, 0.2] as [number, number, number],
      rotation: [Math.PI / 6, 0, 0] as [number, number, number],
    },
  ];

  useFrame(state => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;

    // Floating animation
    groupRef.current.position.y = Math.sin(time * 0.5) * 0.06;

    // Display platform rotation
    if (displayRef.current) {
      displayRef.current.rotation.y = time * 0.2;
    }

    // Product rotation
    if (productsRef.current) {
      productsRef.current.rotation.y = time * 0.3;
    }

    // Price tags floating animation
    if (priceTagsRef.current) {
      priceTagsRef.current.position.y = Math.sin(time * 2) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Display platform */}
      <group ref={displayRef}>
        {/* Base platform */}
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.8, 0.9, 0.1, 16]} />
          <meshStandardMaterial
            color="#1A0B2E"
            emissive={hotPinkColor}
            emissiveIntensity={isActive ? 0.15 : 0.08}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Holographic display rings */}
        {Array.from({ length: 3 }, (_, i) => (
          <mesh
            key={i}
            position={[0, -0.3 + i * 0.3, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <ringGeometry args={[0.6 + i * 0.1, 0.65 + i * 0.1, 32]} />
            <meshBasicMaterial
              color={
                i === 0
                  ? hotPinkColor
                  : i === 1
                    ? orangeColor
                    : transparentColor
              }
              transparent
              opacity={isActive ? 0.6 : 0.3}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      {/* Floating products */}
      <group ref={productsRef}>
        {merchItems.map((item, index) => (
          <group key={index} position={item.position} rotation={item.rotation}>
            {/* Product representation */}
            {item.name.includes('Tee') && (
              <mesh>
                <boxGeometry args={[0.3, 0.25, 0.05]} />
                <meshStandardMaterial
                  color={item.color}
                  emissive={item.color}
                  emissiveIntensity={isActive ? 0.4 : 0.2}
                  transparent
                  opacity={0.8}
                />
              </mesh>
            )}

            {item.name.includes('Hoodie') && (
              <mesh>
                <boxGeometry args={[0.35, 0.3, 0.08]} />
                <meshStandardMaterial
                  color={item.color}
                  emissive={item.color}
                  emissiveIntensity={isActive ? 0.4 : 0.2}
                  transparent
                  opacity={0.8}
                />
              </mesh>
            )}

            {item.name.includes('Mug') && (
              <mesh>
                <cylinderGeometry args={[0.08, 0.1, 0.15, 16]} />
                <meshStandardMaterial
                  color={item.color}
                  emissive={item.color}
                  emissiveIntensity={isActive ? 0.4 : 0.2}
                  transparent
                  opacity={0.8}
                />
              </mesh>
            )}

            {item.name.includes('Sticker') && (
              <mesh>
                <boxGeometry args={[0.15, 0.15, 0.02]} />
                <meshStandardMaterial
                  color={item.color}
                  emissive={item.color}
                  emissiveIntensity={isActive ? 0.4 : 0.2}
                  transparent
                  opacity={0.8}
                />
              </mesh>
            )}

            {/* Product hologram effect */}
            <mesh>
              <boxGeometry args={[0.4, 0.4, 0.4]} />
              <meshBasicMaterial
                color={item.color}
                transparent
                opacity={isActive ? 0.1 : 0.05}
                depthWrite={false}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* Price tags */}
      <group ref={priceTagsRef}>
        {merchItems.map((item, index) => (
          <group
            key={index}
            position={[
              item.position[0],
              item.position[1] + 0.3,
              item.position[2],
            ]}
          >
            {/* Price tag background */}
            <mesh>
              <planeGeometry args={[0.25, 0.08]} />
              <meshBasicMaterial
                color="#000000"
                transparent
                opacity={isActive ? 0.8 : 0.5}
              />
            </mesh>

            {/* Price text */}
            <Text
              position={[0, 0, 0.01]}
              fontSize={0.04}
              color={hotPinkColor}
              anchorX="center"
              anchorY="middle"
              material-transparent={true}
              material-opacity={isActive ? 0.9 : 0.6}
            >
              {item.price}
            </Text>

            {/* Product name */}
            <Text
              position={[0, -0.15, 0.01]}
              fontSize={0.03}
              color={orangeColor}
              anchorX="center"
              anchorY="middle"
              material-transparent={true}
              material-opacity={isActive ? 0.8 : 0.5}
            >
              {item.name}
            </Text>
          </group>
        ))}
      </group>

      {/* Transparent display panels */}
      <group>
        {Array.from({ length: 4 }, (_, i) => {
          const angle = (i / 4) * Math.PI * 2;
          const x = Math.cos(angle) * 1.2;
          const z = Math.sin(angle) * 1.2;

          return (
            <mesh key={i} position={[x, 0, z]} rotation={[0, angle, 0]}>
              <planeGeometry args={[0.8, 1.5]} />
              <meshStandardMaterial
                color={hotPinkColor}
                transparent
                opacity={isActive ? 0.1 : 0.05}
                metalness={0.1}
                roughness={0.1}
              />
            </mesh>
          );
        })}
      </group>

      {/* Control interface */}
      <mesh position={[1.0, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[0.4, 0.3, 0.05]} />
        <meshStandardMaterial
          color="#0F0F23"
          emissive={orangeColor}
          emissiveIntensity={isActive ? 0.2 : 0.1}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Interface buttons */}
      {Array.from({ length: 4 }, (_, i) => (
        <mesh
          key={i}
          position={[1.02, 0.1 - i * 0.07, 0]}
          rotation={[0, -Math.PI / 2, 0]}
        >
          <cylinderGeometry args={[0.02, 0.02, 0.02, 8]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? hotPinkColor : orangeColor}
            transparent
            opacity={isActive ? 0.9 : 0.6}
          />
        </mesh>
      ))}

      {/* Shopping cart icon */}
      <mesh position={[1.02, -0.2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[0.06, 0.06, 0.02]} />
        <meshBasicMaterial
          color="#00FF41"
          transparent
          opacity={isActive ? 0.9 : 0.6}
        />
      </mesh>

      {/* Holographic aura effect */}
      {isActive && (
        <mesh>
          <cylinderGeometry args={[2, 2, 2, 16]} />
          <meshBasicMaterial
            color={hotPinkColor}
            transparent
            opacity={0.05}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
};
