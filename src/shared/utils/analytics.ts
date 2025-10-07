/**
 * Analytics and User Tracking System
 *
 * Provides comprehensive analytics functionality including user behavior tracking,
 * 3D interaction analytics, performance monitoring, and error reporting.
 */

import { SectionId } from '../types';

// Analytics Event Types
export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp?: number;
  sessionId?: string;
  userId?: string;
}

export interface UserBehaviorEvent extends AnalyticsEvent {
  event:
    | 'page_view'
    | 'section_change'
    | 'user_interaction'
    | 'scroll'
    | 'click'
    | 'form_submit';
  properties: {
    section?: SectionId;
    element?: string;
    value?: any;
    duration?: number;
    scrollDepth?: number;
    viewport?: {
      width: number;
      height: number;
    };
    from?: SectionId;
    to?: SectionId;
    action?: string;
    method?: string;
  };
}

export interface ThreeDInteractionEvent extends AnalyticsEvent {
  event:
    | '3d_object_hover'
    | '3d_object_click'
    | '3d_camera_move'
    | '3d_scene_load'
    | '3d_performance';
  properties: {
    objectId?: string;
    objectType?: string;
    position?: { x: number; y: number; z: number };
    duration?: number;
    fps?: number;
    renderTime?: number;
    polygonCount?: number;
    cameraPosition?: { x: number; y: number; z: number };
    deviceType?: 'mobile' | 'desktop' | 'tablet';
    timestamp?: number;
    loadTime?: number;
    assetCount?: number;
  };
}

export interface PerformanceEvent extends AnalyticsEvent {
  event:
    | 'performance_metric'
    | 'asset_load'
    | 'render_time'
    | 'memory_usage'
    | 'error';
  properties: {
    metric?: string;
    value?: number;
    unit?: string;
    assetType?: string;
    assetSize?: number;
    loadTime?: number;
    errorType?: string;
    errorMessage?: string;
    stackTrace?: string;
    userAgent?: string;
    component?: string;
    timestamp?: number;
    usedJSHeapSize?: number;
    totalJSHeapSize?: number;
    jsHeapSizeLimit?: number;
    url?: string;
    renderTime?: number;
  };
}

// Analytics Configuration
export interface AnalyticsConfig {
  enabled: boolean;
  debug: boolean;
  sessionTimeout: number; // minutes
  batchSize: number;
  flushInterval: number; // seconds
  endpoints: {
    events: string;
    errors: string;
    performance: string;
  };
  privacy: {
    respectDoNotTrack: boolean;
    anonymizeIPs: boolean;
    collectPersonalData: boolean;
  };
  sampling: {
    events: number; // 0-1 (percentage)
    performance: number;
    errors: number;
  };
}

// Default configuration
const DEFAULT_CONFIG: AnalyticsConfig = {
  enabled: import.meta.env.PROD,
  debug: import.meta.env.DEV,
  sessionTimeout: 30,
  batchSize: 10,
  flushInterval: 30,
  endpoints: {
    events: '/api/analytics/events',
    errors: '/api/analytics/errors',
    performance: '/api/analytics/performance',
  },
  privacy: {
    respectDoNotTrack: true,
    anonymizeIPs: true,
    collectPersonalData: false,
  },
  sampling: {
    events: 1.0,
    performance: 0.1, // Sample 10% for performance
    errors: 1.0,
  },
};

/**
 * Analytics Manager Class
 */
export class AnalyticsManager {
  private config: AnalyticsConfig;
  private sessionId: string;
  private userId?: string;
  private eventQueue: AnalyticsEvent[] = [];
  private flushTimer?: NodeJS.Timeout;
  private sessionData: Map<string, any> = new Map();
  private performanceObserver?: PerformanceObserver;

  constructor(config: Partial<AnalyticsConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.sessionId = this.generateSessionId();

    if (this.shouldTrack()) {
      this.initialize();
    }
  }

  /**
   * Initialize analytics system
   */
  private initialize(): void {
    this.log('Analytics initialized');

    // Start flush timer
    this.startFlushTimer();

    // Set up performance monitoring
    this.setupPerformanceMonitoring();

    // Track session start
    this.track('session_start', {
      sessionId: this.sessionId,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
    });

    // Set up unload handler
    window.addEventListener('beforeunload', () => {
      this.flush(true);
    });

    // Track visibility changes
    document.addEventListener('visibilitychange', () => {
      this.track('visibility_change', {
        hidden: document.hidden,
      });
    });
  }

