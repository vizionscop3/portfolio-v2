import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  BarChart3,
  Settings,
  X,
  Monitor,
  Zap,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import {
  formatBytes,
  getPerformanceRecommendations,
} from '@/utils/performance';
import { PerformanceMode } from '@/utils/performance';

interface PerformanceMonitorProps {
  className?: string;
  showRecommendations?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  className = '',
  showRecommendations = true,
  position = 'top-right',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const { metrics, mode, isMonitoring, start, stop, setMode } =
    usePerformanceMonitor({
      onModeChange: _newMode => {
        // Performance mode changed
      },
    });

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      default:
        return 'top-4 right-4';
    }
  };

  const getModeColor = (currentMode: PerformanceMode): string => {
    switch (currentMode) {
      case 'high':
        return 'text-green-400';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getModeIcon = (currentMode: PerformanceMode) => {
    switch (currentMode) {
      case 'high':
        return <CheckCircle size={16} className="text-green-400" />;
      case 'medium':
        return <AlertTriangle size={16} className="text-yellow-400" />;
      case 'low':
        return <AlertTriangle size={16} className="text-red-400" />;
      default:
        return <Monitor size={16} className="text-gray-400" />;
    }
  };

  const recommendations = metrics ? getPerformanceRecommendations(metrics) : [];

  if (!isMonitoring || !metrics) {
    return (
      <div className={`fixed ${getPositionClasses()} z-50 ${className}`}>
        <motion.button
          onClick={start}
          className="p-2 bg-gray-800/80 backdrop-blur-sm border border-gray-600 rounded-lg 
                     hover:bg-gray-700/80 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Activity size={20} className="text-gray-400" />
        </motion.button>
      </div>
    );
  }

  return (
    <div className={`fixed ${getPositionClasses()} z-50 ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900/95 backdrop-blur-sm border border-gray-600 rounded-lg shadow-xl"
      >
        {/* Compact View */}
        <AnimatePresence>
          {!isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-3 flex items-center space-x-3"
            >
              <div className="flex items-center space-x-2">
                {getModeIcon(mode)}
                <span className={`text-sm font-mono ${getModeColor(mode)}`}>
                  {Math.round(metrics.averageFps)} FPS
                </span>
              </div>

              <button
                onClick={() => setIsExpanded(true)}
                className="p-1 hover:bg-gray-700 rounded transition-colors"
              >
                <BarChart3 size={16} className="text-gray-400" />
              </button>

              <button
                onClick={stop}
                className="p-1 hover:bg-gray-700 rounded transition-colors"
              >
                <X size={16} className="text-gray-400" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expanded View */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="w-80"
            >
              {/* Header */}
              <div className="p-3 border-b border-gray-700 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity size={18} className="text-cyan-400" />
                  <span className="text-white font-medium">
                    Performance Monitor
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-1 hover:bg-gray-700 rounded transition-colors"
                  >
                    <Settings size={16} className="text-gray-400" />
                  </button>

                  <button
                    onClick={() => setIsExpanded(false)}
                    className="p-1 hover:bg-gray-700 rounded transition-colors"
                  >
                    <X size={16} className="text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Settings Panel */}
              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3 border-b border-gray-700 bg-gray-800/50"
                  >
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">
                        Performance Mode:
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['high', 'medium', 'low'] as PerformanceMode[]).map(
                          modeOption => (
                            <button
                              key={modeOption}
                              onClick={() => setMode(modeOption)}
                              className={`p-2 text-xs rounded transition-colors ${
                                mode === modeOption
                                  ? 'bg-cyan-500 text-white'
                                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              }`}
                            >
                              {modeOption.toUpperCase()}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Metrics */}
              <div className="p-3 space-y-3">
                {/* FPS */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">FPS (Average)</span>
                  <span className={`font-mono text-sm ${getModeColor(mode)}`}>
                    {Math.round(metrics.averageFps)} / {Math.round(metrics.fps)}
                  </span>
                </div>

                {/* Frame Time */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Frame Time</span>
                  <span className="text-white font-mono text-sm">
                    {metrics.frameTime.toFixed(1)}ms
                  </span>
                </div>

                {/* Memory Usage */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Memory</span>
                  <span className="text-white font-mono text-sm">
                    {formatBytes(metrics.memoryUsage)}
                  </span>
                </div>

                {/* Performance Mode */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Mode</span>
                  <div className="flex items-center space-x-2">
                    {getModeIcon(mode)}
                    <span
                      className={`text-sm font-medium ${getModeColor(mode)}`}
                    >
                      {mode.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Visual Performance Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Performance</span>
                    <span>{Math.round((metrics.averageFps / 60) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full transition-colors duration-300 ${
                        metrics.averageFps >= 50
                          ? 'bg-green-500'
                          : metrics.averageFps >= 30
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                      }`}
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min((metrics.averageFps / 60) * 100, 100)}%`,
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              {showRecommendations && recommendations.length > 0 && (
                <div className="p-3 border-t border-gray-700 bg-yellow-900/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap size={16} className="text-yellow-400" />
                    <span className="text-sm text-yellow-400 font-medium">
                      Recommendations
                    </span>
                  </div>
                  <div className="space-y-1">
                    {recommendations.slice(0, 2).map((rec, index) => (
                      <div key={index} className="text-xs text-gray-300">
                        • {rec}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default PerformanceMonitor;
