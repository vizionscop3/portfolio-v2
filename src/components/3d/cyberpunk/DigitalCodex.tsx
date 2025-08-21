import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import React, { useMemo, useRef } from 'react';
import { Color, Group } from 'three';

interface DigitalCodexProps {
  position?: [number, number, number];
  scale?: number;
  isActive?: boolean;
}

export const DigitalCodex: React.FC<DigitalCodexProps> = ({
  position = [0, 0, 0],
  scale = 1,
  isActive = false,
}) => {
  const groupRef = useRef<Group>(null);
  const bookRef = useRef<Group>(null);
  const pagesRef = useRef<Group>(null);
  const particlesRef = useRef<Group>(null);

  // Cyberpunk magenta and purple colors
  const magentaColor = useMemo(() => new Color('#FF00FF'), []);
  const purpleColor = useMemo(() => new Color('#8B5CF6'), []);
  const hotPinkColor = useMemo(() => new Color('#FF1493'), []);

  // Blog content preview
  const blogPages = [
    {
      title: 'Digital Poetry',
      content: [
        'In circuits deep,',
        'Where data flows like dreams,',
        'Code becomes art...',
      ],
    },
    {
      title: 'Tech Musings',
      content: [
        'The future is written',
        'In lines of light,',
        'Pixels and passion...',
      ],
    },
    {
      title: 'Creative Process',
      content: [
        'Between logic and art,',
        'Lives the soul of creation,',
        'Binary beauty...',
      ],
    },
  ];

  useFrame(state => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;

    // Floating animation
    groupRef.current.position.y = Math.sin(time * 0.6) * 0.08;

    // Book rotation animation
    if (bookRef.current) {
      bookRef.current.rotation.y = Math.sin(time * 0.3) * 0.1;
    }

    // Page turning animation
    if (pagesRef.current && isActive) {
      const pageFlip = Math.sin(time * 2) * 0.2;
      pagesRef.current.rotation.y = pageFlip;
    }

    // Floating text particles
    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.2;
      particlesRef.current.position.y = Math.sin(time * 0.8) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Main book structure */}
      <group ref={bookRef}>
        {/* Book cover */}
        <mesh position={[0, 0, 0.05]}>
          <boxGeometry args={[0.8, 1.2, 0.1]} />
          <meshStandardMaterial
            color="#1A0B2E"
            emissive={magentaColor}
            emissiveIntensity={isActive ? 0.2 : 0.1}
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>

        {/* Book spine */}
        <mesh position={[-0.4, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[0.1, 1.2, 0.05]} />
          <meshStandardMaterial
            color="#0F0F23"
            emissive={purpleColor}
            emissiveIntensity={isActive ? 0.15 : 0.08}
          />
        </mesh>

        {/* Holographic pages */}
        <group ref={pagesRef} position={[0, 0, 0.1]}>
          {blogPages.map((page, pageIndex) => (
            <group key={pageIndex} position={[0, 0, pageIndex * 0.02]}>
              {/* Page background */}
              <mesh>
                <planeGeometry args={[0.7, 1.0]} />
                <meshBasicMaterial
                  color={magentaColor}
                  transparent
                  opacity={isActive ? 0.3 : 0.15}
                  depthWrite={false}
                />
              </mesh>

              {/* Page title */}
              <Text
                position={[0, 0.4, 0.01]}
                fontSize={0.08}
                color={hotPinkColor}
                anchorX="center"
                anchorY="middle"
                material-transparent={true}
                material-opacity={isActive ? 0.9 : 0.5}
              >
                {page.title}
              </Text>

              {/* Page content */}
              {page.content.map((line, lineIndex) => (
                <Text
                  key={lineIndex}
                  position={[0, 0.2 - lineIndex * 0.12, 0.01]}
                  fontSize={0.05}
                  color={magentaColor}
                  anchorX="center"
                  anchorY="middle"
                  material-transparent={true}
                  material-opacity={isActive ? 0.8 : 0.4}
                >
                  {line}
                </Text>
              ))}
            </group>
          ))}
        </group>

        {/* Holographic bookmark */}
        <mesh position={[0.3, 0.5, 0.15]}>
          <boxGeometry args={[0.05, 0.3, 0.02]} />
          <meshBasicMaterial
            color={hotPinkColor}
            transparent
            opacity={isActive ? 0.8 : 0.5}
          />
        </mesh>
      </group>

      {/* Floating letter particles */}
      <group ref={particlesRef}>
        {Array.from({ length: 15 }, (_, i) => {
          const angle = (i / 15) * Math.PI * 2;
          const radius = 1.2;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          const y = (Math.random() - 0.5) * 0.8;

          const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
          const letter = letters[i % letters.length];

          return (
            <Text
              key={i}
              position={[x, y, z]}
              fontSize={0.06}
              color={magentaColor}
              anchorX="center"
              anchorY="middle"
              material-transparent={true}
              material-opacity={isActive ? 0.6 : 0.3}
            >
              {letter}
            </Text>
          );
        })}
      </group>

      {/* Neon edge lighting */}
      <group>
        {/* Top edge */}
        <mesh position={[0, 0.6, 0.1]}>
          <boxGeometry args={[0.8, 0.02, 0.02]} />
          <meshBasicMaterial
            color={magentaColor}
            transparent
            opacity={isActive ? 0.8 : 0.4}
          />
        </mesh>

        {/* Bottom edge */}
        <mesh position={[0, -0.6, 0.1]}>
          <boxGeometry args={[0.8, 0.02, 0.02]} />
          <meshBasicMaterial
            color={magentaColor}
            transparent
            opacity={isActive ? 0.8 : 0.4}
          />
        </mesh>

        {/* Side edges */}
        <mesh position={[0.4, 0, 0.1]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[1.2, 0.02, 0.02]} />
          <meshBasicMaterial
            color={purpleColor}
            transparent
            opacity={isActive ? 0.8 : 0.4}
          />
        </mesh>

        <mesh position={[-0.4, 0, 0.1]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[1.2, 0.02, 0.02]} />
          <meshBasicMaterial
            color={purpleColor}
            transparent
            opacity={isActive ? 0.8 : 0.4}
          />
        </mesh>
      </group>

      {/* Holographic aura effect */}
      {isActive && (
        <mesh>
          <sphereGeometry args={[1.8, 16, 16]} />
          <meshBasicMaterial
            color={magentaColor}
            transparent
            opacity={0.08}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
};
