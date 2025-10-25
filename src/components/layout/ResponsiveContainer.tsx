/**
 * Responsive Container Component
 *
 * Provides adaptive layouts and spacing for different device types,
 * with proper safe area handling and touch-friendly interactions.
 */

import React from 'react';
import {
  useBreakpoint,
  useMobileUI,
  useSafeArea,
} from '../../shared/hooks/useMobile';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'full' | 'content' | 'section';
  enableSafeArea?: boolean;
  mobileNavigation?: boolean;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className = '',
  variant = 'content',
  enableSafeArea = true,
  mobileNavigation = false,
}) => {
  const breakpoint = useBreakpoint();
  const uiSettings = useMobileUI();
  const safeArea = useSafeArea();

  const getContainerStyles = () => {
    const baseStyles = 'w-full transition-all duration-300';

    switch (variant) {
      case 'full':
        return `${baseStyles} min-h-screen`;

      case 'section':
        return `${baseStyles} min-h-screen flex flex-col`;

      case 'content':
      default:
        return `${baseStyles} mx-auto max-w-7xl`;
    }
  };

  const getPadding = () => {
    const basePadding = uiSettings.containerPadding;
    const topPadding = enableSafeArea
      ? safeArea.top + basePadding
      : basePadding;
    const bottomPadding = enableSafeArea
      ? safeArea.bottom +
        basePadding +
        (mobileNavigation && breakpoint.isMobile ? 80 : 0)
      : basePadding + (mobileNavigation && breakpoint.isMobile ? 80 : 0);
    const leftPadding = enableSafeArea
      ? safeArea.left + basePadding
      : basePadding;
    const rightPadding = enableSafeArea
      ? safeArea.right + basePadding
      : basePadding;

    return {
      paddingTop: `${topPadding}px`,
      paddingBottom: `${bottomPadding}px`,
      paddingLeft: `${leftPadding}px`,
      paddingRight: `${rightPadding}px`,
    };
  };

  return (
    <div
      className={`${getContainerStyles()} ${className}`}
      style={getPadding()}
    >
      {children}
    </div>
  );
};

/**
 * Responsive Grid Component
 */
interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  minItemWidth?: number;
  gap?: number;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  className = '',
  minItemWidth = 300,
  gap = 24,
}) => {
  const getGridConfig = () => {
    // Auto-fit grid based on minimum item width
    return {
      display: 'grid',
      gridTemplateColumns: `repeat(auto-fit, minmax(${minItemWidth}px, 1fr))`,
      gap: `${gap}px`,
    };
  };

  return (
    <div className={`${className}`} style={getGridConfig()}>
      {children}
    </div>
  );
};

/**
 * Responsive Section Component
 */
interface ResponsiveSectionProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  variant?: 'default' | 'hero' | 'feature';
}

export const ResponsiveSection: React.FC<ResponsiveSectionProps> = ({
  children,
  title,
  subtitle,
  className = '',
  variant = 'default',
}) => {
  const uiSettings = useMobileUI();
  const breakpoint = useBreakpoint();

  const getSectionSpacing = () => {
    return {
      marginBottom: `${uiSettings.sectionSpacing}px`,
    };
  };

  const getTitleStyles = () => {
    if (variant === 'hero') {
      return breakpoint.isMobile
        ? 'text-4xl md:text-6xl lg:text-8xl'
        : 'text-6xl lg:text-8xl xl:text-9xl';
    }

    if (variant === 'feature') {
      return breakpoint.isMobile
        ? 'text-2xl md:text-3xl'
        : 'text-3xl lg:text-4xl';
    }

    return breakpoint.isMobile ? 'text-xl md:text-2xl' : 'text-2xl lg:text-3xl';
  };

  return (
    <section className={`${className}`} style={getSectionSpacing()}>
      {title && (
        <header className="mb-8">
          <h2
            className={`font-mono font-bold text-cyan-400 ${getTitleStyles()}`}
          >
            {title}
          </h2>
          {subtitle && (
            <p className="text-cyan-300/80 mt-4 text-lg md:text-xl">
              {subtitle}
            </p>
          )}
        </header>
      )}

      <div className="space-y-6">{children}</div>
    </section>
  );
};

/**
 * Mobile-Optimized Card Component
 */
interface MobileCardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
}

export const MobileCard: React.FC<MobileCardProps> = ({
  children,
  className = '',
  interactive = false,
  onClick,
}) => {
  const uiSettings = useMobileUI();
  const breakpoint = useBreakpoint();

  const getCardStyles = () => {
    const baseStyles =
      'bg-black/50 border border-cyan-400/30 rounded-lg backdrop-blur-md';
    const interactiveStyles = interactive
      ? 'cursor-pointer hover:border-cyan-400/50 hover:bg-black/60 transition-all duration-200'
      : '';
    const touchStyles =
      breakpoint.isMobile && interactive
        ? 'active:scale-95 active:bg-cyan-400/10'
        : '';

    return `${baseStyles} ${interactiveStyles} ${touchStyles}`;
  };

  const getPadding = () => {
    return breakpoint.isMobile ? 'p-4' : 'p-6';
  };

  const getMinHeight = () => {
    return interactive && breakpoint.isMobile
      ? { minHeight: `${uiSettings.minTouchTarget}px` }
      : {};
  };

  return (
    <div
      className={`${getCardStyles()} ${getPadding()} ${className}`}
      style={getMinHeight()}
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={
        interactive
          ? e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
    >
      {children}
    </div>
  );
};

/**
 * Responsive Text Component
 */
interface ResponsiveTextProps {
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  className?: string;
}

export const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  children,
  size = 'base',
  className = '',
}) => {
  const breakpoint = useBreakpoint();

  const getTextSize = () => {
    const sizeMap = {
      xs: breakpoint.isMobile ? 'text-xs' : 'text-sm',
      sm: breakpoint.isMobile ? 'text-sm' : 'text-base',
      base: breakpoint.isMobile ? 'text-base' : 'text-lg',
      lg: breakpoint.isMobile ? 'text-lg' : 'text-xl',
      xl: breakpoint.isMobile ? 'text-xl' : 'text-2xl',
      '2xl': breakpoint.isMobile ? 'text-2xl' : 'text-3xl',
      '3xl': breakpoint.isMobile ? 'text-3xl' : 'text-4xl',
    };

    return sizeMap[size];
  };

  return <div className={`${getTextSize()} ${className}`}>{children}</div>;
};

export default {
  ResponsiveContainer,
  ResponsiveGrid,
  ResponsiveSection,
  MobileCard,
  ResponsiveText,
};
