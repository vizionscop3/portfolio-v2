import React, { useState } from 'react';
import { SectionId } from '../types';
import { Scene3DWrapper } from './3d';
import { MobileScene3D } from './3d/MobileScene3D';
import { Scene3DErrorBoundary } from './3d/Scene3DErrorBoundary';
import { useDevice } from '../hooks/useMobile';
import {
  AccessibilityToolbar,
  SkipLinks,
  AccessibilityStatusIndicator,
} from './accessibility/AccessibilityToolbar';

interface Portfolio3DProps {
  onSectionChange?: (section: SectionId) => void;
}

export const Portfolio3D: React.FC<Portfolio3DProps> = ({
  onSectionChange,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const device = useDevice();

  // Simulate loading completion
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl font-mono text-cyan-400 animate-pulse">
            LOADING...
          </div>
          <div className="text-cyan-300 font-mono">
            Initializing 3D Portfolio Experience
          </div>
          <div className="flex justify-center space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const handleSectionChange = (section: string) => {
    if (onSectionChange) {
      onSectionChange(section as SectionId);
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
      {/* Skip links for accessibility */}
      <SkipLinks />

      {/* Accessibility status indicator */}
      <AccessibilityStatusIndicator />

      {/* Main content */}
      <main role="main" className="w-full h-full">
        {/* 3D Scene with Error Boundary */}
        <Scene3DErrorBoundary
          onSectionChange={onSectionChange}
          onError={(error, errorInfo) => {
            // Log error for debugging
            console.error('3D Scene Error:', error, errorInfo);

            // Report to analytics if available
            if (typeof window !== 'undefined' && (window as any).gtag) {
              (window as any).gtag('event', 'exception', {
                description: `Portfolio3D Error: ${error.message}`,
                fatal: false,
              });
            }
          }}
        >
          {/* Conditionally render mobile or desktop scene */}
          {device.isMobile ? (
            <MobileScene3D
              onObjectClick={handleSectionChange}
              className="w-full h-full"
            />
          ) : (
            <Scene3DWrapper />
          )}
        </Scene3DErrorBoundary>
      </main>

      {/* Cyberpunk UI overlay - hide on mobile for cleaner experience */}
      {!device.isMobile && (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {/* Top bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-magenta-500 to-cyan-400 opacity-60"></div>

          {/* Corner decorations */}
          <div className="absolute top-4 right-4 text-cyan-400 font-mono text-xs">
            <div className="border border-cyan-400 p-2 bg-black bg-opacity-50">
              PORTFOLIO v2.0
            </div>
          </div>

          {/* Scan lines effect */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-full opacity-10 bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-pulse"></div>
          </div>
        </div>
      )}

      {/* Accessibility toolbar */}
      <AccessibilityToolbar position="bottom-right" />
    </div>
  );
};

export default Portfolio3D;
