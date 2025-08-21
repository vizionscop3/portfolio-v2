import React, { useState } from 'react';
import { SectionId } from '../types';
import { Scene3DWrapper } from './3d';

interface Portfolio3DProps {
  onSectionChange?: (section: SectionId) => void;
}

export const Portfolio3D: React.FC<Portfolio3DProps> = ({
  onSectionChange: _onSectionChange,
}) => {
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="w-full h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
      <Scene3DWrapper />

      {/* Cyberpunk UI overlay */}
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
    </div>
  );
};

export default Portfolio3D;
