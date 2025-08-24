import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { infrastructure3D } from '../Infrastructure3D';

interface AtmosphericEffectsProps {
  enableDustParticles?: boolean;
  dustParticleCount?: number;
  dustIntensity?: number;
  
  enableLightRays?: boolean;
  lightRayIntensity?: number;
  
  enableFloatingParticles?: boolean;
  floatingParticleCount?: number;
  
  enableHolographicDust?: boolean;
  holoDustColor?: string;
  
  enabled?: boolean;
}

/**
 * Dust Particles Component
 * Creates atmospheric dust particles that float through the scene
 */
const DustParticles: React.FC<{
  count: number;
  intensity: number;
  color: string;
}> = ({ count, intensity, color }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);

  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Random position in a larger area
      positions[i3] = (Math.random() - 0.5) * 40; // x
      positions[i3 + 1] = (Math.random() - 0.5) * 20; // y
      positions[i3 + 2] = (Math.random() - 0.5) * 40; // z
      
      // Random velocity
      velocities[i3] = (Math.random() - 0.5) * 0.02; // x
      velocities[i3 + 1] = Math.random() * 0.01; // y (always upward drift)
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.02; // z
    }

    return { positions, velocities };
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const time = state.clock.getElapsedTime();
    const positionArray = pointsRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Update positions with velocity and gentle drift
      positionArray[i3] += velocities[i3] + Math.sin(time + i) * 0.001; // x
      positionArray[i3 + 1] += velocities[i3 + 1]; // y
      positionArray[i3 + 2] += velocities[i3 + 2] + Math.cos(time + i) * 0.001; // z
      
      // Reset particles that go too far
      if (positionArray[i3 + 1] > 15) {
        positionArray[i3 + 1] = -15;
        positionArray[i3] = (Math.random() - 0.5) * 40;
        positionArray[i3 + 2] = (Math.random() - 0.5) * 40;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Animate opacity
    if (materialRef.current) {
      materialRef.current.opacity = intensity * (0.3 + 0.2 * Math.sin(time * 0.5));
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.05}
        color={color}
        opacity={intensity * 0.4}
        transparent
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
};

/**
 * Light Rays Component
 * Creates volumetric light ray effects
 */
const LightRays: React.FC<{
  intensity: number;
  color: string;
}> = ({ intensity, color }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const lightRayMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        intensity: { value: intensity },
        color: { value: new THREE.Color(color) },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float intensity;
        uniform vec3 color;
        
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vec2 center = vec2(0.5, 0.5);
          float dist = distance(vUv, center);
          
          // Create ray effect
          float ray = 1.0 - smoothstep(0.0, 0.5, dist);
          
          // Add animated distortion
          float distortion = sin(vPosition.y * 10.0 + time * 2.0) * 0.1;
          ray *= (1.0 + distortion);
          
          // Fade based on angle
          float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
          float angleFade = sin(angle * 4.0 + time) * 0.5 + 0.5;
          
          ray *= angleFade * intensity;
          
          gl_FragColor = vec4(color, ray * 0.3);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
  }, [intensity, color]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 8, -10]} rotation={[Math.PI / 4, 0, 0]}>
      <planeGeometry args={[20, 15]} />
      <primitive object={lightRayMaterial} ref={materialRef} />
    </mesh>
  );
};

/**
 * Holographic Dust Component
 * Creates cyberpunk-style holographic particles
 */
const HolographicDust: React.FC<{
  color: string;
  count: number;
}> = ({ color, count }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    const time = state.clock.getElapsedTime();
    groupRef.current.rotation.y = time * 0.1;
    
    // Animate individual particles
    groupRef.current.children.forEach((child, index) => {
      if (child instanceof THREE.Mesh) {
        child.position.y += Math.sin(time + index) * 0.01;
        child.rotation.z = time * 0.5 + index;
      }
    });
  });

  const particles = useMemo(() => {
    const particleElements = [];
    for (let i = 0; i < count; i++) {
      particleElements.push(
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 30,
            Math.random() * 15,
            (Math.random() - 0.5) * 30,
          ]}
        >
          <ringGeometry args={[0.05, 0.1, 6]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.6}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      );
    }
    return particleElements;
  }, [count, color]);

  return (
    <group ref={groupRef}>
      {particles}
    </group>
  );
};

