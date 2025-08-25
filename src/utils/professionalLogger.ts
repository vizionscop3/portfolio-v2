/**
 * Professional Logging System
 *
 * A comprehensive logging solution that handles:
 * - Environment-aware logging (dev vs production)
 * - Multiple transport layers (console, local storage, remote)
 * - Log levels and filtering
 * - Structured logging with metadata
 * - Error tracking and stack traces
 * - Performance monitoring
 * - Safe API communication with fallbacks
 * - Log rotation and storage management
 */

export enum LogLevel {
  TRACE = 0,
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
  FATAL = 5,
}

export interface LogContext {
  userId?: string;
  sessionId?: string;
  component?: string;
  feature?: string;
  action?: string;
  metadata?: Record<string, unknown>;
  tags?: string[];
  duration?: number;
}

export interface LogEntry {
  id: string;
  timestamp: number;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
    cause?: unknown;
  };
  performance?: {
    duration?: number;
    memory?: number;
    timestamp: number;
  };
  environment: {
    userAgent: string;
    url: string;
    hostname: string;
    timestamp: number;
  };
}

export interface LogTransport {
  name: string;
  level: LogLevel;
  enabled: boolean;
  send(entry: LogEntry): Promise<void> | void;
}

export interface LoggerConfig {
  level: LogLevel;
  transports: LogTransport[];
  enabledInProduction: boolean;
  enabledInDevelopment: boolean;
  maxEntries: number;
  flushInterval: number;
  apiEndpoint?: string;
  retryAttempts: number;
  retryDelay: number;
}

/**
 * Console Transport - Safe console logging
 */
export class ConsoleTransport implements LogTransport {
  name = 'console';
  level: LogLevel;
  enabled: boolean;

  constructor(level: LogLevel = LogLevel.DEBUG, enabled: boolean = true) {
    this.level = level;
    this.enabled = enabled;
  }

  send(entry: LogEntry): void {
    if (!this.enabled || entry.level < this.level) return;

    const timestamp = new Date(entry.timestamp).toISOString();
    const levelName = LogLevel[entry.level];
    const prefix = `[${timestamp}] [${levelName}]`;

    const message = `${prefix} ${entry.message}`;
    const context = entry.context ? { context: entry.context } : {};
    const error = entry.error ? { error: entry.error } : {};
    const performance = entry.performance
      ? { performance: entry.performance }
      : {};

    switch (entry.level) {
      case LogLevel.TRACE:
      case LogLevel.DEBUG:
        // Only log in development
        if (import.meta.env.DEV) {
          console.debug(message, { ...context, ...performance });
        }
        break;
      case LogLevel.INFO:
        if (import.meta.env.DEV) {
          console.info(message, { ...context, ...performance });
        }
        break;
      case LogLevel.WARN:
        if (import.meta.env.DEV) {
          console.warn(message, { ...context, ...performance });
        }
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        if (import.meta.env.DEV) {
          console.error(message, { ...context, ...error, ...performance });
        }
        break;
    }
  }
}

/**
 * Local Storage Transport - Persistent client-side logging
 */
export class LocalStorageTransport implements LogTransport {
  name = 'localStorage';
  level: LogLevel;
  enabled: boolean;
  private storageKey: string;
  private maxEntries: number;

  constructor(
    level: LogLevel = LogLevel.INFO,
    enabled: boolean = true,
    storageKey: string = 'portfolio_logs',
    maxEntries: number = 100
  ) {
    this.level = level;
    this.enabled = enabled;
    this.storageKey = storageKey;
    this.maxEntries = maxEntries;
  }

  send(entry: LogEntry): void {
    if (!this.enabled || entry.level < this.level) return;

    try {
      const existingLogs = this.getLogs();
      const updatedLogs = [entry, ...existingLogs].slice(0, this.maxEntries);
      localStorage.setItem(this.storageKey, JSON.stringify(updatedLogs));
    } catch (error) {
      // Storage might be full or disabled, fail silently
    }
  }

  getLogs(): LogEntry[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  clearLogs(): void {
    try {
      localStorage.removeItem(this.storageKey);
    } catch {
      // Fail silently
    }
  }
}

/**
 * Remote Transport - Send logs to server with smart fallbacks
 */
export class RemoteTransport implements LogTransport {
  name = 'remote';
  level: LogLevel;
  enabled: boolean;
  private endpoint: string;
  private retryAttempts: number;
  private retryDelay: number;
  private queue: LogEntry[] = [];
  private isOnline: boolean = navigator.onLine;

