import React, { Component, ReactNode } from 'react';
import { Scene3DFallback } from './Scene3DFallback';
import { SectionId } from '@/types';

interface Scene3DErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  retryCount: number;
}

interface Scene3DErrorBoundaryProps {
  children: ReactNode;
  onSectionChange?: (section: SectionId) => void;
  fallbackComponent?: React.ComponentType<any>;
  maxRetries?: number;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export class Scene3DErrorBoundary extends Component<
  Scene3DErrorBoundaryProps,
  Scene3DErrorBoundaryState
> {
  private retryTimer?: NodeJS.Timeout;

  constructor(props: Scene3DErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Scene3DErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      retryCount: 0,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details for debugging
    console.error('Scene3D Error Boundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Report to analytics or error tracking service
    this.reportError(error, errorInfo);
  }

  componentWillUnmount() {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
    }
  }

  private reportError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Check if error reporting is available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: `Scene3D Error: ${error.message}`,
        fatal: false,
      });
    }

    // Log detailed error information
    const errorReport = {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      errorInfo: {
        componentStack: errorInfo.componentStack,
      },
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      webglSupport: this.checkWebGLSupport(),
    };

    console.error('3D Scene Error Report:', errorReport);
  };

  private checkWebGLSupport = (): boolean => {
    try {
      const canvas = document.createElement('canvas');
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
    } catch (e) {
      return false;
    }
  };

  private handleRetry = () => {
    const { maxRetries = 3 } = this.props;
    const { retryCount } = this.state;

    if (retryCount < maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        retryCount: prevState.retryCount + 1,
      }));

      // Clear any existing timer
      if (this.retryTimer) {
        clearTimeout(this.retryTimer);
      }

      // Set up automatic retry after a delay
      this.retryTimer = setTimeout(() => {
        // Force re-render after clearing error state
        this.forceUpdate();
      }, 1000);
    }
  };

  render() {
    const { hasError, error, retryCount } = this.state;
    const {
      children,
      onSectionChange,
      fallbackComponent: FallbackComponent,
      maxRetries = 3,
    } = this.props;

    if (hasError) {
      // Check if we can still retry
      const canRetry = retryCount < maxRetries;

      // Use custom fallback component if provided
      if (FallbackComponent) {
        return (
          <FallbackComponent
            error={error}
            onRetry={canRetry ? this.handleRetry : undefined}
            onSectionChange={onSectionChange}
            retryCount={retryCount}
            maxRetries={maxRetries}
          />
        );
      }

      // Default fallback with retry functionality
      return (
        <div className="w-full h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
          <Scene3DFallback error={error} onSectionChange={onSectionChange} />

          {/* Retry Button (if retries available) */}
          {canRetry && (
            <div className="absolute bottom-4 right-4">
              <button
                onClick={this.handleRetry}
                className="px-4 py-2 bg-cyan-500 bg-opacity-20 border border-cyan-400 text-cyan-400 font-mono text-sm rounded hover:bg-opacity-30 transition-all duration-300"
              >
                RETRY 3D ({maxRetries - retryCount} left)
              </button>
            </div>
          )}

          {/* Error Details in Development */}
          {process.env.NODE_ENV === 'development' && error && (
            <div className="absolute bottom-4 left-4 max-w-md p-4 bg-red-900 bg-opacity-30 border border-red-500 rounded text-red-300 font-mono text-xs">
              <div className="mb-2 font-semibold">Error Details:</div>
              <div className="mb-1">Name: {error.name}</div>
              <div className="mb-1">Message: {error.message}</div>
              <div className="mb-1">
                Retries: {retryCount}/{maxRetries}
              </div>
              <div>
                WebGL:{' '}
                {this.checkWebGLSupport() ? 'Supported' : 'Not Supported'}
              </div>
            </div>
          )}
        </div>
      );
    }

    return children;
  }
}

export default Scene3DErrorBoundary;
