export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  drawCalls: number;
  triangles: number;
  averageFps: number;
  gpuMemory?: number;
}

export interface PerformanceConfig {
  targetFps: number;
  lowFpsThreshold: number;
  mediumFpsThreshold: number;
  memoryWarningThreshold: number;
  sampleSize: number;
}

export type PerformanceMode = 'high' | 'medium' | 'low';

export class PerformanceMonitor {
  private frameCount: number = 0;
  private lastFrameTime: number = performance.now();
  private fpsHistory: number[] = [];
  private config: PerformanceConfig;
  private currentMode: PerformanceMode = 'high';
  private callbacks: Set<(metrics: PerformanceMetrics) => void> = new Set();
  private modeChangeCallbacks: Set<(mode: PerformanceMode) => void> = new Set();
  private animationFrameId: number | null = null;
  private isRunning: boolean = false;

  constructor(config: Partial<PerformanceConfig> = {}) {
    this.config = {
      targetFps: 60,
      lowFpsThreshold: 30,
      mediumFpsThreshold: 45,
      memoryWarningThreshold: 50 * 1024 * 1024, // 50MB
      sampleSize: 60,
      ...config,
    };
  }

  start(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    this.frameCount = 0;
    this.fpsHistory = [];
    this.lastFrameTime = performance.now();
    this.update();
  }

  stop(): void {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private update = (): void => {
    if (!this.isRunning) return;

    const now = performance.now();
    const frameTime = now - this.lastFrameTime;
    this.lastFrameTime = now;

    this.frameCount++;

    // Calculate FPS
    const currentFps = frameTime > 0 ? 1000 / frameTime : 0;
    this.fpsHistory.push(currentFps);

    // Keep only recent samples
    if (this.fpsHistory.length > this.config.sampleSize) {
      this.fpsHistory.shift();
    }

    // Calculate metrics every few frames to avoid performance impact
    if (this.frameCount % 10 === 0) {
      const metrics = this.calculateMetrics(frameTime);
      this.notifySubscribers(metrics);
      this.checkPerformanceMode(metrics);
    }

    this.animationFrameId = requestAnimationFrame(this.update);
  };

  private calculateMetrics(frameTime: number): PerformanceMetrics {
    const averageFps =
      this.fpsHistory.length > 0
        ? this.fpsHistory.reduce((sum, fps) => sum + fps, 0) /
          this.fpsHistory.length
        : 0;

    const currentFps = frameTime > 0 ? 1000 / frameTime : 0;

    // Get memory usage if available
    let memoryUsage = 0;
    if ('memory' in performance) {
      const memory = (performance as { memory: { usedJSHeapSize: number } })
        .memory;
      memoryUsage = memory.usedJSHeapSize || 0;
    }

    return {
      fps: currentFps,
      frameTime,
      memoryUsage,
      drawCalls: 0, // Will be updated by 3D scene
      triangles: 0, // Will be updated by 3D scene
      averageFps,
      gpuMemory: undefined, // Will be updated if WebGL available
    };
  }

  private checkPerformanceMode(metrics: PerformanceMetrics): void {
    const avgFps = metrics.averageFps;
    let newMode: PerformanceMode = this.currentMode;

    if (avgFps < this.config.lowFpsThreshold) {
      newMode = 'low';
    } else if (avgFps < this.config.mediumFpsThreshold) {
      newMode = 'medium';
    } else {
      newMode = 'high';
    }

    if (newMode !== this.currentMode) {
      this.currentMode = newMode;
      this.notifyModeChange(newMode);
    }
  }

  private notifySubscribers(metrics: PerformanceMetrics): void {
    this.callbacks.forEach(callback => callback(metrics));
  }

  private notifyModeChange(mode: PerformanceMode): void {
    this.modeChangeCallbacks.forEach(callback => callback(mode));
  }

  // Public API
  subscribe(callback: (metrics: PerformanceMetrics) => void): () => void {
    this.callbacks.add(callback);
    return () => this.callbacks.delete(callback);
  }

  onModeChange(callback: (mode: PerformanceMode) => void): () => void {
    this.modeChangeCallbacks.add(callback);
    return () => this.modeChangeCallbacks.delete(callback);
  }

  getCurrentMode(): PerformanceMode {
    return this.currentMode;
  }

  setMode(mode: PerformanceMode): void {
    if (mode !== this.currentMode) {
      this.currentMode = mode;
      this.notifyModeChange(mode);
    }
  }

  updateRenderMetrics(_drawCalls: number, _triangles: number): void {
    // Called by 3D renderer to update render-specific metrics
    // This will be used in the next metrics calculation
  }

  getAverageFps(): number {
    return this.fpsHistory.length > 0
      ? this.fpsHistory.reduce((sum, fps) => sum + fps, 0) /
          this.fpsHistory.length
      : 0;
  }

  reset(): void {
    this.frameCount = 0;
    this.lastFrameTime = performance.now();
    this.fpsHistory = [];
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Utility functions
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getPerformanceRecommendations = (
  metrics: PerformanceMetrics
): string[] => {
  const recommendations: string[] = [];

  if (metrics.averageFps < 30) {
    recommendations.push('Consider reducing visual effects quality');
    recommendations.push('Enable Level of Detail (LOD) system');
  }

  if (metrics.memoryUsage > 50 * 1024 * 1024) {
    recommendations.push(
      'High memory usage detected - consider optimizing textures'
    );
  }

  if (metrics.frameTime > 33) {
    recommendations.push('Frame time too high - reduce scene complexity');
  }

  return recommendations;
};

export const detectPerformanceCapabilities = (): {
  webgl: boolean;
  webgl2: boolean;
  maxTextureSize: number;
  maxViewportDims: number[];
  extensions: string[];
} => {
  const canvas = document.createElement('canvas');
  const gl =
    canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  const gl2 = canvas.getContext('webgl2');

  let maxTextureSize = 0;
  let maxViewportDims: number[] = [0, 0];
  let extensions: string[] = [];

  if (gl && 'getParameter' in gl) {
    const webglContext = gl as WebGLRenderingContext;
    maxTextureSize = webglContext.getParameter(webglContext.MAX_TEXTURE_SIZE);
    maxViewportDims = webglContext.getParameter(webglContext.MAX_VIEWPORT_DIMS);
    extensions = webglContext.getSupportedExtensions() || [];
  }

  return {
    webgl: !!gl,
    webgl2: !!gl2,
    maxTextureSize,
    maxViewportDims,
    extensions,
  };
};
