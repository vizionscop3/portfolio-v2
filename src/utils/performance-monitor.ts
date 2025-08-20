import {
  PerformanceMetrics,
  PerformanceThresholds,
} from '../types/performance';

/**
 * Performance monitoring utility for 3D scenes
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics[] = [];
  private isMonitoring = false;
  private monitoringInterval: number | null = null;
  private callbacks: ((metrics: PerformanceMetrics) => void)[] = [];
  private thresholds: PerformanceThresholds;
  private degradationCallbacks: ((action: string) => void)[] = [];

  constructor() {
    this.thresholds = {
      minFPS: 30,
      maxMemoryUsage: 100 * 1024 * 1024, // 100MB
      maxDrawCalls: 1000,
      degradationSteps: [
        { condition: 'fps', threshold: 45, action: 'reduceLOD' },
        { condition: 'fps', threshold: 35, action: 'disableShadows' },
        { condition: 'fps', threshold: 25, action: 'disablePostProcessing' },
        { condition: 'fps', threshold: 15, action: 'fallbackTo2D' },
        {
          condition: 'memory',
          threshold: 150 * 1024 * 1024,
          action: 'reduceLOD',
        },
        { condition: 'drawCalls', threshold: 1500, action: 'reduceLOD' },
      ],
    };
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  /**
   * Start performance monitoring
   */
  startMonitoring(intervalMs = 1000): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.monitoringInterval = window.setInterval(() => {
      const metrics = this.collectMetrics();
      this.metrics.push(metrics);

      // Keep only last 60 measurements (1 minute at 1s intervals)
      if (this.metrics.length > 60) {
        this.metrics.shift();
      }

      // Notify callbacks
      this.callbacks.forEach(callback => callback(metrics));

      // Check thresholds
      this.checkThresholds(metrics);
    }, intervalMs);
  }

  /**
   * Stop performance monitoring
   */
  stopMonitoring(): void {
    if (!this.isMonitoring) return;

    this.isMonitoring = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }

  /**
   * Collect current performance metrics
   */
  private collectMetrics(): PerformanceMetrics {
    const memory = (performance as any).memory;

    return {
      fps: this.calculateFPS(),
      memoryUsage: memory ? memory.usedJSHeapSize : 0,
      drawCalls: this.getDrawCalls(),
      triangles: this.getTriangleCount(),
      geometries: this.getGeometryCount(),
      textures: this.getTextureCount(),
      timestamp: Date.now(),
    };
  }

  /**
   * Calculate current FPS
   */
  private calculateFPS(): number {
    // This is a simplified FPS calculation
    // In a real implementation, you'd track frame times
    const now = performance.now();
    const lastFrame = (this as any).lastFrameTime || now;
    (this as any).lastFrameTime = now;

    const deltaTime = now - lastFrame;
    return deltaTime > 0 ? Math.round(1000 / deltaTime) : 60;
  }

  /**
   * Get approximate draw calls (would need Three.js renderer integration)
   */
  private getDrawCalls(): number {
    // This would be integrated with Three.js renderer.info
    // For now, return a placeholder
    return 0;
  }

  /**
   * Get triangle count (would need Three.js scene integration)
   */
  private getTriangleCount(): number {
    // This would be integrated with Three.js scene traversal
    // For now, return a placeholder
    return 0;
  }

  /**
   * Get geometry count (would need Three.js integration)
   */
  private getGeometryCount(): number {
    // This would be integrated with Three.js renderer.info
    return 0;
  }

  /**
   * Get texture count (would need Three.js integration)
   */
  private getTextureCount(): number {
    // This would be integrated with Three.js renderer.info
    return 0;
  }

  /**
   * Check performance thresholds and trigger degradation if needed
   */
  private checkThresholds(metrics: PerformanceMetrics): void {
    for (const degradation of this.thresholds.degradationSteps) {
      let shouldDegrade = false;

      switch (degradation.condition) {
        case 'fps':
          shouldDegrade = metrics.fps < degradation.threshold;
          break;
        case 'memory':
          shouldDegrade = metrics.memoryUsage > degradation.threshold;
          break;
        case 'drawCalls':
          shouldDegrade = metrics.drawCalls > degradation.threshold;
          break;
      }

      if (shouldDegrade) {
        this.triggerDegradation(degradation.action);
        break; // Only trigger one degradation step at a time
      }
    }
  }

  /**
   * Trigger performance degradation action
   */
  private triggerDegradation(action: string): void {
    console.warn(`Performance degradation triggered: ${action}`);
    this.degradationCallbacks.forEach(callback => callback(action));
  }

  /**
   * Add callback for performance updates
   */
  onMetricsUpdate(callback: (metrics: PerformanceMetrics) => void): void {
    this.callbacks.push(callback);
  }

  /**
   * Add callback for degradation events
   */
  onDegradation(callback: (action: string) => void): void {
    this.degradationCallbacks.push(callback);
  }

  /**
   * Remove callback
   */
  removeCallback(callback: (metrics: PerformanceMetrics) => void): void {
    const index = this.callbacks.indexOf(callback);
    if (index > -1) {
      this.callbacks.splice(index, 1);
    }
  }

  /**
   * Get current metrics
   */
  getCurrentMetrics(): PerformanceMetrics | null {
    return this.metrics.length > 0
      ? this.metrics[this.metrics.length - 1]
      : null;
  }

  /**
   * Get average metrics over time period
   */
  getAverageMetrics(periodMs = 10000): PerformanceMetrics | null {
    const now = Date.now();
    const relevantMetrics = this.metrics.filter(
      m => now - m.timestamp <= periodMs
    );

    if (relevantMetrics.length === 0) return null;

    const sum = relevantMetrics.reduce(
      (acc, m) => ({
        fps: acc.fps + m.fps,
        memoryUsage: acc.memoryUsage + m.memoryUsage,
        drawCalls: acc.drawCalls + m.drawCalls,
        triangles: acc.triangles + m.triangles,
        geometries: acc.geometries + m.geometries,
        textures: acc.textures + m.textures,
        timestamp: now,
      }),
      {
        fps: 0,
        memoryUsage: 0,
        drawCalls: 0,
        triangles: 0,
        geometries: 0,
        textures: 0,
        timestamp: now,
      }
    );

    const count = relevantMetrics.length;
    return {
      fps: Math.round(sum.fps / count),
      memoryUsage: Math.round(sum.memoryUsage / count),
      drawCalls: Math.round(sum.drawCalls / count),
      triangles: Math.round(sum.triangles / count),
      geometries: Math.round(sum.geometries / count),
      textures: Math.round(sum.textures / count),
      timestamp: now,
    };
  }

  /**
   * Update performance thresholds
   */
  updateThresholds(thresholds: Partial<PerformanceThresholds>): void {
    this.thresholds = { ...this.thresholds, ...thresholds };
  }

  /**
   * Clear metrics history
   */
  clearMetrics(): void {
    this.metrics = [];
  }
}
