/**
 * Live Region Component
 *
 * Provides an accessible live region for announcing dynamic content changes
 * specifically for 3D scene interactions and animations.
 */

import React, { useEffect, useState } from 'react';

interface LiveRegionProps {
  politeness?: 'polite' | 'assertive' | 'off';
  atomic?: boolean;
  relevant?: 'additions' | 'removals' | 'text' | 'all';
  children?: React.ReactNode;
  className?: string;
}

export const LiveRegion: React.FC<LiveRegionProps> = ({
  politeness = 'polite',
  atomic = true,
  relevant = 'all',
  children,
  className = 'sr-only',
}) => {
  return (
    <div
      aria-live={politeness}
      aria-atomic={atomic}
      aria-relevant={relevant}
      className={className}
      role={politeness === 'assertive' ? 'alert' : 'status'}
    >
      {children}
    </div>
  );
};

interface Scene3DAnnouncerProps {
  sceneState?: {
    currentSection?: string;
    isLoading?: boolean;
    objectCount?: number;
    performanceMode?: string;
  };
}

export const Scene3DAnnouncer: React.FC<Scene3DAnnouncerProps> = ({
  sceneState,
}) => {
  const [announcement, setAnnouncement] = useState<string>('');
  const [lastSection, setLastSection] = useState<string>('');

  useEffect(() => {
    if (
      sceneState?.currentSection &&
      sceneState.currentSection !== lastSection
    ) {
      setLastSection(sceneState.currentSection);

      const sectionDescriptions: Record<string, string> = {
        about:
          'About section loaded. Audio engineering station with personal information and background.',
        tech: 'Tech section loaded. Holographic computer displaying technical skills and projects.',
        blog: 'Blog section loaded. Digital codex with floating pages of articles and posts.',
        fashion:
          'Fashion section loaded. Neon wardrobe pod showcasing creative gallery and style.',
        merch:
          'Merch section loaded. Holographic merchandise display with products and pricing.',
      };

      const description =
        sectionDescriptions[sceneState.currentSection] ||
        `${sceneState.currentSection} section loaded with interactive 3D objects.`;

      setAnnouncement(description);

      // Clear announcement after reading
      setTimeout(() => setAnnouncement(''), 3000);
    }
  }, [sceneState?.currentSection, lastSection]);

  useEffect(() => {
    if (sceneState?.isLoading) {
      setAnnouncement('Loading 3D scene assets, please wait...');
    }
  }, [sceneState?.isLoading]);

  useEffect(() => {
    if (sceneState?.performanceMode) {
      setAnnouncement(
        `Performance mode changed to ${sceneState.performanceMode} quality for optimal experience.`
      );
      setTimeout(() => setAnnouncement(''), 2000);
    }
  }, [sceneState?.performanceMode]);

  return <LiveRegion politeness="polite">{announcement}</LiveRegion>;
};

export default LiveRegion;
