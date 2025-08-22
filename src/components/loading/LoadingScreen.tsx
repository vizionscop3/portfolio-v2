import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader,
  Download,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Zap,
  Cpu,
  HardDrive,
} from 'lucide-react';
import { LoadingProgress } from '@/utils/assetLoader';
// import { formatBytes } from '@/utils/performance';

export interface LoadingScreenProps {
  progress: LoadingProgress;
  title?: string;
  subtitle?: string;
  showDetails?: boolean;
  showRetry?: boolean;
  onRetry?: () => void;
  className?: string;
}

interface LoadingTip {
  icon: React.ReactNode;
  text: string;
  subtext: string;
}

const loadingTips: LoadingTip[] = [
  {
    icon: <Zap className="w-5 h-5 text-yellow-400" />,
    text: 'Optimizing Performance',
    subtext: 'Adjusting quality settings based on your device capabilities',
  },
  {
    icon: <Cpu className="w-5 h-5 text-blue-400" />,
    text: 'Loading 3D Models',
    subtext: 'Preparing cyberpunk interactive elements and environments',
  },
  {
    icon: <HardDrive className="w-5 h-5 text-green-400" />,
    text: 'Caching Assets',
    subtext: 'Storing resources for faster future loading',
  },
  {
    icon: <Download className="w-5 h-5 text-cyan-400" />,
    text: 'Progressive Loading',
    subtext: 'Critical assets are loaded first for better experience',
  },
];

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  progress,
  title = 'Loading Portfolio',
  subtitle = 'Preparing your cyberpunk experience...',
  showDetails = true,
  showRetry = false,
  onRetry,
  className = '',
}) => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  // Cycle through loading tips
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex(prev => (prev + 1) % loadingTips.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Animate progress bar
  useEffect(() => {
    const targetProgress = progress.percentage;
    const animate = () => {
      setAnimatedProgress(current => {
        const diff = targetProgress - current;
        if (Math.abs(diff) < 0.1) return targetProgress;
        return current + diff * 0.1;
      });
    };

    const animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [progress.percentage]);

  const getPhaseDisplay = () => {
    switch (progress.phase) {
      case 'initializing':
        return { text: 'Initializing', color: 'text-blue-400' };
      case 'loading':
        return { text: 'Loading Assets', color: 'text-cyan-400' };
      case 'complete':
        return { text: 'Complete', color: 'text-green-400' };
      case 'error':
        return { text: 'Error Occurred', color: 'text-red-400' };
      default:
        return { text: 'Loading', color: 'text-cyan-400' };
    }
  };

  const phaseDisplay = getPhaseDisplay();
  const isComplete = progress.phase === 'complete';
  const hasErrors = progress.errors.length > 0;

  return (
    <div
      className={`fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 z-50 flex items-center justify-center ${className}`}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0 bg-grid-white/10 bg-[size:50px_50px]"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
            }}
          />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0.6, 0.2, 0.6],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Scanning Line */}
        <motion.div
          className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50"
          animate={{
            y: [-100, window.innerHeight + 100],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md mx-auto p-6 text-center">
        {/* Logo/Icon */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            <motion.div
              className="w-20 h-20 mx-auto border-2 border-cyan-400 rounded-full flex items-center justify-center"
              animate={{ rotate: isComplete ? 0 : 360 }}
              transition={{
                duration: isComplete ? 0.5 : 2,
                repeat: isComplete ? 0 : Infinity,
                ease: 'linear',
              }}
            >
              {isComplete ? (
                <CheckCircle className="w-8 h-8 text-green-400" />
              ) : hasErrors ? (
                <AlertCircle className="w-8 h-8 text-red-400" />
              ) : (
                <Loader className="w-8 h-8 text-cyan-400" />
              )}
            </motion.div>

            {/* Pulse Effect */}
            <motion.div
              className="absolute inset-0 border-2 border-cyan-400 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
          </div>
        </motion.div>

        {/* Title and Subtitle */}
        <motion.div
          className="mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
          <p className="text-gray-400">{subtitle}</p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          className="mb-6"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: '100%', opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span className={phaseDisplay.color}>{phaseDisplay.text}</span>
            <span>{Math.round(animatedProgress)}%</span>
          </div>

          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
              style={{ width: `${animatedProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>
              {progress.loaded} of {progress.total} assets
            </span>
          </div>
        </motion.div>

        {/* Loading Tips */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTipIndex}
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center space-x-3 text-gray-300">
              {loadingTips[currentTipIndex].icon}
              <div className="text-left">
                <div className="text-sm font-medium">
                  {loadingTips[currentTipIndex].text}
                </div>
                <div className="text-xs text-gray-500">
                  {loadingTips[currentTipIndex].subtext}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Details */}
        {showDetails && (
          <motion.div
            className="space-y-2 text-xs text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {progress.currentAsset && (
              <div>Loading: {progress.currentAsset.url.split('/').pop()}</div>
            )}

            {hasErrors && (
              <div className="text-red-400">
                {progress.errors.length} error
                {progress.errors.length !== 1 ? 's' : ''} occurred
              </div>
            )}
          </motion.div>
        )}

        {/* Retry Button */}
        {showRetry && hasErrors && onRetry && (
          <motion.button
            className="mt-6 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg 
                       transition-colors flex items-center space-x-2 mx-auto"
            onClick={onRetry}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Loading</span>
          </motion.button>
        )}

        {/* Error Details (Expandable) */}
        {hasErrors && (
          <motion.details
            className="mt-4 text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <summary className="cursor-pointer text-xs text-gray-400 hover:text-gray-300">
              View Error Details ({progress.errors.length})
            </summary>
            <div className="mt-2 space-y-1 text-xs text-red-400 bg-red-900/20 p-2 rounded border border-red-800">
              {progress.errors.slice(0, 3).map((error, index) => (
                <div key={index} className="truncate">
                  <span className="text-red-300">{error.assetId}:</span>{' '}
                  {error.error.message}
                </div>
              ))}
              {progress.errors.length > 3 && (
                <div className="text-gray-500">
                  ... and {progress.errors.length - 3} more errors
                </div>
              )}
            </div>
          </motion.details>
        )}
      </div>

      {/* Progress Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-gray-600"
              animate={{
                backgroundColor:
                  i <= Math.floor(animatedProgress / 25)
                    ? '#22D3EE'
                    : '#4B5563',
                scale: i === Math.floor(animatedProgress / 25) ? 1.2 : 1,
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