  constructor(
    endpoint: string,
    level: LogLevel = LogLevel.WARN,
    enabled: boolean = true,
    retryAttempts: number = 3,
    retryDelay: number = 1000
  ) {
    this.endpoint = endpoint;
    this.level = level;
    this.enabled = enabled;
    this.retryAttempts = retryAttempts;
    this.retryDelay = retryDelay;

    // Monitor online status
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.flushQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  async send(entry: LogEntry): Promise<void> {
    if (!this.enabled || entry.level < this.level) return;

    // Skip API calls for localhost/development environments
    if (this.isLocalhost()) {
      return;
    }

    // If offline, queue the entry
    if (!this.isOnline) {
      this.queue.push(entry);
      return;
    }

    await this.sendWithRetry(entry);
  }

  private isLocalhost(): boolean {
    const hostname = window.location.hostname;
    return (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.startsWith('192.168.') ||
      hostname.endsWith('.local')
    );
  }

  private async sendWithRetry(
    entry: LogEntry,
    attempt: number = 1
  ): Promise<void> {
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ entries: [entry] }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      if (attempt < this.retryAttempts) {
        await this.delay(this.retryDelay * attempt);
        return this.sendWithRetry(entry, attempt + 1);
      }

      // Final retry failed, queue for later
      this.queue.push(entry);
    }
  }

  private async flushQueue(): Promise<void> {
    if (this.queue.length === 0 || !this.isOnline) return;

    const entriesToSend = [...this.queue];
    this.queue = [];

    for (const entry of entriesToSend) {
      await this.sendWithRetry(entry);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Professional Logger Class
 */
export class ProfessionalLogger {
  private config: LoggerConfig;
  private transports: LogTransport[] = [];
  private sessionId: string;
  private flushTimer?: NodeJS.Timeout;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: LogLevel.INFO,
      transports: [],
      enabledInProduction: true,
      enabledInDevelopment: true,
      maxEntries: 1000,
      flushInterval: 30000, // 30 seconds
      retryAttempts: 3,
      retryDelay: 1000,
      ...config,
    };

    this.sessionId = this.generateSessionId();
    this.setupDefaultTransports();
    this.startFlushTimer();
  }

  private setupDefaultTransports(): void {
    // Console transport for development
    if (import.meta.env.DEV && this.config.enabledInDevelopment) {
      this.addTransport(new ConsoleTransport(LogLevel.DEBUG, true));
    }

    // Local storage for persistence
    this.addTransport(new LocalStorageTransport(LogLevel.INFO, true));

    // Remote transport for production errors
    if (this.config.apiEndpoint) {
      this.addTransport(
        new RemoteTransport(
          this.config.apiEndpoint,
          LogLevel.ERROR,
          this.config.enabledInProduction
        )
      );
    }
  }

  private startFlushTimer(): void {
    this.flushTimer = setInterval(() => {
      // Periodic cleanup and maintenance
      this.performMaintenance();
    }, this.config.flushInterval);
  }

  private performMaintenance(): void {
    // Clean up old logs from localStorage
    const localStorageTransport = this.transports.find(
      t => t instanceof LocalStorageTransport
    ) as LocalStorageTransport;

    if (localStorageTransport) {
      const logs = localStorageTransport.getLogs();
      const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000; // 7 days
      const recentLogs = logs.filter(log => log.timestamp > cutoff);

      if (recentLogs.length !== logs.length) {
        localStorageTransport.clearLogs();
        recentLogs.forEach(log => localStorageTransport.send(log));
      }
    }
  }

  addTransport(transport: LogTransport): void {
    this.transports.push(transport);
  }

  removeTransport(name: string): void {
    this.transports = this.transports.filter(t => t.name !== name);
  }

  private async log(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: Error
  ): Promise<void> {
    if (level < this.config.level) return;

    const entry: LogEntry = {
      id: this.generateId(),
      timestamp: Date.now(),
      level,
      message,
      context: {
        sessionId: this.sessionId,
        ...context,
      },
      error: error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : undefined,
      environment: {
        userAgent: navigator.userAgent,
        url: window.location.href,
        hostname: window.location.hostname,
        timestamp: Date.now(),
      },
    };

    // Send to all transports
    await Promise.all(
      this.transports.map(transport => {
        try {
          return transport.send(entry);
        } catch (error) {
          // Transport failed, but don't break the logging chain
          return Promise.resolve();
        }
      })
    );
  }

  // Public logging methods
  trace(message: string, context?: LogContext): Promise<void> {
    return this.log(LogLevel.TRACE, message, context);
  }

  debug(message: string, context?: LogContext): Promise<void> {
    return this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: LogContext): Promise<void> {
    return this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: LogContext): Promise<void> {
    return this.log(LogLevel.WARN, message, context);
  }

  error(message: string, error?: Error, context?: LogContext): Promise<void> {
    return this.log(LogLevel.ERROR, message, context, error);
  }

  fatal(message: string, error?: Error, context?: LogContext): Promise<void> {
    return this.log(LogLevel.FATAL, message, context, error);
  }

  // Performance logging
  async logPerformance(
    operation: string,
    duration: number,
    context?: LogContext
  ): Promise<void> {
    const entry: LogEntry = {
      id: this.generateId(),
      timestamp: Date.now(),
      level: LogLevel.INFO,
      message: `Performance: ${operation}`,
      context: {
        sessionId: this.sessionId,
        ...context,
      },
      performance: {
        duration,
        memory: (performance as any).memory?.usedJSHeapSize,
        timestamp: Date.now(),
      },
      environment: {
        userAgent: navigator.userAgent,
        url: window.location.href,
        hostname: window.location.hostname,
        timestamp: Date.now(),
      },
    };

    await Promise.all(
      this.transports.map(transport => {
        try {
          return transport.send(entry);
        } catch {
          return Promise.resolve();
        }
      })
    );
  }

  // Utility methods
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Cleanup
  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
  }
}

