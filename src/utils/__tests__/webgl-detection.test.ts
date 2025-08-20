import { beforeEach, describe, expect, it, vi } from 'vitest';
import { WebGLDetector } from '../webgl-detection';

// Mock WebGL context for testing
const mockWebGLContext = {
  getExtension: vi.fn(() => ({
    UNMASKED_RENDERER_WEBGL: 37446,
    UNMASKED_VENDOR_WEBGL: 37445,
  })),
  getSupportedExtensions: vi.fn(() => ['WEBGL_debug_renderer_info']),
  getParameter: vi.fn(param => {
    switch (param) {
      case 7938: // VERSION
        return 'WebGL 1.0';
      case 37446: // UNMASKED_RENDERER_WEBGL
        return 'Test Renderer';
      case 37445: // UNMASKED_VENDOR_WEBGL
        return 'Test Vendor';
      case 3379: // MAX_TEXTURE_SIZE
        return 4096;
      case 36347: // MAX_VERTEX_UNIFORM_VECTORS
        return 256;
      case 36348: // MAX_FRAGMENT_UNIFORM_VECTORS
        return 256;
      default:
        return 0;
    }
  }),
  VERSION: 7938,
  MAX_TEXTURE_SIZE: 3379,
  MAX_VERTEX_UNIFORM_VECTORS: 36347,
  MAX_FRAGMENT_UNIFORM_VECTORS: 36348,
};

describe('WebGLDetector', () => {
  let detector: WebGLDetector;

  beforeEach(() => {
    // Reset singleton instance for each test
    (WebGLDetector as any).instance = undefined;
    detector = WebGLDetector.getInstance();

    // Mock canvas getContext
    HTMLCanvasElement.prototype.getContext = vi.fn(contextType => {
      if (contextType === 'webgl' || contextType === 'experimental-webgl') {
        return mockWebGLContext as any;
      }
      if (contextType === 'webgl2') {
        return mockWebGLContext as any;
      }
      return null;
    });
  });

  it('should be a singleton', () => {
    const detector2 = WebGLDetector.getInstance();
    expect(detector).toBe(detector2);
  });

  it('should detect WebGL support', () => {
    const isSupported = detector.isWebGLSupported();
    expect(typeof isSupported).toBe('boolean');
  });

  it('should get capabilities', () => {
    const capabilities = detector.getCapabilities();
    expect(capabilities).toHaveProperty('supported');
    expect(capabilities).toHaveProperty('version');
    expect(capabilities).toHaveProperty('renderer');
    expect(capabilities).toHaveProperty('vendor');
    expect(capabilities).toHaveProperty('maxTextureSize');
    expect(capabilities).toHaveProperty('extensions');
  });

  it('should detect mobile devices', () => {
    const isMobile = detector.isMobile();
    expect(typeof isMobile).toBe('boolean');
  });

  it('should get performance tier', () => {
    const tier = detector.getPerformanceTier();
    expect(['high', 'medium', 'low']).toContain(tier);
  });

  it('should get recommended settings', () => {
    const settings = detector.getRecommendedSettings();
    expect(settings).toHaveProperty('shadows');
    expect(settings).toHaveProperty('postProcessing');
    expect(settings).toHaveProperty('particles');
    expect(settings).toHaveProperty('antialiasing');
    expect(settings).toHaveProperty('maxLights');
    expect(settings).toHaveProperty('textureQuality');
    expect(settings).toHaveProperty('modelLOD');
  });
});
