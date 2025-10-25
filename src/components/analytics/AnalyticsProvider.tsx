/**
 * Analytics Provider Component
 *
 * Provides analytics context and automatic tracking for the entire application.
 * Integrates with React Router for page view tracking and error boundaries for error tracking.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  useAnalytics,
  usePerformanceAnalytics,
  useSessionAnalytics,
} from '../../shared/hooks/useAnalytics';
import { analytics } from '../../shared/utils/analytics';
import { AnalyticsDashboard } from './AnalyticsDashboard';

interface AnalyticsContextType {
  isEnabled: boolean;
  isDashboardOpen: boolean;
  toggleDashboard: () => void;
  trackEvent: (event: string, properties?: Record<string, any>) => void;
  trackError: (error: Error, context?: Record<string, any>) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

export const useAnalyticsContext = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error(
      'useAnalyticsContext must be used within AnalyticsProvider'
    );
  }
  return context;
};

interface AnalyticsProviderProps {
  children: React.ReactNode;
  enabled?: boolean;
  showDashboard?: boolean;
  dashboardPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({
  children,
  enabled = import.meta.env.PROD,
  showDashboard = import.meta.env.DEV,
  dashboardPosition = 'bottom-right',
}) => {
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const location = useLocation();

  // Initialize analytics hooks
  useAnalytics({
    autoTrackPageViews: true,
    trackScrollDepth: true,
    trackClicks: true,
  });

  const { trackError } = usePerformanceAnalytics();
  const { trackSessionData } = useSessionAnalytics();

  // Track route changes
  useEffect(() => {
    const section = getSectionFromPath(location.pathname);
    if (section) {
      trackSessionData('lastSection', section);
      trackSessionData('lastVisit', Date.now());
    }
  }, [location, trackSessionData]);

  // Set up global error tracking
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      trackError(
        new Error(event.message),
        `Error at ${event.filename}:${event.lineno}:${event.colno}`
      );
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      trackError(
        new Error(String(event.reason)),
        'Unhandled promise rejection'
      );
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener(
        'unhandledrejection',
        handleUnhandledRejection
      );
    };
  }, [trackError]);

  // Keyboard shortcut to toggle dashboard
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + A to toggle analytics dashboard
      if (
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey &&
        event.key === 'A'
      ) {
        event.preventDefault();
        setIsDashboardOpen(!isDashboardOpen);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDashboardOpen]);

  const contextValue: AnalyticsContextType = {
    isEnabled: enabled,
    isDashboardOpen,
    toggleDashboard: () => setIsDashboardOpen(!isDashboardOpen),
    trackEvent: (event: string, properties?: Record<string, any>) => {
      if (enabled) {
        analytics.track(event, properties);
      }
    },
    trackError: (error: Error, context?: Record<string, any>) => {
      if (enabled) {
        analytics.trackError(error, context);
      }
    },
  };

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}

      {/* Analytics Dashboard */}
      {showDashboard && (
        <AnalyticsDashboard
          isOpen={isDashboardOpen}
          onToggle={() => setIsDashboardOpen(!isDashboardOpen)}
          position={dashboardPosition}
        />
      )}

      {/* Dashboard Toggle Button (only in development) */}
      {showDashboard && process.env.NODE_ENV === 'development' && (
        <button
          onClick={() => setIsDashboardOpen(!isDashboardOpen)}
          className="fixed bottom-4 left-4 z-40 bg-cyan-400/20 border border-cyan-400/50 text-cyan-300 p-2 rounded-lg hover:bg-cyan-400/30 transition-colors"
          title="Toggle Analytics Dashboard (Ctrl+Shift+A)"
        >
          📊
        </button>
      )}
    </AnalyticsContext.Provider>
  );
};

/**
 * HOC for tracking component renders and errors
 */
export const withAnalytics = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
) => {
  const WithAnalyticsComponent = (props: P) => {
    const { trackEvent, trackError } = useAnalyticsContext();
    const renderStartTime = React.useRef<number>(Date.now());

    // Track component mount
    useEffect(() => {
      const renderTime = Date.now() - renderStartTime.current;
      trackEvent('component_render', {
        componentName,
        renderTime,
      });
    }, [trackEvent]);

    // Error boundary for component
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
      return () => {
        if (hasError) {
          setHasError(false);
        }
      };
    }, [hasError]);

    if (hasError) {
      return (
        <div className="p-4 border border-red-400/50 rounded bg-red-400/10 text-red-400">
          <h3 className="font-semibold mb-2">Component Error</h3>
          <p className="text-sm">
            The {componentName} component encountered an error.
          </p>
        </div>
      );
    }

    try {
      return <WrappedComponent {...props} />;
    } catch (error) {
      trackError(error as Error, { componentName });
      throw error;
    }
  };

  WithAnalyticsComponent.displayName = `withAnalytics(${componentName})`;
  return WithAnalyticsComponent;
};

/**
 * Hook for tracking specific component interactions
 */
export const useComponentAnalytics = (componentName: string) => {
  const { trackEvent } = useAnalyticsContext();

  const trackInteraction = React.useCallback(
    (interaction: string, data?: Record<string, any>) => {
      trackEvent('component_interaction', {
        componentName,
        interaction,
        ...data,
      });
    },
    [componentName, trackEvent]
  );

  return { trackInteraction };
};

/**
 * Utility function to extract section from pathname
 */
function getSectionFromPath(pathname: string): string | undefined {
  const path = pathname.replace('/', '');
  const validSections = ['about', 'tech', 'blog', 'fashion', 'merch'];
  return validSections.includes(path) ? path : undefined;
}

export default AnalyticsProvider;
