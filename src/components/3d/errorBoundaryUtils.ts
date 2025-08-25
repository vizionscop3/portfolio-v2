/**
 * 3D Error Boundary Utilities
 *
 * Helper functions for 3D error handling (no JSX components)
 */

import React, { ReactNode } from 'react';
import { ThreeDErrorBoundary } from './ThreeDErrorBoundary';

/**
 * HOC for wrapping 3D components with error boundary
 */
export function with3DErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options: {
    fallbackComponent?: ReactNode;
    maxRetries?: number;
    enableFallback?: boolean;
  } = {}
) {
  const displayName = Component.displayName || Component.name || 'Component';

  const WrappedComponent = (props: P) =>
    React.createElement(ThreeDErrorBoundary, {
      ...options,
      children: React.createElement(Component, props),
    });

  WrappedComponent.displayName = `with3DErrorBoundary(${displayName})`;
  return WrappedComponent;
}

/**
 * Create a safe 3D component wrapper
 */
export function createSafe3DComponent<P extends object>(
  Component: React.ComponentType<P>,
  fallbackMessage?: string
) {
  const fallbackComponent = React.createElement(
    'div',
    {
      className:
        'w-full h-full flex items-center justify-center bg-gray-900 rounded-lg',
    },
    React.createElement(
      'div',
      { className: 'text-center text-gray-400' },
      React.createElement(
        'p',
        null,
        fallbackMessage || '3D content unavailable'
      ),
      React.createElement(
        'p',
        { className: 'text-sm mt-2' },
        'Portfolio features remain available'
      )
    )
  );

  return with3DErrorBoundary(Component, {
    enableFallback: true,
    maxRetries: 2,
    fallbackComponent,
  });
}

/**
 * Detect WebGL support
 */
export function isWebGLSupported(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!(
      gl && typeof (gl as WebGLRenderingContext).getExtension === 'function'
    );
  } catch (e) {
    return false;
  }
}

/**
 * Get 3D capability info
 */
export function get3DCapabilities() {
  const webglSupported = isWebGLSupported();
  let renderer = 'unknown';
  let vendor = 'unknown';

  if (webglSupported) {
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        const webglContext = gl as WebGLRenderingContext;
        const debugInfo = webglContext.getExtension(
          'WEBGL_debug_renderer_info'
        );
        if (debugInfo) {
          renderer = webglContext.getParameter(
            debugInfo.UNMASKED_RENDERER_WEBGL
          );
          vendor = webglContext.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
        }
      }
    } catch (e) {
      // Silently handle errors
    }
  }

  return {
    webglSupported,
    renderer,
    vendor,
    userAgent: navigator.userAgent,
  };
}

/**
 * Error boundary configuration presets
 */
export const ERROR_BOUNDARY_PRESETS = {
  strict: {
    enableFallback: true,
    maxRetries: 1,
  },
  lenient: {
    enableFallback: true,
    maxRetries: 3,
  },
  production: {
    enableFallback: true,
    maxRetries: 2,
  },
  development: {
    enableFallback: false,
    maxRetries: 0,
  },
} as const;
