import React, { Suspense, useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { SectionId } from '../../types/scene';
import { SceneSetup } from '../../utils/scene-setup';
import ErrorFallback from '../ui/ErrorFallback';
import LoadingScreen from '../ui/LoadingScreen';
import CameraController from './CameraController';
import RoomEnvironment from './RoomEnvironment';
import SceneManager from './SceneManager';

interface Scene3DProps {
  activeSection: SectionId;
  onSectionChange: (section: SectionId) => void;
}

interface SceneState {
  isLoading: boolean;
  error: string | null;
  performanceMode: 'high' | 'medium' | 'low';
  webglSupported: boolean;
  fallbackTo2D: boolean;
}

const Scene3D: React.FC<Scene3DProps> = ({
  activeSection,
  onSectionChange,
}) => {
  const [state, setState] = useState<SceneState>({
    isLoading: true,
    error: null,
    performanceMode: 'medium',
    webglSupported: false,
    fallbackTo2D: false,
  });

  // Initialize 3D scene
  useEffect(() => {
    const initializeScene = async () => {
      try {
        const sceneSetup = new SceneSetup();
        const result = await sceneSetup.initialize();

        setState({
          isLoading: false,
          error: null,
          performanceMode: result.performanceMode,
          webglSupported: result.supported,
          fallbackTo2D: result.fallbackTo2D,
        });

        // Cleanup on unmount
        return () => {
          sceneSetup.cleanup();
        };
      } catch (error) {
        console.error('Failed to initialize 3D scene:', error);
        setState({
          isLoading: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          performanceMode: 'low',
          webglSupported: false,
          fallbackTo2D: true,
        });
      }
    };

    initializeScene();
  }, []);

  // Handle errors in 3D scene
  const handleError = (error: Error, errorInfo: any) => {
    console.error('3D Scene Error:', error, errorInfo);
    setState(prev => ({
      ...prev,
      error: error.message,
      fallbackTo2D: true,
    }));
  };

  // Loading state
  if (state.isLoading) {
    return <LoadingScreen message="Initializing 3D environment..." />;
  }

  // Error state or fallback to 2D
  if (state.error || state.fallbackTo2D || !state.webglSupported) {
    return (
      <ErrorFallback
        error={state.error}
        webglSupported={state.webglSupported}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="w-full h-full relative">
      <ErrorBoundary
        FallbackComponent={({ error }) => (
          <ErrorFallback
            error={error.message}
            webglSupported={state.webglSupported}
            onRetry={() => window.location.reload()}
          />
        )}
        onError={handleError}
      >
        <Suspense fallback={<LoadingScreen message="Loading 3D assets..." />}>
          <SceneManager
            activeSection={activeSection}
            onSectionChange={onSectionChange}
            performanceMode={state.performanceMode}
          >
            {/* Camera Controls */}
            <CameraController
              activeSection={activeSection}
              onSectionChange={onSectionChange}
              enableControls={true}
              transitionDuration={2.0}
            />

            {/* Room Environment */}
            <RoomEnvironment performanceMode={state.performanceMode} />

            {/* Interactive Objects will be added in future tasks */}
          </SceneManager>
        </Suspense>
      </ErrorBoundary>

      {/* Performance indicator (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded text-sm">
          <div>Performance: {state.performanceMode}</div>
          <div>
            WebGL: {state.webglSupported ? 'Supported' : 'Not Supported'}
          </div>
          <div>Section: {activeSection}</div>
        </div>
      )}
    </div>
  );
};

export default Scene3D;
