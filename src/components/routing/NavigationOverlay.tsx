import { SectionId } from '@/types';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTransitionStore } from '../3d/transitions';
import { useNavigationAccessibility } from '../../hooks/useAccessibility';

interface NavigationOverlayProps {
  className?: string;
}

export const NavigationOverlay: React.FC<NavigationOverlayProps> = ({
  className = '',
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { startTransition, transitionState } = useTransitionStore();
  const { announceNavigation } = useNavigationAccessibility();

  const navigationItems: Array<{
    id: SectionId;
    label: string;
    route: string;
  }> = [
    { id: 'about', label: 'About', route: '/about' },
    { id: 'tech', label: 'Tech', route: '/tech' },
    { id: 'blog', label: 'Blog', route: '/blog' },
    { id: 'fashion', label: 'Fashion', route: '/fashion' },
    { id: 'merch', label: 'Merch', route: '/merch' },
  ];

  const handleNavigation = (sectionId: SectionId, route: string) => {
    if (transitionState.isTransitioning) return;

    // Announce navigation for screen readers
    const currentSection =
      location.pathname === '/' ? '3D scene' : location.pathname.substring(1);
    announceNavigation(currentSection, sectionId);

    // If we're on the home route (3D scene), use 3D transition
    if (location.pathname === '/') {
      startTransition(sectionId, {
        duration: 2.5,
        easing: 'easeInOut',
        fadeOverlay: true,
      });
    } else {
      // Otherwise, navigate directly
      navigate(route);
    }
  };

  const handleHomeNavigation = () => {
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  const isActive = (route: string) => location.pathname === route;
  const isHome = location.pathname === '/';

  return (
    <nav
      className={`fixed top-4 right-4 z-50 ${className}`}
      aria-label="Main navigation"
      role="navigation"
    >
      <div className="bg-black bg-opacity-80 border border-cyan-400 p-4 font-mono">
        {/* Home/3D Scene Button */}
        <button
          onClick={handleHomeNavigation}
          className={`block w-full text-left mb-2 pb-2 border-b border-gray-600 transition-colors ${
            isHome ? 'text-cyan-400' : 'text-gray-300 hover:text-cyan-400'
          }`}
          aria-label="Return to 3D Portfolio home"
          aria-current={isHome ? 'page' : undefined}
        >
          3D PORTFOLIO
        </button>

        {/* Section Navigation */}
        <div className="space-y-1" role="list">
          {navigationItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id, item.route)}
              disabled={transitionState.isTransitioning}
              className={`block w-full text-left px-2 py-1 text-sm transition-colors ${
                isActive(item.route)
                  ? 'text-magenta-400 bg-magenta-900 bg-opacity-30'
                  : 'text-gray-300 hover:text-cyan-400 hover:bg-cyan-900 hover:bg-opacity-20'
              } ${
                transitionState.isTransitioning
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
              aria-label={`Navigate to ${item.label} section`}
              aria-current={isActive(item.route) ? 'page' : undefined}
              role="listitem"
            >
              {item.label.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Transition Status */}
        {transitionState.isTransitioning && (
          <div className="mt-4 pt-2 border-t border-gray-600">
            <div className="text-xs text-cyan-400 flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              TRANSITIONING...
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavigationOverlay;
