import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useProgressiveImage,
  useLazyLoading,
} from '../../shared/hooks/useAssetLoader';
import { Loader, AlertCircle } from 'lucide-react';

export interface LazyImageProps {
  src: string;
  alt: string;
  placeholderSrc?: string;
  className?: string;
  containerClassName?: string;
  loadingClassName?: string;
  errorClassName?: string;
  width?: number | string;
  height?: number | string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  style?: React.CSSProperties;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholderSrc,
  className = '',
  containerClassName = '',
  loadingClassName = '',
  errorClassName = '',
  width,
  height,
  priority = false,
  onLoad,
  onError,
  style,
}) => {
  const [shouldLoad, setShouldLoad] = useState(priority);
  const [hasLoaded, setHasLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use lazy loading if not priority
  useLazyLoading(containerRef, () => setShouldLoad(true), {
    threshold: 0.1,
    rootMargin: '100px',
  });

  // Use progressive image loading
  const {
    src: currentSrc,
    isLoading,
    error,
  } = useProgressiveImage(shouldLoad ? src : '', placeholderSrc);

  // Handle load completion
  useEffect(() => {
    if (!isLoading && !error && currentSrc === src) {
      setHasLoaded(true);
      onLoad?.();
    }
  }, [isLoading, error, currentSrc, src, onLoad]);

  // Handle errors
  useEffect(() => {
    if (error) {
      onError?.(error);
    }
  }, [error, onError]);

  const containerStyle = {
    width,
    height,
    ...style,
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${containerClassName}`}
      style={containerStyle}
    >
      <AnimatePresence mode="wait">
        {/* Loading State */}
        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`
              absolute inset-0 flex items-center justify-center 
              bg-gray-800 text-gray-400 ${loadingClassName}
            `}
          >
            <div className="flex flex-col items-center space-y-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                <Loader className="w-6 h-6" />
              </motion.div>
              <span className="text-xs">Loading...</span>
            </div>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`
              absolute inset-0 flex items-center justify-center 
              bg-red-900/20 border border-red-800 text-red-400 ${errorClassName}
            `}
          >
            <div className="flex flex-col items-center space-y-2 text-center p-4">
              <AlertCircle className="w-6 h-6" />
              <span className="text-xs">Failed to load image</span>
              <span className="text-xs text-red-600 truncate max-w-full">
                {error.message}
              </span>
            </div>
          </motion.div>
        )}

        {/* Image */}
        {currentSrc && !error && (
          <motion.img
            key="image"
            src={currentSrc}
            alt={alt}
            className={`w-full h-full object-cover ${className}`}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{
              opacity: hasLoaded ? 1 : 0.7,
              scale: 1,
            }}
            transition={{
              duration: 0.5,
              ease: 'easeOut',
            }}
            onLoad={() => {
              if (currentSrc === src) {
                setHasLoaded(true);
                onLoad?.();
              }
            }}
            onError={() => {
              const loadError = new Error(`Failed to load image: ${src}`);
              onError?.(loadError);
            }}
          />
        )}

        {/* Placeholder blur overlay during loading */}
        {placeholderSrc && currentSrc === placeholderSrc && isLoading && (
          <motion.div
            key="blur-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 backdrop-blur-sm bg-white/10"
          />
        )}
      </AnimatePresence>

      {/* Progressive loading shimmer effect */}
      {isLoading && !error && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
      )}

      {/* Image metadata overlay (dev mode) */}
      {typeof window !== 'undefined' && import.meta.env?.DEV && (
        <div className="absolute top-2 right-2 bg-black/75 text-white text-xs px-2 py-1 rounded opacity-75">
          {shouldLoad ? 'Loaded' : 'Lazy'}
        </div>
      )}
    </div>
  );
};

export default LazyImage;
