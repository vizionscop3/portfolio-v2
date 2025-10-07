/**
 * Logging Integration Service
 *
 * Manages the transition to professional logging and provides
 * backwards compatibility while fixing the API issues we've been experiencing.
 */

import {
  logDebug,
  logError,
  logInfo,
  logWarn,
  setupGlobalErrorHandling,
} from './professionalLogger';

// Re-export the professional logger components
export {
  ConsoleTransport,
  LocalStorageTransport,
  LogLevel,
  ProfessionalLogger,
  RemoteTransport,
  withAsyncPerformanceLogging,
  withPerformanceLogging,
} from './professionalLogger';

export type { LogContext, LogEntry } from './professionalLogger';

/**
 * Enhanced Logger Class - Backwards compatible with improved functionality
 */
class EnhancedLogger {
  // Maintain backwards compatibility with existing logger interface
  error(message: string, error?: Error, data?: Record<string, unknown>): void {
    logError(message, error, {
      component: 'LegacyLogger',
      metadata: data,
    });
  }

  warn(message: string, data?: Record<string, unknown>): void {
    logWarn(message, {
      component: 'LegacyLogger',
      metadata: data,
    });
  }

  info(message: string, data?: Record<string, unknown>): void {
    logInfo(message, {
      component: 'LegacyLogger',
      metadata: data,
    });
  }

  debug(message: string, data?: Record<string, unknown>): void {
    logDebug(message, {
      component: 'LegacyLogger',
      metadata: data,
    });
  }

  // Enhanced methods with better context
  logUserInteraction(
    action: string,
    element: string,
    data?: Record<string, unknown>
  ): void {
    logInfo(`User interaction: ${action}`, {
      component: 'UserInteraction',
      action,
      feature: element,
      metadata: data,
    });
  }

  logPerformanceMetric(
    metric: string,
    value: number,
    unit: string = 'ms'
  ): void {
    logInfo(`Performance metric: ${metric}`, {
      component: 'Performance',
      feature: metric,
      metadata: { value, unit },
    });
  }

  log3DInteraction(
    objectId: string,
    interactionType: string,
    data?: Record<string, unknown>
  ): void {
    logInfo(`3D interaction: ${interactionType} on ${objectId}`, {
      component: '3DEngine',
      action: interactionType,
      feature: objectId,
      metadata: data,
    });
  }

  logComponentError(
    component: string,
    error: Error,
    context?: Record<string, unknown>
  ): void {
    logError(`Component error in ${component}`, error, {
      component,
      metadata: context,
    });
  }

  logAPICall(
    endpoint: string,
    method: string,
    status?: number,
    duration?: number
  ): void {
    const level = status && status >= 400 ? 'error' : 'info';
    const message = `API call: ${method} ${endpoint}`;

    if (level === 'error') {
      logError(message, undefined, {
        component: 'APIClient',
        action: method,
        feature: endpoint,
        metadata: { status, duration },
      });
    } else {
      logInfo(message, {
        component: 'APIClient',
        action: method,
        feature: endpoint,
        metadata: { status, duration },
      });
    }
  }

  // Safe API communication methods
  async safeAPICall<T>(
    url: string,
    options: RequestInit = {},
    context?: string
  ): Promise<T | null> {
    const startTime = performance.now();

    try {
      // Skip API calls for localhost/development
      if (this.isLocalEnvironment()) {
        logDebug(`Skipping API call in local environment: ${url}`, {
          component: 'SafeAPIClient',
          feature: context || 'unknown',
        });
        return null;
      }

      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      const duration = performance.now() - startTime;

      if (!response.ok) {
        this.logAPICall(
          url,
          options.method || 'GET',
          response.status,
          duration
        );
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      this.logAPICall(url, options.method || 'GET', response.status, duration);
      return await response.json();
    } catch (error) {
      const duration = performance.now() - startTime;
      this.logAPICall(url, options.method || 'GET', 0, duration);

      logError(`API call failed: ${url}`, error as Error, {
        component: 'SafeAPIClient',
        feature: context || 'unknown',
        metadata: { url, method: options.method || 'GET' },
      });

      return null;
    }
  }

  private isLocalEnvironment(): boolean {
    const hostname = window.location.hostname;
    return (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.startsWith('192.168.') ||
      hostname.endsWith('.local') ||
      hostname.includes('localhost')
    );
  }

  // Utility methods
  createPerformanceTimer(operation: string): () => void {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.logPerformanceMetric(operation, duration);
    };
  }