// Default logger instance
export const logger = new ProfessionalLogger({
  level: import.meta.env.DEV ? LogLevel.DEBUG : LogLevel.INFO,
  apiEndpoint: '/api/logs',
  enabledInProduction: true,
  enabledInDevelopment: true,
});

// Convenience functions
export const logTrace = (message: string, context?: LogContext) =>
  logger.trace(message, context);
export const logDebug = (message: string, context?: LogContext) =>
  logger.debug(message, context);
export const logInfo = (message: string, context?: LogContext) =>
  logger.info(message, context);
export const logWarn = (message: string, context?: LogContext) =>
  logger.warn(message, context);
export const logError = (
  message: string,
  error?: Error,
  context?: LogContext
) => logger.error(message, error, context);
export const logFatal = (
  message: string,
  error?: Error,
  context?: LogContext
) => logger.fatal(message, error, context);
export const logPerformance = (
  operation: string,
  duration: number,
  context?: LogContext
) => logger.logPerformance(operation, duration, context);

// Performance monitoring wrapper
export function withPerformanceLogging<T extends any[], R>(
  operation: string,
  fn: (...args: T) => R,
  context?: LogContext
): (...args: T) => R {
  return (...args: T): R => {
    const start = performance.now();
    try {
      const result = fn(...args);
      const duration = performance.now() - start;
      logPerformance(operation, duration, context);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      logError(`${operation} failed`, error as Error, { ...context, duration });
      throw error;
    }
  };
}

// Async performance monitoring wrapper
export function withAsyncPerformanceLogging<T extends any[], R>(
  operation: string,
  fn: (...args: T) => Promise<R>,
  context?: LogContext
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    const start = performance.now();
    try {
      const result = await fn(...args);
      const duration = performance.now() - start;
      await logPerformance(operation, duration, context);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      await logError(`${operation} failed`, error as Error, {
        ...context,
        duration,
      });
      throw error;
    }
  };
}

// Global error handler setup
export function setupGlobalErrorHandling(): void {
  window.addEventListener('error', event => {
    logError('Global JavaScript error', new Error(event.message), {
      component: 'GlobalErrorHandler',
      metadata: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
    });
  });

  window.addEventListener('unhandledrejection', event => {
    logError('Unhandled promise rejection', new Error(String(event.reason)), {
      component: 'GlobalErrorHandler',
      metadata: {
        reason: event.reason,
      },
    });
  });
}
