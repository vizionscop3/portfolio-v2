import { useFrame } from '@react-three/fiber';
import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { MeshStandardMaterial } from 'three';
import { RoomEnvironment as RoomEnvironmentType } from '../../types/interactive';

interface RoomEnvironmentProps {
  config?: Partial<RoomEnvironmentType>;
  performanceMode: 'high' | 'medium' | 'low';
}

const RoomEnvironment: React.FC<RoomEnvironmentProps> = ({
  performanceMode,
}) => {
  const roomRef = useRef<THREE.Group>(null);

  // Room dimensions
  const roomSize = {
    width: 12,
    height: 8,
    depth: 12,
  };

  // Create materials based on performance mode
  const materials = useMemo(() => {
    const createMaterial = (
      color: string,
      roughness = 0.8,
      metalness = 0.1
    ) => {
      return new MeshStandardMaterial({
        color,
        roughness,
        metalness,
        // Only use maps in high performance mode
        ...(performanceMode === 'high' &&
          {
            // These would be actual texture paths in a real implementation
            // map: textureLoader.load('/textures/wall.jpg'),
            // normalMap: textureLoader.load('/textures/wall_normal.jpg'),
          }),
      });
    };

    return {
      wall: createMaterial('#f5f5f5', 0.9, 0.0),
      floor: createMaterial('#8B4513', 0.7, 0.1), // Wood brown
      ceiling: createMaterial('#ffffff', 0.8, 0.0),
      desk: createMaterial('#654321', 0.6, 0.2), // Darker wood
      bed: createMaterial('#4a4a4a', 0.8, 0.0), // Dark gray
      closet: createMaterial('#2d2d2d', 0.7, 0.1), // Very dark gray
    };
  }, [performanceMode]);

  // Animate room elements subtly
  useFrame(state => {
    if (roomRef.current) {
      const time = state.clock.getElapsedTime();
      // Very subtle breathing effect for the room
      roomRef.current.scale.setScalar(1 + Math.sin(time * 0.1) * 0.001);
    }
  });

  return (
    <group ref={roomRef}>
      {/* Floor */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[roomSize.width, roomSize.depth]} />
        <primitive object={materials.floor} />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, roomSize.height, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[roomSize.width, roomSize.depth]} />
        <primitive object={materials.ceiling} />
      </mesh>

      {/* Back Wall */}
      <mesh
        position={[0, roomSize.height / 2, -roomSize.depth / 2]}
        receiveShadow
      >
        <planeGeometry args={[roomSize.width, roomSize.height]} />
        <primitive object={materials.wall} />
      </mesh>

      {/* Left Wall */}
      <mesh
        position={[-roomSize.width / 2, roomSize.height / 2, 0]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[roomSize.depth, roomSize.height]} />
        <primitive object={materials.wall} />
      </mesh>

      {/* Right Wall */}
      <mesh
        position={[roomSize.width / 2, roomSize.height / 2, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[roomSize.depth, roomSize.height]} />
        <primitive object={materials.wall} />
      </mesh>

      {/* Desk (Foundation for computer) */}
      <group position={[-3, 0, -4]}>
        {/* Desktop */}
        <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.5, 0.1, 1.2]} />
          <primitive object={materials.desk} />
        </mesh>

        {/* Desk Legs */}
        {[
          [-1.1, 0.75, -0.5] as [number, number, number],
          [1.1, 0.75, -0.5] as [number, number, number],
          [-1.1, 0.75, 0.5] as [number, number, number],
          [1.1, 0.75, 0.5] as [number, number, number],
        ].map((position, index) => (
          <mesh key={index} position={position} castShadow>
            <boxGeometry args={[0.1, 1.5, 0.1]} />
            <primitive object={materials.desk} />
          </mesh>
        ))}
      </group>

      {/* Bed (Foundation for book) */}
      <group position={[3, 0, 2]}>
        {/* Bed Frame */}
        <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[2, 0.6, 3]} />
          <primitive object={materials.bed} />
        </mesh>

        {/* Mattress */}
        <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 0.2, 2.8]} />
          <meshStandardMaterial color="#ffffff" roughness={0.9} />
        </mesh>
      </group>

      {/* Closet (Foundation for fashion items) */}
      <group position={[4, 0, -4]}>
        {/* Main Body */}
        <mesh position={[0, 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 4, 0.8]} />
          <primitive object={materials.closet} />
        </mesh>

        {/* Doors */}
        <mesh position={[-0.4, 2, 0.41]} castShadow>
          <boxGeometry args={[0.7, 3.8, 0.05]} />
          <primitive object={materials.closet} />
        </mesh>
        <mesh position={[0.4, 2, 0.41]} castShadow>
          <boxGeometry args={[0.7, 3.8, 0.05]} />
          <primitive object={materials.closet} />
        </mesh>

        {/* Door Handles */}
        <mesh position={[-0.6, 2, 0.45]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.1]} />
          <meshStandardMaterial
            color="#silver"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[0.6, 2, 0.45]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.1]} />
          <meshStandardMaterial
            color="#silver"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Shelf (For merchandise display) */}
      <group position={[-4, 0, 2]}>
        {/* Shelf Base */}
        <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 0.2, 0.8]} />
          <primitive object={materials.desk} />
        </mesh>

        {/* Shelf Middle */}
        <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 0.1, 0.8]} />
          <primitive object={materials.desk} />
        </mesh>

        {/* Shelf Top */}
        <mesh position={[0, 2.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 0.1, 0.8]} />
          <primitive object={materials.desk} />
        </mesh>

        {/* Vertical Supports */}
        {[
          [-0.7, 1.4, -0.35] as [number, number, number],
          [0.7, 1.4, -0.35] as [number, number, number],
          [-0.7, 1.4, 0.35] as [number, number, number],
          [0.7, 1.4, 0.35] as [number, number, number],
        ].map((position, index) => (
          <mesh key={index} position={position} castShadow>
            <boxGeometry args={[0.05, 2.8, 0.05]} />
            <primitive object={materials.desk} />
          </mesh>
        ))}
      </group>

      {/* Room Baseboards */}
      {performanceMode === 'high' && (
        <>
          {/* Back wall baseboard */}
          <mesh position={[0, 0.1, -roomSize.depth / 2 + 0.05]}>
            <boxGeometry args={[roomSize.width, 0.2, 0.1]} />
            <meshStandardMaterial color="#d0d0d0" />
          </mesh>

          {/* Left wall baseboard */}
          <mesh position={[-roomSize.width / 2 + 0.05, 0.1, 0]}>
            <boxGeometry args={[0.1, 0.2, roomSize.depth]} />
            <meshStandardMaterial color="#d0d0d0" />
          </mesh>

          {/* Right wall baseboard */}
          <mesh position={[roomSize.width / 2 - 0.05, 0.1, 0]}>
            <boxGeometry args={[0.1, 0.2, roomSize.depth]} />
            <meshStandardMaterial color="#d0d0d0" />
          </mesh>
        </>
      )}

      {/* Ambient room details (high performance only) */}
      {performanceMode === 'high' && (
        <>
          {/* Window frame on back wall */}
          <group position={[2, 3, -roomSize.depth / 2 + 0.01]}>
            <mesh>
              <boxGeometry args={[2, 1.5, 0.1]} />
              <meshStandardMaterial color="#8B4513" />
            </mesh>
            {/* Window glass */}
            <mesh position={[0, 0, 0.05]}>
              <planeGeometry args={[1.8, 1.3]} />
              <meshStandardMaterial
                color="#87CEEB"
                transparent
                opacity={0.3}
                roughness={0.1}
                metalness={0.1}
              />
            </mesh>
          </group>

          {/* Picture frame */}
          <mesh position={[-2, 3, -roomSize.depth / 2 + 0.01]}>
            <boxGeometry args={[1, 0.8, 0.05]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
        </>
      )}
    </group>
  );
};

export default RoomEnvironment;