  async measureAsync<T>(operation: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;
      this.logPerformanceMetric(operation, duration);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      logError(`Operation failed: ${operation}`, error as Error, {
        component: 'PerformanceLogger',
        feature: operation,
        metadata: { duration },
      });
      throw error;
    }
  }

  // Analytics integration with safe API calls
  async trackEvent(
    event: string,
    properties: Record<string, unknown> = {}
  ): Promise<void> {
    logInfo(`Analytics event: ${event}`, {
      component: 'Analytics',
      action: event,
      metadata: properties,
    });

    // Only send to analytics API in production environments
    if (!this.isLocalEnvironment()) {
      await this.safeAPICall(
        '/api/analytics/events',
        {
          method: 'POST',
          body: JSON.stringify({ event, properties, timestamp: Date.now() }),
        },
        'trackEvent'
      );
    }
  }

  async trackError(
    error: Error,
    context?: Record<string, unknown>
  ): Promise<void> {
    logError('Tracked error', error, {
      component: 'ErrorTracking',
      metadata: context,
    });

    // Only send to error tracking API in production environments
    if (!this.isLocalEnvironment()) {
      await this.safeAPICall(
        '/api/analytics/errors',
        {
          method: 'POST',
          body: JSON.stringify({
            error: {
              name: error.name,
              message: error.message,
              stack: error.stack,
            },
            context,
            timestamp: Date.now(),
          }),
        },
        'trackError'
      );
    }
  }
}

// Create enhanced logger instance
export const logger = new EnhancedLogger();

// Performance monitoring utilities
export class PerformanceMonitor {
  private static marks = new Map<string, number>();

  static mark(name: string): void {
    this.marks.set(name, performance.now());

    if (performance.mark) {
      try {
        performance.mark(name);
      } catch {
        // Performance API might not be available
      }
    }

    logger.logPerformanceMetric(`mark_${name}`, performance.now());
  }

  static measure(name: string, startMark: string): number {
    const startTime = this.marks.get(startMark);
    const endTime = performance.now();

    if (startTime) {
      const duration = endTime - startTime;

      if (performance.measure) {
        try {
          performance.measure(name, startMark);
        } catch {
          // Performance API might not be available
        }
      }

      logger.logPerformanceMetric(name, duration);
      return duration;
    }

    return 0;
  }

  static clearMarks(): void {
    this.marks.clear();

    if (performance.clearMarks) {
      try {
        performance.clearMarks();
      } catch {
        // Performance API might not be available
      }
    }
  }
}

// Convenience functions for common logging patterns
export const trackUserInteraction = (
  action: string,
  element: string,
  data?: Record<string, unknown>
) => {
  logger.logUserInteraction(action, element, data);
};

export const trackComponentError = (
  component: string,
  error: Error,
  context?: Record<string, unknown>
) => {
  logger.logComponentError(component, error, context);
};

export const track3DInteraction = (
  objectId: string,
  interactionType: string,
  data?: Record<string, unknown>
) => {
  logger.log3DInteraction(objectId, interactionType, data);
};

export const measurePerformance = (operation: string) => {
  return logger.createPerformanceTimer(operation);
};

// Initialize professional logging
export function initializeLogging(): void {
  // Set up global error handling
  setupGlobalErrorHandling();

  // Log initialization
  logInfo('Professional logging system initialized', {
    component: 'LoggingSystem',
    feature: 'initialization',
    metadata: {
      environment: import.meta.env.MODE,
      hostname: window.location.hostname,
    },
  });

  // Override console methods in production to use our logger
  if (import.meta.env.PROD) {
    const originalConsole = { ...console };

    console.error = (message: string, ...args: unknown[]) => {
      logger.error(String(message), undefined, { args });
      originalConsole.error(message, ...args);
    };

    console.warn = (message: string, ...args: unknown[]) => {
      logger.warn(String(message), { args });
      originalConsole.warn(message, ...args);
    };

    console.info = (message: string, ...args: unknown[]) => {
      logger.info(String(message), { args });
      originalConsole.info(message, ...args);
    };
  }
}

// Auto-initialize when module is imported
initializeLogging();
