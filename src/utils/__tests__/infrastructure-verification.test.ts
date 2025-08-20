import { describe, expect, it } from 'vitest';

describe('3D Infrastructure Verification', () => {
  it('should import all new types without errors', async () => {
    // Test type imports
    const sceneTypes = await import('../../types/scene');
    const interactiveTypes = await import('../../types/interactive');
    const performanceTypes = await import('../../types/performance');

    expect(sceneTypes).toBeDefined();
    expect(interactiveTypes).toBeDefined();
    expect(performanceTypes).toBeDefined();
  });

  it('should import all new utilities without errors', async () => {
    // Test utility imports
    const { WebGLDetector } = await import('../webgl-detection');
    const { PerformanceMonitor } = await import('../performance-monitor');
    const { SceneSetup } = await import('../scene-setup');

    expect(WebGLDetector).toBeDefined();
    expect(PerformanceMonitor).toBeDefined();
    expect(SceneSetup).toBeDefined();
  });

  it('should verify package dependencies are installed', () => {
    // Test that our new dependencies are available
    expect(() => require('@react-three/postprocessing')).not.toThrow();
    expect(() => require('zustand')).not.toThrow();
    expect(() => require('framer-motion')).not.toThrow();
  });

  it('should verify existing Three.js dependencies', () => {
    // Test that existing dependencies still work
    expect(() => require('@react-three/fiber')).not.toThrow();
    expect(() => require('@react-three/drei')).not.toThrow();
    expect(() => require('three')).not.toThrow();
  });
});
