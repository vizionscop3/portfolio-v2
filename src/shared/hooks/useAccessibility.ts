/**
 * Accessibility Hooks
 *
 * Provides convenient hooks for integrating accessibility features
 * throughout the portfolio application.
 */

import { useCallback, useEffect, useRef } from 'react';
import { useScreenReader } from '../components/accessibility/ScreenReaderProvider';
import { useKeyboardAccessibility } from '../components/accessibility/KeyboardAccessibilityProvider';

/**
 * Hook for section accessibility integration
 */
export const useSectionAccessibility = (
  sectionName: string,
  sectionDescription?: string
) => {
  const { announceSection } = useScreenReader();
  const hasAnnouncedRef = useRef(false);

  const announceEntry = useCallback(() => {
    if (!hasAnnouncedRef.current) {
      announceSection(sectionName, sectionDescription);
      hasAnnouncedRef.current = true;
    }
  }, [announceSection, sectionName, sectionDescription]);

  // Reset announcement flag when section changes
  useEffect(() => {
    hasAnnouncedRef.current = false;
  }, [sectionName]);

  return {
    announceEntry,
  };
};

/**
 * Hook for interactive element accessibility
 */
export const useElementAccessibility = (
  elementId: string,
  elementName: string
) => {
  const { announceInteraction, setAlternativeText } = useScreenReader();
  const { registerObject, currentFocus } = useKeyboardAccessibility();

  const isFocused = currentFocus === elementId;

  const announceAction = useCallback(
    (action: string, result?: string) => {
      announceInteraction(elementName, action, result);
    },
    [announceInteraction, elementName]
  );

  const setAltText = useCallback(
    (altText: string) => {
      setAlternativeText(elementId, altText);
    },
    [setAlternativeText, elementId]
  );

  const registerForKeyboard = useCallback(
    (config: {
      position: { x: number; y: number; z: number };
      section: string;
      tooltip: string;
      priority?: number;
    }) => {
      registerObject({
        id: elementId,
        position: config.position,
        section: config.section,
        tooltip: config.tooltip,
        priority: config.priority || 1,
        isVisible: true,
        isInteractable: true,
        ariaLabel: elementName,
        ariaDescription: `${elementName} in ${config.section} section. ${config.tooltip}`,
      });
    },
    [registerObject, elementId, elementName]
  );

  return {
    isFocused,
    announceAction,
    setAltText,
    registerForKeyboard,
  };
};

/**
 * Hook for form accessibility
 */
export const useFormAccessibility = () => {
  const { announce } = useScreenReader();

  const announceFormError = useCallback(
    (fieldName: string, errorMessage: string) => {
      announce(`Error in ${fieldName}: ${errorMessage}`, 'assertive');
    },
    [announce]
  );

  const announceFormSuccess = useCallback(
    (message: string) => {
      announce(`Success: ${message}`, 'assertive');
    },
    [announce]
  );

  const announceFieldChange = useCallback(
    (fieldName: string, value: string) => {
      announce(`${fieldName} changed to ${value}`, 'polite');
    },
    [announce]
  );

  return {
    announceFormError,
    announceFormSuccess,
    announceFieldChange,
  };
};

/**
 * Hook for navigation accessibility
 */
export const useNavigationAccessibility = () => {
  const { announce } = useScreenReader();

  const announceNavigation = useCallback(
    (from: string, to: string) => {
      announce(`Navigating from ${from} to ${to}`, 'assertive');
    },
    [announce]
  );

  const announcePageLoad = useCallback(
    (pageName: string) => {
      announce(`${pageName} loaded`, 'polite');
    },
    [announce]
  );

  const announceLoading = useCallback(
    (what: string) => {
      announce(`Loading ${what}, please wait`, 'polite');
    },
    [announce]
  );

  const announceLoadComplete = useCallback(
    (what: string) => {
      announce(`${what} loaded successfully`, 'polite');
    },
    [announce]
  );

  return {
    announceNavigation,
    announcePageLoad,
    announceLoading,
    announceLoadComplete,
  };
};

/**
 * Hook for 3D scene accessibility
 */
export const use3DSceneAccessibility = () => {
  const { announce, setAlternativeText } = useScreenReader();

  const announceSceneChange = useCallback(
    (sceneName: string, description: string) => {
      announce(`3D scene changed to ${sceneName}. ${description}`, 'polite');
    },
    [announce]
  );

  const announceObjectInteraction = useCallback(
    (objectName: string, action: string) => {
      announce(`${action} ${objectName} in 3D scene`, 'polite');
    },
    [announce]
  );

  const setSceneDescription = useCallback(
    (sceneId: string, description: string) => {
      setAlternativeText(sceneId, description);
    },
    [setAlternativeText]
  );

  const announcePerformanceChange = useCallback(
    (mode: string) => {
      announce(`Performance mode changed to ${mode} quality`, 'polite');
    },
    [announce]
  );

  return {
    announceSceneChange,
    announceObjectInteraction,
    setSceneDescription,
    announcePerformanceChange,
  };
};

/**
 * Hook for media accessibility (images, videos)
 */
export const useMediaAccessibility = () => {
  const { setAlternativeText, announce } = useScreenReader();

  const setImageAlt = useCallback(
    (imageId: string, altText: string) => {
      setAlternativeText(imageId, altText);
    },
    [setAlternativeText]
  );

  const announceMediaLoad = useCallback(
    (mediaType: string, mediaName: string) => {
      announce(`${mediaType} ${mediaName} loaded`, 'polite');
    },
    [announce]
  );

  const announceMediaError = useCallback(
    (mediaType: string, mediaName: string) => {
      announce(`Error loading ${mediaType} ${mediaName}`, 'assertive');
    },
    [announce]
  );

  return {
    setImageAlt,
    announceMediaLoad,
    announceMediaError,
  };
};

export default {
  useSectionAccessibility,
  useElementAccessibility,
  useFormAccessibility,
  useNavigationAccessibility,
  use3DSceneAccessibility,
  useMediaAccessibility,
};
