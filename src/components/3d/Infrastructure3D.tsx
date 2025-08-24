/**
 * Phase 1: 3D Infrastructure Configuration
 *
 * Enhanced 3D infrastructure with improved WebGL detection,
 * performance monitoring integration, and robust fallback systems
 */

import { logger } from '../../utils/logger';

export interface WebGLCapabilities {
  isWebGLSupported: boolean;
  isWebGL2Supported: boolean;
  maxTextureSize: number;
  maxRenderBufferSize: number;
  maxVertexTextures: number;
  maxFragmentTextures: number;
  maxCombinedTextures: number;
  renderer: string;
  vendor: string;
  version: string;
  shadingLanguageVersion: string;
  extensions: string[];
}

export interface PerformanceProfile {
  tier: 'high' | 'medium' | 'low';
  maxComplexity: number;
  enableShadows: boolean;
  enablePostProcessing: boolean;
  enableLOD: boolean;
  maxLights: number;
  renderScale: number;
  targetFPS: number;
}

/**
 * Detect WebGL capabilities and device performance
 */
export class Infrastructure3D {
  private static instance: Infrastructure3D;
  private capabilities: WebGLCapabilities | null = null;
  private performanceProfile: PerformanceProfile | null = null;
  private isInitialized = false;

  static getInstance(): Infrastructure3D {
    if (!Infrastructure3D.instance) {
      Infrastructure3D.instance = new Infrastructure3D();
    }
    return Infrastructure3D.instance;
  }

  /**
   * Initialize 3D infrastructure with capability detection
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      logger.info('Phase 1: Initializing 3D Infrastructure');

      // Detect WebGL capabilities with error handling
      this.capabilities = await this.detectWebGLCapabilities();

      // Check if WebGL is supported at all
      if (!this.capabilities.isWebGLSupported) {
        throw new Error('WebGL is not supported on this device');
      }

      // Determine performance profile
      this.performanceProfile = this.calculatePerformanceProfile();

      // Log initialization results
      logger.info('3D Infrastructure initialized', {
        webglSupported: this.capabilities.isWebGLSupported,
        webgl2Supported: this.capabilities.isWebGL2Supported,
        performanceTier: this.performanceProfile.tier,
        renderer: this.capabilities.renderer,
      });

      this.isInitialized = true;
    } catch (error) {
      logger.error('Failed to initialize 3D infrastructure', error as Error);

      // Set fallback capabilities for graceful degradation
      this.capabilities = this.getFallbackCapabilities();
      this.performanceProfile = this.getFallbackPerformanceProfile();

      throw new Error(
        `3D Infrastructure initialization failed: ${(error as Error).message}`
      );
    }
  }

  /**
   * Get fallback capabilities when WebGL detection fails
   */
  private getFallbackCapabilities(): WebGLCapabilities {
    return {
      isWebGLSupported: false,
      isWebGL2Supported: false,
      maxTextureSize: 0,
      maxRenderBufferSize: 0,
      maxVertexTextures: 0,
      maxFragmentTextures: 0,
      maxCombinedTextures: 0,
      renderer: 'Unknown',
      vendor: 'Unknown',
      version: 'Unknown',
      shadingLanguageVersion: 'Unknown',
      extensions: [],
    };
  }

  /**
   * Get fallback performance profile for unsupported devices
   */
  private getFallbackPerformanceProfile(): PerformanceProfile {
    return {
      tier: 'low',
      maxComplexity: 0,
      enableShadows: false,
      enablePostProcessing: false,
      enableLOD: false,
      maxLights: 0,
      renderScale: 0.5,
      targetFPS: 30,
    };
  }

