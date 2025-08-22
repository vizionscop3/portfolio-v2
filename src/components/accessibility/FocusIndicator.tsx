/**
 * Focus Indicator Component
 *
 * Provides visual feedback for keyboard navigation focus in the 3D scene,
 * with cyberpunk-themed styling and accessibility features.
 */

import React from 'react';
import { useFocusIndicator } from '../../hooks/useKeyboardNavigation';

interface FocusIndicatorProps {
  isVisible: boolean;
  position?: { x: number; y: number };
  objectName?: string;
  description?: string;
  variant?: 'default' | 'active' | 'interactive';
  size?: 'small' | 'medium' | 'large';
}

export const FocusIndicator: React.FC<FocusIndicatorProps> = ({
  isVisible,
  position = { x: 0, y: 0 },
  objectName,
  description,
  variant = 'default',
  size = 'medium',
}) => {
  const showIndicator = useFocusIndicator(isVisible);

  if (!showIndicator) return null;

  const sizeClasses = {
    small: 'w-6 h-6 border-2',
    medium: 'w-8 h-8 border-2',
    large: 'w-12 h-12 border-4',
  };

  const variantClasses = {
    default: 'border-cyan-400 shadow-cyan-400/50',
    active: 'border-magenta-400 shadow-magenta-400/50',
    interactive: 'border-green-400 shadow-green-400/50',
  };

  const pulseAnimation = variant === 'active' ? 'animate-pulse' : '';

  return (
    <div
      className="fixed pointer-events-none z-50 transition-all duration-300"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Main focus ring */}
      <div
        className={`
          rounded-full border-dashed
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${pulseAnimation}
          shadow-lg
          bg-black/20
          backdrop-blur-sm
        `}
      >
        {/* Inner glow effect */}
        <div
          className={`
            absolute inset-0 rounded-full
            ${variantClasses[variant]}
            opacity-30 blur-sm
          `}
        />

        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`
              w-2 h-2 rounded-full
              ${variant === 'default' && 'bg-cyan-400'}
              ${variant === 'active' && 'bg-magenta-400'}
              ${variant === 'interactive' && 'bg-green-400'}
              animate-ping
            `}
          />
        </div>
      </div>

      {/* Tooltip with object information */}
      {(objectName || description) && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2">
          <div className="bg-black/90 text-cyan-300 px-3 py-2 rounded-lg border border-cyan-500/30 text-sm font-mono whitespace-nowrap">
            {objectName && (
              <div className="font-semibold text-cyan-400">{objectName}</div>
            )}
            {description && (
              <div className="text-xs text-cyan-300/80 mt-1">{description}</div>
            )}

            {/* Keyboard hint */}
            <div className="text-xs text-cyan-500/60 mt-1 border-t border-cyan-500/20 pt-1">
              Press ENTER to activate • ESC to clear focus
            </div>
          </div>

          {/* Arrow pointing to focused object */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2">
            <div
              className={`
                w-0 h-0 border-l-4 border-r-4 border-b-4
                border-l-transparent border-r-transparent
                ${variant === 'default' && 'border-b-cyan-500/30'}
                ${variant === 'active' && 'border-b-magenta-500/30'}
                ${variant === 'interactive' && 'border-b-green-500/30'}
              `}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FocusIndicator;
