/**
 * Performance Optimization Utilities
 * Phase 11 Task 11.3 - Final performance optimization and polish
 */

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  drawCalls: number;
  triangles: number;
}

interface OptimizationSettings {
  targetFPS: number;
  maxDrawCalls: number;
  maxTriangles: number;
  enableLOD: boolean;
  enableFrustumCulling: boolean;
  renderScale: number;
  shadowMapSize: number;
  enablePostProcessing: boolean;
}

class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  private metrics: PerformanceMetrics = {
    fps: 60,
    frameTime: 16.67,
    memoryUsage: 0,
    drawCalls: 0,
    triangles: 0,
  };

  private settings: OptimizationSettings = {
    targetFPS: 60,
    maxDrawCalls: 100,
    maxTriangles: 50000,
    enableLOD: true,
    enableFrustumCulling: true,
    renderScale: 1.0,
    shadowMapSize: 2048,
    enablePostProcessing: true,
  };

  private performanceHistory: PerformanceMetrics[] = [];
  private adjustmentTimer?: number;
  private isOptimizing = false;

  static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer();
    }
    return PerformanceOptimizer.instance;
  }

  /**
   * Initialize performance monitoring
   */
  initialize(targetFPS: number = 60): void {
    this.settings.targetFPS = targetFPS;
    this.startMonitoring();
  }

  /**
   * Start performance monitoring
   */
  private startMonitoring(): void {
    if (this.adjustmentTimer) {
      clearInterval(this.adjustmentTimer);
    }

    // Monitor performance every 2 seconds
    this.adjustmentTimer = window.setInterval(() => {
      this.updateMetrics();
      this.evaluatePerformance();
    }, 2000);
  }

  /**
   * Update current performance metrics
   */
  private updateMetrics(): void {
    // Get memory usage if available
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.metrics.memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // Convert to MB
    }

    // Calculate FPS based on frame timing
    const now = performance.now();
    const deltaTime = now - this.lastFrameTime;
    this.lastFrameTime = now;

    this.metrics.frameTime = deltaTime;
    this.metrics.fps = Math.round(1000 / deltaTime);

    // Store performance history
    this.performanceHistory.push({ ...this.metrics });

    // Keep only last 30 entries (1 minute of history)
    if (this.performanceHistory.length > 30) {
      this.performanceHistory.shift();
    }
  }

  private lastFrameTime = performance.now();

  /**
   * Evaluate current performance and make adjustments
   */
  private evaluatePerformance(): void {
    if (this.isOptimizing) return;

    const avgFPS = this.getAverageFPS();
    const performanceRatio = avgFPS / this.settings.targetFPS;

    // Performance is too low - optimize
    if (performanceRatio < 0.8) {
      this.optimizeForPerformance();
    }
    // Performance is good - can enable more features
    else if (performanceRatio > 1.1 && this.canEnhanceQuality()) {
      this.enhanceQuality();
    }
  }

  /**
   * Get average FPS over recent history
   */
  private getAverageFPS(): number {
    if (this.performanceHistory.length === 0) return 60;

    const recentHistory = this.performanceHistory.slice(-10); // Last 10 samples
    const sum = recentHistory.reduce((acc, metrics) => acc + metrics.fps, 0);
    return sum / recentHistory.length;
  }

  /**
   * Optimize settings for better performance
   */
  private optimizeForPerformance(): void {
    this.isOptimizing = true;
    let optimized = false;

    // Step 1: Reduce render scale
    if (this.settings.renderScale > 0.7) {
      this.settings.renderScale = Math.max(
        0.7,
        this.settings.renderScale - 0.1
      );
      optimized = true;
    }

    // Step 2: Disable post-processing
    if (this.settings.enablePostProcessing) {
      this.settings.enablePostProcessing = false;
      optimized = true;
    }

    // Step 3: Reduce shadow map size
    if (this.settings.shadowMapSize > 512) {
      this.settings.shadowMapSize = Math.max(
        512,
        this.settings.shadowMapSize / 2
      );
      optimized = true;
    }

    // Step 4: Enable aggressive LOD
    if (!this.settings.enableLOD) {
      this.settings.enableLOD = true;
      optimized = true;
    }

    // Step 5: Reduce triangle limits
    if (this.settings.maxTriangles > 20000) {
      this.settings.maxTriangles = Math.max(
        20000,
        this.settings.maxTriangles * 0.8
      );
      optimized = true;
    }

    if (optimized) {
      console.log('Performance optimized:', this.settings);
      this.notifySettingsChanged();
    }

    // Reset optimization flag after delay
    setTimeout(() => {
      this.isOptimizing = false;
    }, 5000);
  }

  /**
   * Enhance quality when performance allows
   */
  private enhanceQuality(): void {
    let enhanced = false;

    // Step 1: Increase render scale
    if (this.settings.renderScale < 1.0) {
      this.settings.renderScale = Math.min(
        1.0,
        this.settings.renderScale + 0.1
      );
      enhanced = true;
    }

    // Step 2: Enable post-processing
    if (!this.settings.enablePostProcessing) {
      this.settings.enablePostProcessing = true;
      enhanced = true;
    }

    // Step 3: Increase shadow map size
    if (this.settings.shadowMapSize < 2048) {
      this.settings.shadowMapSize = Math.min(
        2048,
        this.settings.shadowMapSize * 2
      );
      enhanced = true;
    }

    if (enhanced) {
      console.log('Quality enhanced:', this.settings);
      this.notifySettingsChanged();
    }
  }

  /**
   * Check if quality can be enhanced
   */
  private canEnhanceQuality(): boolean {
    return (
      this.settings.renderScale < 1.0 ||
      !this.settings.enablePostProcessing ||
      this.settings.shadowMapSize < 2048
    );
  }

  /**
   * Notify observers of settings changes
   */
  private notifySettingsChanged(): void {
    // Dispatch custom event for components to listen to
    window.dispatchEvent(
      new CustomEvent('performanceSettingsChanged', {
        detail: { ...this.settings },
      })
    );
  }

  /**
   * Get current optimization settings
   */
  getSettings(): OptimizationSettings {
    return { ...this.settings };
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Set render statistics for monitoring
   */
  setRenderStats(drawCalls: number, triangles: number): void {
    this.metrics.drawCalls = drawCalls;
    this.metrics.triangles = triangles;
  }

  /**
   * Force performance optimization
   */
  forceOptimize(): void {
    this.optimizeForPerformance();
  }

  /**
   * Reset to default settings
   */
  reset(): void {
    this.settings = {
      targetFPS: 60,
      maxDrawCalls: 100,
      maxTriangles: 50000,
      enableLOD: true,
      enableFrustumCulling: true,
      renderScale: 1.0,
      shadowMapSize: 2048,
      enablePostProcessing: true,
    };
    this.notifySettingsChanged();
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    if (this.adjustmentTimer) {
      clearInterval(this.adjustmentTimer);
      this.adjustmentTimer = undefined;
    }
  }

  /**
   * Get performance grade based on current metrics
   */
  getPerformanceGrade(): 'excellent' | 'good' | 'fair' | 'poor' {
    const avgFPS = this.getAverageFPS();

    if (avgFPS >= 55) return 'excellent';
    if (avgFPS >= 45) return 'good';
    if (avgFPS >= 30) return 'fair';
    return 'poor';
  }

  /**
   * Get optimization recommendations
   */
  getRecommendations(): string[] {
    const recommendations: string[] = [];
    const avgFPS = this.getAverageFPS();

    if (avgFPS < 30) {
      recommendations.push('Consider reducing render scale');
      recommendations.push('Disable post-processing effects');
      recommendations.push('Reduce shadow quality');
    } else if (avgFPS < 45) {
      recommendations.push('Enable aggressive LOD');
      recommendations.push('Reduce maximum triangle count');
    } else if (avgFPS > 55 && this.canEnhanceQuality()) {
      recommendations.push('Can increase render quality');
      recommendations.push('Can enable additional post-processing');
    }

    return recommendations;
  }
}

// Export singleton instance
export const performanceOptimizer = PerformanceOptimizer.getInstance();

// Export types
export type { PerformanceMetrics, OptimizationSettings };

// Export utility functions
export const getPerformanceGrade = (fps: number): string => {
  if (fps >= 55) return 'excellent';
  if (fps >= 45) return 'good';
  if (fps >= 30) return 'fair';
  return 'poor';
};

export const calculateOptimalSettings = (deviceInfo: {
  gpu: string;
  memory: number;
  isMobile: boolean;
}): Partial<OptimizationSettings> => {
  const settings: Partial<OptimizationSettings> = {};

  if (deviceInfo.isMobile) {
    settings.renderScale = 0.8;
    settings.shadowMapSize = 1024;
    settings.enablePostProcessing = false;
    settings.targetFPS = 30;
  } else if (deviceInfo.memory < 4000) {
    // Less than 4GB
    settings.renderScale = 0.9;
    settings.shadowMapSize = 1024;
    settings.enablePostProcessing = true;
  } else {
    settings.renderScale = 1.0;
    settings.shadowMapSize = 2048;
    settings.enablePostProcessing = true;
  }

  return settings;
};
