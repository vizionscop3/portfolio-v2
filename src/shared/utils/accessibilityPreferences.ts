/**
 * Accessibility Preferences Utility
 *
 * Manages user accessibility preferences including reduced motion,
 * high contrast, font sizes, and other accessibility settings.
 */

export interface AccessibilityPreferences {
  // Motion and animation preferences
  reduceMotion: boolean;
  reduceAnimations: boolean;
  disableParallax: boolean;
  disableAutoPlay: boolean;

  // Visual preferences
  highContrast: boolean;
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  lineHeight: 'normal' | 'relaxed' | 'loose';

  // Navigation preferences
  keyboardNavigation: boolean;
  focusIndicators: 'subtle' | 'prominent' | 'high-contrast';
  skipLinks: boolean;

  // 3D and performance preferences
  reduce3DEffects: boolean;
  simplifyVisuals: boolean;
  disableBloom: boolean;
  disableShadows: boolean;

  // Audio preferences
  muteAudio: boolean;
  reduceVolume: boolean;
  audioDescriptions: boolean;

  // Screen reader preferences
  verboseDescriptions: boolean;
  announceChanges: boolean;
  structuredNavigation: boolean;
}

export const DEFAULT_ACCESSIBILITY_PREFERENCES: AccessibilityPreferences = {
  reduceMotion: false,
  reduceAnimations: false,
  disableParallax: false,
  disableAutoPlay: false,
  highContrast: false,
  darkMode: false,
  fontSize: 'medium',
  lineHeight: 'normal',
  keyboardNavigation: true,
  focusIndicators: 'subtle',
  skipLinks: true,
  reduce3DEffects: false,
  simplifyVisuals: false,
  disableBloom: false,
  disableShadows: false,
  muteAudio: false,
  reduceVolume: false,
  audioDescriptions: false,
  verboseDescriptions: false,
  announceChanges: true,
  structuredNavigation: true,
};

/**
 * Storage key for accessibility preferences
 */
const STORAGE_KEY = 'portfolio-accessibility-preferences';

/**
 * Get accessibility preferences from localStorage with system defaults
 */
export const getAccessibilityPreferences = (): AccessibilityPreferences => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const storedPrefs = stored ? JSON.parse(stored) : {};

    // Detect system preferences
    const systemPrefs = detectSystemPreferences();

    // Merge with defaults, system preferences, and stored preferences
    return {
      ...DEFAULT_ACCESSIBILITY_PREFERENCES,
      ...systemPrefs,
      ...storedPrefs,
    };
  } catch (error) {
    console.warn('Failed to load accessibility preferences:', error);
    return {
      ...DEFAULT_ACCESSIBILITY_PREFERENCES,
      ...detectSystemPreferences(),
    };
  }
};

/**
 * Save accessibility preferences to localStorage
 */
export const saveAccessibilityPreferences = (
  preferences: AccessibilityPreferences
): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));

    // Apply preferences immediately to the document
    applyAccessibilityPreferences(preferences);

    // Dispatch custom event for components to react
    window.dispatchEvent(
      new CustomEvent('accessibilityPreferencesChanged', {
        detail: preferences,
      })
    );
  } catch (error) {
    console.warn('Failed to save accessibility preferences:', error);
  }
};

/**
 * Detect system-level accessibility preferences
 */
export const detectSystemPreferences =
  (): Partial<AccessibilityPreferences> => {
    const preferences: Partial<AccessibilityPreferences> = {};

    // Reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      preferences.reduceMotion = true;
      preferences.reduceAnimations = true;
      preferences.disableParallax = true;
      preferences.disableAutoPlay = true;
    }

    // High contrast preference
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      preferences.highContrast = true;
      preferences.focusIndicators = 'high-contrast';
    }

    // Dark mode preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      preferences.darkMode = true;
    }

    // Reduced transparency preference
    if (window.matchMedia('(prefers-reduced-transparency: reduce)').matches) {
      preferences.simplifyVisuals = true;
      preferences.reduce3DEffects = true;
    }

    return preferences;
  };

/**
 * Apply accessibility preferences to the document
 */
