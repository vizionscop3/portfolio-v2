/**
 * Safe 3D Canvas Components
 *
 * Wrapped versions of existing 3D components with error boundaries
 */

import React, { Suspense } from 'react';
import { logger } from '../../utils/logger';
import { isWebGLSupported, with3DErrorBoundary } from './errorBoundaryUtils';

// Import existing components
import { MobileScene3D } from './MobileScene3D';
import { Scene3D } from './Scene3D';

/**
 * Loading component for 3D scenes
 */
const ThreeDLoader = () => (
  <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-lg">
    <div className="text-center text-cyan-400">
      <div className="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"></div>
      <p>Loading 3D Experience...</p>
    </div>
  </div>
);

/**
 * Fallback component for 3D failures
 */
const ThreeDFallback = ({ componentName }: { componentName: string }) => (
  <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-lg">
    <div className="text-center text-gray-400">
      <div className="mb-4">
        <svg
          className="w-16 h-16 mx-auto text-gray-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 3a1 1 0 000 2h.01a1 1 0 100-2H5zm4 0a1 1 0 000 2h.01a1 1 0 100-2H9zm4 0a1 1 0 000 2h.01a1 1 0 100-2H13z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold mb-2">3D Content Unavailable</h3>
      <p className="text-sm">The {componentName} couldn't load</p>
      <p className="text-xs mt-1 text-gray-500">
        Portfolio features remain fully accessible
      </p>
    </div>
  </div>
);

/**
 * Safe wrapper for any 3D component
 */
const Safe3DWrapper: React.FC<{
  children: React.ReactNode;
  componentName: string;
  className?: string;
}> = ({ children, componentName, className }) => {
  // Check WebGL support before rendering
  React.useEffect(() => {
    if (!isWebGLSupported()) {
      logger.warn(`WebGL not supported for ${componentName}`);
    }
  }, [componentName]);

  return (
    <div className={className}>
      <Suspense fallback={<ThreeDLoader />}>{children}</Suspense>
    </div>
  );
};

// Define prop interfaces
interface Scene3DProps {
  className?: string;
  onObjectClick?: (section: string) => void;
  enableLODDebug?: boolean;
  performanceThreshold?: number;
}

interface MobileScene3DProps {
  className?: string;
  onInteraction?: (type: string, data?: unknown) => void;
  enableDebug?: boolean;
}

/**
 * Safe Scene 3D
 */
export const SafeScene3D = with3DErrorBoundary(
  (props: Scene3DProps) => (
    <Safe3DWrapper componentName="Scene 3D" className={props.className}>
      <Scene3D {...props} />
    </Safe3DWrapper>
  ),
  {
    enableFallback: true,
    maxRetries: 2,
    fallbackComponent: <ThreeDFallback componentName="3D Scene" />,
  }
);

/**
 * Safe Mobile Scene 3D
 */
export const SafeMobileScene3D = with3DErrorBoundary(
  (props: MobileScene3DProps) => (
    <Safe3DWrapper componentName="Mobile Scene 3D" className={props.className}>
      <MobileScene3D {...props} />
    </Safe3DWrapper>
  ),
  {
    enableFallback: true,
    maxRetries: 2,
    fallbackComponent: <ThreeDFallback componentName="Mobile 3D Scene" />,
  }
);

/**
 * Generic Safe Canvas Wrapper for any 3D component
 */
export const SafeCanvasWrapper: React.FC<{
  children: React.ReactNode;
  componentName?: string;
  className?: string;
}> = ({ children, componentName = '3D Component', className }) => {
  const WrappedComponent = with3DErrorBoundary(
    () => (
      <Safe3DWrapper componentName={componentName} className={className}>
        {children}
      </Safe3DWrapper>
    ),
    {
      enableFallback: true,
      maxRetries: 2,
      fallbackComponent: <ThreeDFallback componentName={componentName} />,
    }
  );

  return <WrappedComponent />;
};
