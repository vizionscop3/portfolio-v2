import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { infrastructure3D } from '../Infrastructure3D';

interface AmbientAnimationsProps {
  enableObjectMovement?: boolean;
  enableFloatingAnimation?: boolean;
  enableRotationAnimation?: boolean;
  enableScaleAnimation?: boolean;
  enableColorAnimation?: boolean;
  animationSpeed?: number;
  intensity?: number;
  enabled?: boolean;
}

/**
 * Floating Animation Component
 * Adds gentle floating motion to objects
 */
const FloatingObject: React.FC<{
  children: React.ReactNode;
  amplitude?: number;
  frequency?: number;
  offset?: number;
  axis?: 'x' | 'y' | 'z' | 'all';
}> = ({ 
  children, 
  amplitude = 0.1, 
  frequency = 1, 
  offset = 0,
  axis = 'y'
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const initialPosition = useRef<THREE.Vector3>(new THREE.Vector3());

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime() * frequency + offset;
    const floatY = Math.sin(time) * amplitude;
    const floatX = axis === 'all' ? Math.cos(time * 0.7) * amplitude * 0.5 : 0;
    const floatZ = axis === 'all' ? Math.sin(time * 1.3) * amplitude * 0.3 : 0;

    if (axis === 'y' || axis === 'all') {
      groupRef.current.position.y = initialPosition.current.y + floatY;
    }
    if (axis === 'x' || axis === 'all') {
      groupRef.current.position.x = initialPosition.current.x + floatX;
    }
    if (axis === 'z' || axis === 'all') {
      groupRef.current.position.z = initialPosition.current.z + floatZ;
    }
  });

  // Store initial position
  React.useEffect(() => {
    if (groupRef.current) {
      initialPosition.current.copy(groupRef.current.position);
    }
  }, []);

  return (
    <group ref={groupRef}>
      {children}
    </group>
  );
};

/**
 * Gentle Rotation Component
 * Adds subtle rotation animations
 */
const GentleRotation: React.FC<{
  children: React.ReactNode;
  speed?: number;
  axis?: 'x' | 'y' | 'z' | 'all';
}> = ({ children, speed = 0.5, axis = 'y' }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime() * speed;

    if (axis === 'x' || axis === 'all') {
      groupRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
    }
    if (axis === 'y' || axis === 'all') {
      groupRef.current.rotation.y = time * 0.2;
    }
    if (axis === 'z' || axis === 'all') {
      groupRef.current.rotation.z = Math.cos(time * 0.5) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {children}
    </group>
  );
};

/**
 * Pulsing Scale Component
 * Adds gentle scale pulsing animation
 */
const PulsingScale: React.FC<{
  children: React.ReactNode;
  amplitude?: number;
  frequency?: number;
}> = ({ children, amplitude = 0.05, frequency = 1 }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime() * frequency;
    const scale = 1 + Math.sin(time) * amplitude;
    
    groupRef.current.scale.setScalar(scale);
  });

  return (
    <group ref={groupRef}>
      {children}
    </group>
  );
};

/**
 * Color Animation Component
 * Adds subtle color transitions
 */
const ColorAnimation: React.FC<{
  children: React.ReactNode;
  colors: string[];
  speed?: number;
}> = ({ children, colors, speed = 1 }) => {
  const materialRef = useRef<THREE.Material>(null);
  const colorObjects = useMemo(() => colors.map(color => new THREE.Color(color)), [colors]);

  useFrame((state) => {
    if (!materialRef.current || !('color' in materialRef.current)) return;

    const time = state.clock.getElapsedTime() * speed;
    const colorIndex = Math.floor(time) % colorObjects.length;
    const nextColorIndex = (colorIndex + 1) % colorObjects.length;
    const t = time - Math.floor(time);

    const currentColor = colorObjects[colorIndex];
    const nextColor = colorObjects[nextColorIndex];
    
    (materialRef.current as any).color.lerpColors(currentColor, nextColor, t);
  });

  return React.cloneElement(children as React.ReactElement, {
    ref: materialRef
  });
};

/**
 * Ambient Background Elements
 * Creates dynamic background elements that respond to user interaction
 */
