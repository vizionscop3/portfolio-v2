import { WebGLCapabilities } from '../types/performance';

/**
 * Detects WebGL support and capabilities
 */
export class WebGLDetector {
  private static instance: WebGLDetector;
  private capabilities: WebGLCapabilities | null = null;

  static getInstance(): WebGLDetector {
    if (!WebGLDetector.instance) {
      WebGLDetector.instance = new WebGLDetector();
    }
    return WebGLDetector.instance;
  }

  /**
   * Check if WebGL is supported
   */
  isWebGLSupported(): boolean {
    try {
      const canvas = document.createElement('canvas');
      const context =
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!context;
    } catch (e) {
      return false;
    }
  }

  /**
   * Check if WebGL2 is supported
   */
  isWebGL2Supported(): boolean {
    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('webgl2');
      return !!context;
    } catch (e) {
      return false;
    }
  }

  /**
   * Get detailed WebGL capabilities
   */
  getCapabilities(): WebGLCapabilities {
    if (this.capabilities) {
      return this.capabilities;
    }

    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    if (!gl || !(gl instanceof WebGLRenderingContext)) {
      this.capabilities = {
        supported: false,
        version: 'Not supported',
        renderer: 'Unknown',
        vendor: 'Unknown',
        maxTextureSize: 0,
        maxVertexUniforms: 0,
        maxFragmentUniforms: 0,
        extensions: [],
      };
      return this.capabilities;
    }

    const webglContext = gl as WebGLRenderingContext;
    const debugInfo = webglContext.getExtension('WEBGL_debug_renderer_info');
    const extensions = webglContext.getSupportedExtensions() || [];

    this.capabilities = {
      supported: true,
      version: webglContext.getParameter(webglContext.VERSION),
      renderer: debugInfo
        ? webglContext.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
        : 'Unknown',
      vendor: debugInfo
        ? webglContext.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
        : 'Unknown',
      maxTextureSize: webglContext.getParameter(webglContext.MAX_TEXTURE_SIZE),
      maxVertexUniforms: webglContext.getParameter(
        webglContext.MAX_VERTEX_UNIFORM_VECTORS
      ),
      maxFragmentUniforms: webglContext.getParameter(
        webglContext.MAX_FRAGMENT_UNIFORM_VECTORS
      ),
      extensions,
    };

    return this.capabilities;
  }

  /**
   * Check if device is mobile
   */
  isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  /**
   * Estimate device performance tier
   */
  getPerformanceTier(): 'high' | 'medium' | 'low' {
    const capabilities = this.getCapabilities();

    if (!capabilities.supported) {
      return 'low';
    }

    const isMobile = this.isMobile();
    const maxTextureSize = capabilities.maxTextureSize;
    const renderer = capabilities.renderer.toLowerCase();

    // High-end desktop GPUs
    if (!isMobile && maxTextureSize >= 16384) {
      if (
        renderer.includes('rtx') ||
        renderer.includes('radeon rx') ||
        renderer.includes('gtx')
      ) {
        return 'high';
      }
    }

    // Medium performance
    if (maxTextureSize >= 8192) {
      return 'medium';
    }

    // Low performance (mobile, integrated graphics, old hardware)
    return 'low';
  }

  /**
   * Check for specific WebGL extensions
   */
  hasExtension(extensionName: string): boolean {
    const capabilities = this.getCapabilities();
    return capabilities.extensions.includes(extensionName);
  }

  /**
   * Get recommended settings based on capabilities
   */
  getRecommendedSettings() {
    const tier = this.getPerformanceTier();
    const isMobile = this.isMobile();

    switch (tier) {
      case 'high':
        return {
          shadows: true,
          postProcessing: true,
          particles: true,
          antialiasing: true,
          maxLights: 8,
          textureQuality: 'high',
          modelLOD: 'high',
        };

      case 'medium':
        return {
          shadows: true,
          postProcessing: !isMobile,
          particles: !isMobile,
          antialiasing: !isMobile,
          maxLights: 4,
          textureQuality: 'medium',
          modelLOD: 'medium',
        };

      case 'low':
      default:
        return {
          shadows: false,
          postProcessing: false,
          particles: false,
          antialiasing: false,
          maxLights: 2,
          textureQuality: 'low',
          modelLOD: 'low',
        };
    }
  }
}
