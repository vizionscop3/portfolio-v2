import { PerformanceMode, SceneConfig } from '../types/scene';
import { PerformanceMonitor } from './performance-monitor';
import { WebGLDetector } from './webgl-detection';

/**
 * Initialize 3D scene with performance monitoring and WebGL detection
 */
export class SceneSetup {
  private webglDetector: WebGLDetector;
  private performanceMonitor: PerformanceMonitor;

  constructor() {
    this.webglDetector = WebGLDetector.getInstance();
    this.performanceMonitor = PerformanceMonitor.getInstance();
  }

  /**
   * Initialize the 3D scene with optimal settings
   */
  async initialize(): Promise<{
    supported: boolean;
    performanceMode: PerformanceMode;
    config: SceneConfig;
    fallbackTo2D: boolean;
  }> {
    // Check WebGL support
    const webglSupported = this.webglDetector.isWebGLSupported();

    if (!webglSupported) {
      return {
        supported: false,
        performanceMode: 'low',
        config: this.getMinimalConfig(),
        fallbackTo2D: true,
      };
    }

    // Get performance tier and recommended settings
    const performanceTier = this.webglDetector.getPerformanceTier();
    const recommendedSettings = this.webglDetector.getRecommendedSettings();

    // Start performance monitoring
    this.performanceMonitor.startMonitoring();

    // Set up degradation callbacks
    this.performanceMonitor.onDegradation(action => {
      console.warn(`Performance degradation: ${action}`);
      // Handle performance degradation actions
      this.handlePerformanceDegradation(action);
    });

    return {
      supported: true,
      performanceMode: performanceTier,
      config: this.generateSceneConfig(performanceTier, recommendedSettings),
      fallbackTo2D: false,
    };
  }

  /**
   * Generate scene configuration based on performance tier
   */
  private generateSceneConfig(
    performanceMode: PerformanceMode,
    settings: any
  ): SceneConfig {
    return {
      lighting: {
        ambient: {
          intensity: 0.4,
          color: '#ffffff',
        },
        directional: {
          intensity: settings.shadows ? 1.0 : 0.8,
          color: '#ffffff',
          position: { x: 10, y: 10, z: 5 } as any,
          castShadow: settings.shadows,
        },
        point:
          settings.maxLights >= 4
            ? [
                {
                  intensity: 0.5,
                  color: '#ffa500',
                  position: { x: -5, y: 3, z: 2 } as any,
                  distance: 10,
                },
                {
                  intensity: 0.3,
                  color: '#87ceeb',
                  position: { x: 5, y: 2, z: -3 } as any,
                  distance: 8,
                },
              ]
            : [],
      },
      environment: {
        background: '#1a1a2e',
        environment: 'studio',
      },
      camera: {
        position: { x: 0, y: 5, z: 10 } as any,
        target: { x: 0, y: 0, z: 0 } as any,
        fov: 75,
        near: 0.1,
        far: 1000,
      },
      postProcessing: {
        enabled: settings.postProcessing,
        bloom: {
          intensity: performanceMode === 'high' ? 0.5 : 0.2,
          threshold: 0.9,
          smoothWidth: 0.4,
        },
        depthOfField: {
          enabled: performanceMode === 'high',
          focusDistance: 10,
          focalLength: 0.02,
          bokehScale: 2,
        },
        colorGrading: {
          enabled: settings.postProcessing,
          exposure: 0.1,
          contrast: 0.05,
          saturation: 0.1,
        },
      },
    };
  }

  /**
   * Get minimal configuration for fallback
   */
  private getMinimalConfig(): SceneConfig {
    return {
      lighting: {
        ambient: {
          intensity: 0.6,
          color: '#ffffff',
        },
        directional: {
          intensity: 0.4,
          color: '#ffffff',
          position: { x: 5, y: 5, z: 5 } as any,
          castShadow: false,
        },
        point: [],
      },
      environment: {
        background: '#1a1a2e',
        environment: 'studio',
      },
      camera: {
        position: { x: 0, y: 5, z: 10 } as any,
        target: { x: 0, y: 0, z: 0 } as any,
        fov: 75,
        near: 0.1,
        far: 1000,
      },
      postProcessing: {
        enabled: false,
        bloom: {
          intensity: 0,
          threshold: 1,
          smoothWidth: 0,
        },
        depthOfField: {
          enabled: false,
          focusDistance: 10,
          focalLength: 0.02,
          bokehScale: 1,
        },
        colorGrading: {
          enabled: false,
          exposure: 0,
          contrast: 0,
          saturation: 0,
        },
      },
    };
  }

  /**
   * Handle performance degradation actions
   */
  private handlePerformanceDegradation(action: string): void {
    switch (action) {
      case 'reduceLOD':
        console.log('Reducing Level of Detail');
        // Implement LOD reduction
        break;
      case 'disableShadows':
        console.log('Disabling shadows');
        // Implement shadow disabling
        break;
      case 'disablePostProcessing':
        console.log('Disabling post-processing');
        // Implement post-processing disabling
        break;
      case 'fallbackTo2D':
        console.log('Falling back to 2D mode');
        // Implement 2D fallback
        break;
    }
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    this.performanceMonitor.stopMonitoring();
  }
}
