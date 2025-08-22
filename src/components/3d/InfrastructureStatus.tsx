/**
 * Phase 1 Infrastructure Status Component
 *
 * Shows the status of 3D infrastructure initialization and capabilities
 */

import React, { useState } from 'react';
import { infrastructure3D } from './Infrastructure3D';

export const InfrastructureStatus: React.FC = () => {
  const [showDetails, setShowDetails] = useState(false);

  const capabilities = infrastructure3D.getCapabilities();
  const performanceProfile = infrastructure3D.getPerformanceProfile();

  if (!capabilities || !performanceProfile) {
    return null;
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'high':
        return 'text-green-400 border-green-400';
      case 'medium':
        return 'text-yellow-400 border-yellow-400';
      case 'low':
        return 'text-red-400 border-red-400';
      default:
        return 'text-gray-400 border-gray-400';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'high':
        return '🚀';
      case 'medium':
        return '⚡';
      case 'low':
        return '🔋';
      default:
        return '❓';
    }
  };

  return (
    <div className="absolute bottom-4 right-4 font-mono text-xs">
      <div
        className={`border border-cyan-400 bg-black/80 rounded p-3 cursor-pointer transition-all duration-200 ${
          showDetails ? 'w-80' : 'w-48'
        }`}
        onClick={() => setShowDetails(!showDetails)}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="text-cyan-400 font-bold">
            PHASE 1: 3D INFRASTRUCTURE
          </div>
          <div className="text-cyan-400">{showDetails ? '▼' : '▶'}</div>
        </div>

        {/* Basic Status */}
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-400">WebGL:</span>
            <span className="text-green-400">
              {capabilities.isWebGL2Supported ? 'WebGL2' : 'WebGL1'}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">Performance:</span>
            <span className={getTierColor(performanceProfile.tier)}>
              {getTierIcon(performanceProfile.tier)}{' '}
              {performanceProfile.tier.toUpperCase()}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">Target FPS:</span>
            <span className="text-cyan-400">
              {performanceProfile.targetFPS}
            </span>
          </div>
        </div>

        {/* Detailed Information */}
        {showDetails && (
          <div className="mt-3 pt-3 border-t border-cyan-400/30 space-y-2">
            <div className="text-yellow-400 font-bold text-center mb-2">
              INFRASTRUCTURE DETAILS
            </div>

            <div className="space-y-1">
              <div className="text-gray-400">GPU Renderer:</div>
              <div className="text-white text-xs break-all">
                {capabilities.renderer.substring(0, 40)}
                {capabilities.renderer.length > 40 ? '...' : ''}
              </div>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Max Texture:</span>
              <span className="text-cyan-400">
                {capabilities.maxTextureSize}px
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Shadows:</span>
              <span
                className={
                  performanceProfile.enableShadows
                    ? 'text-green-400'
                    : 'text-red-400'
                }
              >
                {performanceProfile.enableShadows ? 'Enabled' : 'Disabled'}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Post-Processing:</span>
              <span
                className={
                  performanceProfile.enablePostProcessing
                    ? 'text-green-400'
                    : 'text-red-400'
                }
              >
                {performanceProfile.enablePostProcessing
                  ? 'Enabled'
                  : 'Disabled'}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Max Lights:</span>
              <span className="text-cyan-400">
                {performanceProfile.maxLights}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Render Scale:</span>
              <span className="text-cyan-400">
                {Math.round(performanceProfile.renderScale * 100)}%
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Extensions:</span>
              <span className="text-cyan-400">
                {capabilities.extensions.length}
              </span>
            </div>

            <div className="mt-3 pt-2 border-t border-cyan-400/20">
              <div className="text-center text-yellow-400 text-xs">
                Phase 1: Enhanced Infrastructure ✨
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfrastructureStatus;
