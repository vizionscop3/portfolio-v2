import React, { useEffect, useState, useCallback } from 'react';
import { useAssetLoader } from '@/hooks/useAssetLoader';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { performanceConfigs } from '@/utils/assetRegistry';
import LoadingScreen from './LoadingScreen';

export interface AssetPreloaderProps {
  onLoadingComplete?: () => void;
  onError?: (errors: Array<{ assetId: string; error: Error }>) => void;
  showLoadingScreen?: boolean;
  minLoadingTime?: number;
  children?: React.ReactNode;
}

const AssetPreloader: React.FC<AssetPreloaderProps> = ({
  onLoadingComplete,
  onError,
  showLoadingScreen = true,
  minLoadingTime = 2000,
  children,
}) => {
  const [isReady, setIsReady] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [startTime] = useState(Date.now());

  // Get performance mode for adaptive loading
  const { mode } = usePerformanceMonitor();

  // Initialize asset loader
  const {
    progress,
    preloadCritical,
    loadAssetsByPriority,
    // isLoading,
    errors,
    clearErrors,
  } = useAssetLoader([], {
    preloadCritical: true,
    enableProgressTracking: true,
    onError: errorList => {
      console.warn('Asset loading errors:', errorList);
      onError?.(errorList);
    },
  });

  // Adaptive loading based on performance mode
  const loadAssetsByPerformance = useCallback(async () => {
    const config = performanceConfigs[mode];

    try {
      // Phase 1: Always load critical assets
      await preloadCritical();

      // Load additional phases based on performance mode
      if (config.preloadPhases.includes('phase2')) {
        await loadAssetsByPriority('high');
      }

      if (config.preloadPhases.includes('phase3')) {
        await loadAssetsByPriority('medium');
      }

      if (config.preloadPhases.includes('phase4')) {
        await loadAssetsByPriority('low');
      }
    } catch (error) {
      console.error('Asset loading failed:', error);
      throw error;
    }
  }, [mode, preloadCritical, loadAssetsByPriority]);

  // Main loading logic
  useEffect(() => {
    const startLoading = async () => {
      try {
        await loadAssetsByPerformance();

        // Ensure minimum loading time for better UX
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

        if (remainingTime > 0) {
          await new Promise(resolve => setTimeout(resolve, remainingTime));
        }

        setIsReady(true);
        onLoadingComplete?.();
      } catch (error) {
        console.error('Critical asset loading failed:', error);
        // Don't block the app completely, but show errors
      }
    };

    if (!isReady && retryCount === 0) {
      startLoading();
    }
  }, [
    loadAssetsByPerformance,
    isReady,
    retryCount,
    startTime,
    minLoadingTime,
    onLoadingComplete,
  ]);

  // Retry loading
  const handleRetry = useCallback(async () => {
    setRetryCount(prev => prev + 1);
    clearErrors();

    try {
      await loadAssetsByPerformance();
      setIsReady(true);
      onLoadingComplete?.();
    } catch (error) {
      console.error('Retry failed:', error);
    }
  }, [loadAssetsByPerformance, clearErrors, onLoadingComplete]);

  // Progressive enhancement: show content even if not fully loaded after timeout
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isReady && errors.length === 0) {
        console.warn(
          'Loading timeout reached, showing content with partial assets'
        );
        setIsReady(true);
        onLoadingComplete?.();
      }
    }, 15000); // 15 second timeout

    return () => clearTimeout(timeout);
  }, [isReady, errors, onLoadingComplete]);

  // Show loading screen while loading
  if (showLoadingScreen && !isReady) {
    return (
      <LoadingScreen
        progress={progress}
        title="Loading Portfolio"
        subtitle="Preparing your cyberpunk experience..."
        showDetails={true}
        showRetry={errors.length > 0}
        onRetry={handleRetry}
      />
    );
  }

  // Show children when ready
  return <>{children}</>;
};

export default AssetPreloader;
