import React from 'react';

interface LoadingScreenProps {
  message?: string;
  progress?: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Loading...',
  progress,
}) => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="text-center">
        {/* Loading Animation */}
        <div className="relative mb-8">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>

          {/* Inner spinning element */}
          <div
            className="absolute inset-0 w-8 h-8 border-2 border-purple-200 border-t-purple-500 rounded-full animate-spin mx-auto mt-4 ml-4"
            style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}
          ></div>
        </div>

        {/* Loading Message */}
        <h2 className="text-xl font-semibold text-white mb-4">{message}</h2>

        {/* Progress Bar */}
        {progress !== undefined && (
          <div className="w-64 mx-auto">
            <div className="bg-gray-700 rounded-full h-2 mb-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
              ></div>
            </div>
            <p className="text-gray-300 text-sm">
              {Math.round(progress)}% Complete
            </p>
          </div>
        )}

        {/* Loading Tips */}
        <div className="mt-8 text-gray-400 text-sm max-w-md mx-auto">
          <p>Preparing your immersive 3D experience...</p>
          {progress === undefined && (
            <p className="mt-2">This may take a moment on first load.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
