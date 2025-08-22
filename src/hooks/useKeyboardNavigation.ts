/**
 * React hooks for Keyboard Navigation integration
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getKeyboardNavigation,
  KeyboardNavigationOptions,
  KeyboardShortcut,
  NavigableObject,
} from '../utils/keyboardNavigation';

/**
 * Main hook for keyboard navigation system
 */
export const useKeyboardNavigation = (options?: KeyboardNavigationOptions) => {
  const [keyboardNav] = useState(() => getKeyboardNavigation(options));
  const [currentFocus, setCurrentFocus] = useState<string | null>(null);
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    const unsubscribe = keyboardNav.onFocusChange((objectId, action) => {
      setCurrentFocus(objectId);

      // Handle activation
      if (action === 'activate' && objectId) {
        // This will be handled by the parent component
      }
    });

    return () => {
      unsubscribe();
      keyboardNav.dispose();
    };
  }, [keyboardNav]);

  const registerObject = useCallback(
    (object: NavigableObject) => {
      keyboardNav.registerObject(object);
    },
    [keyboardNav]
  );

  const unregisterObject = useCallback(
    (objectId: string) => {
      keyboardNav.unregisterObject(objectId);
    },
    [keyboardNav]
  );

  const updateObject = useCallback(
    (objectId: string, updates: Partial<NavigableObject>) => {
      keyboardNav.updateObject(objectId, updates);
    },
    [keyboardNav]
  );

  const focusObject = useCallback(
    (objectId: string) => {
      return keyboardNav.focusObject(objectId);
    },
    [keyboardNav]
  );

  const registerShortcut = useCallback(
    (shortcut: KeyboardShortcut) => {
      keyboardNav.registerShortcut(shortcut);
    },
    [keyboardNav]
  );

  const toggleEnabled = useCallback(() => {
    const newEnabled = !isEnabled;
    setIsEnabled(newEnabled);
    keyboardNav.setEnabled(newEnabled);
  }, [keyboardNav, isEnabled]);

  const setAnnounceCallback = useCallback(
    (callback: (message: string) => void) => {
      keyboardNav.setAnnounceCallback(callback);
    },
    [keyboardNav]
  );

  return {
    keyboardNav,
    currentFocus,
    isEnabled,
    registerObject,
    unregisterObject,
    updateObject,
    focusObject,
    registerShortcut,
    toggleEnabled,
    setAnnounceCallback,
    shortcuts: keyboardNav.getShortcuts(),
  };
};

/**
 * Hook for registering a single navigable object
 */
export const useNavigableObject = (
  objectId: string,
  object: Omit<NavigableObject, 'id'>,
  dependencies: React.DependencyList = []
) => {
  const { registerObject, unregisterObject, updateObject, currentFocus } =
    useKeyboardNavigation();
  const isFocused = currentFocus === objectId;

  useEffect(() => {
    registerObject({
      id: objectId,
      ...object,
    });

    return () => {
      unregisterObject(objectId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objectId, registerObject, unregisterObject, ...dependencies]);

  useEffect(() => {
    updateObject(objectId, object);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objectId, updateObject, ...dependencies]);

  return {
    isFocused,
    updateObject: (updates: Partial<NavigableObject>) =>
      updateObject(objectId, updates),
  };
};

/**
 * Hook for managing focus visual indicators
 */
export const useFocusIndicator = (isKeyboardFocused: boolean) => {
  const [showIndicator, setShowIndicator] = useState(false);
  const indicatorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isKeyboardFocused) {
      setShowIndicator(true);

      // Clear any existing timeout
      if (indicatorTimeoutRef.current) {
        clearTimeout(indicatorTimeoutRef.current);
      }

      // Hide indicator after a delay if not focused
      indicatorTimeoutRef.current = setTimeout(() => {
        if (!isKeyboardFocused) {
          setShowIndicator(false);
        }
      }, 3000);
    } else {
      setShowIndicator(false);
    }

    return () => {
      if (indicatorTimeoutRef.current) {
        clearTimeout(indicatorTimeoutRef.current);
      }
    };
  }, [isKeyboardFocused]);

  return showIndicator;
};

/**
 * Hook for keyboard shortcuts management
 */
export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[]) => {
  const { registerShortcut } = useKeyboardNavigation();

  useEffect(() => {
    shortcuts.forEach(shortcut => {
      registerShortcut(shortcut);
    });
  }, [shortcuts, registerShortcut]);
};

/**
 * Hook for screen reader announcements
 */
export const useScreenReader = () => {
  const { setAnnounceCallback } = useKeyboardNavigation();
  const [announcements, setAnnouncements] = useState<string[]>([]);

  const announce = useCallback((message: string) => {
    setAnnouncements(prev => [...prev, message]);

    // Remove announcement after it's been read
    setTimeout(() => {
      setAnnouncements(prev => prev.slice(1));
    }, 1000);
  }, []);

  useEffect(() => {
    setAnnounceCallback(announce);
  }, [setAnnounceCallback, announce]);

  return {
    announce,
    announcements,
  };
};

/**
 * Hook for spatial navigation in 3D space
 */
export const use3DNavigation = () => {
  const { keyboardNav } = useKeyboardNavigation();

  const register3DObject = useCallback(
    (
      objectId: string,
      position: { x: number; y: number; z: number },
      objectData: Omit<NavigableObject, 'id' | 'position'>
    ) => {
      keyboardNav.registerObject({
        id: objectId,
        position,
        ...objectData,
      });
    },
    [keyboardNav]
  );

  const update3DPosition = useCallback(
    (objectId: string, position: { x: number; y: number; z: number }) => {
      keyboardNav.updateObject(objectId, { position });
    },
    [keyboardNav]
  );

  return {
    register3DObject,
    update3DPosition,
  };
};

/**
 * Hook for keyboard navigation debugging
 */
export const useKeyboardNavigationDebug = () => {
  const { keyboardNav, currentFocus, shortcuts } = useKeyboardNavigation();
  const [debugInfo, setDebugInfo] = useState({
    focusedObject: null as NavigableObject | null,
    availableShortcuts: [] as KeyboardShortcut[],
    registeredObjects: 0,
  });

  useEffect(() => {
    const updateDebugInfo = () => {
      setDebugInfo({
        focusedObject: keyboardNav.getCurrentFocus(),
        availableShortcuts: shortcuts,
        registeredObjects: keyboardNav['objects']?.size || 0,
      });
    };

    updateDebugInfo();

    // Update when focus changes
    const interval = setInterval(updateDebugInfo, 1000);
    return () => clearInterval(interval);
  }, [keyboardNav, currentFocus, shortcuts]);

  return debugInfo;
};