export const applyAccessibilityPreferences = (
  preferences: AccessibilityPreferences
): void => {
  const root = document.documentElement;

  // Apply CSS custom properties for preferences
  root.style.setProperty(
    '--reduce-motion',
    preferences.reduceMotion ? '1' : '0'
  );
  root.style.setProperty(
    '--high-contrast',
    preferences.highContrast ? '1' : '0'
  );
  root.style.setProperty('--dark-mode', preferences.darkMode ? '1' : '0');

  // Font size scaling
  const fontSizeMultipliers = {
    small: 0.875,
    medium: 1,
    large: 1.125,
    'extra-large': 1.25,
  };
  root.style.setProperty(
    '--font-size-multiplier',
    fontSizeMultipliers[preferences.fontSize].toString()
  );

  // Line height adjustments
  const lineHeightValues = {
    normal: '1.5',
    relaxed: '1.625',
    loose: '1.75',
  };
  root.style.setProperty(
    '--line-height-base',
    lineHeightValues[preferences.lineHeight]
  );

  // Focus indicator styles
  const focusStyles = {
    subtle: '2px solid #00FFFF',
    prominent: '3px solid #00FFFF',
    'high-contrast': '4px solid #FFFFFF',
  };
  root.style.setProperty(
    '--focus-outline',
    focusStyles[preferences.focusIndicators]
  );

  // Apply body classes for CSS targeting
  const bodyClasses = [
    preferences.reduceMotion && 'reduce-motion',
    preferences.highContrast && 'high-contrast',
    preferences.darkMode && 'dark-mode',
    preferences.simplifyVisuals && 'simplify-visuals',
    preferences.reduce3DEffects && 'reduce-3d-effects',
  ].filter(Boolean);

  // Remove existing accessibility classes
  document.body.classList.remove(
    'reduce-motion',
    'high-contrast',
    'dark-mode',
    'simplify-visuals',
    'reduce-3d-effects'
  );

  // Add current accessibility classes
  const validClasses = bodyClasses.filter((cls): cls is string => Boolean(cls));
  if (validClasses.length > 0) {
    document.body.classList.add(...validClasses);
  }
};

/**
 * Reset accessibility preferences to system defaults
 */
export const resetAccessibilityPreferences = (): AccessibilityPreferences => {
  const systemPrefs = {
    ...DEFAULT_ACCESSIBILITY_PREFERENCES,
    ...detectSystemPreferences(),
  };

  saveAccessibilityPreferences(systemPrefs);
  return systemPrefs;
};

/**
 * Get accessibility preference presets
 */
export const getAccessibilityPresets = () => {
  return {
    default: DEFAULT_ACCESSIBILITY_PREFERENCES,

    'reduced-motion': {
      ...DEFAULT_ACCESSIBILITY_PREFERENCES,
      reduceMotion: true,
      reduceAnimations: true,
      disableParallax: true,
      disableAutoPlay: true,
      reduce3DEffects: true,
      disableBloom: true,
    },

    'high-contrast': {
      ...DEFAULT_ACCESSIBILITY_PREFERENCES,
      highContrast: true,
      focusIndicators: 'high-contrast' as const,
      simplifyVisuals: true,
      disableShadows: true,
    },

    'screen-reader-optimized': {
      ...DEFAULT_ACCESSIBILITY_PREFERENCES,
      verboseDescriptions: true,
      announceChanges: true,
      structuredNavigation: true,
      reduceMotion: true,
      simplifyVisuals: true,
    },

    'low-vision': {
      ...DEFAULT_ACCESSIBILITY_PREFERENCES,
      fontSize: 'large' as const,
      lineHeight: 'relaxed' as const,
      highContrast: true,
      focusIndicators: 'prominent' as const,
      simplifyVisuals: true,
    },

    'motor-impairment': {
      ...DEFAULT_ACCESSIBILITY_PREFERENCES,
      keyboardNavigation: true,
      focusIndicators: 'prominent' as const,
      skipLinks: true,
      reduceMotion: true,
      disableAutoPlay: true,
    },
  };
};

/**
 * Utility to check if a specific accessibility feature is enabled
 */
export const isAccessibilityFeatureEnabled = (
  preferences: AccessibilityPreferences,
  feature: keyof AccessibilityPreferences
): boolean => {
  return Boolean(preferences[feature]);
};

/**
 * Utility to get CSS variables for current accessibility preferences
 */
export const getAccessibilityCSS = (
  preferences: AccessibilityPreferences
): Record<string, string> => {
  return {
    '--reduce-motion': preferences.reduceMotion ? '1' : '0',
    '--high-contrast': preferences.highContrast ? '1' : '0',
    '--dark-mode': preferences.darkMode ? '1' : '0',
    '--font-size-multiplier': {
      small: '0.875',
      medium: '1',
      large: '1.125',
      'extra-large': '1.25',
    }[preferences.fontSize],
    '--line-height-base': {
      normal: '1.5',
      relaxed: '1.625',
      loose: '1.75',
    }[preferences.lineHeight],
    '--focus-outline': {
      subtle: '2px solid #00FFFF',
      prominent: '3px solid #00FFFF',
      'high-contrast': '4px solid #FFFFFF',
    }[preferences.focusIndicators],
  };
};

export default {
  getAccessibilityPreferences,
  saveAccessibilityPreferences,
  detectSystemPreferences,
  applyAccessibilityPreferences,
  resetAccessibilityPreferences,
  getAccessibilityPresets,
  isAccessibilityFeatureEnabled,
  getAccessibilityCSS,
};
