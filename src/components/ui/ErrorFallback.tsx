import { AlertTriangle, Monitor, RefreshCw } from 'lucide-react';
import React from 'react';

interface ErrorFallbackProps {
  error?: string | null;
  webglSupported?: boolean;
  onRetry?: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  webglSupported = false,
  onRetry,
}) => {
  const getErrorMessage = () => {
    if (!webglSupported) {
      return {
        title: 'WebGL Not Supported',
        message:
          "Your browser or device doesn't support WebGL, which is required for the 3D experience.",
        suggestion:
          'Try using a modern browser like Chrome, Firefox, or Safari, or switch to a device with better graphics support.',
      };
    }

    if (error) {
      return {
        title: '3D Scene Error',
        message: error,
        suggestion:
          'This might be a temporary issue. Try refreshing the page or check your graphics drivers.',
      };
    }

    return {
      title: 'Fallback Mode',
      message: 'The 3D experience is not available on your device.',
      suggestion:
        'You can still explore the portfolio in 2D mode with full functionality.',
    };
  };

  const errorInfo = getErrorMessage();

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <div className="max-w-md text-center">
        {/* Error Icon */}
        <div className="mb-6">
          {!webglSupported ? (
            <Monitor size={64} className="mx-auto text-gray-500" />
          ) : (
            <AlertTriangle size={64} className="mx-auto text-yellow-500" />
          )}
        </div>

        {/* Error Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {errorInfo.title}
        </h2>

        {/* Error Message */}
        <p className="text-gray-600 mb-4">{errorInfo.message}</p>

        {/* Suggestion */}
        <p className="text-sm text-gray-500 mb-6">{errorInfo.suggestion}</p>

        {/* Action Buttons */}
        <div className="space-y-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw size={18} />
              Try Again
            </button>
          )}

          <button
            onClick={() => (window.location.href = '/')}
            className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Continue in 2D Mode
          </button>
        </div>

        {/* Technical Details (Development) */}
        {process.env.NODE_ENV === 'development' && error && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              Technical Details
            </summary>
            <pre className="mt-2 p-3 bg-gray-800 text-green-400 text-xs rounded overflow-auto">
              {error}
            </pre>
          </details>
        )}

        {/* Browser Compatibility Info */}
        {!webglSupported && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">
              Browser Compatibility
            </h3>
            <div className="text-sm text-yellow-700 space-y-1">
              <p>✅ Chrome 56+</p>
              <p>✅ Firefox 51+</p>
              <p>✅ Safari 15+</p>
              <p>✅ Edge 79+</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorFallback;
