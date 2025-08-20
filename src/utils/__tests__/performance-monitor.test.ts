import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PerformanceMonitor } from '../performance-monitor';

describe('PerformanceMonitor', () => {
  let monitor: PerformanceMonitor;

  beforeEach(() => {
    monitor = PerformanceMonitor.getInstance();
    monitor.clearMetrics();
  });

  afterEach(() => {
    monitor.stopMonitoring();
  });

  it('should be a singleton', () => {
    const monitor2 = PerformanceMonitor.getInstance();
    expect(monitor).toBe(monitor2);
  });

  it('should start and stop monitoring', () => {
    expect(monitor['isMonitoring']).toBe(false);

    monitor.startMonitoring(100); // 100ms interval for testing
    expect(monitor['isMonitoring']).toBe(true);

    monitor.stopMonitoring();
    expect(monitor['isMonitoring']).toBe(false);
  });

  it('should collect metrics', () => {
    const metrics = monitor['collectMetrics']();
    expect(metrics).toHaveProperty('fps');
    expect(metrics).toHaveProperty('memoryUsage');
    expect(metrics).toHaveProperty('drawCalls');
    expect(metrics).toHaveProperty('triangles');
    expect(metrics).toHaveProperty('geometries');
    expect(metrics).toHaveProperty('textures');
    expect(metrics).toHaveProperty('timestamp');
  });

  it('should handle callbacks', () => {
    const callback = vi.fn();
    monitor.onMetricsUpdate(callback);

    // Start monitoring with short interval
    monitor.startMonitoring(50);

    // Wait for at least one callback
    return new Promise<void>(resolve => {
      setTimeout(() => {
        expect(callback).toHaveBeenCalled();
        monitor.removeCallback(callback);
        resolve();
      }, 100);
    });
  });

  it('should handle degradation callbacks', () => {
    const callback = vi.fn();
    monitor.onDegradation(callback);

    // Trigger degradation manually
    monitor['triggerDegradation']('reduceLOD');

    expect(callback).toHaveBeenCalledWith('reduceLOD');
  });

  it('should clear metrics', () => {
    // Add some fake metrics
    monitor['metrics'] = [
      {
        fps: 60,
        memoryUsage: 1000,
        drawCalls: 100,
        triangles: 1000,
        geometries: 10,
        textures: 5,
        timestamp: Date.now(),
      },
    ];

    expect(monitor['metrics'].length).toBe(1);

    monitor.clearMetrics();
    expect(monitor['metrics'].length).toBe(0);
  });
});
