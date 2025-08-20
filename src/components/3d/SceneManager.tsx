import { Environment, OrbitControls, Stats } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import {
  Bloom,
  DepthOfField,
  EffectComposer,
} from '@react-three/postprocessing';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { SceneConfig, SceneManagerProps } from '../../types/scene';
import { PerformanceMonitor } from '../../utils/performance-monitor';
import LightingSystem from './LightingSystem';

interface SceneManagerState {
  config: SceneConfig;
  performanceMode: 'high' | 'medium' | 'low';
  showStats: boolean;
}

interface SceneManagerComponentProps extends SceneManagerProps {
  children?: React.ReactNode;
}

const SceneManager: React.FC<SceneManagerComponentProps> = ({
  activeSection: _activeSection,
  onSectionChange: _onSectionChange,
  performanceMode: initialPerformanceMode,
  children,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<SceneManagerState>({
    config: getDefaultConfig(initialPerformanceMode),
    performanceMode: initialPerformanceMode,
    showStats: process.env.NODE_ENV === 'development',
  });

  // Initialize performance monitoring
  useEffect(() => {
    const performanceMonitor = PerformanceMonitor.getInstance();

    // Start monitoring
    performanceMonitor.startMonitoring();

    // Handle performance degradation
    const handleDegradation = (action: string) => {
      console.warn(`Performance degradation: ${action}`);

      setState(prevState => {
        const newConfig = { ...prevState.config };

        switch (action) {
          case 'disableShadows':
            newConfig.lighting.directional.castShadow = false;
            break;
          case 'disablePostProcessing':
            newConfig.postProcessing.enabled = false;
            break;
          case 'reduceLOD':
            // This would be handled by individual components
            break;
        }

        return {
          ...prevState,
          config: newConfig,
          performanceMode: 'low',
        };
      });
    };

    performanceMonitor.onDegradation(handleDegradation);

    return () => {
      performanceMonitor.stopMonitoring();
    };
  }, []);

  // Update config when performance mode changes
  useEffect(() => {
    setState(prevState => ({
      ...prevState,
      config: getDefaultConfig(initialPerformanceMode),
      performanceMode: initialPerformanceMode,
    }));
  }, [initialPerformanceMode]);

  return (
    <div className="w-full h-full relative">
      <Canvas
        ref={canvasRef}
        shadows={state.config.lighting.directional.castShadow}
        camera={{
          position: [
            state.config.camera.position.x,
            state.config.camera.position.y,
            state.config.camera.position.z,
          ],
          fov: state.config.camera.fov,
          near: state.config.camera.near,
          far: state.config.camera.far,
        }}
        gl={{
          antialias: state.performanceMode !== 'low',
          alpha: true,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl, scene }) => {
          // Configure renderer
          gl.shadowMap.enabled = state.config.lighting.directional.castShadow;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.0;

          // Set background
          scene.background = new THREE.Color(
            state.config.environment.background
          );

          // Add fog if configured
          if (state.config.environment.fog) {
            scene.fog = new THREE.Fog(
              state.config.environment.fog.color,
              state.config.environment.fog.near,
              state.config.environment.fog.far
            );
          }
        }}
      >
        {/* Camera Controls */}
        <OrbitControls
          target={[
            state.config.camera.target.x,
            state.config.camera.target.y,
            state.config.camera.target.z,
          ]}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={50}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
          dampingFactor={0.05}
          enableDamping={true}
        />

        {/* Lighting System */}
        <LightingSystem config={state.config.lighting} />

        {/* Environment */}
        <Environment preset={state.config.environment.environment as any} />

        {/* Post-processing Effects */}
        {state.config.postProcessing.enabled && (
          <EffectComposer>
            <Bloom
              intensity={state.config.postProcessing.bloom.intensity}
              threshold={state.config.postProcessing.bloom.threshold}
              smoothWidth={state.config.postProcessing.bloom.smoothWidth}
            />

            <>
              {state.config.postProcessing.depthOfField.enabled && (
                <DepthOfField
                  focusDistance={
                    state.config.postProcessing.depthOfField.focusDistance
                  }
                  focalLength={
                    state.config.postProcessing.depthOfField.focalLength
                  }
                  bokehScale={
                    state.config.postProcessing.depthOfField.bokehScale
                  }
                />
              )}
            </>
          </EffectComposer>
        )}

        {/* Performance Stats (Development only) */}
        {state.showStats && <Stats />}

        {/* Children components */}
        {children}
      </Canvas>
    </div>
  );
};

/**
 * Generate default scene configuration based on performance mode
 */
function getDefaultConfig(
  performanceMode: 'high' | 'medium' | 'low'
): SceneConfig {
  const baseConfig: SceneConfig = {
    lighting: {
      ambient: {
        intensity: 0.4,
        color: '#ffffff',
      },
      directional: {
        intensity: 1.0,
        color: '#ffffff',
        position: new THREE.Vector3(10, 10, 5),
        castShadow: true,
      },
      point: [],
    },
    environment: {
      background: '#1a1a2e',
      environment: 'studio',
    },
    camera: {
      position: new THREE.Vector3(0, 5, 10),
      target: new THREE.Vector3(0, 0, 0),
      fov: 75,
      near: 0.1,
      far: 1000,
    },
    postProcessing: {
      enabled: true,
      bloom: {
        intensity: 0.5,
        threshold: 0.9,
        smoothWidth: 0.4,
      },
      depthOfField: {
        enabled: false,
        focusDistance: 10,
        focalLength: 0.02,
        bokehScale: 2,
      },
      colorGrading: {
        enabled: true,
        exposure: 0.1,
        contrast: 0.05,
        saturation: 0.1,
      },
    },
  };

  // Adjust config based on performance mode
  switch (performanceMode) {
    case 'high':
      baseConfig.lighting.point = [
        {
          intensity: 0.5,
          color: '#ffa500',
          position: new THREE.Vector3(-5, 3, 2),
          distance: 10,
        },
        {
          intensity: 0.3,
          color: '#87ceeb',
          position: new THREE.Vector3(5, 2, -3),
          distance: 8,
        },
      ];
      baseConfig.postProcessing.depthOfField.enabled = true;
      break;

    case 'medium':
      baseConfig.lighting.point = [
        {
          intensity: 0.3,
          color: '#ffa500',
          position: new THREE.Vector3(-5, 3, 2),
          distance: 8,
        },
      ];
      baseConfig.postProcessing.bloom.intensity = 0.3;
      break;

    case 'low':
      baseConfig.lighting.directional.castShadow = false;
      baseConfig.postProcessing.enabled = false;
      break;
  }

  return baseConfig;
}

export default SceneManager;
