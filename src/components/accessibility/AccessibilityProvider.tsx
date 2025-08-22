/**
 * Accessibility Provider Component
 *
 * Provides comprehensive accessibility context and preferences management
 * throughout the application, combining all accessibility features.
 */

import React, { useEffect } from 'react';
import { KeyboardAccessibilityProvider } from './KeyboardAccessibilityProvider';
import { ScreenReaderProvider } from './ScreenReaderProvider';
import { useAccessibilityPreferences } from '../../hooks/useAccessibilityPreferences';

interface AccessibilityProviderProps {
  children: React.ReactNode;
  onSectionNavigation?: (section: string) => void;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({
  children,
  onSectionNavigation,
}) => {
  const { preferences } = useAccessibilityPreferences();

  // Initialize accessibility preferences on mount
  useEffect(() => {
    // Apply initial accessibility classes to body
    document.body.classList.toggle('reduce-motion', preferences.reduceMotion);
    document.body.classList.toggle('high-contrast', preferences.highContrast);
    document.body.classList.toggle('dark-mode', preferences.darkMode);
    document.body.classList.toggle(
      'simplify-visuals',
      preferences.simplifyVisuals
    );
    document.body.classList.toggle(
      'reduce-3d-effects',
      preferences.reduce3DEffects
    );
  }, [preferences]);

  return (
    <KeyboardAccessibilityProvider onSectionNavigation={onSectionNavigation}>
      <ScreenReaderProvider>{children}</ScreenReaderProvider>
    </KeyboardAccessibilityProvider>
  );
};

export default AccessibilityProvider;
