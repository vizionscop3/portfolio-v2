/**
 * Mobile Layout Component
 *
 * Provides the complete mobile layout structure with navigation,
 * safe areas, performance monitoring, and responsive containers.
 */

import React from 'react';
import { useLocation } from 'react-router-dom';
import { MobileNavigation } from './MobileNavigation';
import { ResponsiveContainer } from './ResponsiveContainer';
import { useDevice, useIOSWebAppBehavior } from '../../shared/hooks/useMobile';
import { useMobilePerformanceOptimization } from '../../shared/hooks/usePerformanceMonitor';

interface MobileLayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
  variant?: 'full' | 'content' | 'section';
  className?: string;
  onNavigate?: (section: string) => void;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({
  children,
  showNavigation = true,
  variant = 'content',
  className = '',
  onNavigate,
}) => {
  const device = useDevice();
  const location = useLocation();
  const { optimizations } = useMobilePerformanceOptimization();

  // Apply iOS-specific behavior fixes
  useIOSWebAppBehavior();

  // Don't apply mobile layout to desktop devices
  if (!device.isMobile && !device.isTablet) {
    return <>{children}</>;
  }

  const isHome = location.pathname === '/';
  const shouldShowNavigation = showNavigation && !isHome;

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black ${className}`}
    >
      {/* Reduced motion notice */}
      {optimizations.reducedMotion && (
        <div className="fixed top-4 left-4 right-4 z-50 bg-black/90 border border-yellow-400/50 text-yellow-400 p-3 rounded-lg backdrop-blur font-mono text-sm">
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Reduced motion mode active</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <ResponsiveContainer
        variant={variant}
        enableSafeArea={true}
        mobileNavigation={shouldShowNavigation}
        className="relative"
      >
        {children}
      </ResponsiveContainer>

      {/* Mobile Navigation */}
      {shouldShowNavigation && (
        <MobileNavigation isVisible={true} onNavigate={onNavigate} />
      )}

      {/* Performance Warning for Low-End Devices */}
      {device.performanceLevel === 'low' && <LowPerformanceWarning />}
    </div>
  );
};

/**
 * Low Performance Warning Component
 */
const LowPerformanceWarning: React.FC = () => {
  const [dismissed, setDismissed] = React.useState(() => {
    return localStorage.getItem('mobile-perf-warning-dismissed') === 'true';
  });

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('mobile-perf-warning-dismissed', 'true');
  };

  if (dismissed) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 bg-red-900/90 border border-red-400/50 text-red-100 p-4 rounded-lg backdrop-blur">
      <div className="flex items-start space-x-3">
        <svg
          className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.96-.833-2.73 0L3.084 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>

        <div className="flex-1">
          <h3 className="font-mono font-medium text-red-200 mb-1">
            Performance Notice
          </h3>
          <p className="text-sm text-red-100/80 mb-3">
            Your device may experience reduced performance with 3D content.
            Visual quality has been automatically optimized for better
            experience.
          </p>

          <div className="flex space-x-2">
            <button
              onClick={handleDismiss}
              className="px-3 py-1 bg-red-400/20 border border-red-400/50 text-red-200 rounded text-sm font-mono hover:bg-red-400/30 transition-colors"
            >
              Understood
            </button>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="text-red-300 hover:text-red-100 transition-colors"
          aria-label="Dismiss warning"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

/**
 * Mobile Section Layout Component
 */
interface MobileSectionLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  className?: string;
}

export const MobileSectionLayout: React.FC<MobileSectionLayoutProps> = ({
  children,
  title,
  subtitle,
  showBackButton = true,
  onBack,
  className = '',
}) => {
  const device = useDevice();

  if (!device.isMobile && !device.isTablet) {
    return <>{children}</>;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      {(title || showBackButton) && (
        <header className="flex items-center space-x-4">
          {showBackButton && (
            <button
              onClick={onBack}
              className="flex items-center justify-center w-10 h-10 bg-cyan-400/20 border border-cyan-400 text-cyan-400 rounded-full backdrop-blur hover:bg-cyan-400/30 transition-colors"
              aria-label="Go back"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {title && (
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-mono font-bold text-cyan-400">
                {title}
              </h1>
              {subtitle && <p className="text-cyan-300/80 mt-1">{subtitle}</p>}
            </div>
          )}
        </header>
      )}

      {/* Content */}
      <main>{children}</main>
    </div>
  );
};

/**
 * Mobile Page Transition Wrapper
 */
interface MobilePageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const MobilePageTransition: React.FC<MobilePageTransitionProps> = ({
  children,
  className = '',
}) => {
  const device = useDevice();

  if (!device.isMobile && !device.isTablet) {
    return <>{children}</>;
  }

  return (
    <div
      className={`animate-in slide-in-from-right-5 duration-300 ${className}`}
    >
      {children}
    </div>
  );
};

export default {
  MobileLayout,
  MobileSectionLayout,
  MobilePageTransition,
};
