import { SectionId } from '@/types';
import React, { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useNavigationAccessibility } from '../../hooks/useAccessibility';
import { useTransitionStore } from '../3d/transitions';
import Portfolio3D from '../Portfolio3D'; // 3D Interactive Room
import {
  AboutSection,
  BlogSection,
  FashionSection,
  MerchSection,
  TechSection,
} from '../sections';

interface PortfolioRouterProps {
  className?: string;
}

export const PortfolioRouter: React.FC<PortfolioRouterProps> = ({
  className = '',
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { transitionState, startTransition } = useTransitionStore();
  const { announceNavigation } = useNavigationAccessibility();

  // Map routes to section IDs
  const routeToSection = React.useMemo(
    (): Record<string, SectionId> => ({
      '/about': 'about',
      '/tech': 'tech',
      '/blog': 'blog',
      '/fashion': 'fashion',
      '/merch': 'merch',
    }),
    []
  );

  const sectionToRoute = React.useMemo(
    (): Record<SectionId, string> => ({
      about: '/about',
      tech: '/tech',
      blog: '/blog',
      fashion: '/fashion',
      merch: '/merch',
    }),
    []
  );

  // Handle URL changes and sync with 3D scene
  useEffect(() => {
    const currentSection = routeToSection[location.pathname];

    // If we're on a section route and not currently transitioning to it
    if (currentSection && transitionState.currentSection !== currentSection) {
      // Only start transition if we're not already transitioning to this section
      if (transitionState.targetSection !== currentSection) {
        // Announce navigation for screen readers
        const fromSection = transitionState.currentSection || 'home';
        announceNavigation(fromSection, currentSection);

        startTransition(currentSection, {
          duration: 2.0,
          easing: 'easeInOut',
          fadeOverlay: true,
        });
      }
    }
  }, [
    location.pathname,
    transitionState,
    startTransition,
    routeToSection,
    announceNavigation,
  ]);

  // Listen for 3D scene transitions and update URL
  useEffect(() => {
    const unsubscribe = useTransitionStore.subscribe(
      state => state.transitionState.currentSection,
      currentSection => {
        if (currentSection) {
          const targetRoute = sectionToRoute[currentSection];
          if (targetRoute && location.pathname !== targetRoute) {
            // Update URL without triggering navigation
            navigate(targetRoute, { replace: true });
          }
        }
      }
    );

    return unsubscribe;
  }, [navigate, location.pathname, sectionToRoute]);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const currentSection = routeToSection[location.pathname];
      if (currentSection) {
        startTransition(currentSection, {
          duration: 1.5,
          easing: 'easeInOut',
        });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [location.pathname, routeToSection, startTransition]);

  return (
    <div className={className}>
      <Routes>
        {/* 3D Interactive Room (Home) */}
        <Route path="/" element={<Portfolio3D />} />

        {/* Section Routes */}
        <Route path="/about" element={<AboutSection />} />
        <Route path="/tech" element={<TechSection />} />
        <Route path="/blog" element={<BlogSection />} />
        <Route path="/fashion" element={<FashionSection />} />
        <Route path="/merch" element={<MerchSection />} />

        {/* Fallback to 3D interactive room */}
        <Route path="*" element={<Portfolio3D />} />
      </Routes>
    </div>
  );
};

export default PortfolioRouter;
