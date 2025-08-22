/**
 * Accessibility Toolbar Component
 *
 * Provides a floating toolbar with quick access to accessibility features
 * including reduced motion, high contrast, and preferences panel.
 */

import React, { useState } from 'react';
import { useAccessibilityPreferences } from '../../hooks/useAccessibilityPreferences';
import { AccessibilityPreferencesPanel } from './AccessibilityPreferencesPanel';

interface AccessibilityToolbarProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}

export const AccessibilityToolbar: React.FC<AccessibilityToolbarProps> = ({
  position = 'bottom-right',
  className = '',
}) => {
  const { preferences, updatePreferences } = useAccessibilityPreferences();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPreferencesPanel, setShowPreferencesPanel] = useState(false);

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  const quickActions = [
    {
      id: 'reduceMotion',
      label: 'Reduce Motion',
      icon: '🎭',
      active: preferences.reduceMotion,
      action: () =>
        updatePreferences({ reduceMotion: !preferences.reduceMotion }),
    },
    {
      id: 'highContrast',
      label: 'High Contrast',
      icon: '🔆',
      active: preferences.highContrast,
      action: () =>
        updatePreferences({ highContrast: !preferences.highContrast }),
    },
    {
      id: 'fontSize',
      label: 'Large Text',
      icon: '📝',
      active:
        preferences.fontSize === 'large' ||
        preferences.fontSize === 'extra-large',
      action: () =>
        updatePreferences({
          fontSize: preferences.fontSize === 'medium' ? 'large' : 'medium',
        }),
    },
    {
      id: 'darkMode',
      label: 'Dark Mode',
      icon: '🌙',
      active: preferences.darkMode,
      action: () => updatePreferences({ darkMode: !preferences.darkMode }),
    },
  ];

  return (
    <>
      {/* Main Toolbar */}
      <div
        className={`fixed z-40 ${positionClasses[position]} ${className}`}
        role="toolbar"
        aria-label="Accessibility tools"
      >
        <div className="flex flex-col items-end space-y-2">
          {/* Expanded Quick Actions */}
          {isExpanded && (
            <div className="flex flex-col space-y-2 mb-2">
              {quickActions.map(action => (
                <QuickActionButton key={action.id} {...action} />
              ))}

              {/* Preferences Panel Button */}
              <button
                onClick={() => setShowPreferencesPanel(true)}
                className="flex items-center space-x-2 px-3 py-2 bg-black/90 border border-cyan-400/50 text-cyan-300 rounded-lg backdrop-blur hover:bg-cyan-400/10 hover:text-cyan-400 transition-colors"
                aria-label="Open accessibility preferences"
              >
                <span className="text-sm">⚙️</span>
                <span className="text-xs font-mono">Settings</span>
              </button>
            </div>
          )}

          {/* Main Toggle Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center justify-center w-12 h-12 rounded-full border-2 backdrop-blur transition-all ${
              isExpanded
                ? 'bg-cyan-400/20 border-cyan-400 text-cyan-400 rotate-45'
                : 'bg-black/80 border-cyan-400/50 text-cyan-300 hover:border-cyan-400 hover:text-cyan-400'
            }`}
            aria-label={
              isExpanded
                ? 'Close accessibility toolbar'
                : 'Open accessibility toolbar'
            }
            aria-expanded={isExpanded}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Accessibility Preferences Panel */}
      <AccessibilityPreferencesPanel
        isOpen={showPreferencesPanel}
        onClose={() => setShowPreferencesPanel(false)}
      />
    </>
  );
};

// Quick Action Button Component
const QuickActionButton: React.FC<{
  id: string;
  label: string;
  icon: string;
  active: boolean;
  action: () => void;
}> = ({ label, icon, active, action }) => (
  <button
    onClick={action}
    className={`flex items-center space-x-2 px-3 py-2 rounded-lg backdrop-blur transition-all ${
      active
        ? 'bg-cyan-400/30 border border-cyan-400 text-cyan-400'
        : 'bg-black/90 border border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/10 hover:text-cyan-400'
    }`}
    aria-label={`${active ? 'Disable' : 'Enable'} ${label.toLowerCase()}`}
    aria-pressed={active}
  >
    <span className="text-sm">{icon}</span>
    <span className="text-xs font-mono whitespace-nowrap">{label}</span>
  </button>
);

/**
 * Skip Links Component
 * Provides keyboard navigation shortcuts
 */
export const SkipLinks: React.FC = () => {
  const { preferences } = useAccessibilityPreferences();

  if (!preferences.skipLinks) return null;

  const skipToMain = () => {
    const main =
      document.querySelector('main') || document.querySelector('[role="main"]');
    if (main) {
      (main as HTMLElement).focus();
      main.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const skipToNav = () => {
    const nav =
      document.querySelector('nav') ||
      document.querySelector('[role="navigation"]');
    if (nav) {
      (nav as HTMLElement).focus();
      nav.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const skipToContent = () => {
    const content =
      document.querySelector('#content') || document.querySelector('.content');
    if (content) {
      (content as HTMLElement).focus();
      content.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="sr-only focus-within:not-sr-only fixed top-0 left-0 z-50 p-4">
      <div className="flex space-x-2">
        <button
          onClick={skipToMain}
          className="px-4 py-2 bg-cyan-400 text-black font-mono text-sm font-medium rounded focus:outline focus:outline-2 focus:outline-cyan-400"
        >
          Skip to Main Content
        </button>

        <button
          onClick={skipToNav}
          className="px-4 py-2 bg-cyan-400 text-black font-mono text-sm font-medium rounded focus:outline focus:outline-2 focus:outline-cyan-400"
        >
          Skip to Navigation
        </button>

        <button
          onClick={skipToContent}
          className="px-4 py-2 bg-cyan-400 text-black font-mono text-sm font-medium rounded focus:outline focus:outline-2 focus:outline-cyan-400"
        >
          Skip to Content
        </button>
      </div>
    </div>
  );
};

/**
 * Accessibility Status Indicator
 * Shows current accessibility status
 */
export const AccessibilityStatusIndicator: React.FC<{
  className?: string;
}> = ({ className = '' }) => {
  const { preferences } = useAccessibilityPreferences();

  const activeFeatures = [
    preferences.reduceMotion && 'Motion Reduced',
    preferences.highContrast && 'High Contrast',
    preferences.fontSize !== 'medium' && 'Large Text',
    preferences.darkMode && 'Dark Mode',
    preferences.reduce3DEffects && '3D Simplified',
  ].filter(Boolean);

  if (activeFeatures.length === 0) return null;

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-30 ${className}`}
    >
      <div className="bg-black/90 border border-cyan-400/50 text-cyan-400 px-4 py-2 rounded-lg backdrop-blur">
        <div className="flex items-center space-x-2">
          <span className="text-sm">♿</span>
          <span className="text-xs font-mono">
            {activeFeatures.length === 1
              ? activeFeatures[0]
              : `${activeFeatures.length} accessibility features active`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityToolbar;
