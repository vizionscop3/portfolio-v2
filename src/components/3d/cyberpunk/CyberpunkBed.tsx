import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { InteractiveObject } from '../InteractiveObject';
import { VisualFeedback } from '../VisualFeedback';
import { useTransitionStore } from '../transitions';

interface CyberpunkBedProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  isVisible?: boolean;
}

const CyberpunkBed: React.FC<CyberpunkBedProps> = ({
  position = [2, 0, 1],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  isVisible = true,
}) => {
  const bedRef = useRef<THREE.Group>(null);
  const { transitionState } = useTransitionStore();

  // Load the uploaded bed model
  const { scene: bedScene } = useGLTF('/models/bed.glb'); // Procedural bed geometry as fallback
  const proceduralBed = useMemo(() => {
    const group = new THREE.Group();

    // Bed frame (main platform)
    const frameGeometry = new THREE.BoxGeometry(2.5, 0.3, 4);
    const frameMaterial = new THREE.MeshStandardMaterial({
      color: '#1a1a2e',
      metalness: 0.8,
      roughness: 0.2,
      emissive: '#0f0f1a',
      emissiveIntensity: 0.1,
    });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.set(0, 0.15, 0);
    group.add(frame);

    // Mattress
    const mattressGeometry = new THREE.BoxGeometry(2.3, 0.2, 3.8);
    const mattressMaterial = new THREE.MeshStandardMaterial({
      color: '#16213e',
      metalness: 0.1,
      roughness: 0.8,
      emissive: '#0a0f1e',
      emissiveIntensity: 0.05,
    });
    const mattress = new THREE.Mesh(mattressGeometry, mattressMaterial);
    mattress.position.set(0, 0.4, 0);
    group.add(mattress);

    // Headboard
    const headboardGeometry = new THREE.BoxGeometry(2.5, 1.2, 0.1);
    const headboardMaterial = new THREE.MeshStandardMaterial({
      color: '#0f3460',
      metalness: 0.9,
      roughness: 0.1,
      emissive: '#16213e',
      emissiveIntensity: 0.2,
    });
    const headboard = new THREE.Mesh(headboardGeometry, headboardMaterial);
    headboard.position.set(0, 0.8, -1.95);
    group.add(headboard);

    // Cyberpunk LED strips on headboard
    const ledStripGeometry = new THREE.BoxGeometry(2.3, 0.05, 0.02);
    const ledMaterial = new THREE.MeshStandardMaterial({
      color: '#00ffff',
      emissive: '#00ffff',
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.8,
    });

    // Multiple LED strips
    for (let i = 0; i < 3; i++) {
      const ledStrip = new THREE.Mesh(ledStripGeometry, ledMaterial);
      ledStrip.position.set(0, 0.4 + i * 0.3, -1.94);
      group.add(ledStrip);
    }

    // Holographic pillow
    const pillowGeometry = new THREE.BoxGeometry(0.6, 0.2, 0.4);
    const pillowMaterial = new THREE.MeshStandardMaterial({
      color: '#16213e',
      metalness: 0.3,
      roughness: 0.6,
      emissive: '#0066cc',
      emissiveIntensity: 0.1,
      transparent: true,
      opacity: 0.9,
    });
    const pillow = new THREE.Mesh(pillowGeometry, pillowMaterial);
    pillow.position.set(0.8, 0.6, 1.5);
    group.add(pillow);

    return group;
  }, []);

  // Animation for cyberpunk effects
  useFrame(state => {
    if (bedRef.current) {
      // Subtle floating animation
      bedRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.02;

      // LED pulsing effect
      const leds = bedRef.current.children.filter(
        child =>
          child instanceof THREE.Mesh &&
          child.material instanceof THREE.MeshStandardMaterial &&
          child.material.emissive.getHex() === 0x00ffff
      );

      leds.forEach((led, index) => {
        if (
          led instanceof THREE.Mesh &&
          led.material instanceof THREE.MeshStandardMaterial
        ) {
          led.material.emissiveIntensity =
            0.3 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.2;
        }
      });
    }
  });

  const handleInteraction = (type: 'hover' | 'click') => {
    if (type === 'click') {
      // Navigate to blog section when bed is clicked
      window.location.hash = '#blog';
    }
  };

  const handleHover = (hovered: boolean) => {
    if (hovered) {
      handleInteraction('hover');
    }
  };

  if (!isVisible) return null;

  return (
    <InteractiveObject
      id="cyberpunk-bed"
      position={new THREE.Vector3(...position)}
      tooltip="Rest & Reflection - View Blog"
      section="blog"
      onHover={handleHover}
      onClick={() => handleInteraction('click')}
    >
      <group ref={bedRef} position={position} rotation={rotation} scale={scale}>
        {bedScene ? (
          // Use uploaded 3D model
          <primitive object={bedScene.clone()} />
        ) : (
          // Use procedural bed as fallback
          <primitive object={proceduralBed} />
        )}

        {/* Interactive book on bed (existing functionality) */}
        <InteractiveObject
          id="bed-book"
          position={new THREE.Vector3(0.5, 0.7, 0.8)}
          tooltip="Blog Posts"
          section="blog"
          onClick={() => (window.location.hash = '#blog')}
        >
          <mesh position={[0.5, 0.7, 0.8]}>
            <boxGeometry args={[0.3, 0.4, 0.05]} />
            <meshStandardMaterial
              color="#0f3460"
              emissive="#00ffff"
              emissiveIntensity={0.2}
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
        </InteractiveObject>

        {/* Holographic effects */}
        <VisualFeedback
          isActive={transitionState.currentSection === 'blog'}
          intensity={0.5}
        />
      </group>
    </InteractiveObject>
  );
};

export default CyberpunkBed;

export { CyberpunkBed };
