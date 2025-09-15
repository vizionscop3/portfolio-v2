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

  // Content for PIP windows
  const getAboutContent = () => (
    <div>
      <h3 className="text-3xl mb-4 tt-frantz-menu">About VIZIONSCOPE</h3>
      <div className="grid grid-cols-2 gap-8">
        <div>
          <p className="mb-4 text-lg leading-relaxed">
            Welcome to VIZIONSCOPE - where innovation meets creativity. I'm Lee
            Aulder, a passionate fullstack developer dedicated to crafting
            exceptional digital experiences.
          </p>
          <p className="text-lg leading-relaxed">
            Let's build something amazing together.
          </p>
        </div>
        <div>
          <p className="text-lg leading-relaxed">
            With expertise in modern web technologies, I bring visions to life
            through clean code, stunning design, and user-centered solutions.
          </p>
        </div>
      </div>
    </div>
  );

  const getTechContent = () => (
    <div>
      <h3 className="text-3xl mb-4 tt-frantz-menu">Tech Stack</h3>
      <div className="grid grid-cols-4 gap-6">
        <div>
          <h4 className="text-xl mb-3 text-cyan-400">Frontend</h4>
          <ul className="text-base space-y-2">
            <li>• React</li>
            <li>• TypeScript</li>
            <li>• Next.js</li>
            <li>• Tailwind CSS</li>
          </ul>
        </div>
        <div>
          <h4 className="text-xl mb-3 text-cyan-400">Backend</h4>
          <ul className="text-base space-y-2">
            <li>• Node.js</li>
            <li>• PostgreSQL</li>
            <li>• AWS</li>
            <li>• Docker</li>
          </ul>
        </div>
        <div>
          <h4 className="text-xl mb-3 text-cyan-400">3D & Graphics</h4>
          <ul className="text-base space-y-2">
            <li>• Three.js</li>
            <li>• WebGL</li>
            <li>• Blender</li>
            <li>• GSAP</li>
          </ul>
        </div>
        <div>
          <h4 className="text-xl mb-3 text-cyan-400">Tools</h4>
          <ul className="text-base space-y-2">
            <li>• Git</li>
            <li>• Vite</li>
            <li>• VS Code</li>
            <li>• Figma</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const getBlogContent = () => (
    <div>
      <h3 className="text-3xl mb-4 tt-frantz-menu">Latest Posts</h3>
      <div className="grid grid-cols-3 gap-6">
        <div className="border-l-4 border-cyan-400 pl-4">
          <h4 className="text-lg mb-2">Building Modern Web Apps</h4>
          <p className="text-base text-gray-300 leading-relaxed">
            Exploring the latest in React and TypeScript development...
          </p>
        </div>
        <div className="border-l-4 border-cyan-400 pl-4">
          <h4 className="text-lg mb-2">The Future of UI/UX</h4>
          <p className="text-base text-gray-300 leading-relaxed">
            How design trends are shaping user experiences...
          </p>
        </div>
        <div className="border-l-4 border-cyan-400 pl-4">
          <h4 className="text-lg mb-2">Performance Optimization</h4>
          <p className="text-base text-gray-300 leading-relaxed">
            Best practices for lightning-fast web applications...
          </p>
        </div>
      </div>
    </div>
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
      // Navigate to full contact page
      navigate('/contact');
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
