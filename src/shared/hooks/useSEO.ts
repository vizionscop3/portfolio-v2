/**
 * SEO React Hook
 *
 * Provides React integration for SEO management, including automatic
 * meta tag updates, social sharing, and structured data management.
 */

import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SectionId } from '../types';
import { SEOData, seoManager } from '../utils/seoManager';

export interface UseSEOOptions {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;
  updateOnMount?: boolean;
}

export interface UseSEOReturn {
  updateSEO: (section?: SectionId, customData?: Partial<SEOData>) => void;
  getSharingUrls: (section?: SectionId) => Record<string, string>;
  getCurrentSEO: () => SEOData;
  openShare: (platform: string, section?: SectionId) => void;
  copyToClipboard: (section?: SectionId) => Promise<boolean>;
  isSharing: boolean;
}

/**
 * Main SEO hook for managing meta tags and social sharing
 */
export const useSEO = (options: UseSEOOptions = {}): UseSEOReturn => {
  const location = useLocation();
  const [isSharing, setIsSharing] = useState(false);

  // Auto-update SEO based on route changes
  useEffect(() => {
    if (options.updateOnMount !== false) {
      const section = getSectionFromPath(location.pathname);
      updateSEO(section);
    }
  }, [location.pathname, options.updateOnMount]);

  // Apply no-index if specified
  useEffect(() => {
    if (options.noIndex) {
      const meta = document.querySelector(
        'meta[name="robots"]'
      ) as HTMLMetaElement;
      if (meta) {
        meta.content = 'noindex, nofollow';
      }
    }
  }, [options.noIndex]);

  /**
   * Update SEO for a specific section with optional custom data
   */
  const updateSEO = useCallback(
    (section?: SectionId, customData?: Partial<SEOData>) => {
      // Get base SEO data
      const baseSEO = seoManager.getSEOData(section);

      // Merge with custom data and options
      const finalSEO: SEOData = {
        ...baseSEO,
        ...customData,
        ...(options.title && { title: options.title }),
        ...(options.description && { description: options.description }),
        ...(options.keywords && { keywords: options.keywords }),
        ...(options.image && { image: options.image }),
      };

      // Update meta tags through SEO manager
      seoManager.updateMetaTags(section);

      // Apply custom overrides if provided
      if (customData || Object.keys(options).length > 0) {
        // Override specific meta tags
        if (finalSEO.title !== baseSEO.title) {
          document.title = finalSEO.title;
        }

        if (finalSEO.description !== baseSEO.description) {
          const meta = document.querySelector(
            'meta[name="description"]'
          ) as HTMLMetaElement;
          if (meta) meta.content = finalSEO.description;
        }

        if (finalSEO.keywords && finalSEO.keywords !== baseSEO.keywords) {
          const meta = document.querySelector(
            'meta[name="keywords"]'
          ) as HTMLMetaElement;
          if (meta) meta.content = finalSEO.keywords.join(', ');
        }
      }
    },
    [options]
  );

  /**
   * Get social sharing URLs for current or specified section
   */
  const getSharingUrls = useCallback(
    (section?: SectionId) => {
      const currentSection = section || getSectionFromPath(location.pathname);
      return seoManager.generateSharingUrls(currentSection);
    },
    [location.pathname]
  );

  /**
   * Get current SEO data
   */
  const getCurrentSEO = useCallback(() => {
    const section = getSectionFromPath(location.pathname);
    return seoManager.getSEOData(section);
  }, [location.pathname]);

  /**
   * Open social sharing window
   */
  const openShare = useCallback(
    (platform: string, section?: SectionId) => {
      setIsSharing(true);
      const urls = getSharingUrls(section);
      const url = urls[platform];

      if (url && platform !== 'copy' && platform !== 'email') {
        // Open in new window for social platforms
        const width = platform === 'twitter' ? 550 : 600;
        const height = platform === 'twitter' ? 420 : 600;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;

        window.open(
          url,
          `share-${platform}`,
          `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
        );
      } else if (platform === 'email') {
        // Open email client
        window.location.href = url;
      }

      // Reset sharing state after a short delay
      setTimeout(() => setIsSharing(false), 1000);
    },
    [getSharingUrls]
  );

  /**
   * Copy URL to clipboard
   */
  const copyToClipboard = useCallback(
    async (section?: SectionId): Promise<boolean> => {
      try {
        const urls = getSharingUrls(section);
        await navigator.clipboard.writeText(urls.copy);
        setIsSharing(true);
        setTimeout(() => setIsSharing(false), 2000);
        return true;
      } catch (error) {
        console.warn('Failed to copy to clipboard:', error);
        return false;
      }
    },
    [getSharingUrls]
  );

  return {
    updateSEO,
    getSharingUrls,
    getCurrentSEO,
    openShare,
    copyToClipboard,
    isSharing,
  };
};

/**
 * Hook for page-specific SEO that automatically updates on mount
 */
export const usePageSEO = (
  section: SectionId,
  customData?: Partial<SEOData>,
  options: Omit<UseSEOOptions, 'updateOnMount'> = {}
) => {
  const seo = useSEO({ ...options, updateOnMount: false });

  useEffect(() => {
    seo.updateSEO(section, customData);
  }, [section, customData, seo]);

  return seo;
};

/**
 * Hook for dynamic SEO updates (useful for blog posts, projects, etc.)
 */
export const useDynamicSEO = () => {
  const seo = useSEO({ updateOnMount: false });
  const [currentSEO, setCurrentSEO] = useState<SEOData | null>(null);

  const updateDynamicSEO = useCallback((data: SEOData) => {
    setCurrentSEO(data);

    // Update document meta tags manually
    document.title = data.title;

    const updateMeta = (name: string, content: string) => {
      let meta = document.querySelector(
        `meta[name="${name}"]`
      ) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    updateMeta('description', data.description);
    updateMeta('keywords', data.keywords.join(', '));

    // Update Open Graph tags
    const updateOG = (property: string, content: string) => {
      let meta = document.querySelector(
        `meta[property="${property}"]`
      ) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    updateOG('og:title', data.title);
    updateOG('og:description', data.description);
    if (data.image) {
      updateOG(
        'og:image',
        data.image.startsWith('http')
          ? data.image
          : `https://vizionscope.com${data.image}`
      );
    }
    if (data.url) {
      updateOG('og:url', data.url);
    }
  }, []);

  return {
    ...seo,
    updateDynamicSEO,
    currentSEO,
  };
};

/**
 * Extract section from pathname
 */
function getSectionFromPath(pathname: string): SectionId | undefined {
  const path = pathname.replace('/', '');
  const validSections: SectionId[] = [
    'about',
    'tech',
    'blog',
    'fashion',
    'merch',
  ];
  return validSections.includes(path as SectionId)
    ? (path as SectionId)
    : undefined;
}

/**
 * Hook for social sharing functionality only
 */
export const useSocialSharing = () => {
  const { getSharingUrls, openShare, copyToClipboard, isSharing } = useSEO({
    updateOnMount: false,
  });

  return {
    getSharingUrls,
    openShare,
    copyToClipboard,
    isSharing,
  };
};

export default useSEO;
