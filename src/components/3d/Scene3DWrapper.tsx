import { SectionId } from '@/types';
import React, { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Scene3D } from './Scene3D';
import { useTransitionStore } from './transitions';

interface Scene3DWrapperProps {
  className?: string;
}

export const Scene3DWrapper: React.FC<Scene3DWrapperProps> = ({
  className = '',
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { startTransition } = useTransitionStore();

  const handleObjectClick = useCallback(
    (section: string) => {
      // Map section to route
      const sectionRoutes: Record<string, string> = {
        about: '/about',
        tech: '/tech',
        blog: '/blog',
        fashion: '/fashion',
        merch: '/merch',
      };

      const targetRoute = sectionRoutes[section];

      if (targetRoute) {
        // If we're on the home route, use 3D transition
        if (location.pathname === '/') {
          startTransition(section as SectionId, {
            duration: 2.5,
            easing: 'easeInOut',
            fadeOverlay: true,
            fadeOverlayOpacity: 0.4,
          });
        } else {
          // Otherwise navigate directly
          navigate(targetRoute);
        }
      }
    },
    [startTransition, navigate, location.pathname]
  );

  // Enable LOD debugging in development mode
  const enableLODDebug = process.env.NODE_ENV === 'development';

  return (
    <Scene3D
      className={className}
      onObjectClick={handleObjectClick}
      enableLODDebug={enableLODDebug}
      performanceThreshold={45}
    />
  );
};

export default Scene3DWrapper;
