/**
 * Deployment Environment Info Component
 * Shows current deployment environment and build information
 */

import React, { useState } from 'react';

interface DeploymentInfoProps {
  className?: string;
}

export const DeploymentInfo: React.FC<DeploymentInfoProps> = ({
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Get environment variables (set during build)
  const environment =
    import.meta.env.VITE_DEPLOYMENT_ENVIRONMENT || 'development';
  const buildTimestamp = import.meta.env.VITE_BUILD_TIMESTAMP || 'unknown';
  const gitCommit = import.meta.env.VITE_GIT_COMMIT || 'unknown';
  const branchName = import.meta.env.VITE_BRANCH_NAME || 'unknown';

  // Determine environment color and icon
  const getEnvironmentDisplay = (env: string) => {
    if (env === 'development') {
      return { color: 'bg-blue-500', icon: '🔧', label: 'Development' };
    } else if (env.startsWith('phase-')) {
      return {
        color: 'bg-yellow-500',
        icon: '🚧',
        label: `Phase: ${env.replace('phase-', '')}`,
      };
    } else if (env.startsWith('feature-')) {
      return {
        color: 'bg-purple-500',
        icon: '🧪',
        label: `Feature: ${env.replace('feature-', '')}`,
      };
    } else if (env === 'production' || env === 'main') {
      return { color: 'bg-green-500', icon: '🚀', label: 'Production' };
    } else {
      return { color: 'bg-gray-500', icon: '❓', label: env };
    }
  };

  const envDisplay = getEnvironmentDisplay(environment);

  // Only show in non-production environments
  if (environment === 'production' || environment === 'main') {
    return null;
  }

  return (
    <div className={`fixed top-4 right-4 z-50 ${className}`}>
      <div
        className={`${envDisplay.color} text-white px-3 py-2 rounded-lg shadow-lg cursor-pointer transition-all duration-200 ${
          isExpanded ? 'rounded-b-none' : ''
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2 text-sm font-medium">
          <span>{envDisplay.icon}</span>
          <span>{envDisplay.label}</span>
          <span className="text-xs opacity-75">{isExpanded ? '▼' : '▶'}</span>
        </div>
      </div>

      {isExpanded && (
        <div className="bg-black/90 text-white p-4 rounded-b-lg shadow-lg border-t border-white/20">
          <div className="space-y-2 text-xs">
            <div>
              <span className="opacity-75">Environment:</span>
              <span className="ml-2 font-mono">{environment}</span>
            </div>
            <div>
              <span className="opacity-75">Branch:</span>
              <span className="ml-2 font-mono">{branchName}</span>
            </div>
            <div>
              <span className="opacity-75">Commit:</span>
              <span className="ml-2 font-mono">
                {gitCommit.substring(0, 8)}
              </span>
            </div>
            <div>
              <span className="opacity-75">Built:</span>
              <span className="ml-2 font-mono">
                {buildTimestamp !== 'unknown'
                  ? new Date(buildTimestamp).toLocaleString()
                  : 'unknown'}
              </span>
            </div>
          </div>

          {environment.startsWith('phase-') && (
            <div className="mt-3 pt-2 border-t border-white/20">
              <p className="text-xs opacity-75">
                🧪 This is a phase preview environment.
                <br />
                Merge to main for production deployment.
              </p>
            </div>
          )}

          {environment.startsWith('feature-') && (
            <div className="mt-3 pt-2 border-t border-white/20">
              <p className="text-xs opacity-75">
                🔬 This is a feature preview environment.
                <br />
                Create PR when ready for review.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DeploymentInfo;
