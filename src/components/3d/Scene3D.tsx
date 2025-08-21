import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import React, { Suspense } from 'react';
import { ObjectManager } from './ObjectManager';
import { Tooltip } from './Tooltip';
import { LODManager } from './LODManager';
import {
  FadeOverlay,
  LoadingIndicator,
  TransitionManager,
} from './transitions';

interface Scene3DProps {
  className?: string;
  onObjectClick?: (section: string) => void;
  enableLODDebug?: boolean;
  performanceThreshold?: number;
}

export const Scene3D: React.FC<Scene3DProps> = ({
  className = '',
  onObjectClick,
  enableLODDebug = false,
  performanceThreshold = 45,
}) => {
  return (
    <div className={`relative w-full h-screen ${className}`}>
      <Canvas
        camera={{ position: [5, 3, 5], fov: 75 }}
        shadows
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          {/* LOD System Manager */}
          <LODManager
            enableAutoOptimization={true}
            performanceThreshold={performanceThreshold}
            enableDebugMode={enableLODDebug}
            enableDebugUI={enableLODDebug}
            targetFPS={60}
          >
            {/* Lighting setup for cyberpunk atmosphere */}
            <ambientLight intensity={0.2} color="#1A0B2E" />

            {/* Main directional light */}
            <directionalLight
              position={[10, 10, 5]}
              intensity={0.5}
              color="#00FFFF"
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />

            {/* Accent lights for cyberpunk atmosphere */}
            <pointLight position={[-5, 2, -5]} intensity={0.3} color="#FF00FF" />
            <pointLight position={[5, 2, 5]} intensity={0.3} color="#0080FF" />

            {/* Neon strip lighting */}
            <rectAreaLight
              position={[0, 5, -8]}
              width={10}
              height={0.1}
              intensity={2}
              color="#00FFFF"
            />

            {/* Room environment */}
            <mesh
              receiveShadow
              position={[0, -1, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <planeGeometry args={[20, 20]} />
              <meshStandardMaterial
                color="#0F0F23"
                metalness={0.1}
                roughness={0.8}
              />
            </mesh>

            {/* Back wall */}
            <mesh position={[0, 4, -10]}>
              <planeGeometry args={[20, 10]} />
              <meshStandardMaterial
                color="#1A0B2E"
                metalness={0.2}
                roughness={0.7}
              />
            </mesh>

            {/* Transition Manager */}
            <TransitionManager>
              {/* Interactive objects */}
              <ObjectManager onObjectClick={onObjectClick} />

              {/* Camera controls */}
              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                maxPolarAngle={Math.PI / 2}
                minDistance={3}
                maxDistance={15}
                target={[0, 0, 0]}
              />
            </TransitionManager>
          </LODManager>
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      <Tooltip />

      {/* Transition Effects */}
      <FadeOverlay />
      <LoadingIndicator />

      {/* Loading indicator */}
      <div className="absolute top-4 left-4 text-cyan-400 font-mono text-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
          3D PORTFOLIO INITIALIZED
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 text-cyan-400 font-mono text-xs space-y-1">
        <div>MOUSE: Rotate view</div>
        <div>SCROLL: Zoom in/out</div>
        <div>HOVER: Discover objects</div>
        <div>CLICK: Navigate sections</div>
      </div>
    </div>
  );
};
