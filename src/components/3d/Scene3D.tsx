import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import { use3DAnalytics } from '../../hooks/useAnalytics';
import { logger } from '../../utils/logger';
import { infrastructure3D } from './Infrastructure3D';
import { InfrastructureStatus } from './InfrastructureStatus';
import { LODManager } from './LODManager';
import { ObjectManager } from './ObjectManager';
import { Tooltip } from './Tooltip';
import {
  FadeOverlay,
  LoadingIndicator,
  TransitionManager,
} from './transitions';

interface RendererSettings {
  antialias: boolean;
  alpha: boolean;
  powerPreference: string;
  precision: string;
  shadowMap: {
    enabled: boolean;
    type: string;
  };
  toneMapping: string;
  pixelRatio: number;
  outputColorSpace: string;
}

interface Scene3DProps {
  className?: string;
  onObjectClick?: (section: string) => void;
  enableLODDebug?: boolean;
  performanceThreshold?: number;
}

// Performance tracking component for 3D scene
const ScenePerformanceTracker: React.FC = () => {
  const { trackScenePerformance, trackCameraMovement } = use3DAnalytics();
  const frameCountRef = useRef(0);
  const lastFPSLogRef = useRef(Date.now());
  const lastCameraPositionRef = useRef({ x: 0, y: 0, z: 0 });

  useFrame(state => {
    frameCountRef.current++;
    const now = Date.now();

    // Track FPS every 5 seconds
    if (now - lastFPSLogRef.current > 5000) {
      const fps = Math.round(
        (frameCountRef.current * 1000) / (now - lastFPSLogRef.current)
      );
      const renderTime = state.clock.getDelta() * 1000; // Convert to ms

      trackScenePerformance(fps, renderTime, 0); // Polygon count would be tracked by LODManager

      frameCountRef.current = 0;
      lastFPSLogRef.current = now;
    }

    // Track camera movement
    const { x, y, z } = state.camera.position;
    const lastPos = lastCameraPositionRef.current;
    const distance = Math.sqrt(
      Math.pow(x - lastPos.x, 2) +
        Math.pow(y - lastPos.y, 2) +
        Math.pow(z - lastPos.z, 2)
    );

    // Only track if camera moved significantly (> 0.1 units)
    if (distance > 0.1) {
      trackCameraMovement({ x, y, z });
      lastCameraPositionRef.current = { x, y, z };
    }
  });

  return null;
};

export const Scene3D: React.FC<Scene3DProps> = ({
  className = '',
  onObjectClick,
  enableLODDebug = false,
  performanceThreshold = 45,
}) => {
  const [infrastructureReady, setInfrastructureReady] = useState(false);
  const [rendererSettings, setRendererSettings] =
    useState<RendererSettings | null>(null);

  // Initialize 3D infrastructure on mount
  useEffect(() => {
    const initializeInfrastructure = async () => {
      try {
        logger.info('Phase 1: Initializing 3D infrastructure for Scene3D');
        await infrastructure3D.initialize();

        const settings = infrastructure3D.getRecommendedRendererSettings();
        setRendererSettings(settings);
        setInfrastructureReady(true);

        logger.info('3D infrastructure ready', {
          performanceTier: infrastructure3D.getPerformanceProfile()?.tier,
          webglSupported: infrastructure3D.getCapabilities()?.isWebGLSupported,
        });
      } catch (error) {
        logger.error('Failed to initialize 3D infrastructure', error as Error);
        // Fallback to basic settings
        setRendererSettings({
          antialias: false,
          alpha: true,
          powerPreference: 'default',
          precision: 'mediump',
          shadowMap: { enabled: false, type: 'BasicShadowMap' },
          toneMapping: 'LinearToneMapping',
          pixelRatio: 1,
          outputColorSpace: 'sRGB',
        });
        setInfrastructureReady(true);
      }
    };

    initializeInfrastructure();
  }, []);

  // Show loading state while infrastructure initializes
  if (!infrastructureReady || !rendererSettings) {
    return (
      <div
        className={`relative w-full h-screen ${className} flex items-center justify-center`}
      >
        <div className="text-cyan-400 font-mono text-center">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div>Initializing 3D Infrastructure...</div>
          <div className="text-xs opacity-75 mt-2">
            Phase 1: Enhanced WebGL Detection
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={`relative w-full h-screen ${className}`}>
      <Canvas
        camera={{ position: [5, 3, 5], fov: 75 }}
        shadows={rendererSettings.shadowMap.enabled}
        gl={{
          antialias: rendererSettings.antialias,
          alpha: rendererSettings.alpha,
          powerPreference:
            rendererSettings.powerPreference as WebGLPowerPreference,
          precision: rendererSettings.precision as 'highp' | 'mediump' | 'lowp',
        }}
        dpr={rendererSettings.pixelRatio}
      >
        <Suspense fallback={null}>
          {/* 3D Analytics Performance Tracker */}
          <ScenePerformanceTracker />

          {/* LOD System Manager */}
          <LODManager
            enableAutoOptimization={true}
            performanceThreshold={performanceThreshold}
            enableDebugMode={enableLODDebug}
            enableDebugUI={enableLODDebug}
            targetFPS={
              infrastructure3D.getPerformanceProfile()?.targetFPS || 60
            }
          >
            {/* Adaptive Lighting Setup for Cyberpunk Atmosphere */}
            <ambientLight intensity={0.2} color="#1A0B2E" />

            {/* Main directional light */}
            <directionalLight
              position={[10, 10, 5]}
              intensity={0.5}
              color="#00FFFF"
              castShadow={rendererSettings.shadowMap.enabled}
              shadow-mapSize-width={
                rendererSettings.shadowMap.enabled ? 2048 : 512
              }
              shadow-mapSize-height={
                rendererSettings.shadowMap.enabled ? 2048 : 512
              }
            />

            {/* Performance-aware accent lights */}
            {(infrastructure3D.getPerformanceProfile()?.maxLights || 0) > 2 && (
              <>
                <pointLight
                  position={[-5, 2, -5]}
                  intensity={0.3}
                  color="#FF00FF"
                />
                <pointLight
                  position={[5, 2, 5]}
                  intensity={0.3}
                  color="#0080FF"
                />
              </>
            )}

            {/* High-performance only: Neon strip lighting */}
            {infrastructure3D.getPerformanceProfile()?.tier === 'high' && (
              <rectAreaLight
                position={[0, 5, -8]}
                width={10}
                height={0.1}
                intensity={2}
                color="#00FF41"
              />
            )}

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

      {/* Phase 1: Infrastructure Status */}
      <InfrastructureStatus />
    </div>
  );
};
