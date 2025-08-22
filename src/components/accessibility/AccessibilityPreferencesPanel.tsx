/**
 * Accessibility Preferences Panel Component
 *
 * Provides a comprehensive UI for users to configure their accessibility
 * preferences including reduced motion, high contrast, and other settings.
 */

import React, { useState } from 'react';
import { useAccessibilityPreferences } from '../../hooks/useAccessibilityPreferences';
import { AccessibilityPreferences } from '../../utils/accessibilityPreferences';

interface AccessibilityPreferencesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export const AccessibilityPreferencesPanel: React.FC<
  AccessibilityPreferencesPanelProps
> = ({ isOpen, onClose, className = '' }) => {
  const { preferences, updatePreferences, resetToDefaults, applyPreset } =
    useAccessibilityPreferences();

  const [activeTab, setActiveTab] = useState<
    'motion' | 'visual' | 'navigation' | '3d'
  >('motion');

  if (!isOpen) return null;

  const handleToggle = (key: keyof AccessibilityPreferences) => {
    updatePreferences({ [key]: !preferences[key] });
  };

  const handleSelect = <K extends keyof AccessibilityPreferences>(
    key: K,
    value: AccessibilityPreferences[K]
  ) => {
    updatePreferences({ [key]: value });
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm ${className}`}
    >
      <div className="w-full max-w-4xl max-h-[90vh] bg-black/95 border border-cyan-400/50 rounded-lg backdrop-blur-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cyan-400/30">
          <div>
            <h2 className="text-2xl font-mono font-bold text-cyan-400">
              Accessibility Preferences
            </h2>
            <p className="text-sm text-cyan-300/80 mt-1">
              Customize your experience for better accessibility
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Quick Presets */}
            <select
              value=""
              onChange={e =>
                e.target.value && applyPreset(e.target.value as any)
              }
              className="bg-black/50 border border-cyan-400/50 text-cyan-300 px-3 py-1 rounded font-mono text-sm"
              aria-label="Apply accessibility preset"
            >
              <option value="">Apply Preset...</option>
              <option value="reduced-motion">Reduced Motion</option>
              <option value="high-contrast">High Contrast</option>
              <option value="screen-reader-optimized">Screen Reader</option>
              <option value="low-vision">Low Vision</option>
              <option value="motor-impairment">Motor Impairment</option>
            </select>

            <button
              onClick={resetToDefaults}
              className="px-4 py-2 bg-yellow-600/20 border border-yellow-500 text-yellow-400 rounded font-mono text-sm hover:bg-yellow-600/30 transition-colors"
            >
              Reset
            </button>

            <button
              onClick={onClose}
              className="text-cyan-300 hover:text-cyan-100 transition-colors"
              aria-label="Close preferences panel"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row h-full">
          {/* Tab Navigation */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-cyan-400/30 bg-black/30">
            <div className="p-4 space-y-1">
              {[
                { id: 'motion', label: 'Motion & Animation', icon: '🎭' },
                { id: 'visual', label: 'Visual & Display', icon: '👁️' },
                { id: 'navigation', label: 'Navigation', icon: '⌨️' },
                { id: '3d', label: '3D Performance', icon: '🎮' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/50'
                      : 'text-cyan-300 hover:bg-cyan-400/10 hover:text-cyan-200'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="font-mono text-sm">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'motion' && (
              <MotionPreferencesTab
                preferences={preferences}
                onToggle={handleToggle}
              />
            )}

            {activeTab === 'visual' && (
              <VisualPreferencesTab
                preferences={preferences}
                onToggle={handleToggle}
                onSelect={handleSelect}
              />
            )}

            {activeTab === 'navigation' && (
              <NavigationPreferencesTab
                preferences={preferences}
                onToggle={handleToggle}
                onSelect={handleSelect}
              />
            )}

            {activeTab === '3d' && (
              <ThreeDPreferencesTab
                preferences={preferences}
                onToggle={handleToggle}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Motion Preferences Tab
const MotionPreferencesTab: React.FC<{
  preferences: AccessibilityPreferences;
  onToggle: (key: keyof AccessibilityPreferences) => void;
}> = ({ preferences, onToggle }) => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-mono font-semibold text-cyan-400 mb-4">
        Motion & Animation Settings
      </h3>
      <p className="text-sm text-cyan-300/80 mb-6">
        Control animations and motion effects for better comfort and
        accessibility.
      </p>
    </div>

    <div className="space-y-4">
      <PreferenceToggle
        id="reduceMotion"
        label="Reduce Motion"
        description="Minimizes animations and transitions throughout the interface"
        checked={preferences.reduceMotion}
        onChange={() => onToggle('reduceMotion')}
      />

      <PreferenceToggle
        id="reduceAnimations"
        label="Reduce Animations"
        description="Disables decorative animations while keeping functional transitions"
        checked={preferences.reduceAnimations}
        onChange={() => onToggle('reduceAnimations')}
      />

      <PreferenceToggle
        id="disableParallax"
        label="Disable Parallax Effects"
        description="Removes parallax scrolling and depth effects"
        checked={preferences.disableParallax}
        onChange={() => onToggle('disableParallax')}
      />

      <PreferenceToggle
        id="disableAutoPlay"
        label="Disable Auto-play"
        description="Prevents media and animations from playing automatically"
        checked={preferences.disableAutoPlay}
        onChange={() => onToggle('disableAutoPlay')}
      />
    </div>
  </div>
);

// Visual Preferences Tab
const VisualPreferencesTab: React.FC<{
  preferences: AccessibilityPreferences;
  onToggle: (key: keyof AccessibilityPreferences) => void;
  onSelect: <K extends keyof AccessibilityPreferences>(
    key: K,
    value: AccessibilityPreferences[K]
  ) => void;
}> = ({ preferences, onToggle, onSelect }) => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-mono font-semibold text-cyan-400 mb-4">
        Visual & Display Settings
      </h3>
      <p className="text-sm text-cyan-300/80 mb-6">
        Adjust visual elements for better readability and comfort.
      </p>
    </div>

    <div className="space-y-6">
      <PreferenceToggle
        id="highContrast"
        label="High Contrast Mode"
        description="Increases contrast between text and background for better readability"
        checked={preferences.highContrast}
        onChange={() => onToggle('highContrast')}
      />

      <PreferenceToggle
        id="darkMode"
        label="Dark Mode"
        description="Uses dark theme throughout the interface"
        checked={preferences.darkMode}
        onChange={() => onToggle('darkMode')}
      />

      <div className="space-y-2">
        <label className="block text-sm font-mono font-medium text-cyan-300">
          Font Size
        </label>
        <select
          value={preferences.fontSize}
          onChange={e => onSelect('fontSize', e.target.value as any)}
          className="w-full bg-black/50 border border-cyan-400/50 text-cyan-300 px-3 py-2 rounded font-mono"
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
          <option value="extra-large">Extra Large</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-mono font-medium text-cyan-300">
          Line Height
        </label>
        <select
          value={preferences.lineHeight}
          onChange={e => onSelect('lineHeight', e.target.value as any)}
          className="w-full bg-black/50 border border-cyan-400/50 text-cyan-300 px-3 py-2 rounded font-mono"
        >
          <option value="normal">Normal</option>
          <option value="relaxed">Relaxed</option>
          <option value="loose">Loose</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-mono font-medium text-cyan-300">
          Focus Indicators
        </label>
        <select
          value={preferences.focusIndicators}
          onChange={e => onSelect('focusIndicators', e.target.value as any)}
          className="w-full bg-black/50 border border-cyan-400/50 text-cyan-300 px-3 py-2 rounded font-mono"
        >
          <option value="subtle">Subtle</option>
          <option value="prominent">Prominent</option>
          <option value="high-contrast">High Contrast</option>
        </select>
      </div>
    </div>
  </div>
);

// Navigation Preferences Tab
const NavigationPreferencesTab: React.FC<{
  preferences: AccessibilityPreferences;
  onToggle: (key: keyof AccessibilityPreferences) => void;
  onSelect: <K extends keyof AccessibilityPreferences>(
    key: K,
    value: AccessibilityPreferences[K]
  ) => void;
}> = ({ preferences, onToggle }) => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-mono font-semibold text-cyan-400 mb-4">
        Navigation & Interaction
      </h3>
      <p className="text-sm text-cyan-300/80 mb-6">
        Configure navigation and interaction preferences.
      </p>
    </div>

    <div className="space-y-4">
      <PreferenceToggle
        id="keyboardNavigation"
        label="Enhanced Keyboard Navigation"
        description="Enables enhanced keyboard navigation throughout the interface"
        checked={preferences.keyboardNavigation}
        onChange={() => onToggle('keyboardNavigation')}
      />

      <PreferenceToggle
        id="skipLinks"
        label="Show Skip Links"
        description="Displays skip navigation links for faster keyboard navigation"
        checked={preferences.skipLinks}
        onChange={() => onToggle('skipLinks')}
      />

      <PreferenceToggle
        id="verboseDescriptions"
        label="Verbose Descriptions"
        description="Provides detailed descriptions for screen readers"
        checked={preferences.verboseDescriptions}
        onChange={() => onToggle('verboseDescriptions')}
      />

      <PreferenceToggle
        id="announceChanges"
        label="Announce Changes"
        description="Announces dynamic content changes to screen readers"
        checked={preferences.announceChanges}
        onChange={() => onToggle('announceChanges')}
      />

      <PreferenceToggle
        id="structuredNavigation"
        label="Structured Navigation"
        description="Enables structured navigation for complex content"
        checked={preferences.structuredNavigation}
        onChange={() => onToggle('structuredNavigation')}
      />
    </div>
  </div>
);

// 3D Preferences Tab
const ThreeDPreferencesTab: React.FC<{
  preferences: AccessibilityPreferences;
  onToggle: (key: keyof AccessibilityPreferences) => void;
}> = ({ preferences, onToggle }) => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-mono font-semibold text-cyan-400 mb-4">
        3D Performance & Effects
      </h3>
      <p className="text-sm text-cyan-300/80 mb-6">
        Control 3D effects and performance for better accessibility and comfort.
      </p>
    </div>

    <div className="space-y-4">
      <PreferenceToggle
        id="reduce3DEffects"
        label="Reduce 3D Effects"
        description="Minimizes complex 3D effects that may cause discomfort"
        checked={preferences.reduce3DEffects}
        onChange={() => onToggle('reduce3DEffects')}
      />

      <PreferenceToggle
        id="simplifyVisuals"
        label="Simplify Visuals"
        description="Reduces visual complexity for better performance and clarity"
        checked={preferences.simplifyVisuals}
        onChange={() => onToggle('simplifyVisuals')}
      />

      <PreferenceToggle
        id="disableBloom"
        label="Disable Bloom Effects"
        description="Removes bloom and glow effects that may be distracting"
        checked={preferences.disableBloom}
        onChange={() => onToggle('disableBloom')}
      />

      <PreferenceToggle
        id="disableShadows"
        label="Disable Shadows"
        description="Removes shadow effects to improve performance and reduce complexity"
        checked={preferences.disableShadows}
        onChange={() => onToggle('disableShadows')}
      />
    </div>
  </div>
);

// Reusable Preference Toggle Component
const PreferenceToggle: React.FC<{
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}> = ({ id, label, description, checked, onChange }) => (
  <div className="flex items-start space-x-3 p-4 rounded-lg border border-cyan-400/20 bg-black/30">
    <div className="flex-shrink-0 mt-1">
      <button
        onClick={onChange}
        className={`w-5 h-5 rounded border-2 transition-colors ${
          checked
            ? 'bg-cyan-400 border-cyan-400'
            : 'border-cyan-400/50 hover:border-cyan-400'
        }`}
        aria-checked={checked}
        role="switch"
        aria-labelledby={`${id}-label`}
        aria-describedby={`${id}-description`}
      >
        {checked && (
          <svg
            className="w-3 h-3 text-black"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>
    </div>

    <div className="flex-1">
      <label
        id={`${id}-label`}
        className="block text-sm font-mono font-medium text-cyan-300 cursor-pointer"
        onClick={onChange}
      >
        {label}
      </label>
      <p id={`${id}-description`} className="text-xs text-cyan-300/70 mt-1">
        {description}
      </p>
    </div>
  </div>
);

export default AccessibilityPreferencesPanel;
