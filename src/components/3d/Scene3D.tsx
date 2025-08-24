import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import { use3DAnalytics } from '../../hooks/useAnalytics';
import { logger } from '../../utils/logger';
import { infrastructure3D } from './Infrastructure3D';
import { InfrastructureStatus } from './InfrastructureStatus';
import AdvancedLighting from './lighting';
import AtmosphericEffects from './effects/AtmosphericEffects';
import ScreenSpaceReflections from './effects/ScreenSpaceReflections';
import AmbientAnimations from './animations/AmbientAnimations';
import AmbientSoundSystem from './audio/AmbientSoundSystem';
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
            {/* Advanced Lighting System - Phase 10 Task 10.1 */}
            <AdvancedLighting
              cyberpunkMode={true}
              enableControls={enableLODDebug}
              initialTimeOfDay="night"
              initialMode="cyberpunk-cycle"
              enableShadows={rendererSettings.shadowMap.enabled}
              enableAmbientOcclusion={true}
              enableBloom={true}
              enableDynamicEffects={true}
            />

            {/* Atmospheric Effects - Phase 10 Task 10.2 */}
            <AtmosphericEffects
              enableDustParticles={true}
              enableLightRays={true}
              enableFloatingParticles={true}
              enableHolographicDust={true}
              holoDustColor="#00ffff"
            />

            {/* Screen-Space Reflections - Phase 10 Task 10.2 */}
            <ScreenSpaceReflections
              enabled={true}
              intensity={0.5}
              opacity={0.6}
            />

            {/* Ambient Animations - Phase 10 Task 10.3 */}
            <AmbientAnimations
              enableObjectMovement={true}
              enableFloatingAnimation={true}
              enableRotationAnimation={true}
              enableScaleAnimation={true}
              enableColorAnimation={true}
              animationSpeed={1.0}
              intensity={0.8}
            />

            {/* Ambient Sound System - Phase 10 Task 10.3 */}
            <AmbientSoundSystem
              enableBackgroundMusic={true}
              enableSpatialAudio={true}
              enableInteractiveAudio={true}
              enableUIFeedback={true}
              timeOfDay="night"
              masterVolume={0.2}
              musicVolume={0.3}
              effectsVolume={0.4}
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

      {/* Phase 1: Infrastructure Status */}
      <InfrastructureStatus />
    </div>
  );
};