  /**
   * Detect comprehensive WebGL capabilities
   */
  private async detectWebGLCapabilities(): Promise<WebGLCapabilities> {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;

    // Try WebGL2 first, fallback to WebGL1
    let gl: WebGLRenderingContext | WebGL2RenderingContext | null =
      canvas.getContext('webgl2');
    const isWebGL2 = !!gl;

    if (!gl) {
      gl = canvas.getContext('webgl');
    }

    if (!gl) {
      return {
        isWebGLSupported: false,
        isWebGL2Supported: false,
        maxTextureSize: 0,
        maxRenderBufferSize: 0,
        maxVertexTextures: 0,
        maxFragmentTextures: 0,
        maxCombinedTextures: 0,
        renderer: 'none',
        vendor: 'none',
        version: 'none',
        shadingLanguageVersion: 'none',
        extensions: [],
      };
    }

    // Get debug info
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = debugInfo
      ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      : 'Unknown';
    const vendor = debugInfo
      ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
      : 'Unknown';

    // Get supported extensions
    const extensions = gl.getSupportedExtensions() || [];

    const capabilities: WebGLCapabilities = {
      isWebGLSupported: true,
      isWebGL2Supported: isWebGL2,
      maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
      maxRenderBufferSize: gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),
      maxVertexTextures: gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS),
      maxFragmentTextures: gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS),
      maxCombinedTextures: gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS),
      renderer: renderer || 'Unknown',
      vendor: vendor || 'Unknown',
      version: gl.getParameter(gl.VERSION) || 'Unknown',
      shadingLanguageVersion:
        gl.getParameter(gl.SHADING_LANGUAGE_VERSION) || 'Unknown',
      extensions,
    };

    // Clean up
    canvas.remove();

    return capabilities;
  }

  /**
   * Calculate performance profile based on device capabilities
   */
  private calculatePerformanceProfile(): PerformanceProfile {
    if (!this.capabilities) {
      throw new Error('Capabilities not detected');
    }

    const { renderer, maxTextureSize, isWebGL2Supported, extensions } =
      this.capabilities;

    // Score factors
    let score = 0;

    // WebGL2 support
    if (isWebGL2Supported) score += 20;

    // Texture size capabilities
    if (maxTextureSize >= 16384) score += 30;
    else if (maxTextureSize >= 8192) score += 20;
    else if (maxTextureSize >= 4096) score += 10;

    // Renderer-based scoring
    const rendererLower = renderer.toLowerCase();
    if (rendererLower.includes('nvidia') || rendererLower.includes('geforce')) {
      score += 25;
    } else if (
      rendererLower.includes('amd') ||
      rendererLower.includes('radeon')
    ) {
      score += 20;
    } else if (rendererLower.includes('intel')) {
      score += 10;
    }

    // Extension support
    const importantExtensions = [
      'OES_texture_float',
      'WEBGL_depth_texture',
      'EXT_texture_filter_anisotropic',
      'WEBGL_compressed_texture_s3tc',
    ];

    const supportedImportantExtensions = importantExtensions.filter(ext =>
      extensions.includes(ext)
    );
    score += supportedImportantExtensions.length * 5;

    // Memory estimation (rough)
    const memoryMB = this.estimateGPUMemory();
    if (memoryMB >= 4096) score += 15;
    else if (memoryMB >= 2048) score += 10;
    else if (memoryMB >= 1024) score += 5;

    // Determine tier
    let tier: 'high' | 'medium' | 'low';
    if (score >= 70) tier = 'high';
    else if (score >= 40) tier = 'medium';
    else tier = 'low';

    // Return appropriate profile
    switch (tier) {
      case 'high':
        return {
          tier: 'high',
          maxComplexity: 100,
          enableShadows: true,
          enablePostProcessing: true,
          enableLOD: true,
          maxLights: 8,
          renderScale: 1.0,
          targetFPS: 60,
        };
      case 'medium':
        return {
          tier: 'medium',
          maxComplexity: 60,
          enableShadows: true,
          enablePostProcessing: false,
          enableLOD: true,
          maxLights: 4,
          renderScale: 0.8,
          targetFPS: 30,
        };
      case 'low':
        return {
          tier: 'low',
          maxComplexity: 30,
          enableShadows: false,
          enablePostProcessing: false,
          enableLOD: true,
          maxLights: 2,
          renderScale: 0.6,
          targetFPS: 24,
        };
    }
  }

  /**
   * Estimate GPU memory (rough approximation)
   */
  private estimateGPUMemory(): number {
    if (!this.capabilities) return 512;

    const { maxTextureSize, renderer } = this.capabilities;

    // Very rough estimation based on texture size and renderer
    let estimatedMB = 512;

    if (maxTextureSize >= 16384) estimatedMB = 4096;
    else if (maxTextureSize >= 8192) estimatedMB = 2048;
    else if (maxTextureSize >= 4096) estimatedMB = 1024;

    // Adjust based on renderer
    const rendererLower = renderer.toLowerCase();
    if (rendererLower.includes('nvidia') && rendererLower.includes('rtx')) {
      estimatedMB *= 2;
    } else if (
      rendererLower.includes('mobile') ||
      rendererLower.includes('mali')
    ) {
      estimatedMB *= 0.5;
    }

    return Math.round(estimatedMB);
  }

  /**
   * Get current capabilities
   */
  getCapabilities(): WebGLCapabilities | null {
    return this.capabilities;
  }

  /**
   * Get current performance profile
   */
  getPerformanceProfile(): PerformanceProfile | null {
    return this.performanceProfile;
  }

  /**
   * Check if feature is supported based on performance profile
   */
  isFeatureSupported(
    feature: 'shadows' | 'postprocessing' | 'lod' | 'complexGeometry'
  ): boolean {
    if (!this.performanceProfile) return false;

    switch (feature) {
      case 'shadows':
        return this.performanceProfile.enableShadows;
      case 'postprocessing':
        return this.performanceProfile.enablePostProcessing;
      case 'lod':
        return this.performanceProfile.enableLOD;
      case 'complexGeometry':
        return this.performanceProfile.tier !== 'low';
      default:
        return false;
    }
  }

  /**
   * Get recommended settings for Three.js renderer
   */
  getRecommendedRendererSettings() {
    if (!this.performanceProfile) {
      throw new Error('Performance profile not initialized');
    }

    const { tier, enableShadows, renderScale } = this.performanceProfile;

    return {
      antialias: tier !== 'low',
      alpha: true,
      powerPreference: tier === 'high' ? 'high-performance' : 'default',
      precision: tier === 'high' ? 'highp' : 'mediump',
      shadowMap: {
        enabled: enableShadows,
        type: tier === 'high' ? 'PCFSoftShadowMap' : 'BasicShadowMap',
      },
      toneMapping:
        tier === 'high' ? 'ACESFilmicToneMapping' : 'LinearToneMapping',
      pixelRatio: Math.min(window.devicePixelRatio, renderScale * 2),
      outputColorSpace: 'sRGB',
    };
  }

  /**
   * Report infrastructure status for debugging
   */
  getInfrastructureReport(): object {
    return {
      initialized: this.isInitialized,
      capabilities: this.capabilities,
      performanceProfile: this.performanceProfile,
      timestamp: new Date().toISOString(),
    };
  }
}

// Export singleton instance
export const infrastructure3D = Infrastructure3D.getInstance();
