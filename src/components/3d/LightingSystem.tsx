import { useFrame } from '@react-three/fiber';
import React, { useRef } from 'react';
import * as THREE from 'three';
import { LightingConfig } from '../../types/scene';

interface LightingSystemProps {
  config: LightingConfig;
}

const LightingSystem: React.FC<LightingSystemProps> = ({ config }) => {
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);
  const pointLightRefs = useRef<(THREE.PointLight | null)[]>([]);

  // Animate lights subtly
  useFrame(state => {
    const time = state.clock.getElapsedTime();

    // Subtle directional light movement
    if (directionalLightRef.current) {
      const light = directionalLightRef.current;
      light.position.x =
        config.directional.position.x + Math.sin(time * 0.1) * 0.5;
      light.position.z =
        config.directional.position.z + Math.cos(time * 0.1) * 0.5;
    }

    // Animate point lights
    pointLightRefs.current.forEach((light, index) => {
      if (light && config.point[index]) {
        const pointConfig = config.point[index];
        const offset = index * Math.PI;

        // Subtle intensity variation
        light.intensity =
          pointConfig.intensity + Math.sin(time * 0.5 + offset) * 0.1;

        // Gentle position animation
        light.position.y =
          pointConfig.position.y + Math.sin(time * 0.3 + offset) * 0.2;
      }
    });
  });

  return (
    <>
      {/* Ambient Light */}
      <ambientLight
        intensity={config.ambient.intensity}
        color={config.ambient.color}
      />

      {/* Directional Light (Main light source) */}
      <directionalLight
        ref={directionalLightRef}
        intensity={config.directional.intensity}
        color={config.directional.color}
        position={[
          config.directional.position.x,
          config.directional.position.y,
          config.directional.position.z,
        ]}
        castShadow={config.directional.castShadow}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0001}
      />

      {/* Point Lights */}
      {config.point.map((pointLight, index) => (
        <pointLight
          key={index}
          ref={el => {
            if (pointLightRefs.current) {
              pointLightRefs.current[index] = el;
            }
          }}
          intensity={pointLight.intensity}
          color={pointLight.color}
          position={[
            pointLight.position.x,
            pointLight.position.y,
            pointLight.position.z,
          ]}
          distance={pointLight.distance}
          decay={2}
        />
      ))}
    </>
  );
};

export default LightingSystem;
