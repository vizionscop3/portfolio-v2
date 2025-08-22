/**
 * Mobile-Optimized 3D Scene Component
 *
 * Provides a mobile-responsive 3D scene with touch controls,
 * adaptive performance settings, and mobile-specific optimizations.
 */

import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
} from '@react-three/drei';
import { Vector3 } from 'three';
import { ObjectManager } from './ObjectManager';
import {
  useDevice,
  useMobilePerformance,
  useTouchGestures,
  useOrientation,
} from '../../hooks/useMobile';
import { useMobilePerformanceOptimization } from '../../hooks/usePerformanceMonitor';
import { LODManager } from './LODManager';
import {
  useMotionPreferences,
  use3DAccessibility,
  useVisualAccessibility,
} from '../../hooks/useAccessibilityPreferences';

interface MobileScene3DProps {
  onObjectClick?: (section: string) => void;
  className?: string;
}

export const MobileScene3D: React.FC<MobileScene3DProps> = ({
  onObjectClick,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controlsRef = useRef<any>(null);
  const device = useDevice();
  const mobilePerf = useMobilePerformance();
  const orientation = useOrientation();
  const { optimizations } = useMobilePerformanceOptimization();
  const motionPrefs = useMotionPreferences();
  const visualAccessibility = useVisualAccessibility();
  const accessibility3D = use3DAccessibility();

  // Camera positioning for mobile
  const [cameraPosition, setCameraPosition] = useState<Vector3>(() => {
    if (device.isMobile) {
      return orientation.isPortrait
        ? new Vector3(0, 2, 8) // Further back in portrait
        : new Vector3(0, 1, 6); // Closer in landscape
    }
    return new Vector3(0, 1, 5); // Default for tablets/desktop
  });

  // Update camera position on orientation change
  useEffect(() => {
    if (device.isMobile) {
      const newPosition = orientation.isPortrait
        ? new Vector3(0, 2, 8)
        : new Vector3(0, 1, 6);
      setCameraPosition(newPosition);
    }
  }, [orientation.orientation, orientation.isPortrait, device.isMobile]);

  // Touch gesture handling
  const touchGestures = useTouchGestures(canvasRef, {
    enablePan: true,
    enablePinch: true,
    enableTap: true,
    enableDoubleTap: true,
    enableSwipe: true,
    panThreshold: device.isMobile ? 15 : 10,
    pinchThreshold: 0.05,
    swipeThreshold: device.isMobile ? 40 : 30,
  });

  // Set up touch gesture handlers
  useEffect(() => {
    if (!controlsRef.current) return;

    const controls = controlsRef.current;

    // Pan gesture - rotate camera
    touchGestures.setOnPan(delta => {
      if (controls) {
        const sensitivity = device.isMobile ? 0.003 : 0.005;
        controls.rotateLeft(delta.x * sensitivity);
        controls.rotateUp(-delta.y * sensitivity);
        controls.update();
      }
    });

    // Pinch gesture - zoom
    touchGestures.setOnPinch(scale => {
      if (controls) {
        const zoomSpeed = device.isMobile ? 0.5 : 0.3;
        const zoomDelta = (scale - 1) * zoomSpeed;
        controls.dollyIn(1 - zoomDelta);
        controls.update();
      }
    });

    // Double tap - reset camera
    touchGestures.setOnDoubleTap(() => {
      if (controls) {
        controls.reset();
      }
    });

    // Swipe gestures for quick navigation
    touchGestures.setOnSwipe((direction, velocity) => {
      if (!controls) return;

      const swipeSpeed = Math.min(velocity * 0.1, 0.5);

      switch (direction) {
        case 'left':
          controls.rotateLeft(swipeSpeed);
          break;
        case 'right':
          controls.rotateLeft(-swipeSpeed);
          break;
        case 'up':
          controls.rotateUp(swipeSpeed);
          break;
        case 'down':
          controls.rotateUp(-swipeSpeed);
          break;
      }
      controls.update();
    });
  }, [touchGestures, device.isMobile]);

  // Mobile-specific canvas settings with accessibility optimizations
  const canvasSettings = {
    dpr: Math.min(mobilePerf.pixelRatio, device.isMobile ? 2 : 3),
    performance: {
      min: device.isMobile ? 20 : 45,
      max: device.isMobile ? 45 : 120,
      debounce: device.isMobile ? 300 : 100,
    },
    gl: {
      powerPreference: device.isMobile
        ? ('default' as const)
        : ('high-performance' as const),
      antialias: optimizations.antialiasing && !accessibility3D.simplifyVisuals,
      alpha: true,
      preserveDrawingBuffer: false,
      failIfMajorPerformanceCaveat:
        device.isMobile || accessibility3D.shouldSimplify3D,
      stencil: false,
      depth: true,
    },
  };

  // Camera settings based on device
  const cameraSettings = {
    fov: device.isMobile ? (orientation.isPortrait ? 65 : 55) : 50,
    near: 0.1,
    far: mobilePerf.renderDistance,
    position: cameraPosition,
  };

  // Controls settings for mobile with accessibility considerations
  const controlsSettings = {
    enablePan: false, // Disable built-in pan, use touch gestures
    enableZoom: !device.hasTouch, // Disable zoom on touch devices, use pinch
    enableRotate: !device.hasTouch, // Disable rotate on touch, use pan gesture
    enableDamping: !motionPrefs.shouldReduceMotion,
    dampingFactor: motionPrefs.shouldReduceMotion
      ? 0.01
      : device.isMobile
        ? 0.08
        : 0.05,
    rotateSpeed: motionPrefs.shouldReduceMotion
      ? 0.3
      : device.isMobile
        ? 0.8
        : 1.0,
    zoomSpeed: motionPrefs.shouldReduceMotion
      ? 0.3
      : device.isMobile
        ? 0.8
        : 1.0,
    panSpeed: motionPrefs.shouldReduceMotion
      ? 0.3
      : device.isMobile
        ? 0.8
        : 1.0,
    maxPolarAngle: Math.PI * 0.8, // Prevent camera from going too low
    minPolarAngle: Math.PI * 0.1, // Prevent camera from going too high
    maxDistance: device.isMobile ? 15 : 20,
    minDistance: device.isMobile ? 3 : 2,
    target: new Vector3(0, 0, 0),
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      <Canvas
        ref={canvasRef}
        {...canvasSettings}
        className="touch-none" // Prevent default touch behaviors
      >
        {/* Camera */}
        <PerspectiveCamera makeDefault {...cameraSettings} />

        {/* Controls */}
        <OrbitControls ref={controlsRef} {...controlsSettings} />

        {/* LOD Manager for performance optimization */}
        <LODManager enableDebugUI={false} />

        {/* Lighting optimized for mobile and accessibility */}
        <ambientLight
          intensity={visualAccessibility.highContrast ? 0.4 : 0.2}
          color={visualAccessibility.highContrast ? '#FFFFFF' : '#00FFFF'}
        />
        <directionalLight
          position={[10, 10, 5]}
          intensity={
            visualAccessibility.highContrast
              ? 1.2
              : optimizations.shadowQuality !== 'low' &&
                  !accessibility3D.disableShadows
                ? 1
                : 0.5
          }
          color={visualAccessibility.highContrast ? '#FFFFFF' : '#FFFFFF'}
          castShadow={
            optimizations.shadowQuality !== 'low' &&
            !accessibility3D.disableShadows &&
            !accessibility3D.simplifyVisuals
          }
        />
        {optimizations.maxLights > 2 && !accessibility3D.simplifyVisuals && (
          <pointLight
            position={[-10, -10, -5]}
            intensity={visualAccessibility.highContrast ? 0.5 : 0.3}
            color={visualAccessibility.highContrast ? '#FFFFFF' : '#FF00FF'}
          />
        )}

        {/* Environment with reduced quality for mobile */}
        <Environment
          preset="city"
          background={false}
          resolution={optimizations.textureSize}
        />

        {/* 3D Objects with LOD optimization */}
        <Suspense fallback={<MobileLoadingFallback />}>
          <ObjectManager onObjectClick={onObjectClick} />
        </Suspense>

        {/* Mobile-specific effects with accessibility considerations */}
        {optimizations.postProcessing &&
          !accessibility3D.disableBloom &&
          !accessibility3D.simplifyVisuals && (
            <Suspense fallback={null}>
              <MobilePostProcessing />
            </Suspense>
          )}
      </Canvas>

      {/* Mobile UI Overlays */}
      <MobileUIOverlay
        device={device}
        orientation={orientation}
        onCameraReset={() => controlsRef.current?.reset()}
      />

      {/* Touch feedback */}
      {device.hasTouch && <TouchFeedback />}
    </div>
  );
};

// Mobile-specific loading fallback
const MobileLoadingFallback: React.FC = () => (
  <mesh>
    <boxGeometry args={[1, 1, 1]} />
    <meshBasicMaterial color="#333" wireframe />
  </mesh>
);

// Mobile-optimized post-processing
const MobilePostProcessing: React.FC = () => {
  const device = useDevice();

  // Simplified post-processing for mobile
  if (device.isMobile) {
    return null; // Skip heavy post-processing on mobile
  }

  return null; // Placeholder for actual post-processing
};

// Mobile UI overlay component
interface MobileUIOverlayProps {
  device: ReturnType<typeof useDevice>;
  orientation: ReturnType<typeof useOrientation>;
  onCameraReset: () => void;
}

const MobileUIOverlay: React.FC<MobileUIOverlayProps> = ({
  device,
  orientation,
  onCameraReset,
}) => {
  if (!device.isMobile) return null;

  return (
    <>
      {/* Touch instructions for first-time users */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="bg-black/80 text-cyan-400 text-xs p-3 rounded border border-cyan-400/30 backdrop-blur">
          <div className="font-mono mb-1">Touch Controls:</div>
          <div className="text-cyan-300/80 space-y-1">
            <div>• Drag to rotate camera</div>
            <div>• Pinch to zoom in/out</div>
            <div>• Tap objects to interact</div>
            <div>• Double-tap to reset view</div>
          </div>
        </div>
      </div>

      {/* Camera reset button */}
      <button
        onClick={onCameraReset}
        className="absolute bottom-4 right-4 z-10 bg-cyan-400/20 border border-cyan-400 text-cyan-400 p-3 rounded-full backdrop-blur hover:bg-cyan-400/30 transition-colors"
        aria-label="Reset camera view"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </button>

      {/* Orientation notice for landscape phones */}
      {device.isMobile && orientation.isLandscape && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="bg-black/90 text-cyan-400 p-4 rounded border border-cyan-400/50 backdrop-blur text-center">
            <div className="font-mono text-sm mb-2">Landscape Mode</div>
            <div className="text-xs text-cyan-300/80">
              Rotate to portrait for optimal experience
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Touch feedback component
const TouchFeedback: React.FC = () => {
  const [touchPoints, setTouchPoints] = useState<
    Array<{ id: number; x: number; y: number }>
  >([]);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const points = Array.from(e.touches).map(touch => ({
        id: touch.identifier,
        x: touch.clientX,
        y: touch.clientY,
      }));
      setTouchPoints(points);
    };

    const handleTouchEnd = () => {
      setTouchPoints([]);
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, []);

  return (
    <>
      {touchPoints.map(point => (
        <div
          key={point.id}
          className="fixed pointer-events-none z-50 w-12 h-12 rounded-full border-2 border-cyan-400/50 bg-cyan-400/10 transform -translate-x-1/2 -translate-y-1/2 animate-ping"
          style={{
            left: point.x,
            top: point.y,
          }}
        />
      ))}
    </>
  );
};

export default MobileScene3D;
