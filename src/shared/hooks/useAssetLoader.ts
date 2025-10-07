import {
  AssetItem,
  AssetLoader,
  AssetPriority,
  LoadingProgress,
  assetLoader,
} from '@/utils/assetLoader';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseAssetLoaderOptions {
  preloadCritical?: boolean;
  enableProgressTracking?: boolean;
  onError?: (errors: Array<{ assetId: string; error: Error }>) => void;
}

export interface UseAssetLoaderReturn {
  progress: LoadingProgress;
  loadAsset: (assetId: string) => Promise<unknown>;
  loadAssetsByPriority: (
    priority: AssetPriority
  ) => Promise<Map<string, unknown>>;
  preloadCritical: () => Promise<void>;
  loadAll: () => Promise<Map<string, unknown>>;
  getAsset: (assetId: string) => unknown | null;
  isAssetLoaded: (assetId: string) => boolean;
  isLoading: boolean;
  errors: Array<{ assetId: string; error: Error }>;
  clearErrors: () => void;
}

export const useAssetLoader = (
  assets?: Array<Omit<AssetItem, 'cached' | 'loadTime' | 'retryCount'>>,
  options: UseAssetLoaderOptions = {}
): UseAssetLoaderReturn => {
  const {
    preloadCritical = true,
    enableProgressTracking = true,
    onError,
  } = options;

  const [progress, setProgress] = useState<LoadingProgress>({
    loaded: 0,
    total: 0,
    percentage: 0,
    phase: 'initializing',
    errors: [],
  });

  const [errors, setErrors] = useState<
    Array<{ assetId: string; error: Error }>
  >([]);
  const loaderRef = useRef<AssetLoader>(assetLoader);
  const initializedRef = useRef(false);

  const updateProgress = useCallback(
    (newProgress: LoadingProgress) => {
      setProgress(newProgress);

      // Extract errors for easier access
      const errorList = newProgress.errors.map(err => ({
        assetId: err.assetId,
        error: err.error,
      }));

      setErrors(errorList);

      if (errorList.length > 0 && onError) {
        onError(errorList);
      }
    },
    [onError]
  );

  // Initialize assets and progress tracking
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const loader = loaderRef.current;

    // Register provided assets
    if (assets?.length) {
      loader.registerAssets(assets);
    }

    // Set up progress tracking
    let unsubscribeProgress: (() => void) | null = null;
    if (enableProgressTracking) {
      unsubscribeProgress = loader.onProgress(updateProgress);
      // Initial progress update
      updateProgress(loader.getLoadingProgress());
    }

    // Preload critical assets if enabled
    if (preloadCritical) {
      loader.preloadCriticalAssets().catch(error => {
        console.warn('Failed to preload critical assets:', error);
      });
    }

    return () => {
      if (unsubscribeProgress) {
        unsubscribeProgress();
      }
    };
  }, [assets, preloadCritical, enableProgressTracking, updateProgress]);

  const loadAsset = useCallback(async (assetId: string): Promise<unknown> => {
    const loader = loaderRef.current;
    try {
      return await loader.loadAsset(assetId);
    } catch (error) {
      console.error(`Failed to load asset ${assetId}:`, error);
      throw error;
    }
  }, []);

  const loadAssetsByPriority = useCallback(
    async (priority: AssetPriority): Promise<Map<string, unknown>> => {
      const loader = loaderRef.current;
      return await loader.loadAssetsByPriority(priority);
    },
    []
  );

  const preloadCriticalAssets = useCallback(async (): Promise<void> => {
    const loader = loaderRef.current;
    return await loader.preloadCriticalAssets();
  }, []);

  const loadAll = useCallback(async (): Promise<Map<string, unknown>> => {
    const loader = loaderRef.current;
    return await loader.loadAllAssets();
  }, []);

  const getAsset = useCallback((assetId: string): unknown | null => {
    const loader = loaderRef.current;
    return loader.getAsset(assetId);
  }, []);

  const isAssetLoaded = useCallback((assetId: string): boolean => {
    const loader = loaderRef.current;
    return loader.isAssetLoaded(assetId);
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const isLoading = progress.phase === 'loading';

  return {
    progress,
    loadAsset,
    loadAssetsByPriority,
    preloadCritical: preloadCriticalAssets,
    loadAll,
    getAsset,
    isAssetLoaded,
    isLoading,
    errors,
    clearErrors,
  };
};

// Utility hook for loading specific assets
export const useAssets = (
  assetIds: string[]
): {
  assets: Map<string, unknown>;
  isLoading: boolean;
  errors: string[];
  loadAssets: () => Promise<void>;
} => {
  const [assets, setAssets] = useState<Map<string, unknown>>(new Map());
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const loadAssets = useCallback(async () => {
    setLoading(true);
    setErrors([]);

    const loader = assetLoader;
    const loadedAssets = new Map<string, unknown>();
    const loadErrors: string[] = [];

    for (const assetId of assetIds) {
      try {
        const asset = await loader.loadAsset(assetId);
        loadedAssets.set(assetId, asset);
      } catch (error) {
        console.error(`Failed to load asset ${assetId}:`, error);
        loadErrors.push(assetId);
      }
    }

    setAssets(loadedAssets);
    setErrors(loadErrors);
    setLoading(false);
  }, [assetIds]);

  // Auto-load when assetIds change
  useEffect(() => {
    if (assetIds.length > 0) {
      loadAssets();
    }
  }, [assetIds, loadAssets]);

  return {
    assets,
    isLoading: loading,
    errors,
    loadAssets,
  };
};

// Hook for progressive image loading with placeholder
export const useProgressiveImage = (
  src: string,
  placeholderSrc?: string
): {
  src: string;
  isLoading: boolean;
  error: Error | null;
} => {
  const [currentSrc, setCurrentSrc] = useState(placeholderSrc || '');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!src) return;

    setIsLoading(true);
    setError(null);

    const img = new Image();

    img.onload = () => {
      setCurrentSrc(src);
      setIsLoading(false);
    };

    img.onerror = () => {
      setError(new Error(`Failed to load image: ${src}`));
      setIsLoading(false);
    };

    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return {
    src: currentSrc,
    isLoading,
    error,
  };
};

// Hook for preloading images with intersection observer
export const useImagePreloader = (): {
  preloadImage: (src: string) => Promise<HTMLImageElement>;
  preloadImages: (srcs: string[]) => Promise<HTMLImageElement[]>;
} => {
  const preloadImage = useCallback((src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to preload image: ${src}`));
      img.src = src;
    });
  }, []);

  const preloadImages = useCallback(
    async (srcs: string[]): Promise<HTMLImageElement[]> => {
      const promises = srcs.map(src => preloadImage(src));
      return Promise.all(promises);
    },
    [preloadImage]
  );

  return {
    preloadImage,
    preloadImages,
  };
};

// Hook for lazy loading with Intersection Observer
export const useLazyLoading = (
  ref: React.RefObject<HTMLElement | HTMLDivElement | null>,
  callback: () => void,
  options: IntersectionObserverInit = {}
): boolean => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    if (!ref.current || hasTriggered) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasTriggered(true);
          callback();
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, callback, hasTriggered, options]);

  return isVisible;
};
