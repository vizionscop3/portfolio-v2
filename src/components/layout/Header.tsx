import { SectionId } from '@/types';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useNavigationAccessibility } from '../../hooks/useAccessibility';
import { useTransitionStore } from '../3d/transitions';

export const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { startTransition, transitionState } = useTransitionStore();
  const { announceNavigation } = useNavigationAccessibility();

  const navigationItems: Array<{
    id: SectionId;
    label: string;
    route: string;
    icon: string;
  }> = [
    { id: 'about', label: 'About', route: '/about', icon: '👤' },
    { id: 'tech', label: 'Tech', route: '/tech', icon: '💻' },
    { id: 'blog', label: 'Blog', route: '/blog', icon: '📝' },
    { id: 'fashion', label: 'Fashion', route: '/fashion', icon: '👔' },
    { id: 'merch', label: 'Merch', route: '/merch', icon: '🛍️' },
  ];

  const handleLogoClick = () => {
    if (location.pathname !== '/') {
      navigate('/');
    }
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (sectionId: SectionId, route: string) => {
    if (transitionState.isTransitioning) return;

    // Close mobile menu
    setIsMobileMenuOpen(false);

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

  const isActive = (route: string) => location.pathname === route;
  const isHome = location.pathname === '/';

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-primary via-tertiary to-primary backdrop-blur-lg border-b border-[#915EFF]/20 shadow-lg shadow-[#915EFF]/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Brand - Left side */}
            <div
              className="flex items-center space-x-4 cursor-pointer group"
              onClick={handleLogoClick}
            >
              {/* Cyberpunk-style logo with glowing effect */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-[#915EFF] rounded-lg opacity-75 group-hover:opacity-100 transition-opacity blur-sm"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-cyan-400 via-[#915EFF] to-magenta-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-all duration-300 shadow-lg shadow-[#915EFF]/50">
                  <span className="text-black font-bold text-xl tracking-wide">
                    DL
                  </span>
                </div>
              </div>

              {/* Brand text with cyberpunk styling */}
              <div className="hidden sm:block">
                <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-[#915EFF] font-mono text-xl font-bold group-hover:from-[#915EFF] group-hover:to-cyan-400 transition-all duration-300 tracking-wider">
                  DENWARD LEE
                </h1>
                <p className="text-secondary text-sm font-mono tracking-wide opacity-80">
                  &lt;FullStack Developer /&gt;
                </p>
              </div>
            </div>

            {/* Desktop Navigation - Center/Right */}
            <nav
              className="hidden lg:flex items-center space-x-2"
              aria-label="Main navigation"
            >
              {/* Home Button */}
              <button
                onClick={handleLogoClick}
                className={`relative px-4 py-2 text-sm font-mono transition-all duration-300 rounded-lg border ${
                  isHome
                    ? 'text-[#915EFF] bg-[#915EFF]/10 border-[#915EFF]/50 shadow-lg shadow-[#915EFF]/20'
                    : 'text-secondary hover:text-white border-transparent hover:border-[#915EFF]/30 hover:bg-[#915EFF]/5'
                }`}
                aria-current={isHome ? 'page' : undefined}
              >
                <span className="relative z-10">🏠 3D.PORTFOLIO</span>
                {isHome && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#915EFF]/10 to-cyan-400/10 rounded-lg"></div>
                )}
              </button>

              {/* Navigation Items */}
              {navigationItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id, item.route)}
                  disabled={transitionState.isTransitioning}
                  className={`relative px-4 py-2 text-sm font-mono transition-all duration-300 rounded-lg border group ${
                    isActive(item.route)
                      ? 'text-[#915EFF] bg-[#915EFF]/10 border-[#915EFF]/50 shadow-lg shadow-[#915EFF]/20'
                      : 'text-secondary hover:text-white border-transparent hover:border-[#915EFF]/30 hover:bg-[#915EFF]/5'
                  } ${
                    transitionState.isTransitioning
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                  aria-current={isActive(item.route) ? 'page' : undefined}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <span className="text-base group-hover:scale-110 transition-transform">
                      {item.icon}
                    </span>
                    <span className="tracking-wider">
                      {item.label.toUpperCase()}
                    </span>
                  </span>
                  {isActive(item.route) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#915EFF]/10 to-cyan-400/10 rounded-lg"></div>
                  )}
                </button>
              ))}
            </nav>

            {/* Mobile Menu Toggle - Cyberpunk Style */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden relative p-2 rounded-lg border border-[#915EFF]/30 bg-[#915EFF]/5 hover:bg-[#915EFF]/10 transition-all duration-300 group"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen ? 'true' : 'false'}
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <span
                  className={`block h-0.5 bg-gradient-to-r from-cyan-400 to-[#915EFF] transition-all duration-300 group-hover:from-[#915EFF] group-hover:to-cyan-400 ${
                    isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                  }`}
                />
                <span
                  className={`block h-0.5 bg-gradient-to-r from-cyan-400 to-[#915EFF] transition-all duration-300 group-hover:from-[#915EFF] group-hover:to-cyan-400 ${
                    isMobileMenuOpen ? 'opacity-0' : ''
                  }`}
                />
                <span
                  className={`block h-0.5 bg-gradient-to-r from-cyan-400 to-[#915EFF] transition-all duration-300 group-hover:from-[#915EFF] group-hover:to-cyan-400 ${
                    isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Transition Status Indicator - Cyberpunk Style */}
        {transitionState.isTransitioning && (
          <div className="border-t border-[#915EFF]/30 bg-gradient-to-r from-[#915EFF]/5 to-cyan-400/5">
            <div className="max-w-7xl mx-auto px-6 py-2">
              <div className="flex items-center gap-3 text-sm font-mono">
                <div className="relative">
                  <div className="w-3 h-3 bg-[#915EFF] rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-[#915EFF] rounded-full animate-ping opacity-50"></div>
                </div>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-[#915EFF] tracking-wider">
                  &gt;_ TRANSITIONING TO NEW DIMENSION...
                </span>
                <div className="flex-1 h-1 bg-tertiary rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-400 via-[#915EFF] to-magenta-500 animate-pulse rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu Dropdown - Cyberpunk Style */}
      {isMobileMenuOpen && (
        <div className="fixed top-20 left-0 right-0 z-[55] lg:hidden bg-gradient-to-b from-tertiary via-primary to-black-200 backdrop-blur-xl border-b border-[#915EFF]/30 shadow-2xl shadow-[#915EFF]/20">
          <nav
            className="max-w-7xl mx-auto px-6 py-6"
            aria-label="Mobile navigation"
          >
            {/* Mobile Home Button */}
            <button
              onClick={handleLogoClick}
              className={`w-full flex items-center gap-4 p-4 mb-3 rounded-lg border transition-all duration-300 group ${
                isHome
                  ? 'text-[#915EFF] bg-[#915EFF]/10 border-[#915EFF]/50 shadow-lg shadow-[#915EFF]/20'
                  : 'text-secondary hover:text-white border-[#915EFF]/20 hover:border-[#915EFF]/50 hover:bg-[#915EFF]/5'
              }`}
              aria-current={isHome ? 'page' : undefined}
            >
              <div className="text-2xl group-hover:scale-110 transition-transform">
                🏠
              </div>
              <div className="text-left">
                <div className="font-mono font-bold text-base tracking-wider">
                  3D.PORTFOLIO
                </div>
                <div className="text-sm opacity-70 font-mono">
                  &lt;Interactive Experience /&gt;
                </div>
              </div>
            </button>

            {/* Mobile Navigation Items */}
            <div className="space-y-2">
              <div className="text-secondary text-xs font-mono uppercase tracking-wider mb-3 opacity-60">
                &gt; Navigation.Menu
              </div>
              {navigationItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id, item.route)}
                  disabled={transitionState.isTransitioning}
                  className={`w-full flex items-center gap-4 p-4 rounded-lg border transition-all duration-300 group ${
                    isActive(item.route)
                      ? 'text-[#915EFF] bg-[#915EFF]/10 border-[#915EFF]/50 shadow-lg shadow-[#915EFF]/20'
                      : 'text-secondary hover:text-white border-[#915EFF]/20 hover:border-[#915EFF]/50 hover:bg-[#915EFF]/5'
                  } ${
                    transitionState.isTransitioning
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                  aria-current={isActive(item.route) ? 'page' : undefined}
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  <div className="text-left flex-1">
                    <div className="font-mono font-medium text-base tracking-wider">
                      {item.label.toUpperCase()}
                    </div>
                    <div className="text-xs opacity-70 font-mono">
                      &lt;{item.route.replace('/', '')} /&gt;
                    </div>
                  </div>
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
