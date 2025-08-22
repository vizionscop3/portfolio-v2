import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import React from 'react';
import { Vector3 } from 'three';
import { InteractiveObject } from './InteractiveObject';
import { Tooltip } from './Tooltip';

export const TestInteractiveObject: React.FC = () => {
  const handleObjectClick = (_section: string) => {
    // TODO: Implement navigation
    // console.log(`Navigating to ${section} section`);
  };

  return (
    <div className="w-full h-screen relative">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />

        <InteractiveObject
          id="test-cube"
          position={new Vector3(0, 0, 0)}
          tooltip="Test Interactive Cube"
          section="test"
          onClick={() => handleObjectClick('test')}
        >
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#4ade80" />
          </mesh>
        </InteractiveObject>

        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>

      <Tooltip />
    </div>
  );
};
