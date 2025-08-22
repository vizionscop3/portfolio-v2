/**
 * Mobile and Responsive React Hooks
 *
 * Provides React hooks for mobile detection, responsive design,
 * touch handling, and mobile-specific optimizations.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  detectDevice,
  getViewportInfo,
  getCurrentBreakpoint,
  matchesBreakpoint,
  isLandscape,
  getSafeAreaInsets,
  BREAKPOINTS,
  type DeviceInfo,
  type ViewportInfo,
} from '../utils/mobileDetection';
import {
  TouchHandler,
  type TouchHandlerOptions,
  type GestureState,
} from '../utils/touchHandler';

/**
 * Hook for device detection and capabilities
 */
export const useDevice = () => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() =>
    detectDevice()
  );

  useEffect(() => {
    const updateDeviceInfo = () => {
      setDeviceInfo(detectDevice());
    };

    // Listen for orientation changes
    window.addEventListener('orientationchange', updateDeviceInfo);
    window.addEventListener('resize', updateDeviceInfo);

    return () => {
      window.removeEventListener('orientationchange', updateDeviceInfo);
      window.removeEventListener('resize', updateDeviceInfo);
    };
  }, []);

  return deviceInfo;
};

/**
 * Hook for viewport information and changes
 */
export const useViewport = () => {
  const [viewportInfo, setViewportInfo] = useState<ViewportInfo>(() =>
    getViewportInfo()
  );

  useEffect(() => {
    const updateViewport = () => {
      setViewportInfo(getViewportInfo());
    };

    window.addEventListener('resize', updateViewport);
    window.addEventListener('orientationchange', updateViewport);

    return () => {
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('orientationchange', updateViewport);
    };
  }, []);

  return viewportInfo;
};

/**
 * Hook for responsive breakpoints
 */
export const useBreakpoint = () => {
  const [currentBreakpoint, setCurrentBreakpoint] = useState(() =>
    getCurrentBreakpoint()
  );

  useEffect(() => {
    const updateBreakpoint = () => {
      setCurrentBreakpoint(getCurrentBreakpoint());
    };

    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  const matches = useCallback((breakpoint: keyof typeof BREAKPOINTS) => {
    return matchesBreakpoint(breakpoint);
  }, []);

  return {
    current: currentBreakpoint,
    matches,
    isXS: currentBreakpoint === 'xs',
    isSM: currentBreakpoint === 'sm',
    isMD: currentBreakpoint === 'md',
    isLG: currentBreakpoint === 'lg',
    isXL: currentBreakpoint === 'xl',
    is2XL: currentBreakpoint === '2xl',
    isMobile: currentBreakpoint === 'xs' || currentBreakpoint === 'sm',
    isTablet: currentBreakpoint === 'md',
    isDesktop:
      currentBreakpoint === 'lg' ||
      currentBreakpoint === 'xl' ||
      currentBreakpoint === '2xl',
  };
};

/**
 * Hook for device orientation
 */
export const useOrientation = () => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    () => (isLandscape() ? 'landscape' : 'portrait')
  );

  useEffect(() => {
    const updateOrientation = () => {
      setOrientation(isLandscape() ? 'landscape' : 'portrait');
    };

    window.addEventListener('orientationchange', updateOrientation);
    window.addEventListener('resize', updateOrientation);

    return () => {
      window.removeEventListener('orientationchange', updateOrientation);
      window.removeEventListener('resize', updateOrientation);
    };
  }, []);

  return {
    orientation,
    isLandscape: orientation === 'landscape',
    isPortrait: orientation === 'portrait',
  };
};

/**
 * Hook for safe area insets (notches, etc.)
 */
export const useSafeArea = () => {
  const [safeAreaInsets, setSafeAreaInsets] = useState(() =>
    getSafeAreaInsets()
  );

  useEffect(() => {
    const updateSafeArea = () => {
      setSafeAreaInsets(getSafeAreaInsets());
    };

    window.addEventListener('resize', updateSafeArea);
    window.addEventListener('orientationchange', updateSafeArea);

    return () => {
      window.removeEventListener('resize', updateSafeArea);
      window.removeEventListener('orientationchange', updateSafeArea);
    };
  }, []);

  return safeAreaInsets;
};

