/**
 * Accessibility Provider
 *
 * Combines keyboard navigation and screen reader support into a unified accessibility system
 * for the 3D portfolio. Provides comprehensive WCAG 2.1 AA compliance.
 */

import React from 'react';
import { KeyboardAccessibilityProvider } from './KeyboardAccessibilityProvider';
import { ScreenReaderProvider } from './ScreenReaderProvider';

interface AccessibilityProviderProps {
  children: React.ReactNode;
  onSectionNavigation?: (section: string) => void;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({
  children,
  onSectionNavigation,
}) => {
  return (
    <ScreenReaderProvider>
      <KeyboardAccessibilityProvider onSectionNavigation={onSectionNavigation}>
        {children}
      </KeyboardAccessibilityProvider>
    </ScreenReaderProvider>
  );
};

export default AccessibilityProvider;
