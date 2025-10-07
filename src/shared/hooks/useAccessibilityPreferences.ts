/**
 * Accessibility Preferences React Hooks
 *
 * Provides React hooks for managing and responding to accessibility preferences,
 * including system preference detection and real-time updates.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  AccessibilityPreferences,
  getAccessibilityPreferences,
  saveAccessibilityPreferences,
  applyAccessibilityPreferences,
  detectSystemPreferences,
  resetAccessibilityPreferences,
  getAccessibilityPresets,
  isAccessibilityFeatureEnabled,
  getAccessibilityCSS,
} from '../utils/accessibilityPreferences';

/**
 * Main hook for accessibility preferences management
 */
export const useAccessibilityPreferences = () => {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>(() =>
    getAccessibilityPreferences()
  );

  // Update preferences and save to localStorage
  const updatePreferences = useCallback(
    (newPreferences: Partial<AccessibilityPreferences>) => {
      const updated = { ...preferences, ...newPreferences };
      setPreferences(updated);
      saveAccessibilityPreferences(updated);
    },
    [preferences]
  );

  // Reset to system defaults
  const resetToDefaults = useCallback(() => {
    const resetPrefs = resetAccessibilityPreferences();
    setPreferences(resetPrefs);
  }, []);

  // Apply a preset
  const applyPreset = useCallback(
    (presetName: keyof ReturnType<typeof getAccessibilityPresets>) => {
      const presets = getAccessibilityPresets();
      const preset = presets[presetName];
      if (preset) {
        setPreferences(preset);
        saveAccessibilityPreferences(preset);
      }
    },
    []
  );

  // Check if a feature is enabled
  const isFeatureEnabled = useCallback(
    (feature: keyof AccessibilityPreferences) => {
      return isAccessibilityFeatureEnabled(preferences, feature);
    },
    [preferences]
  );

  // Get CSS variables for current preferences
  const cssVariables = useMemo(
    () => getAccessibilityCSS(preferences),
    [preferences]
  );

  // Listen for system preference changes
  useEffect(() => {
    const mediaQueries = [
      window.matchMedia('(prefers-reduced-motion: reduce)'),
      window.matchMedia('(prefers-contrast: high)'),
      window.matchMedia('(prefers-color-scheme: dark)'),
      window.matchMedia('(prefers-reduced-transparency: reduce)'),
    ];

    const handleSystemChange = () => {
      const systemPrefs = detectSystemPreferences();
      updatePreferences(systemPrefs);
    };

    mediaQueries.forEach(mq => {
      mq.addListener(handleSystemChange);
    });

    return () => {
      mediaQueries.forEach(mq => {
        mq.removeListener(handleSystemChange);
      });
    };
  }, [updatePreferences]);

  // Listen for preference changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'portfolio-accessibility-preferences' && e.newValue) {
        try {
          const newPreferences = JSON.parse(e.newValue);
          setPreferences(newPreferences);
        } catch (error) {
          console.warn(
            'Failed to parse accessibility preferences from storage:',
            error
          );
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Listen for custom preference change events
  useEffect(() => {
    const handlePreferenceChange = (
      e: CustomEvent<AccessibilityPreferences>
    ) => {
      setPreferences(e.detail);
    };

    window.addEventListener(
      'accessibilityPreferencesChanged',
      handlePreferenceChange as EventListener
    );
    return () => {
      window.removeEventListener(
        'accessibilityPreferencesChanged',
        handlePreferenceChange as EventListener
      );
    };
  }, []);

  // Apply preferences on mount and changes
  useEffect(() => {
    applyAccessibilityPreferences(preferences);
  }, [preferences]);

  return {
    preferences,
    updatePreferences,
    resetToDefaults,
    applyPreset,
    isFeatureEnabled,
    cssVariables,
    presets: getAccessibilityPresets(),
  };
};

/**
 * Hook for reduced motion preferences
 */
export const useReducedMotion = () => {
  const { isFeatureEnabled } = useAccessibilityPreferences();
  return isFeatureEnabled('reduceMotion');
};

/**
 * Hook for high contrast preferences
 */
export const useHighContrast = () => {
  const { isFeatureEnabled } = useAccessibilityPreferences();
  return isFeatureEnabled('highContrast');
};

/**
 * Hook for dark mode preferences
 */
export const useDarkMode = () => {
  const { isFeatureEnabled } = useAccessibilityPreferences();
  return isFeatureEnabled('darkMode');
};

/**
 * Hook for 3D effects preferences
 */
export const useReduce3DEffects = () => {
  const { isFeatureEnabled } = useAccessibilityPreferences();
  return isFeatureEnabled('reduce3DEffects');
};

/**
 * Hook for motion and animation preferences
 */
export const useMotionPreferences = () => {
  const { preferences } = useAccessibilityPreferences();

  return {
    reduceMotion: preferences.reduceMotion,
    reduceAnimations: preferences.reduceAnimations,
    disableParallax: preferences.disableParallax,
    disableAutoPlay: preferences.disableAutoPlay,
    shouldReduceMotion:
      preferences.reduceMotion || preferences.reduceAnimations,
  };
};

/**
 * Hook for visual accessibility preferences
 */
export const useVisualAccessibility = () => {
  const { preferences } = useAccessibilityPreferences();

  return {
    highContrast: preferences.highContrast,
    fontSize: preferences.fontSize,
    lineHeight: preferences.lineHeight,
    focusIndicators: preferences.focusIndicators,
    simplifyVisuals: preferences.simplifyVisuals,
    reduce3DEffects: preferences.reduce3DEffects,
  };
};

/**
 * Hook for 3D performance accessibility settings
 */
export const use3DAccessibility = () => {
  const { preferences } = useAccessibilityPreferences();

  return {
    reduce3DEffects: preferences.reduce3DEffects,
    simplifyVisuals: preferences.simplifyVisuals,
    disableBloom: preferences.disableBloom,
    disableShadows: preferences.disableShadows,
    shouldSimplify3D:
      preferences.reduce3DEffects || preferences.simplifyVisuals,
  };
};

/**
 * Hook for navigation accessibility preferences
 */
export const useNavigationAccessibility = () => {
  const { preferences } = useAccessibilityPreferences();

  return {
    keyboardNavigation: preferences.keyboardNavigation,
    focusIndicators: preferences.focusIndicators,
    skipLinks: preferences.skipLinks,
    verboseDescriptions: preferences.verboseDescriptions,
    announceChanges: preferences.announceChanges,
    structuredNavigation: preferences.structuredNavigation,
  };
};

/**
 * Hook for responsive design with accessibility considerations
 */
export const useAccessibleResponsive = () => {
  const { preferences } = useAccessibilityPreferences();
  const { cssVariables } = useAccessibilityPreferences();

  const getFontSize = useCallback(
    (baseSize: number) => {
      const multiplier = parseFloat(cssVariables['--font-size-multiplier']);
      return baseSize * multiplier;
    },
    [cssVariables]
  );

  const getLineHeight = useCallback(() => {
    return cssVariables['--line-height-base'];
  }, [cssVariables]);

  const getFocusStyle = useCallback(() => {
    return {
      outline: cssVariables['--focus-outline'],
      outlineOffset: '2px',
    };
  }, [cssVariables]);

  return {
    preferences,
    cssVariables,
    getFontSize,
    getLineHeight,
    getFocusStyle,
    shouldReduceSpacing: preferences.fontSize === 'extra-large',
    shouldSimplifyLayout: preferences.simplifyVisuals,
  };
};

/**
 * Hook for system preference detection and monitoring
 */
export const useSystemPreferences = () => {
  const [systemPreferences, setSystemPreferences] = useState(() =>
    detectSystemPreferences()
  );

  useEffect(() => {
    const updateSystemPreferences = () => {
      setSystemPreferences(detectSystemPreferences());
    };

    const mediaQueries = [
      window.matchMedia('(prefers-reduced-motion: reduce)'),
      window.matchMedia('(prefers-contrast: high)'),
      window.matchMedia('(prefers-color-scheme: dark)'),
      window.matchMedia('(prefers-reduced-transparency: reduce)'),
    ];

    mediaQueries.forEach(mq => {
      mq.addListener(updateSystemPreferences);
    });

    return () => {
      mediaQueries.forEach(mq => {
        mq.removeListener(updateSystemPreferences);
      });
    };
  }, []);

  return systemPreferences;
};

export default {
  useAccessibilityPreferences,
  useReducedMotion,
  useHighContrast,
  useDarkMode,
  useReduce3DEffects,
  useMotionPreferences,
  useVisualAccessibility,
  use3DAccessibility,
  useNavigationAccessibility,
  useAccessibleResponsive,
  useSystemPreferences,
};