/**
 * Hook for touch gesture handling
 */
export const useTouchGestures = (
  elementRef: React.RefObject<HTMLElement>,
  options: TouchHandlerOptions = {}
) => {
  const touchHandlerRef = useRef<TouchHandler | null>(null);
  const [gestureState, setGestureState] = useState<GestureState | null>(null);

  // Gesture event handlers
  const [onTap, setOnTap] = useState<
    ((point: { x: number; y: number }) => void) | null
  >(null);
  const [onDoubleTap, setOnDoubleTap] = useState<
    ((point: { x: number; y: number }) => void) | null
  >(null);
  const [onLongPress, setOnLongPress] = useState<
    ((point: { x: number; y: number }) => void) | null
  >(null);
  const [onSwipe, setOnSwipe] = useState<
    | ((direction: 'up' | 'down' | 'left' | 'right', velocity: number) => void)
    | null
  >(null);
  const [onPan, setOnPan] = useState<
    | ((
        delta: { x: number; y: number },
        velocity: { x: number; y: number }
      ) => void)
    | null
  >(null);
  const [onPinch, setOnPinch] = useState<
    ((scale: number, center: { x: number; y: number }) => void) | null
  >(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    touchHandlerRef.current = new TouchHandler(element, options);

    // Set up event handlers
    touchHandlerRef.current
      .onTapHandler(point => onTap?.(point))
      .onDoubleTapHandler(point => onDoubleTap?.(point))
      .onLongPressHandler(point => onLongPress?.(point))
      .onSwipeHandler((direction, velocity) => onSwipe?.(direction, velocity))
      .onPanHandler((delta, velocity) => onPan?.(delta, velocity))
      .onPinchHandler((scale, center) => onPinch?.(scale, center))
      .onGestureStartHandler(gesture => setGestureState(gesture))
      .onGestureMoveHandler(gesture => setGestureState(gesture))
      .onGestureEndHandler(() => setGestureState(null));

    return () => {
      touchHandlerRef.current?.destroy();
      touchHandlerRef.current = null;
    };
  }, [
    elementRef,
    options,
    onTap,
    onDoubleTap,
    onLongPress,
    onSwipe,
    onPan,
    onPinch,
  ]);

  return {
    gestureState,
    setOnTap: useCallback(
      (handler: (point: { x: number; y: number }) => void) => {
        setOnTap(() => handler);
      },
      []
    ),
    setOnDoubleTap: useCallback(
      (handler: (point: { x: number; y: number }) => void) => {
        setOnDoubleTap(() => handler);
      },
      []
    ),
    setOnLongPress: useCallback(
      (handler: (point: { x: number; y: number }) => void) => {
        setOnLongPress(() => handler);
      },
      []
    ),
    setOnSwipe: useCallback(
      (
        handler: (
          direction: 'up' | 'down' | 'left' | 'right',
          velocity: number
        ) => void
      ) => {
        setOnSwipe(() => handler);
      },
      []
    ),
    setOnPan: useCallback(
      (
        handler: (
          delta: { x: number; y: number },
          velocity: { x: number; y: number }
        ) => void
      ) => {
        setOnPan(() => handler);
      },
      []
    ),
    setOnPinch: useCallback(
      (handler: (scale: number, center: { x: number; y: number }) => void) => {
        setOnPinch(() => handler);
      },
      []
    ),
  };
};

/**
 * Hook for mobile-optimized performance settings
 */