/**
 * Main Atmospheric Effects Component
 */
export const AtmosphericEffects: React.FC<AtmosphericEffectsProps> = ({
  enableDustParticles = true,
  dustParticleCount = 200,
  dustIntensity = 0.5,
  
  enableLightRays = true,
  lightRayIntensity = 0.3,
  
  enableFloatingParticles = true,
  floatingParticleCount = 50,
  
  enableHolographicDust = true,
  holoDustColor = '#00ffff',
  
  enabled = true,
}) => {
  const performanceProfile = infrastructure3D.getPerformanceProfile();

  // Performance-based configuration
  const effectConfig = useMemo(() => {
    if (!performanceProfile || !enabled) {
      return {
        dustParticles: false,
        lightRays: false,
        floatingParticles: false,
        holographicDust: false,
        particleCount: 0,
      };
    }

    const { tier } = performanceProfile;

    switch (tier) {
      case 'high':
        return {
          dustParticles: enableDustParticles,
          lightRays: enableLightRays,
          floatingParticles: enableFloatingParticles,
          holographicDust: enableHolographicDust,
          dustCount: dustParticleCount,
          floatingCount: floatingParticleCount,
          holoCount: 30,
        };
      case 'medium':
        return {
          dustParticles: enableDustParticles,
          lightRays: enableLightRays,
          floatingParticles: enableFloatingParticles,
          holographicDust: enableHolographicDust,
          dustCount: Math.floor(dustParticleCount * 0.6),
          floatingCount: Math.floor(floatingParticleCount * 0.6),
          holoCount: 15,
        };
      case 'low':
        return {
          dustParticles: enableDustParticles,
          lightRays: false,
          floatingParticles: enableFloatingParticles,
          holographicDust: false,
          dustCount: Math.floor(dustParticleCount * 0.3),
          floatingCount: Math.floor(floatingParticleCount * 0.3),
          holoCount: 0,
        };
      default:
        return { dustParticles: false, lightRays: false, floatingParticles: false, holographicDust: false };
    }
  }, [
    performanceProfile,
    enabled,
    enableDustParticles,
    enableLightRays,
    enableFloatingParticles,
    enableHolographicDust,
    dustParticleCount,
    floatingParticleCount,
  ]);

  if (!performanceProfile || !enabled) {
    return null;
  }

  return (
    <>
      {/* Dust Particles */}
      {effectConfig.dustParticles && (
        <DustParticles
          count={effectConfig.dustCount || 100}
          intensity={dustIntensity}
          color="#ffffff"
        />
      )}

      {/* Light Rays */}
      {effectConfig.lightRays && (
        <LightRays
          intensity={lightRayIntensity}
          color="#00ffff"
        />
      )}

      {/* Floating Particles with Sparkles */}
      {effectConfig.floatingParticles && (
        <Sparkles
          count={effectConfig.floatingCount || 30}
          scale={[40, 20, 40]}
          size={2}
          speed={0.2}
          opacity={0.6}
          color="#ff00ff"
        />
      )}

      {/* Holographic Dust */}
      {effectConfig.holographicDust && effectConfig.holoCount && effectConfig.holoCount > 0 && (
        <HolographicDust
          color={holoDustColor}
          count={effectConfig.holoCount}
        />
      )}

      {/* Additional ambient particles for cyberpunk atmosphere */}
      {performanceProfile.tier !== 'low' && (
        <DustParticles
          count={50}
          intensity={dustIntensity * 0.3}
          color="#ff1493"
        />
      )}
    </>
  );
};

export default AtmosphericEffects;