import React from 'react';
import { SectionId } from '@/types';

interface Scene3DFallbackProps {
  onSectionChange?: (section: SectionId) => void;
  error?: Error;
  className?: string;
}

export const Scene3DFallback: React.FC<Scene3DFallbackProps> = ({
  onSectionChange,
  error,
  className = '',
}) => {
  const handleSectionClick = (section: SectionId) => {
    if (onSectionChange) {
      onSectionChange(section);
    }
  };

  return (
    <div
      className={`w-full h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black ${className}`}
    >
      {/* Fallback UI Header */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-magenta-500 to-cyan-400 opacity-60"></div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        {/* Error Message (if any) */}
        {error && (
          <div className="mb-8 p-4 border border-red-500 bg-red-900 bg-opacity-30 rounded-lg max-w-md">
            <h3 className="text-red-400 font-mono text-sm mb-2">
              3D Scene Error
            </h3>
            <p className="text-red-300 font-mono text-xs">
              {error.message || 'Failed to initialize 3D environment'}
            </p>
          </div>
        )}

        {/* Fallback Title */}
        <div className="mb-12">
          <h1 className="text-6xl md:text-8xl font-mono text-cyan-400 mb-4 animate-pulse">
            PORTFOLIO v2.0
          </h1>
          <p className="text-cyan-300 font-mono text-lg">
            {error ? '2D Fallback Mode' : 'Loading 3D Experience...'}
          </p>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl">
          {/* About Section */}
          <button
            onClick={() => handleSectionClick('about')}
            className="group relative p-6 bg-black bg-opacity-50 border border-cyan-400 rounded-lg hover:border-magenta-500 hover:bg-opacity-70 transition-all duration-300"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
              🚀
            </div>
            <h3 className="text-cyan-400 font-mono text-lg mb-2">ABOUT</h3>
            <p className="text-cyan-300 font-mono text-sm opacity-70">
              Personal journey & vision
            </p>
            {/* Hover effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-magenta-500 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
          </button>

          {/* Tech Section */}
          <button
            onClick={() => handleSectionClick('tech')}
            className="group relative p-6 bg-black bg-opacity-50 border border-cyan-400 rounded-lg hover:border-green-400 hover:bg-opacity-70 transition-all duration-300"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
              💻
            </div>
            <h3 className="text-cyan-400 font-mono text-lg mb-2">TECH</h3>
            <p className="text-cyan-300 font-mono text-sm opacity-70">
              Development skills & projects
            </p>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-green-400 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
          </button>

          {/* Blog Section */}
          <button
            onClick={() => handleSectionClick('blog')}
            className="group relative p-6 bg-black bg-opacity-50 border border-cyan-400 rounded-lg hover:border-yellow-400 hover:bg-opacity-70 transition-all duration-300"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
              📖
            </div>
            <h3 className="text-cyan-400 font-mono text-lg mb-2">BLOG</h3>
            <p className="text-cyan-300 font-mono text-sm opacity-70">
              Thoughts & insights
            </p>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-yellow-400 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
          </button>

          {/* Fashion Section */}
          <button
            onClick={() => handleSectionClick('fashion')}
            className="group relative p-6 bg-black bg-opacity-50 border border-cyan-400 rounded-lg hover:border-pink-400 hover:bg-opacity-70 transition-all duration-300"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
              👗
            </div>
            <h3 className="text-cyan-400 font-mono text-lg mb-2">FASHION</h3>
            <p className="text-cyan-300 font-mono text-sm opacity-70">
              Style & creativity
            </p>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-pink-400 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
          </button>

          {/* Merch Section */}
          <button
            onClick={() => handleSectionClick('merch')}
            className="group relative p-6 bg-black bg-opacity-50 border border-cyan-400 rounded-lg hover:border-purple-400 hover:bg-opacity-70 transition-all duration-300"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
              🛍️
            </div>
            <h3 className="text-cyan-400 font-mono text-lg mb-2">MERCH</h3>
            <p className="text-cyan-300 font-mono text-sm opacity-70">
              Products & collections
            </p>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
          </button>

          {/* Retry 3D Button (if error) */}
          {error && (
            <button
              onClick={() => window.location.reload()}
              className="group relative p-6 bg-black bg-opacity-50 border border-red-400 rounded-lg hover:border-red-300 hover:bg-opacity-70 transition-all duration-300"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                🔄
              </div>
              <h3 className="text-red-400 font-mono text-lg mb-2">RETRY</h3>
              <p className="text-red-300 font-mono text-sm opacity-70">
                Reload 3D experience
              </p>
              <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-300 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
            </button>
          )}
        </div>

        {/* Technical Info */}
        <div className="mt-12 text-center">
          <p className="text-cyan-300 font-mono text-xs opacity-50 mb-2">
            {error
              ? 'WebGL not supported or initialization failed'
              : 'Preparing WebGL context...'}
          </p>
          <div className="flex justify-center space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Corner decoration */}
      <div className="absolute top-4 right-4 text-cyan-400 font-mono text-xs">
        <div className="border border-cyan-400 p-2 bg-black bg-opacity-50">
          {error ? 'FALLBACK MODE' : 'INITIALIZING...'}
        </div>
      </div>

      {/* Scan lines effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full opacity-5 bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-pulse"></div>
      </div>
    </div>
  );
};

export default Scene3DFallback;