export const useMobilePerformance = () => {
  const device = useDevice();
  const viewport = useViewport();

  const performanceSettings = useCallback(() => {
    const settings = {
      pixelRatio: Math.min(viewport.devicePixelRatio, device.isMobile ? 2 : 3),
      shadowQuality:
        device.performanceLevel === 'high'
          ? 'high'
          : device.performanceLevel === 'medium'
            ? 'medium'
            : 'low',
      textureQuality:
        device.performanceLevel === 'high'
          ? 1.0
          : device.performanceLevel === 'medium'
            ? 0.75
            : 0.5,
      particleCount:
        device.performanceLevel === 'high'
          ? 100
          : device.performanceLevel === 'medium'
            ? 50
            : 25,
      enablePostProcessing: device.performanceLevel !== 'low',
      enableBloom: device.performanceLevel === 'high',
      enableSSAO: device.performanceLevel === 'high' && !device.isMobile,
      maxLights:
        device.performanceLevel === 'high'
          ? 8
          : device.performanceLevel === 'medium'
            ? 4
            : 2,
      renderDistance:
        device.performanceLevel === 'high'
          ? 100
          : device.performanceLevel === 'medium'
            ? 75
            : 50,
    };

    return settings;
  }, [device, viewport]);

  return performanceSettings();
};

/**
 * Hook for mobile-friendly UI adaptations
 */
export const useMobileUI = () => {
  const device = useDevice();
  const breakpoint = useBreakpoint();
  const orientation = useOrientation();
  const safeArea = useSafeArea();

  const uiSettings = useCallback(() => {
    return {
      // Touch target sizes
      minTouchTarget: device.hasTouch ? 44 : 24, // 44px minimum for touch

      // Navigation
      showMobileMenu: breakpoint.isMobile,
      navigationPosition: breakpoint.isMobile ? 'bottom' : 'top',

      // Content layout
      sidebarCollapsed: breakpoint.isMobile || breakpoint.isTablet,
      gridColumns: breakpoint.isXS
        ? 1
        : breakpoint.isSM
          ? 2
          : breakpoint.isMD
            ? 3
            : breakpoint.isLG
              ? 4
              : 5,

      // Typography
      baseFontSize: breakpoint.isMobile ? 14 : 16,
      lineHeight: breakpoint.isMobile ? 1.4 : 1.6,

      // Spacing
      containerPadding: breakpoint.isMobile ? 16 : 24,
      sectionSpacing: breakpoint.isMobile ? 32 : 48,

      // Safe area
      safeAreaTop: safeArea.top,
      safeAreaBottom: safeArea.bottom,
      safeAreaLeft: safeArea.left,
      safeAreaRight: safeArea.right,

      // Orientation specific
      isLandscapePhone: device.isMobile && orientation.isLandscape,
      showFullscreen: device.isMobile && orientation.isLandscape,
    };
  }, [device, breakpoint, orientation, safeArea]);

  return uiSettings();
};

/**
 * Hook for preventing iOS Safari bounce/zoom behaviors
 */
export const useIOSWebAppBehavior = () => {
  useEffect(() => {
    // Prevent zoom on double tap
    let lastTouchEnd = 0;

    const preventZoom = (e: TouchEvent) => {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    };

    // Prevent pinch zoom
    const preventPinchZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // Add event listeners
    document.addEventListener('touchend', preventZoom, { passive: false });
    document.addEventListener('touchstart', preventPinchZoom, {
      passive: false,
    });

    // Prevent pull-to-refresh on iOS
    let startY = 0;
    const preventPullToRefresh = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (e.type === 'touchstart') {
        startY = touch.clientY;
      } else if (e.type === 'touchmove') {
        const currentY = touch.clientY;
        const isScrollingUp = currentY > startY;
        const isAtTop = window.scrollY === 0;

        if (isScrollingUp && isAtTop) {
          e.preventDefault();
        }
      }
    };

    document.addEventListener('touchstart', preventPullToRefresh, {
      passive: false,
    });
    document.addEventListener('touchmove', preventPullToRefresh, {
      passive: false,
    });

    return () => {
      document.removeEventListener('touchend', preventZoom);
      document.removeEventListener('touchstart', preventPinchZoom);
      document.removeEventListener('touchstart', preventPullToRefresh);
      document.removeEventListener('touchmove', preventPullToRefresh);
    };
  }, []);
};

export default {
  useDevice,
  useViewport,
  useBreakpoint,
  useOrientation,
  useSafeArea,
  useTouchGestures,
  useMobilePerformance,
  useMobileUI,
  useIOSWebAppBehavior,
};