const BackgroundElements: React.FC<{
  mousePosition: THREE.Vector2;
  intensity: number;
}> = ({ mousePosition, intensity }) => {
  const elementsRef = useRef<THREE.Group>(null);
  
  // Create background elements
  const elements = useMemo(() => {
    const elementArray = [];
    const count = 20;
    
    for (let i = 0; i < count; i++) {
      const position = new THREE.Vector3(
        (Math.random() - 0.5) * 50,
        Math.random() * 20,
        -15 - Math.random() * 10
      );
      
      elementArray.push({
        id: i,
        position,
        initialPosition: position.clone(),
        scale: Math.random() * 0.5 + 0.2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        color: new THREE.Color().setHSL(
          Math.random() * 0.3 + 0.5, // Hue: cyan to purple range
          0.8,
          0.6
        ),
      });
    }
    
    return elementArray;
  }, []);

  useFrame((state) => {
    if (!elementsRef.current) return;

    const time = state.clock.getElapsedTime();
    
    elementsRef.current.children.forEach((child, childIndex) => {
      const element = elements[childIndex];
      if (!element || !child) return;

      // Mouse interaction
      const mouseInfluence = mousePosition.length() * intensity * 2;
      const mouseOffset = new THREE.Vector3(
        mousePosition.x * mouseInfluence * 0.5,
        mousePosition.y * mouseInfluence * 0.3,
        0
      );

      // Floating animation
      const floatOffset = new THREE.Vector3(
        Math.sin(time * 0.5 + childIndex) * 0.5,
        Math.cos(time * 0.3 + childIndex) * 0.3,
        Math.sin(time * 0.7 + childIndex) * 0.2
      );

      // Update position
      child.position.copy(element.initialPosition)
        .add(mouseOffset)
        .add(floatOffset);

      // Update rotation
      child.rotation.y += element.rotationSpeed;
      child.rotation.z = Math.sin(time + childIndex) * 0.1;

      // Update scale based on mouse proximity
      const baseScale = element.scale;
      const mouseDistance = mousePosition.distanceTo(new THREE.Vector2(
        (child.position.x / 25), 
        (child.position.y / 10)
      ));
      const scaleMultiplier = 1 + Math.max(0, (2 - mouseDistance)) * 0.2 * intensity;
      child.scale.setScalar(baseScale * scaleMultiplier);
    });
  });

  return (
    <group ref={elementsRef}>
      {elements.map((element) => (
        <mesh key={element.id} position={element.position}>
          <ringGeometry args={[0.1, 0.2, 6]} />
          <meshBasicMaterial
            color={element.color}
            transparent
            opacity={0.4 * intensity}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
};

/**
 * Main Ambient Animations Component
 */
export const AmbientAnimations: React.FC<AmbientAnimationsProps> = ({
  enableObjectMovement = true,
  enableFloatingAnimation = true,
  enableRotationAnimation = true,
  enableScaleAnimation = true,
  enableColorAnimation = true,
  animationSpeed = 1.0,
  intensity = 1.0,
  enabled = true,
}) => {
  const performanceProfile = infrastructure3D.getPerformanceProfile();
  const mousePosition = useRef<THREE.Vector2>(new THREE.Vector2());

  // Performance-based configuration
  const animationConfig = useMemo(() => {
    if (!performanceProfile || !enabled) {
      return {
        objectMovement: false,
        floating: false,
        rotation: false,
        scale: false,
        colorAnimation: false,
        backgroundElements: false,
      };
    }

    const { tier } = performanceProfile;

    switch (tier) {
      case 'high':
        return {
          objectMovement: enableObjectMovement,
          floating: enableFloatingAnimation,
          rotation: enableRotationAnimation,
          scale: enableScaleAnimation,
          colorAnimation: enableColorAnimation,
          backgroundElements: true,
          animationSpeed: animationSpeed,
          intensity: intensity,
        };
      case 'medium':
        return {
          objectMovement: enableObjectMovement,
          floating: enableFloatingAnimation,
          rotation: enableRotationAnimation,
          scale: enableScaleAnimation,
          colorAnimation: enableColorAnimation,
          backgroundElements: true,
          animationSpeed: animationSpeed * 0.8,
          intensity: intensity * 0.8,
        };
      case 'low':
        return {
          objectMovement: enableObjectMovement,
          floating: enableFloatingAnimation,
          rotation: false,
          scale: false,
          colorAnimation: false,
          backgroundElements: false,
          animationSpeed: animationSpeed * 0.5,
          intensity: intensity * 0.5,
        };
      default:
        return { objectMovement: false, floating: false, rotation: false, scale: false };
    }
  }, [
    performanceProfile,
    enabled,
    enableObjectMovement,
    enableFloatingAnimation,
    enableRotationAnimation,
    enableScaleAnimation,
    enableColorAnimation,
    animationSpeed,
    intensity,
  ]);

  // Mouse tracking for interactive background elements
  React.useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mousePosition.current.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!animationConfig.objectMovement && !animationConfig.backgroundElements) {
    return null;
  }

  return (
    <>
      {/* Dynamic Background Elements */}
      {animationConfig.backgroundElements && (
        <BackgroundElements
          mousePosition={mousePosition.current}
          intensity={animationConfig.intensity || intensity}
        />
      )}

      {/* Floating decorative elements */}
      {animationConfig.floating && (
        <>
          <FloatingObject amplitude={0.2} frequency={0.5} offset={0} axis="all">
            <mesh position={[-8, 6, -3]}>
              <octahedronGeometry args={[0.3]} />
              <meshBasicMaterial
                color="#00ffff"
                transparent
                opacity={0.6}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          </FloatingObject>

          <FloatingObject amplitude={0.15} frequency={0.7} offset={Math.PI} axis="y">
            <mesh position={[8, 4, -5]}>
              <tetrahedronGeometry args={[0.4]} />
              <meshBasicMaterial
                color="#ff00ff"
                transparent
                opacity={0.5}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          </FloatingObject>

          <FloatingObject amplitude={0.1} frequency={1.2} offset={Math.PI / 2} axis="all">
            <mesh position={[0, 8, -7]}>
              <icosahedronGeometry args={[0.25]} />
              <meshBasicMaterial
                color="#ff1493"
                transparent
                opacity={0.7}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          </FloatingObject>
        </>
      )}

      {/* Rotating ambient objects */}
      {animationConfig.rotation && (
        <GentleRotation speed={0.3} axis="all">
          <mesh position={[-12, 2, -8]}>
            <torusGeometry args={[0.5, 0.1, 8, 16]} />
            <meshBasicMaterial
              color="#00ff41"
              transparent
              opacity={0.4}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </GentleRotation>
      )}

      {/* Pulsing scale objects */}
      {animationConfig.scale && (
        <PulsingScale amplitude={0.1} frequency={0.8}>
          <mesh position={[12, 3, -6]}>
            <dodecahedronGeometry args={[0.3]} />
            <meshBasicMaterial
              color="#0080ff"
              transparent
              opacity={0.6}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </PulsingScale>
      )}
    </>
  );
};

// Export utility components for use in other parts of the application
export { FloatingObject, GentleRotation, PulsingScale, ColorAnimation };
export default AmbientAnimations;