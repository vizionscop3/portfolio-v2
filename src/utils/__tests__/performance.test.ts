import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import {
  PerformanceMonitor,
  formatBytes,
  getPerformanceRecommendations,
  detectPerformanceCapabilities,
} from '../performance';

// Mock requestAnimationFrame and cancelAnimationFrame
const mockRequestAnimationFrame = vi.fn();
const mockCancelAnimationFrame = vi.fn();

Object.defineProperty(window, 'requestAnimationFrame', {
  value: mockRequestAnimationFrame,
  writable: true,
});

Object.defineProperty(window, 'cancelAnimationFrame', {
  value: mockCancelAnimationFrame,
  writable: true,
});

// Mock performance.now()
Object.defineProperty(window.performance, 'now', {
  value: vi.fn(() => 1000),
  writable: true,
});

// Mock performance.memory
Object.defineProperty(window.performance, 'memory', {
  value: {
    usedJSHeapSize: 25 * 1024 * 1024, // 25MB
  },
  writable: true,
});

describe('PerformanceMonitor', () => {
  let monitor: PerformanceMonitor;

  beforeEach(() => {
    vi.clearAllMocks();
    monitor = new PerformanceMonitor({
      targetFps: 60,
      lowFpsThreshold: 30,
      mediumFpsThreshold: 45,
    });
  });

  afterEach(() => {
    monitor.stop();
  });

  it('initializes with correct default config', () => {
    const defaultMonitor = new PerformanceMonitor();
    expect(defaultMonitor.getCurrentMode()).toBe('high');
  });

  it('starts monitoring when start() is called', () => {
    expect(mockRequestAnimationFrame).not.toHaveBeenCalled();

    monitor.start();

    expect(mockRequestAnimationFrame).toHaveBeenCalled();
  });

  it('stops monitoring when stop() is called', () => {
    monitor.start();
    monitor.stop();

    expect(mockCancelAnimationFrame).toHaveBeenCalled();
  });

  it('does not start multiple times', () => {
    monitor.start();
    monitor.start();

    // Should only call requestAnimationFrame once
    expect(mockRequestAnimationFrame).toHaveBeenCalledTimes(1);
  });

  it('subscribes to metrics updates', () => {
    const callback = vi.fn();
    const unsubscribe = monitor.subscribe(callback);

    expect(typeof unsubscribe).toBe('function');
  });

  it('unsubscribes from metrics updates', () => {
    const callback = vi.fn();
    const unsubscribe = monitor.subscribe(callback);

    unsubscribe();
    // Callback should no longer be called (tested indirectly)
  });

  it('subscribes to mode changes', () => {
    const callback = vi.fn();
    const unsubscribe = monitor.onModeChange(callback);

    expect(typeof unsubscribe).toBe('function');
  });

  it('changes mode manually', () => {
    const callback = vi.fn();
    monitor.onModeChange(callback);

    monitor.setMode('medium');

    expect(monitor.getCurrentMode()).toBe('medium');
    expect(callback).toHaveBeenCalledWith('medium');
  });

  it('resets monitoring data', () => {
    monitor.start();
    monitor.reset();

    expect(monitor.getAverageFps()).toBe(0);
  });

  it('updates render metrics', () => {
    // Should not throw error
    expect(() => monitor.updateRenderMetrics(100, 50000)).not.toThrow();
  });
});

describe('formatBytes', () => {
  it('formats bytes correctly', () => {
    expect(formatBytes(0)).toBe('0 Bytes');
    expect(formatBytes(1024)).toBe('1 KB');
    expect(formatBytes(1048576)).toBe('1 MB');
    expect(formatBytes(1073741824)).toBe('1 GB');
    expect(formatBytes(1536)).toBe('1.5 KB');
  });
});

describe('getPerformanceRecommendations', () => {
  it('returns recommendations for low FPS', () => {
    const metrics = {
      fps: 20,
      frameTime: 50,
      memoryUsage: 25 * 1024 * 1024,
      drawCalls: 100,
      triangles: 50000,
      averageFps: 25,
    };

    const recommendations = getPerformanceRecommendations(metrics);

    expect(recommendations).toContain(
      'Consider reducing visual effects quality'
    );
    expect(recommendations).toContain('Enable Level of Detail (LOD) system');
  });

  it('returns memory recommendations for high memory usage', () => {
    const metrics = {
      fps: 60,
      frameTime: 16,
      memoryUsage: 60 * 1024 * 1024, // 60MB
      drawCalls: 100,
      triangles: 50000,
      averageFps: 60,
    };

    const recommendations = getPerformanceRecommendations(metrics);

    expect(recommendations).toContain(
      'High memory usage detected - consider optimizing textures'
    );
  });

  it('returns frame time recommendations', () => {
    const metrics = {
      fps: 30,
      frameTime: 40, // High frame time
      memoryUsage: 25 * 1024 * 1024,
      drawCalls: 100,
      triangles: 50000,
      averageFps: 30,
    };

    const recommendations = getPerformanceRecommendations(metrics);

    expect(recommendations).toContain(
      'Frame time too high - reduce scene complexity'
    );
  });

  it('returns empty array for good performance', () => {
    const metrics = {
      fps: 60,
      frameTime: 16,
      memoryUsage: 25 * 1024 * 1024,
      drawCalls: 100,
      triangles: 50000,
      averageFps: 60,
    };

    const recommendations = getPerformanceRecommendations(metrics);

    expect(recommendations).toHaveLength(0);
  });
});

describe('detectPerformanceCapabilities', () => {
  beforeEach(() => {
    // Mock canvas and WebGL context
    const mockCanvas = {
      getContext: vi.fn(),
    };

    const mockWebGLContext = {
      getParameter: vi.fn(),
      getSupportedExtensions: vi.fn(() => [
        'EXT_texture_filter_anisotropic',
        'WEBGL_lose_context',
      ]),
    };

    // Mock WebGL constants
    mockWebGLContext.getParameter.mockImplementation(param => {
      if (param === 'MAX_TEXTURE_SIZE') return 4096;
      if (param === 'MAX_VIEWPORT_DIMS') return [4096, 4096];
      return null;
    });

    Object.defineProperty(document, 'createElement', {
      value: vi.fn(() => mockCanvas),
      writable: true,
    });

    mockCanvas.getContext.mockImplementation(type => {
      if (type === 'webgl' || type === 'experimental-webgl') {
        return mockWebGLContext;
      }
      if (type === 'webgl2') {
        return mockWebGLContext; // Simulate WebGL2 support
      }
      return null;
    });
  });

  it('detects WebGL capabilities', () => {
    const capabilities = detectPerformanceCapabilities();

    expect(capabilities.webgl).toBe(true);
    expect(capabilities.webgl2).toBe(true);
    expect(capabilities.maxTextureSize).toBe(4096);
    expect(capabilities.maxViewportDims).toEqual([4096, 4096]);
    expect(capabilities.extensions).toContain('EXT_texture_filter_anisotropic');
  });

  it('handles no WebGL support', () => {
    // Mock no WebGL support
    const mockCanvas = {
      getContext: vi.fn(() => null),
    };

    Object.defineProperty(document, 'createElement', {
      value: vi.fn(() => mockCanvas),
      writable: true,
    });

    const capabilities = detectPerformanceCapabilities();

    expect(capabilities.webgl).toBe(false);
    expect(capabilities.webgl2).toBe(false);
    expect(capabilities.maxTextureSize).toBe(0);
    expect(capabilities.maxViewportDims).toEqual([0, 0]);
    expect(capabilities.extensions).toEqual([]);
  });
});
