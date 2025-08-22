import React from 'react';
import { useTransitionStore } from './store';

interface LoadingIndicatorProps {
  className?: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  className = '',
}) => {
  const { transitionState } = useTransitionStore();

  if (!transitionState.isTransitioning) {
    return null;
  }

  const progressPercentage = Math.round(transitionState.loadingProgress * 100);
  const sectionName = transitionState.targetSection?.toUpperCase() || 'SECTION';

  return (
    <div className={`fixed inset-0 z-40 pointer-events-none ${className}`}>
      <div className="absolute bottom-8 left-8 text-cyan-400 font-mono">
        <div className="space-y-2">
          <div className="text-sm">LOADING {sectionName} SECTION...</div>

          {/* Progress bar */}
          <div className="w-64 h-1 bg-gray-800 border border-cyan-400">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-magenta-500 transition-all duration-100"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <div className="text-xs text-cyan-300">
            {progressPercentage}% COMPLETE
          </div>
        </div>
      </div>

      {/* Transition progress indicator */}
      <div className="absolute top-8 right-8 text-cyan-400 font-mono text-xs">
        <div className="border border-cyan-400 p-2 bg-black bg-opacity-50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            TRANSITIONING
          </div>
          <div className="mt-1 text-cyan-300">
            {Math.round(transitionState.progress * 100)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
