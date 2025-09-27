import { SectionId } from '@/types';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useNavigationAccessibility } from '../../hooks/useAccessibility';
import { usePipWindow } from '../../hooks/usePipWindow';
import { useTransitionStore } from '../../hooks/useTransitionStore';

export const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { transitionState } = useTransitionStore();
  const { announceNavigation } = useNavigationAccessibility();
  const { openPipWindow } = usePipWindow();

  // Content for PIP windows - Empty for fresh start
  const getAboutContent = () => (
    <div>{/* Empty content - ready for new vision */}</div>
  );

  const getTechContent = () => (
    <div>{/* Empty content - ready for new vision */}</div>
  );

  const getBlogContent = () => (
    <div>{/* Empty content - ready for new vision */}</div>
  );

  const getContactContent = () => (
    <div>{/* Empty content - ready for new vision */}</div>
  );

  const navigationItems: Array<{
    id: SectionId;
    label: string;
    route: string;
    icon: string;
  }> = [
    { id: 'about', label: 'About', route: '/about', icon: '👤' },
    { id: 'tech', label: 'Tech', route: '/tech', icon: '💻' },
    { id: 'blog', label: 'Blog', route: '/blog', icon: '📝' },
    { id: 'contact', label: 'Contact', route: '/contact', icon: '📧' },
  ];

  const handleLogoClick = () => {
    if (location.pathname !== '/') {
      navigate('/');
    }
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (sectionId: SectionId) => {
    setIsMobileMenuOpen(false);

    // Handle PIP windows for About, Tech, Blog
    if (sectionId === 'about') {
      openPipWindow('about', 'About VIZIONSCOPE', getAboutContent());
    } else if (sectionId === 'tech') {
      openPipWindow('tech', 'Tech Stack', getTechContent());
    } else if (sectionId === 'blog') {
      openPipWindow('blog', 'Blog Posts', getBlogContent());
    } else if (sectionId === 'contact') {
      // Open contact PIP window instead of navigating
      openPipWindow('contact', 'Contact VIZIONSCOPE', getContactContent());
    }

    // Announce for accessibility
    const currentSection =
      location.pathname === '/' ? '3D scene' : location.pathname.substring(1);
    announceNavigation(currentSection, sectionId);
  };

  const isActive = (route: string) => location.pathname === route;

  return (
    <>
      <header className="bg-brand-black border-b border-brand-dark/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center space-x-4 cursor-pointer group"
              onClick={handleLogoClick}
            >
              <div className="relative">
                <div className="relative w-12 h-12 bg-brand-accent rounded-lg flex items-center justify-center group-hover:scale-105 transition-all duration-300">
                  <span className="text-brand-primary font-bold text-xl tracking-wide font-tt-frantz">
                    VS
                  </span>
                </div>
              </div>

              <div className="hidden sm:block">
                <h1 className="tt-frantz-welcome tt-frantz-header-logo font-bold group-hover:opacity-90 transition-all duration-300 tracking-wider">
                  VIZIONSCOPE
                </h1>
              </div>
            </div>

            <nav
              className="hidden lg:flex items-center space-x-2"
              aria-label="Main navigation"
            >
              {navigationItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`relative px-4 py-2 transition-all duration-300 rounded-lg border group ${
                    isActive(item.route)
                      ? 'border-brand-accent/50 bg-brand-accent/10'
                      : 'border-transparent hover:border-brand-accent/30'
                  }`}
                  aria-current={isActive(item.route) ? 'page' : undefined}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <span className="tracking-wider tt-frantz-menu tt-frantz-header-menu">
                      {item.label.toUpperCase()}
                    </span>
                  </span>
                </button>
              ))}
            </nav>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden relative p-2 rounded-lg border border-brand-accent/30 bg-brand-accent/5 hover:bg-brand-accent/10 transition-all duration-300 group"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen ? 'true' : 'false'}
            >
              <svg
                className={`w-6 h-6 text-white transition-transform ${
                  isMobileMenuOpen ? 'rotate-90' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {transitionState.isTransitioning && (
          <div className="border-t border-brand-accent/30 bg-gradient-to-r from-brand-accent/5 to-brand-primary/5">
            <div className="max-w-7xl mx-auto px-6 py-2">
              <div className="flex items-center gap-3 text-sm font-tt-frantz">
                <div className="relative">
                  <div className="w-3 h-3 bg-brand-accent rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-brand-accent rounded-full animate-ping opacity-50"></div>
                </div>
                <span className="text-white tracking-wider">
                  &gt;_ TRANSITIONING TO NEW DIMENSION...
                </span>
                <div className="flex-1 h-1 bg-brand-dark rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary animate-pulse rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {isMobileMenuOpen && (
        <div className="fixed top-20 left-0 right-0 z-[55] lg:hidden bg-brand-black border-b border-brand-dark/30">
          <nav
            className="max-w-7xl mx-auto px-6 py-6"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col space-y-4">
              {navigationItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`text-left p-4 transition-all duration-300 rounded-lg border ${
                    isActive(item.route)
                      ? 'border-brand-accent/50 bg-brand-accent/10'
                      : 'border-brand-dark/30 hover:border-brand-accent/30'
                  }`}
                  aria-current={isActive(item.route) ? 'page' : undefined}
                >
                  <span className="flex items-center gap-3">
                    <span className="tracking-wider tt-frantz-menu tt-frantz-header-menu">
                      {item.label.toUpperCase()}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;
