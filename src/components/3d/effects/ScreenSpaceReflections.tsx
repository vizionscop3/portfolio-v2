import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { infrastructure3D } from '../Infrastructure3D';

interface ScreenSpaceReflectionsProps {
  enabled?: boolean;
  intensity?: number;
  thickness?: number;
  maxDistance?: number;
  resolution?: number;
  opacity?: number;
}

/**
 * Screen-Space Reflections Component
 * Provides realistic reflections for surfaces in the scene
 */
export const ScreenSpaceReflections: React.FC<ScreenSpaceReflectionsProps> = ({
  enabled = true,
  intensity = 0.5,
  thickness = 0.018,
  maxDistance = 3.0,
  resolution = 0.3,
  opacity = 0.8,
}) => {
  const { camera } = useThree();
  const performanceProfile = infrastructure3D.getPerformanceProfile();
  const reflectionMeshRef = useRef<THREE.Mesh>(null);

  // Performance-based configuration
  const reflectionConfig = useMemo(() => {
    if (!performanceProfile || !enabled || performanceProfile.tier === 'low') {
      return null;
    }

    const config = {
      high: {
        enabled: true,
        intensity: intensity,
        resolution: resolution,
        opacity: opacity,
        updateFrequency: 1, // Update every frame
      },
      medium: {
        enabled: true,
        intensity: intensity * 0.7,
        resolution: resolution * 0.8,
        opacity: opacity * 0.8,
        updateFrequency: 2, // Update every 2 frames
      },
      low: {
        enabled: false,
        intensity: 0,
        resolution: 0,
        opacity: 0,
        updateFrequency: 0,
      },
    };

    return config[performanceProfile.tier];
  }, [performanceProfile, enabled, intensity, resolution, opacity]);

  // Custom reflection shader material
  const reflectionMaterial = useMemo(() => {
    if (!reflectionConfig?.enabled) return null;

    return new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: null },
        tDepth: { value: null },
        cameraNear: { value: camera.near },
        cameraFar: { value: camera.far },
        resolution: { value: new THREE.Vector2() },
        cameraProjectionMatrix: { value: camera.projectionMatrix },
        cameraInverseProjectionMatrix: { value: camera.projectionMatrix.clone().invert() },
        time: { value: 0 },
        intensity: { value: reflectionConfig.intensity },
        opacity: { value: reflectionConfig.opacity },
        thickness: { value: thickness },
        maxDistance: { value: maxDistance },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec4 vWorldPosition;
        varying vec3 vViewPosition;
        
        void main() {
          vUv = uv;
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition;
          
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewPosition = mvPosition.xyz;
          
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform sampler2D tDepth;
        uniform float cameraNear;
        uniform float cameraFar;
        uniform vec2 resolution;
        uniform mat4 cameraProjectionMatrix;
        uniform mat4 cameraInverseProjectionMatrix;
        uniform float time;
        uniform float intensity;
        uniform float opacity;
        uniform float thickness;
        uniform float maxDistance;
        
        varying vec2 vUv;
        varying vec4 vWorldPosition;
        varying vec3 vViewPosition;
        
        float readDepth(vec2 coord) {
          float fragCoordZ = texture2D(tDepth, coord).x;
          float viewZ = perspectiveDepthToViewZ(fragCoordZ, cameraNear, cameraFar);
          return viewZToOrthographicDepth(viewZ, cameraNear, cameraFar);
        }
        
        float perspectiveDepthToViewZ(float invClipZ, float near, float far) {
          return (near * far) / ((far - near) * invClipZ - far);
        }
        
        float viewZToOrthographicDepth(float viewZ, float near, float far) {
          return (viewZ + near) / (near - far);
        }
        
        vec3 getViewPosition(vec2 coord, float depth) {
          float clipW = cameraProjectionMatrix[2][3] * depth + cameraProjectionMatrix[3][3];
          vec4 clipPosition = vec4((coord - 0.5) * 2.0, depth, 1.0);
          clipPosition *= clipW;
          return (cameraInverseProjectionMatrix * clipPosition).xyz;
        }
        
        void main() {
          vec2 screenCoord = gl_FragCoord.xy / resolution;
          float depth = readDepth(screenCoord);
          
          if (depth >= 1.0) {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
            return;
          }
          
          vec3 viewPos = getViewPosition(screenCoord, depth);
          vec3 viewNormal = normalize(cross(dFdx(viewPos), dFdy(viewPos)));
          
          // Simple reflection calculation
          vec3 viewDir = normalize(viewPos);
          vec3 reflectDir = reflect(viewDir, viewNormal);
          
          // Ray marching for reflections
          vec3 rayStart = viewPos;
          vec3 rayDir = reflectDir;
          
          float stepSize = maxDistance / 16.0;
          vec3 currentPos = rayStart;
          vec2 hitCoord = screenCoord;
          float hitDepth = depth;
          bool hit = false;
          
          for (int i = 0; i < 16; i++) {
            currentPos += rayDir * stepSize;
            
            vec4 clipPos = cameraProjectionMatrix * vec4(currentPos, 1.0);
            vec2 sampleCoord = (clipPos.xy / clipPos.w) * 0.5 + 0.5;
            
            if (sampleCoord.x < 0.0 || sampleCoord.x > 1.0 || 
                sampleCoord.y < 0.0 || sampleCoord.y > 1.0) break;
            
            float sampleDepth = readDepth(sampleCoord);
            vec3 sampleViewPos = getViewPosition(sampleCoord, sampleDepth);
            
            if (abs(currentPos.z - sampleViewPos.z) < thickness) {
              hitCoord = sampleCoord;
              hitDepth = sampleDepth;
              hit = true;
              break;
            }
          }
          
          if (!hit) {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
            return;
          }
          
          // Sample the reflected color
          vec4 reflectedColor = texture2D(tDiffuse, hitCoord);
          
          // Apply distance-based fade
          float distance = length(getViewPosition(hitCoord, hitDepth) - viewPos);
          float fadeFactor = 1.0 - smoothstep(0.0, maxDistance, distance);
          
          // Apply fresnel effect
          float fresnel = pow(1.0 - dot(-viewDir, viewNormal), 2.0);
          
          // Add subtle noise for more realistic reflections
          float noise = sin(time + hitCoord.x * 100.0) * sin(time + hitCoord.y * 100.0) * 0.02;
          
          float finalOpacity = opacity * intensity * fadeFactor * fresnel * (1.0 + noise);
          
          gl_FragColor = vec4(reflectedColor.rgb, finalOpacity);
        }
      `,
      transparent: true,
      blending: THREE.NormalBlending,
    });
  }, [reflectionConfig, camera, thickness, maxDistance]);

  // Update uniforms and render targets
  useFrame((state) => {
    if (!reflectionConfig?.enabled || !reflectionMaterial || !reflectionMeshRef.current) {
      return;
    }

    // Update time uniform
    reflectionMaterial.uniforms.time.value = state.clock.getElapsedTime();
    
    // Update resolution
    reflectionMaterial.uniforms.resolution.value.set(
      state.size.width * reflectionConfig.resolution,
      state.size.height * reflectionConfig.resolution
    );
  });

  if (!reflectionConfig?.enabled || !reflectionMaterial) {
    return null;
  }

  return (
    <>
      {/* Reflective floor plane */}
      <mesh
        ref={reflectionMeshRef}
        position={[0, -0.99, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial
          color="#0a0a0a"
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Reflective surfaces on walls */}
      {performanceProfile?.tier === 'high' && (
        <>
          {/* Left wall reflection */}
          <mesh position={[-19.5, 5, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[40, 10]} />
            <meshStandardMaterial
              color="#1a1a2e"
              metalness={0.7}
              roughness={0.3}
              transparent
              opacity={0.1}
            />
          </mesh>

          {/* Right wall reflection */}
          <mesh position={[19.5, 5, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[40, 10]} />
            <meshStandardMaterial
              color="#1a1a2e"
              metalness={0.7}
              roughness={0.3}
              transparent
              opacity={0.1}
            />
          </mesh>
        </>
      )}
    </>
  );
};

export default ScreenSpaceReflections;