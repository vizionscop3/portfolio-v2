import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { infrastructure3D } from '../Infrastructure3D';

interface LightingSystemProps {
  timeOfDay?: 'dawn' | 'morning' | 'noon' | 'afternoon' | 'evening' | 'night' | 'midnight';
  intensity?: number;
  enableShadows?: boolean;
  enableDynamicLighting?: boolean;
  cyberpunkMode?: boolean;
}

interface LightingConfig {
  ambient: {
    color: string;
    intensity: number;
  };
  key: {
    color: string;
    intensity: number;
    position: [number, number, number];
    castShadow: boolean;
  };
  fill: {
    color: string;
    intensity: number;
    position: [number, number, number];
  };
  rim: {
    color: string;
    intensity: number;
    position: [number, number, number];
  };
  accent: Array<{
    type: 'point' | 'spot' | 'rect';
    color: string;
    intensity: number;
    position: [number, number, number];
    decay?: number;
    distance?: number;
    angle?: number;
    penumbra?: number;
    width?: number;
    height?: number;
  }>;
}

/**
 * Advanced Lighting System with cinematic three-point lighting,
 * dynamic time-of-day effects, and cyberpunk atmosphere
 */
export const LightingSystem: React.FC<LightingSystemProps> = ({
  timeOfDay = 'night',
  intensity = 1.0,
  enableShadows = true,
  enableDynamicLighting = false,
  cyberpunkMode = true,
}) => {
  const { gl } = useThree();
  const performanceProfile = infrastructure3D.getPerformanceProfile();
  const keyLightRef = useRef<THREE.DirectionalLight>(null);
  const fillLightRef = useRef<THREE.DirectionalLight>(null);
  const rimLightRef = useRef<THREE.SpotLight>(null);
  
  // Dynamic lighting animation state
  const animationStateRef = useRef({
    time: 0,
    flickerPhase: 0,
    pulsePhase: 0,
  });

  // Configure shadow mapping for enhanced realism
  useEffect(() => {
    if (enableShadows && performanceProfile?.enableShadows) {
      // Enhanced shadow mapping configuration
      gl.shadowMap.enabled = true;
      gl.shadowMap.type = performanceProfile.tier === 'high' 
        ? THREE.PCFSoftShadowMap 
        : THREE.PCFShadowMap;
      gl.shadowMap.autoUpdate = true;
      
      // Enable shadow map cascades for better quality
      if (performanceProfile.tier === 'high') {
        gl.shadowMap.type = THREE.VSMShadowMap;
      }
    }
  }, [gl, enableShadows, performanceProfile]);

  // Calculate lighting configuration based on time of day
  const lightingConfig = useMemo((): LightingConfig => {
    const baseConfigs = {
      dawn: {
        ambient: { color: '#2D1B69', intensity: 0.3 },
        key: { 
          color: '#FFB347', 
          intensity: 0.8, 
          position: [-8, 12, 8] as [number, number, number],
          castShadow: true 
        },
        fill: { 
          color: '#4B0082', 
          intensity: 0.4, 
          position: [5, 8, -3] as [number, number, number] 
        },
        rim: { 
          color: '#FF69B4', 
          intensity: 0.6, 
          position: [-3, 4, -8] as [number, number, number] 
        },
        accent: [
          {
            type: 'point' as const,
            color: '#00FFFF',
            intensity: 0.5,
            position: [-2, 2, 3] as [number, number, number],
            decay: 2,
            distance: 10,
          }
        ]
      },
      morning: {
        ambient: { color: '#E6E6FA', intensity: 0.4 },
        key: { 
          color: '#FFF8DC', 
          intensity: 1.0, 
          position: [-10, 15, 10] as [number, number, number],
          castShadow: true 
        },
        fill: { 
          color: '#87CEEB', 
          intensity: 0.5, 
          position: [8, 10, -5] as [number, number, number] 
        },
        rim: { 
          color: '#FFB6C1', 
          intensity: 0.4, 
          position: [-5, 6, -10] as [number, number, number] 
        },
        accent: [
          {
            type: 'rect' as const,
            color: '#00FF41',
            intensity: 1.5,
            position: [0, 8, -12] as [number, number, number],
            width: 15,
            height: 0.5,
          }
        ]
      },
      noon: {
        ambient: { color: '#F5F5F5', intensity: 0.6 },
        key: { 
          color: '#FFFFFF', 
          intensity: 1.2, 
          position: [0, 20, 5] as [number, number, number],
          castShadow: true 
        },
        fill: { 
          color: '#E0E0E0', 
          intensity: 0.6, 
          position: [10, 12, -8] as [number, number, number] 
        },
        rim: { 
          color: '#D3D3D3', 
          intensity: 0.3, 
          position: [-8, 8, -12] as [number, number, number] 
        },
        accent: []
      },
      afternoon: {
        ambient: { color: '#FFFACD', intensity: 0.5 },
        key: { 
          color: '#FFD700', 
          intensity: 1.0, 
          position: [-12, 18, 8] as [number, number, number],
          castShadow: true 
        },
        fill: { 
          color: '#F0E68C', 
          intensity: 0.5, 
          position: [6, 10, -6] as [number, number, number] 
        },
        rim: { 
          color: '#FFA500', 
          intensity: 0.5, 
          position: [-4, 6, -10] as [number, number, number] 
        },
        accent: [
          {
            type: 'spot' as const,
            color: '#FF8C00',
            intensity: 1.0,
            position: [8, 12, 2] as [number, number, number],
            angle: Math.PI / 6,
            penumbra: 0.3,
            decay: 2,
            distance: 20,
          }
        ]
      },
      evening: {
        ambient: { color: '#191970', intensity: 0.3 },
        key: { 
          color: '#FF4500', 
          intensity: 0.9, 
          position: [-15, 10, 12] as [number, number, number],
          castShadow: true 
        },
        fill: { 
          color: '#8A2BE2', 
          intensity: 0.4, 
          position: [8, 8, -4] as [number, number, number] 
        },
        rim: { 
          color: '#FF1493', 
          intensity: 0.7, 
          position: [-6, 4, -8] as [number, number, number] 
        },
        accent: [
          {
            type: 'point' as const,
            color: '#FF00FF',
            intensity: 0.8,
            position: [-5, 3, -2] as [number, number, number],
            decay: 1.5,
            distance: 15,
          },
          {
            type: 'point' as const,
            color: '#00FFFF',
            intensity: 0.6,
            position: [4, 2, 5] as [number, number, number],
            decay: 1.5,
            distance: 12,
          }
        ]
      },
      night: {
        ambient: { color: '#1A0B2E', intensity: 0.2 },
        key: { 
          color: '#00FFFF', 
          intensity: 0.7, 
          position: [10, 12, 8] as [number, number, number],
          castShadow: true 
        },
        fill: { 
          color: '#4B0082', 
          intensity: 0.3, 
          position: [-6, 6, -5] as [number, number, number] 
        },
        rim: { 
          color: '#FF00FF', 
          intensity: 0.8, 
          position: [3, 4, -10] as [number, number, number] 
        },
        accent: [
          {
            type: 'point' as const,
            color: '#FF1493',
            intensity: 0.6,
            position: [-4, 2, 2] as [number, number, number],
            decay: 2,
            distance: 8,
          },
          {
            type: 'point' as const,
            color: '#0080FF',
            intensity: 0.5,
            position: [6, 2, -3] as [number, number, number],
            decay: 2,
            distance: 10,
          },
          {
            type: 'rect' as const,
            color: '#00FF41',
            intensity: 1.2,
            position: [0, 6, -10] as [number, number, number],
            width: 12,
            height: 0.2,
          }
        ]
      },
      midnight: {
        ambient: { color: '#0F0F23', intensity: 0.15 },
        key: { 
          color: '#800080', 
          intensity: 0.5, 
          position: [8, 8, 6] as [number, number, number],
          castShadow: true 
        },
        fill: { 
          color: '#2F2F2F', 
          intensity: 0.2, 
          position: [-4, 4, -3] as [number, number, number] 
        },
        rim: { 
          color: '#FF1493', 
          intensity: 0.9, 
          position: [2, 3, -8] as [number, number, number] 
        },
        accent: [
          {
            type: 'spot' as const,
            color: '#FF00FF',
            intensity: 1.0,
            position: [0, 8, 0] as [number, number, number],
            angle: Math.PI / 4,
            penumbra: 0.5,
            decay: 1,
            distance: 15,
          }
        ]
      }
    };

    const config = baseConfigs[timeOfDay];
    
    // Apply intensity multiplier
    return {
      ...config,
      ambient: {
        ...config.ambient,
        intensity: config.ambient.intensity * intensity,
      },
      key: {
        ...config.key,
        intensity: config.key.intensity * intensity,
      },
      fill: {
        ...config.fill,
        intensity: config.fill.intensity * intensity,
      },
      rim: {
        ...config.rim,
        intensity: config.rim.intensity * intensity,
      },
      accent: config.accent.map(light => ({
        ...light,
        intensity: light.intensity * intensity,
      })),
    };
  }, [timeOfDay, intensity]);

  // Dynamic lighting animation
  useFrame((state) => {
    if (!enableDynamicLighting) return;

    animationStateRef.current.time += state.clock.getDelta();
    
    // Subtle flicker effect for cyberpunk atmosphere
    const flickerIntensity = 0.1 + 0.05 * Math.sin(animationStateRef.current.time * 8.0);
    const pulseIntensity = 1.0 + 0.08 * Math.sin(animationStateRef.current.time * 2.0);

    if (keyLightRef.current) {
      keyLightRef.current.intensity = lightingConfig.key.intensity * pulseIntensity;
    }

    if (fillLightRef.current) {
      fillLightRef.current.intensity = lightingConfig.fill.intensity * (1 + flickerIntensity * 0.3);
    }

    if (rimLightRef.current) {
      rimLightRef.current.intensity = lightingConfig.rim.intensity * (1 + flickerIntensity * 0.5);
    }
  });

  // Performance-based shadow configuration
  const shadowConfig = useMemo(() => {
    if (!enableShadows || !performanceProfile?.enableShadows) {
      return { mapSize: 512, camera: { near: 0.1, far: 50 } };
    }

    switch (performanceProfile.tier) {
      case 'high':
        return {
          mapSize: 4096,
          camera: { near: 0.1, far: 100 },
          radius: 8,
          bias: -0.0001,
        };
      case 'medium':
        return {
          mapSize: 2048,
          camera: { near: 0.5, far: 75 },
          radius: 4,
          bias: -0.0005,
        };
      case 'low':
        return {
          mapSize: 1024,
          camera: { near: 1, far: 50 },
          radius: 2,
          bias: -0.001,
        };
      default:
        return { mapSize: 512, camera: { near: 0.1, far: 50 } };
    }
  }, [enableShadows, performanceProfile]);

  return (
    <>
      {/* Ambient Light */}
      <ambientLight
        color={lightingConfig.ambient.color}
        intensity={lightingConfig.ambient.intensity}
      />

      {/* Key Light (Primary/Directional) */}
      <directionalLight
        ref={keyLightRef}
        position={lightingConfig.key.position}
        color={lightingConfig.key.color}
        intensity={lightingConfig.key.intensity}
        castShadow={lightingConfig.key.castShadow && enableShadows}
        shadow-mapSize-width={shadowConfig.mapSize}
        shadow-mapSize-height={shadowConfig.mapSize}
        shadow-camera-near={shadowConfig.camera.near}
        shadow-camera-far={shadowConfig.camera.far}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={shadowConfig.bias}
        shadow-radius={shadowConfig.radius}
      />

      {/* Fill Light (Secondary) */}
      <directionalLight
        ref={fillLightRef}
        position={lightingConfig.fill.position}
        color={lightingConfig.fill.color}
        intensity={lightingConfig.fill.intensity}
        castShadow={false}
      />

      {/* Rim Light (Backlighting) */}
      <spotLight
        ref={rimLightRef}
        position={lightingConfig.rim.position}
        color={lightingConfig.rim.color}
        intensity={lightingConfig.rim.intensity}
        angle={Math.PI / 3}
        penumbra={0.4}
        decay={1.5}
        distance={25}
        castShadow={false}
      />

      {/* Accent Lights */}
      {lightingConfig.accent.map((light, index) => {
        const shouldRender = performanceProfile && 
          (performanceProfile.maxLights > 3 + index || performanceProfile.tier !== 'low');
        
        if (!shouldRender) return null;

        switch (light.type) {
          case 'point':
            return (
              <pointLight
                key={`accent-point-${index}`}
                position={light.position}
                color={light.color}
                intensity={light.intensity}
                decay={light.decay}
                distance={light.distance}
              />
            );
          case 'spot':
            return (
              <spotLight
                key={`accent-spot-${index}`}
                position={light.position}
                color={light.color}
                intensity={light.intensity}
                angle={light.angle}
                penumbra={light.penumbra}
                decay={light.decay}
                distance={light.distance}
                castShadow={false}
              />
            );
          case 'rect':
            // Only render rect lights on high-performance devices
            if (performanceProfile?.tier === 'high') {
              return (
                <rectAreaLight
                  key={`accent-rect-${index}`}
                  position={light.position}
                  width={light.width}
                  height={light.height}
                  color={light.color}
                  intensity={light.intensity}
                />
              );
            }
            return null;
          default:
            return null;
        }
      })}

      {/* Hemisphere Light for ambient fill (performance-aware) */}
      {performanceProfile?.tier !== 'low' && (
        <hemisphereLight
          color={cyberpunkMode ? '#00FFFF' : '#ffffff'}
          groundColor={cyberpunkMode ? '#1A0B2E' : '#444444'}
          intensity={0.1 * intensity}
        />
      )}
    </>
  );
};