  /**
   * Track a generic analytics event
   */
  track(event: string, properties: Record<string, any> = {}): void {
    if (!this.shouldTrack() || !this.shouldSample('events')) {
      return;
    }

    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        sessionId: this.sessionId,
        timestamp: Date.now(),
        url: window.location.href,
        referrer: document.referrer,
      },
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
    };

    this.log('Tracking event:', analyticsEvent);
    this.eventQueue.push(analyticsEvent);

    // Flush if queue is full
    if (this.eventQueue.length >= this.config.batchSize) {
      this.flush();
    }
  }

  /**
   * Track user behavior events
   */
  trackUserBehavior(event: UserBehaviorEvent): void {
    this.track(event.event, {
      ...event.properties,
      category: 'user_behavior',
    });
  }

  /**
   * Track 3D interaction events
   */
  track3DInteraction(event: ThreeDInteractionEvent): void {
    this.track(event.event, {
      ...event.properties,
      category: '3d_interaction',
    });
  }

  /**
   * Track performance events
   */
  trackPerformance(event: PerformanceEvent): void {
    if (!this.shouldSample('performance')) {
      return;
    }

    this.track(event.event, {
      ...event.properties,
      category: 'performance',
    });
  }

  /**
   * Track errors
   */
  trackError(error: Error, context?: Record<string, any>): void {
    if (!this.shouldSample('errors')) {
      return;
    }

    this.track('error', {
      errorType: error.name,
      errorMessage: error.message,
      stackTrace: error.stack,
      context,
      category: 'error',
    });
  }

  /**
   * Track page views
   */
  trackPageView(
    section: SectionId,
    additionalData: Record<string, any> = {}
  ): void {
    this.trackUserBehavior({
      event: 'page_view',
      properties: {
        section,
        ...additionalData,
      },
    });
  }

  /**
   * Track section changes
   */
  trackSectionChange(from: SectionId, to: SectionId, method?: string): void {
    this.trackUserBehavior({
      event: 'section_change',
      properties: {
        from,
        to,
        method: method || 'navigation',
      },
    });
  }

  /**
   * Track user interactions
   */
  trackUserInteraction(element: string, action: string, value?: any): void {
    this.trackUserBehavior({
      event: 'user_interaction',
      properties: {
        element,
        action,
        value,
      },
    });
  }

  /**
   * Track 3D object interactions
   */
  track3DObjectInteraction(
    action: '3d_object_hover' | '3d_object_click',
    objectId: string,
    objectType: string,
    additionalData: Record<string, any> = {}
  ): void {
    this.track3DInteraction({
      event: action,
      properties: {
        objectId,
        objectType,
        ...additionalData,
      },
    });
  }

  /**
   * Track scroll depth
   */
  trackScrollDepth(depth: number): void {
    this.trackUserBehavior({
      event: 'scroll',
      properties: {
        scrollDepth: depth,
      },
    });
  }

  /**
   * Set user ID
   */
  setUserId(userId: string): void {
    this.userId = userId;
    this.track('user_identify', { userId });
  }

  /**
   * Set session data
   */
  setSessionData(key: string, value: any): void {
    this.sessionData.set(key, value);
  }

  /**
   * Get session data
   */
  getSessionData(key: string): any {
    return this.sessionData.get(key);
  }

  /**
   * Flush events to server
   */
  flush(sync = false): void {
    if (this.eventQueue.length === 0) {
      return;
    }

    const events = [...this.eventQueue];
    this.eventQueue = [];

    this.log(`Flushing ${events.length} events`);

    if (sync) {
      // Use sendBeacon for synchronous sending during page unload
      const data = JSON.stringify({ events });
      navigator.sendBeacon(this.config.endpoints.events, data);
    } else {
      // Regular async sending
      this.sendEvents(events);
    }
  }

  /**
   * Send events to server
   */
  private async sendEvents(events: AnalyticsEvent[]): Promise<void> {
    // Import safe API caller from logging service
    const { logger } = await import('./loggingService');

    // Use the safe API call method that handles localhost detection
    await logger.safeAPICall(
      this.config.endpoints.events,
      {
        method: 'POST',
        body: JSON.stringify({ events }),
      },
      'analytics-events'
    );
  }

  /**
   * Set up performance monitoring
   */
  private setupPerformanceMonitoring(): void {
    // Monitor Web Vitals
    this.monitorWebVitals();

    // Monitor resource loading
    this.monitorResourceLoading();

    // Monitor long tasks
    this.monitorLongTasks();
  }

  /**
   * Monitor Web Vitals (LCP, FID, CLS)
   */
  private monitorWebVitals(): void {
    // This would typically use the web-vitals library
    // For now, we'll use basic Performance API

    // Largest Contentful Paint
    new PerformanceObserver(list => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];

      this.trackPerformance({
        event: 'performance_metric',
        properties: {
          metric: 'LCP',
          value: lastEntry.startTime,
          unit: 'ms',
        },
      });
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay would need polyfill
    // Cumulative Layout Shift
    new PerformanceObserver(list => {
      let clsValue = 0;
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }

      this.trackPerformance({
        event: 'performance_metric',
        properties: {
          metric: 'CLS',
          value: clsValue,
          unit: 'score',
        },
      });
    }).observe({ entryTypes: ['layout-shift'] });
  }

  /**
   * Monitor resource loading
   */
  private monitorResourceLoading(): void {
    new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        const resource = entry as PerformanceResourceTiming;

        this.trackPerformance({
          event: 'asset_load',
          properties: {
            assetType: this.getResourceType(resource.name),
            assetSize: resource.transferSize,
            loadTime: resource.duration,
            url: resource.name,
          },
        });
      }
    }).observe({ entryTypes: ['resource'] });
  }

  /**
   * Monitor long tasks
   */
  private monitorLongTasks(): void {
    if ('PerformanceObserver' in window) {
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          this.trackPerformance({
            event: 'performance_metric',
            properties: {
              metric: 'long_task',
              value: entry.duration,
              unit: 'ms',
            },
          });
        }
      }).observe({ entryTypes: ['longtask'] });
    }
  }

  /**
   * Get resource type from URL
   */
  private getResourceType(url: string): string {
    if (url.match(/\.(js|mjs)$/)) return 'script';
    if (url.match(/\.css$/)) return 'stylesheet';
    if (url.match(/\.(png|jpg|jpeg|gif|svg|webp)$/)) return 'image';
    if (url.match(/\.(woff|woff2|ttf|eot)$/)) return 'font';
    if (url.match(/\.(mp4|webm|ogg)$/)) return 'video';
    if (url.match(/\.(mp3|wav|ogg)$/)) return 'audio';
    return 'other';
  }

  /**
   * Start flush timer
   */
  private startFlushTimer(): void {
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.config.flushInterval * 1000);
  }

  /**
   * Check if tracking should be enabled
   */
  private shouldTrack(): boolean {
    if (!this.config.enabled) return false;

    if (this.config.privacy.respectDoNotTrack && navigator.doNotTrack === '1') {
      return false;
    }

    return true;
  }

  /**
   * Check if event should be sampled
   */
  private shouldSample(type: keyof AnalyticsConfig['sampling']): boolean {
    return Math.random() < this.config.sampling[type];
  }

  /**
   * Generate session ID
   */
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Log messages (only in debug mode)
   */
  private log(...args: any[]): void {
    if (this.config.debug) {
      console.log('[Analytics]', ...args);
    }
  }

  /**
   * Destroy analytics instance
   */
  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }

    this.flush(true);
  }
}

// Create singleton instance
export const analytics = new AnalyticsManager();

// Export convenience functions
export const trackEvent = (event: string, properties?: Record<string, any>) => {
  analytics.track(event, properties);
};

export const trackPageView = (
  section: SectionId,
  additionalData?: Record<string, any>
) => {
  analytics.trackPageView(section, additionalData);
};

export const trackUserInteraction = (
  element: string,
  action: string,
  value?: any
) => {
  analytics.trackUserInteraction(element, action, value);
};

export const track3DInteraction = (
  action: '3d_object_hover' | '3d_object_click',
  objectId: string,
  objectType: string,
  additionalData?: Record<string, any>
) => {
  analytics.track3DObjectInteraction(
    action,
    objectId,
    objectType,
    additionalData
  );
};

export const trackError = (error: Error, context?: Record<string, any>) => {
  analytics.trackError(error, context);
};

export default analytics;
