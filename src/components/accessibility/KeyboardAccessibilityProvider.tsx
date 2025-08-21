/**
 * Keyboard Accessibility Provider
 *
 * Provides keyboard navigation context and integration for the entire 3D portfolio.
 * Manages focus states, screen reader announcements, and accessibility features.
 */

import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
} from 'react';
import {
  useKeyboardNavigation,
  useScreenReader,
} from '../../hooks/useKeyboardNavigation';
import { FocusIndicator } from './FocusIndicator';
import { NavigableObject } from '../../utils/keyboardNavigation';

interface KeyboardAccessibilityContextType {
  registerObject: (object: NavigableObject) => void;
  unregisterObject: (objectId: string) => void;
  updateObject: (objectId: string, updates: Partial<NavigableObject>) => void;
  focusObject: (objectId: string) => boolean;
  currentFocus: string | null;
  isEnabled: boolean;
  toggleEnabled: () => void;
  announce: (message: string) => void;
}

const KeyboardAccessibilityContext =
  createContext<KeyboardAccessibilityContextType | null>(null);

export const useKeyboardAccessibility = () => {
  const context = useContext(KeyboardAccessibilityContext);
  if (!context) {
    throw new Error(
      'useKeyboardAccessibility must be used within KeyboardAccessibilityProvider'
    );
  }
  return context;
};

interface KeyboardAccessibilityProviderProps {
  children: React.ReactNode;
  onSectionNavigation?: (section: string) => void;
}

export const KeyboardAccessibilityProvider: React.FC<
  KeyboardAccessibilityProviderProps
> = ({ children, onSectionNavigation }) => {
  const {
    registerObject,
    unregisterObject,
    updateObject,
    focusObject,
    currentFocus,
    isEnabled,
    toggleEnabled,
    registerShortcut,
  } = useKeyboardNavigation({
    enableArrowKeyNavigation: true,
    enableTabNavigation: true,
    enableShortcuts: true,
    enableSpatialNavigation: true,
    focusVisibleOnly: true,
    announceChanges: true,
    debugMode: process.env.NODE_ENV === 'development',
  });

  const { announce } = useScreenReader();

  // Register section navigation shortcuts
  useEffect(() => {
    if (!onSectionNavigation) return;

    const shortcuts = [
      {
        key: '1',
        action: () => onSectionNavigation('about'),
        description: 'Navigate to About section',
        category: 'navigation' as const,
      },
      {
        key: '2',
        action: () => onSectionNavigation('tech'),
        description: 'Navigate to Tech section',
        category: 'navigation' as const,
      },
      {
        key: '3',
        action: () => onSectionNavigation('blog'),
        description: 'Navigate to Blog section',
        category: 'navigation' as const,
      },
      {
        key: '4',
        action: () => onSectionNavigation('fashion'),
        description: 'Navigate to Fashion section',
        category: 'navigation' as const,
      },
      {
        key: '5',
        action: () => onSectionNavigation('merch'),
        description: 'Navigate to Merch section',
        category: 'navigation' as const,
      },
    ];

    shortcuts.forEach(shortcut => registerShortcut(shortcut));

    // Announce keyboard help on startup
    announce(
      'Keyboard navigation enabled. Press Tab to navigate, Enter to activate, number keys 1-5 for sections, and ? for help.'
    );
  }, [registerShortcut, onSectionNavigation, announce]);

  const contextValue: KeyboardAccessibilityContextType = {
    registerObject: useCallback(
      (object: NavigableObject) => {
        registerObject(object);
      },
      [registerObject]
    ),

    unregisterObject: useCallback(
      (objectId: string) => {
        unregisterObject(objectId);
      },
      [unregisterObject]
    ),

    updateObject: useCallback(
      (objectId: string, updates: Partial<NavigableObject>) => {
        updateObject(objectId, updates);
      },
      [updateObject]
    ),

    focusObject: useCallback(
      (objectId: string) => {
        const success = focusObject(objectId);
        if (success) {
          announce(`Focused on ${objectId}`);
        }
        return success;
      },
      [focusObject, announce]
    ),

    currentFocus,
    isEnabled,
    toggleEnabled,
    announce,
  };

  return (
    <KeyboardAccessibilityContext.Provider value={contextValue}>
      {children}
      <KeyboardFocusIndicator />
      <ScreenReaderAnnouncements />
    </KeyboardAccessibilityContext.Provider>
  );
};

// Component to render focus indicator based on current focus
const KeyboardFocusIndicator: React.FC = () => {
  const { currentFocus } = useKeyboardAccessibility();
  const [focusPosition, setFocusPosition] = React.useState<{
    x: number;
    y: number;
  } | null>(null);
  const [focusInfo, setFocusInfo] = React.useState<{
    objectName?: string;
    description?: string;
  } | null>(null);

  useEffect(() => {
    if (!currentFocus) {
      setFocusPosition(null);
      setFocusInfo(null);
      return;
    }

    // Get the focused element from the DOM or 3D scene
    // This is a simplified implementation - in practice, you'd get the screen position
    // of the 3D object from the Three.js scene
    const mockPosition = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };
    setFocusPosition(mockPosition);

    // Set focus info based on object
    const objectNames: Record<string, { name: string; description: string }> = {
      'desk-computer': {
        name: 'Holographic Computer',
        description: 'Interactive tech skills showcase with floating displays',
      },
      'bed-book': {
        name: 'Digital Codex',
        description: 'Blog posts and articles with holographic pages',
      },
      'closet-main': {
        name: 'Neon Wardrobe Pod',
        description: 'Fashion gallery with LED lighting and style showcase',
      },
      'shelf-merch': {
        name: 'Holographic Merch Display',
        description: 'Merchandise store with floating product previews',
      },
      'desk-headphones': {
        name: 'Audio Engineering Station',
        description: 'About me section with music production setup',
      },
    };

    const info = objectNames[currentFocus] || {
      name: currentFocus,
      description: 'Interactive object',
    };
    setFocusInfo({ objectName: info.name, description: info.description });
  }, [currentFocus]);

  if (!focusPosition || !focusInfo) return null;

  return (
    <FocusIndicator
      isVisible={true}
      position={focusPosition}
      objectName={focusInfo.objectName}
      description={focusInfo.description}
      variant="active"
      size="medium"
    />
  );
};

// Component for screen reader announcements
const ScreenReaderAnnouncements: React.FC = () => {
  const [announcements] = React.useState<string[]>([]);

  // Listen for announcements and manage the queue
  React.useEffect(() => {
    // This would typically be connected to the screen reader hook
    // For now, it's managed by the accessibility context
  }, []);

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
      role="status"
    >
      {announcements.map((message, index) => (
        <div key={index}>{message}</div>
      ))}
    </div>
  );
};

export default KeyboardAccessibilityProvider;
