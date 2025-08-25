/**
 * Example usage of 3D Error Boundaries
 *
 * This shows how to wrap your existing Canvas components with error protection
 */

import { OrbitControls, Preload } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import React from 'react';
import { SafeCanvasWrapper } from './Safe3DComponents';
import { ThreeDErrorBoundary } from './ThreeDErrorBoundary';

// Example: Safe Hero Canvas
export const SafeHeroCanvas: React.FC = () => {
  return (
    <SafeCanvasWrapper componentName="Hero 3D Scene" className="w-full h-full">
      <Canvas
        frameloop="demand"
        shadows
        dpr={[1, 2]}
        camera={{ position: [20, 3, 5], fov: 25 }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <React.Suspense fallback={null}>
          <OrbitControls
            enableZoom={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
          {/* Your existing Computers component would go here */}
        </React.Suspense>
        <Preload all />
      </Canvas>
    </SafeCanvasWrapper>
  );
};

// Example: Direct error boundary usage
export const SafePortfolioCanvas: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ThreeDErrorBoundary
      enableFallback={true}
      maxRetries={2}
      fallbackComponent={
        <div className="w-full h-full flex items-center justify-center bg-gray-900">
          <div className="text-center text-gray-400">
            <h3 className="text-lg mb-2">3D Portfolio Unavailable</h3>
            <p className="text-sm">Falling back to standard view</p>
          </div>
        </div>
      }
    >
      {children}
    </ThreeDErrorBoundary>
  );
};

// Example: How to wrap your existing Hero component's Canvas
export const WrappedComputersCanvas: React.FC = () => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 500px)');
    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener('change', handleMediaQueryChange);
    return () =>
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
  }, []);

  return (
    <ThreeDErrorBoundary
      enableFallback={true}
      maxRetries={2}
      fallbackComponent={
        <div className="w-full h-full flex items-center justify-center bg-black">
          <div className="text-center text-cyan-400">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg mx-auto mb-4 animate-pulse"></div>
            <h3 className="text-lg mb-2">3D Scene Unavailable</h3>
            <p className="text-sm text-gray-400">
              Portfolio remains fully functional
            </p>
          </div>
        </div>
      }
    >
      <Canvas
        frameloop="demand"
        shadows
        dpr={[1, 2]}
        camera={{ position: [20, 3, 5], fov: 25 }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <React.Suspense fallback={null}>
          <OrbitControls
            enableZoom={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
          {/* Your Computers component */}
          <mesh
            scale={isMobile ? 0.7 : 0.75}
            position={isMobile ? [0, -3, -2.2] : [0, -3.25, -1.5]}
            rotation={[-0.01, -0.2, -0.1]}
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#915EFF" />
          </mesh>
        </React.Suspense>
        <Preload all />
      </Canvas>
    </ThreeDErrorBoundary>
  );
};
