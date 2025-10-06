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

  // Contact form state
  const [contactForm, setContactForm] = useState({
    fullName: '',
    phoneNumber: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');

  // Form handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate random success/error for demo
      const success = Math.random() > 0.3; // 70% success rate for demo

      if (success) {
        setSubmitStatus('success');
        // Reset form after success
        setTimeout(() => {
          setContactForm({ fullName: '', phoneNumber: '', message: '' });
          setSubmitStatus('idle');
        }, 3000);
      } else {
        setSubmitStatus('error');
        setTimeout(() => setSubmitStatus('idle'), 5000);
      }
    } catch (error) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Content for PIP windows - Ready for layered headers
  const getAboutContent = () => (
    <div className="space-y-8 px-4 py-4">
      {/* Resume Button - At the top */}
      <div className="flex justify-center items-center">
        <button
          className="group relative px-8 py-4 bg-[#580259] border-2 border-[#8A038C] text-[#00F7ED] font-bold text-2xl rounded-lg hover:bg-[#8A038C] hover:border-[#00F7ED] active:scale-95 transition-all duration-300 transform shadow-lg hover:shadow-[0_0_20px_rgba(138,3,140,0.5)] min-w-[250px] font-tt-frantz tracking-wider"
          onClick={() => {
            window.open(
              'https://docs.google.com/document/d/1QexB73csLCFtOaUyQvChEqIBZZFvtjCGG54ddGXkhTU/edit?usp=sharing',
              '_blank',
              'noopener,noreferrer'
            );
          }}
        >
          <span className="relative z-10">VIEW RESUME</span>
        </button>
      </div>

      {/* About Vizionscope Content */}
      <div className="text-center space-y-6">
        <h3 className="text-4xl font-bold text-[#00F7ED] font-tt-frantz tracking-wider">
          ABOUT VIZIONSCOPE
        </h3>
        <div className="text-[#00F7ED] text-lg leading-relaxed max-w-3xl mx-auto font-tt-frantz">
          <p className="mb-4 text-[#00F7ED]">
            Welcome to VIZIONSCOPE - a cutting-edge portfolio showcasing
            innovative web development, creative design, and technical
            excellence.
          </p>
          <p className="mb-4 text-[#00F7ED]">
            I'm Lee Aulder, a passionate developer dedicated to creating
            immersive digital experiences that blend modern technology with
            artistic vision.
          </p>
          <p className="text-[#00F7ED]">
            Explore my work, discover my technical stack, and let's collaborate
            on your next project.
          </p>
        </div>
      </div>
    </div>
  );

  const getTechContent = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h3
          className="tt-frantz-layered text-6xl font-bold mb-8"
          data-text="TECH STACK"
        >
          TECH STACK
        </h3>
      </div>
      {/* Content area ready for expansion */}
      <div className="text-center text-[#00F7ED] text-2xl">
        Content coming soon...
      </div>
    </div>
  );

  const getBlogContent = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h3
          className="tt-frantz-layered text-6xl font-bold mb-8"
          data-text="BLOG POSTS"
        >
          BLOG POSTS
        </h3>
      </div>
      {/* Content area ready for expansion */}
      <div className="text-center text-[#00F7ED] text-2xl">
        Content coming soon...
      </div>
    </div>
  );

  const getContactContent = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h3
          className="tt-frantz-layered text-5xl font-bold mb-8"
          data-text="INTERESTED IN WORKING TOGETHER?&#10;LEAVE YOUR INFORMATION OR SCHEDULE A MEETING."
        >
          INTERESTED IN WORKING TOGETHER?
          <br />
          LEAVE YOUR INFORMATION OR SCHEDULE A MEETING.
        </h3>
      </div>

      <form className="space-y-6" onSubmit={handleContactSubmit}>
        <div>
          <label
            htmlFor="fullName"
            className="block text-[#00F7ED] font-bold mb-2 text-4xl"
          >
            FULL NAME
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={contactForm.fullName}
            onChange={handleInputChange}
            disabled={isSubmitting}
            className="w-full p-4 bg-black/50 border-2 border-[#8A038C] text-[#00F7ED] text-3xl font-tt-frantz font-bold italic rounded-lg focus:border-[#00F7ED] focus:outline-none placeholder-gray-500 disabled:opacity-50"
            placeholder="Enter your full name..."
            required
          />
        </div>

        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-[#00F7ED] font-bold mb-2 text-4xl"
          >
            PHONE NUMBER
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={contactForm.phoneNumber}
            onChange={handleInputChange}
            disabled={isSubmitting}
            className="w-full p-4 bg-black/50 border-2 border-[#8A038C] text-[#00F7ED] text-3xl font-tt-frantz font-bold italic rounded-lg focus:border-[#00F7ED] focus:outline-none placeholder-gray-500 disabled:opacity-50"
            placeholder="Enter your phone number..."
            required
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-[#00F7ED] font-bold mb-2 text-4xl"
          >
            BRIEF MESSAGE
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={contactForm.message}
            onChange={handleInputChange}
            disabled={isSubmitting}
            className="w-full p-4 bg-black/50 border-2 border-[#8A038C] text-[#00F7ED] text-3xl font-tt-frantz font-bold italic rounded-lg focus:border-[#00F7ED] focus:outline-none placeholder-gray-500 resize-none disabled:opacity-50"
            placeholder="Tell us about your project or reason for reaching out..."
            required
          />
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-10 py-4 bg-[#8A038C] text-[#00F7ED] font-bold text-2xl rounded-lg hover:bg-[#6B0269] active:bg-[#4A0147] active:scale-95 transition-all duration-150 transform shadow-lg hover:shadow-xl active:shadow-inner disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                SENDING...
              </span>
            ) : (
              'SEND MESSAGE'
            )}
          </button>
        </div>

        {/* Status Messages */}
        {submitStatus === 'success' && (
          <div className="p-4 bg-green-500/20 border-2 border-green-500/50 rounded-lg text-green-400 text-center text-xl font-bold">
            ✅ MESSAGE SENT SUCCESSFULLY!
            <div className="text-lg mt-2">
              I'll get back to you within 24 hours.
            </div>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="p-4 bg-red-500/20 border-2 border-red-500/50 rounded-lg text-red-400 text-center text-xl font-bold">
            ❌ FAILED TO SEND MESSAGE
            <div className="text-lg mt-2">
              Please try again or contact me directly.
            </div>
          </div>
        )}
      </form>
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
              aria-expanded={isMobileMenuOpen}
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
