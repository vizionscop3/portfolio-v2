// Logging utility with different levels and structured output
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: number;
  data?: any;
  error?: Error;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  private createLogEntry(level: LogLevel, message: string, data?: any, error?: Error): LogEntry {
    return {
      level,
      message,
      timestamp: Date.now(),
      data,
      error,
    };
  }

  private addLog(entry: LogEntry) {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  private formatMessage(entry: LogEntry): string {
    const timestamp = new Date(entry.timestamp).toISOString();
    const prefix = `[${timestamp}] [${entry.level.toUpperCase()}]`;
    return `${prefix} ${entry.message}`;
  }

  error(message: string, error?: Error, data?: any) {
    const entry = this.createLogEntry(LogLevel.ERROR, message, data, error);
    this.addLog(entry);

    if (this.isDevelopment) {
      console.error(this.formatMessage(entry), { data, error });
    }

    // In production, you might want to send errors to a logging service
    if (!this.isDevelopment && error) {
      this.sendToLoggingService(entry);
    }
  }

  warn(message: string, data?: any) {
    const entry = this.createLogEntry(LogLevel.WARN, message, data);
    this.addLog(entry);

    if (this.isDevelopment) {
      console.warn(this.formatMessage(entry), data);
    }
  }

  info(message: string, data?: any) {
    const entry = this.createLogEntry(LogLevel.INFO, message, data);
    this.addLog(entry);

    if (this.isDevelopment) {
      console.info(this.formatMessage(entry), data);
    }
  }

  debug(message: string, data?: any) {
    const entry = this.createLogEntry(LogLevel.DEBUG, message, data);
    this.addLog(entry);

    if (this.isDevelopment) {
      console.debug(this.formatMessage(entry), data);
    }
  }

  getLogs(level?: LogLevel): LogEntry[] {
    return level ? this.logs.filter(log => log.level === level) : this.logs;
  }

  clearLogs() {
    this.logs = [];
  }

  private async sendToLoggingService(entry: LogEntry) {
    try {
      // Implement your logging service integration here
      // Example: Send to Sentry, LogRocket, DataDog, etc.
      await fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });
    } catch (error) {
      console.error('Failed to send log to service:', error);
    }
  }
}

export const logger = new Logger();

// Performance monitoring utilities
export class PerformanceMonitor {
  private static marks = new Map<string, number>();

  static mark(name: string) {
    this.marks.set(name, performance.now());
    if (performance.mark) {
      performance.mark(name);
    }
    logger.debug(`Performance mark: ${name}`);
  }

  static measure(name: string, startMark: string, endMark?: string) {
    const endTime = endMark ? this.marks.get(endMark) : performance.now();
    const startTime = this.marks.get(startMark);

    if (startTime && endTime) {
      const duration = endTime - startTime;
      logger.info(`Performance measure: ${name}`, { duration, startMark, endMark });

      if (performance.measure) {
        try {
          performance.measure(name, startMark, endMark);
        } catch (error) {
          logger.warn('Failed to create performance measure', { name, error });
        }
      }

      return duration;
    }

    return null;
  }

  static getEntries(): PerformanceEntry[] {
    return performance.getEntriesByType ? performance.getEntriesByType('measure') : [];
  }
}

// User interaction tracking
export const trackUserInteraction = (action: string, data?: any) => {
  logger.info(`User interaction: ${action}`, data);
  
  // In production, send to analytics service
  if (!import.meta.env.DEV) {
    // Example: Google Analytics, Mixpanel, etc.
    // gtag('event', action, data);
  }
};
