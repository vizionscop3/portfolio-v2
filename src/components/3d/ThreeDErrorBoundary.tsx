/**
 * 3D Scene Error Boundary
 *
 * Specialized error boundary for Three.js/React Three Fiber components
 * Provides fallback UI and graceful degradation when 3D fails to load
 */

import { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '../../utils/loggingService';

interface ThreeDErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
}

interface ThreeDErrorBoundaryProps {
  children: ReactNode;
  fallbackComponent?: ReactNode;
  maxRetries?: number;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  enableFallback?: boolean;
}

export class ThreeDErrorBoundary extends Component<
  ThreeDErrorBoundaryProps,
  ThreeDErrorBoundaryState
> {
  private retryTimer?: NodeJS.Timeout;

  constructor(props: ThreeDErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(
    error: Error
  ): Partial<ThreeDErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log the 3D error with specific context
    logger.error('3D Scene Error', error, {
      component: '3DErrorBoundary',
      feature: 'scene-rendering',
      metadata: {
        componentStack: errorInfo.componentStack,
        retryCount: this.state.retryCount,
        errorName: error.name,
        errorMessage: error.message,
      },
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    const maxRetries = this.props.maxRetries || 2;

    if (this.state.retryCount < maxRetries) {
      logger.info('Retrying 3D scene load', {
        component: '3DErrorBoundary',
        feature: 'retry-mechanism',
        metadata: { retryAttempt: this.state.retryCount + 1 },
      });

      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1,
      }));
    }
  };

  componentWillUnmount() {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
    }
  }

  render() {
    if (this.state.hasError) {
      const maxRetries = this.props.maxRetries || 2;
      const canRetry = this.state.retryCount < maxRetries;

      // If custom fallback component is provided, use it
      if (this.props.fallbackComponent) {
        return this.props.fallbackComponent;
      }

      // If fallback is disabled, return null (hide the component)
      if (this.props.enableFallback === false) {
        return null;
      }

      // Default fallback UI
      return (
        <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg border border-gray-700">
          <div className="text-center p-6 max-w-md">
            <div className="mb-4">
              <svg
                className="w-16 h-16 mx-auto text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>

            <h3 className="text-lg font-semibold text-gray-300 mb-2">
              3D Scene Unavailable
            </h3>

            <p className="text-sm text-gray-400 mb-4">
              The 3D visualization couldn't load. This might be due to browser
              compatibility or performance limitations.
            </p>

            {canRetry && (
              <button
                onClick={this.handleRetry}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
              >
                Try Again ({maxRetries - this.state.retryCount} attempts left)
              </button>
            )}

            {!canRetry && (
              <div className="text-xs text-gray-500">
                <p>Maximum retry attempts reached.</p>
                <p className="mt-1">Portfolio features remain available.</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Component is already exported above
// Only export the component to keep fast refresh working
