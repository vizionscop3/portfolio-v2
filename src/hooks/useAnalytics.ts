/**
 * Analytics React Hooks
 * 
 * Provides React integration for analytics tracking including automatic
 * page view tracking, user interaction monitoring, and 3D analytics.
 */

import { useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics, trackEvent, trackPageView, trackUserInteraction, track3DInteraction } from '../utils/analytics';
import { SectionId } from '../types';

/**
 * Main analytics hook with automatic page view tracking
 */
export const useAnalytics = (options: {
  autoTrackPageViews?: boolean;
  trackScrollDepth?: boolean;
  trackClicks?: boolean;
} = {}) => {
  const location = useLocation();
  const scrollDepthRef = useRef<number>(0);
  const {
    autoTrackPageViews = true,
    trackScrollDepth = true,
    trackClicks = true
  } = options;

  // Track page views automatically
  useEffect(() => {
    if (autoTrackPageViews) {
      const section = getSectionFromPath(location.pathname);
      trackPageView(section || 'about', {
        path: location.pathname,
        search: location.search,
        hash: location.hash
      });
    }
  }, [location, autoTrackPageViews]);

  // Track scroll depth
  useEffect(() => {
    if (!trackScrollDepth) return;

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollTop = window.pageYOffset;
      const scrollDepth = Math.round((scrollTop / scrollHeight) * 100);

      // Track significant scroll milestones
      const milestones = [25, 50, 75, 90, 100];
      const currentMilestone = milestones.find(m => scrollDepth >= m && scrollDepthRef.current < m);
      
      if (currentMilestone) {
        scrollDepthRef.current = currentMilestone;
        analytics.trackScrollDepth(currentMilestone);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [trackScrollDepth]);

  // Track clicks
  useEffect(() => {
    if (!trackClicks) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const tagName = target.tagName.toLowerCase();
      const element = target.getAttribute('data-analytics') || 
                    target.getAttribute('aria-label') || 
                    target.className || 
                    tagName;

      trackUserInteraction(element, 'click', {
        tagName,
        position: { x: event.clientX, y: event.clientY }
      });
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [trackClicks]);

  return {
    track: trackEvent,
    trackPageView,
    trackUserInteraction,
    track3DInteraction
  };
};

/**
 * Hook for tracking user interactions on specific elements
 */
export const useInteractionTracking = (elementId: string) => {
  const trackInteraction = useCallback((action: string, value?: any) => {
    trackUserInteraction(elementId, action, value);
  }, [elementId]);

  const trackClick = useCallback((value?: any) => {
    trackInteraction('click', value);
  }, [trackInteraction]);

  const trackHover = useCallback((duration?: number) => {
    trackInteraction('hover', { duration });
  }, [trackInteraction]);

  const trackFocus = useCallback(() => {
    trackInteraction('focus');
  }, [trackInteraction]);

  return {
    trackInteraction,
    trackClick,
    trackHover,
    trackFocus
  };
};

/**
 * Hook for tracking 3D scene interactions
 */
export const use3DAnalytics = () => {
  const trackObjectHover = useCallback((objectId: string, objectType: string, additionalData?: Record<string, any>) => {
    track3DInteraction('3d_object_hover', objectId, objectType, additionalData);
  }, []);

  const trackObjectClick = useCallback((objectId: string, objectType: string, additionalData?: Record<string, any>) => {
    track3DInteraction('3d_object_click', objectId, objectType, additionalData);
  }, []);

  const trackScenePerformance = useCallback((fps: number, renderTime: number, polygonCount: number) => {
    analytics.track3DInteraction({
      event: '3d_performance',
      properties: {
        fps,
        renderTime,
        polygonCount,
        timestamp: Date.now()
      }
    });
  }, []);

  const trackCameraMovement = useCallback((position: { x: number; y: number; z: number }) => {
    analytics.track3DInteraction({
      event: '3d_camera_move',
      properties: {
        cameraPosition: position,
        timestamp: Date.now()
      }
    });
  }, []);

  const trackSceneLoad = useCallback((loadTime: number, assetCount: number) => {
    analytics.track3DInteraction({
      event: '3d_scene_load',
      properties: {
        loadTime,
        assetCount,
        timestamp: Date.now()
      }
    });
  }, []);

  return {
    trackObjectHover,
    trackObjectClick,
    trackScenePerformance,
    trackCameraMovement,
    trackSceneLoad
  };
};

/**
 * Hook for form analytics
 */
export const useFormAnalytics = (formId: string) => {
  const trackFormStart = useCallback(() => {
    trackUserInteraction(formId, 'form_start');
  }, [formId]);

  const trackFieldInteraction = useCallback((fieldName: string, action: 'focus' | 'blur' | 'change') => {
    trackUserInteraction(`${formId}_${fieldName}`, action);
  }, [formId]);

  const trackFormSubmit = useCallback((success: boolean, errorFields?: string[]) => {
    trackUserInteraction(formId, 'form_submit', {
      success,
      errorFields
    });
  }, [formId]);

  const trackFormAbandonment = useCallback((completedFields: string[], totalFields: number) => {
    trackUserInteraction(formId, 'form_abandon', {
      completedFields,
      totalFields,
      completionRate: completedFields.length / totalFields
    });
  }, [formId]);

  return {
    trackFormStart,
    trackFieldInteraction,
    trackFormSubmit,
    trackFormAbandonment
  };
};

/**
 * Hook for performance monitoring
 */
export const usePerformanceAnalytics = () => {
  const trackRenderTime = useCallback((componentName: string, renderTime: number) => {
    analytics.trackPerformance({
      event: 'render_time',
      properties: {
        component: componentName,
        renderTime,
        timestamp: Date.now()
      }
    });
  }, []);

  const trackAssetLoad = useCallback((assetType: string, assetSize: number, loadTime: number) => {
    analytics.trackPerformance({
      event: 'asset_load',
      properties: {
        assetType,
        assetSize,
        loadTime,
        timestamp: Date.now()
      }
    });
  }, []);

  const trackMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      analytics.trackPerformance({
        event: 'memory_usage',
        properties: {
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit,
          timestamp: Date.now()
        }
      });
    }
  }, []);

  const trackError = useCallback((error: Error, componentName?: string) => {
    analytics.trackError(error, { componentName });
  }, []);

  return {
    trackRenderTime,
    trackAssetLoad,
    trackMemoryUsage,
    trackError
  };
};

