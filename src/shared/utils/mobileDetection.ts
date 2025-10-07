/**
 * Mobile Detection Utilities
 *
 * Provides comprehensive mobile device detection, touch capabilities,
 * and responsive breakpoint management for the 3D portfolio.
 */

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  hasTouch: boolean;
  orientation: 'portrait' | 'landscape';
  screenSize: 'small' | 'medium' | 'large' | 'xlarge';
  pixelRatio: number;
  maxTextureSize: number;
  webglSupport: boolean;
  webgl2Support: boolean;
  performanceLevel: 'low' | 'medium' | 'high';
}

export interface ViewportInfo {
  width: number;
  height: number;
  availableWidth: number;
  availableHeight: number;
  innerWidth: number;
  innerHeight: number;
  devicePixelRatio: number;
}

/**
 * Comprehensive device detection
 */
export const detectDevice = (): DeviceInfo => {
  // User agent detection
  const userAgent =
    navigator.userAgent || navigator.vendor || (window as any).opera;

  // Mobile detection patterns
  const mobileRegex =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const tabletRegex =
    /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)|Android(?=.*\bTablet\b)/i;

  const isMobile = mobileRegex.test(userAgent) && !tabletRegex.test(userAgent);
  const isTablet =
    tabletRegex.test(userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); // iPad detection
  const isDesktop = !isMobile && !isTablet;

  // Touch capabilities
  const hasTouch =
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    (navigator as any).msMaxTouchPoints > 0;

  // Screen orientation
  const orientation =
    window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';

  // Screen size classification
  const width = window.innerWidth;
  const screenSize =
    width < 640
      ? 'small'
      : width < 1024
        ? 'medium'
        : width < 1440
          ? 'large'
          : 'xlarge';

  // Device pixel ratio
  const pixelRatio = window.devicePixelRatio || 1;

  // WebGL support detection
  const webglSupport = detectWebGLSupport();
  const webgl2Support = detectWebGL2Support();
  const maxTextureSize = getMaxTextureSize();

  // Performance level estimation
  const performanceLevel = estimatePerformanceLevel(
    isMobile,
    isTablet,
    pixelRatio,
    webglSupport
  );

  return {
    isMobile,
    isTablet,
    isDesktop,
    hasTouch,
    orientation,
    screenSize,
    pixelRatio,
    maxTextureSize,
    webglSupport,
    webgl2Support,
    performanceLevel,
  };
};

/**
 * Get current viewport information
 */
export const getViewportInfo = (): ViewportInfo => {
  return {
    width: window.outerWidth,
    height: window.outerHeight,
    availableWidth: screen.availWidth,
    availableHeight: screen.availHeight,
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio || 1,
  };
};

/**
 * WebGL support detection
 */
const detectWebGLSupport = (): boolean => {
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return gl !== null;
  } catch (e) {
    return false;
  }
};

/**
 * WebGL2 support detection
 */
const detectWebGL2Support = (): boolean => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    return gl !== null;
  } catch (e) {
    return false;
  }
};

/**
 * Get maximum texture size supported by WebGL
 */
const getMaxTextureSize = (): number => {
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl && 'getParameter' in gl && 'MAX_TEXTURE_SIZE' in gl) {
      const webglContext = gl as WebGLRenderingContext;
      return webglContext.getParameter(webglContext.MAX_TEXTURE_SIZE) as number;
    }
    return 2048; // Default fallback
  } catch (e) {
    return 2048;
  }
};

/**
 * Estimate device performance level
 */
const estimatePerformanceLevel = (
  isMobile: boolean,
  isTablet: boolean,
  pixelRatio: number,
  webglSupport: boolean
): 'low' | 'medium' | 'high' => {
  if (!webglSupport) return 'low';

  // Mobile devices generally have lower performance
  if (isMobile) {
    // High-end mobile devices
    if (pixelRatio >= 3 && navigator.hardwareConcurrency >= 6) {
      return 'medium';
    }
    return 'low';
  }

  // Tablets
  if (isTablet) {
    if (pixelRatio >= 2 && navigator.hardwareConcurrency >= 4) {
      return 'medium';
    }
    return 'low';
  }

  // Desktop devices
  if (navigator.hardwareConcurrency >= 8 && pixelRatio <= 2) {
    return 'high';
  }

  return 'medium';
};

/**
 * Check if device is in landscape mode
 */
export const isLandscape = (): boolean => {
  return window.innerWidth > window.innerHeight;
};

/**
 * Check if device is in portrait mode
 */
export const isPortrait = (): boolean => {
  return window.innerHeight > window.innerWidth;
};

/**
 * Get safe area insets for devices with notches
 */
export const getSafeAreaInsets = () => {
  const style = getComputedStyle(document.documentElement);

  return {
    top: parseInt(
      style.getPropertyValue('env(safe-area-inset-top)') || '0',
      10
    ),
    right: parseInt(
      style.getPropertyValue('env(safe-area-inset-right)') || '0',
      10
    ),
    bottom: parseInt(
      style.getPropertyValue('env(safe-area-inset-bottom)') || '0',
      10
    ),
    left: parseInt(
      style.getPropertyValue('env(safe-area-inset-left)') || '0',
      10
    ),
  };
};

/**
 * Responsive breakpoints
 */
export const BREAKPOINTS = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

/**
 * Check if current viewport matches breakpoint
 */
export const matchesBreakpoint = (
  breakpoint: keyof typeof BREAKPOINTS
): boolean => {
  return window.innerWidth >= BREAKPOINTS[breakpoint];
};

/**
 * Get current breakpoint
 */
export const getCurrentBreakpoint = (): keyof typeof BREAKPOINTS => {
  const width = window.innerWidth;

  if (width >= BREAKPOINTS['2xl']) return '2xl';
  if (width >= BREAKPOINTS.xl) return 'xl';
  if (width >= BREAKPOINTS.lg) return 'lg';
  if (width >= BREAKPOINTS.md) return 'md';
  if (width >= BREAKPOINTS.sm) return 'sm';
  return 'xs';
};

export default {
  detectDevice,
  getViewportInfo,
  isLandscape,
  isPortrait,
  getSafeAreaInsets,
  matchesBreakpoint,
  getCurrentBreakpoint,
  BREAKPOINTS,
};