/**
 * Hook for session analytics
 */
export const useSessionAnalytics = () => {
  const sessionStartTime = useRef<number>(Date.now());

  const trackSessionData = useCallback((key: string, value: any) => {
    analytics.setSessionData(key, value);
  }, []);

  const getSessionDuration = useCallback(() => {
    return Date.now() - sessionStartTime.current;
  }, []);

  const trackSessionMilestone = useCallback((milestone: string) => {
    trackEvent('session_milestone', {
      milestone,
      sessionDuration: getSessionDuration()
    });
  }, [getSessionDuration]);

  useEffect(() => {
    // Track session milestones
    const milestones = [
      { time: 30 * 1000, name: '30_seconds' },
      { time: 60 * 1000, name: '1_minute' },
      { time: 5 * 60 * 1000, name: '5_minutes' },
      { time: 10 * 60 * 1000, name: '10_minutes' }
    ];

    const timers = milestones.map(milestone => 
      setTimeout(() => trackSessionMilestone(milestone.name), milestone.time)
    );

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [trackSessionMilestone]);

  return {
    trackSessionData,
    getSessionDuration,
    trackSessionMilestone
  };
};

/**
 * Hook for A/B testing analytics
 */
export const useABTestAnalytics = () => {
  const trackExperiment = useCallback((experimentName: string, variant: string) => {
    trackEvent('ab_test_exposure', {
      experimentName,
      variant
    });
  }, []);

  const trackConversion = useCallback((experimentName: string, variant: string, conversionType: string) => {
    trackEvent('ab_test_conversion', {
      experimentName,
      variant,
      conversionType
    });
  }, []);

  return {
    trackExperiment,
    trackConversion
  };
};

/**
 * Utility function to extract section from pathname
 */
function getSectionFromPath(pathname: string): SectionId | undefined {
  const path = pathname.replace('/', '');
  const validSections: SectionId[] = ['about', 'tech', 'blog', 'fashion', 'merch'];
  return validSections.includes(path as SectionId) ? (path as SectionId) : undefined;
}

export default {
  useAnalytics,
  useInteractionTracking,
  use3DAnalytics,
  useFormAnalytics,
  usePerformanceAnalytics,
  useSessionAnalytics,
  useABTestAnalytics
};