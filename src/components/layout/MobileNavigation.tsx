/**
 * Mobile Navigation Component
 *
 * Provides touch-friendly navigation for mobile devices with
 * large touch targets and accessibility support.
 */

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMobileUI } from '../../shared/hooks/useMobile';

interface MobileNavigationProps {
  isVisible?: boolean;
  onNavigate?: (section: string) => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  isVisible = true,
  onNavigate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const uiSettings = useMobileUI();

  const navigationItems = [
    { id: 'about', label: 'About', path: '/about', icon: '👨‍💻' },
    { id: 'tech', label: 'Tech Stack', path: '/tech', icon: '⚡' },
    { id: 'blog', label: 'Blog', path: '/blog', icon: '📝' },
    { id: 'merch', label: 'Merch', path: '/merch', icon: '🛒' },
  ];

  const handleNavigation = (item: (typeof navigationItems)[0]) => {
    if (onNavigate) {
      onNavigate(item.id);
    } else {
      navigate(item.path);
    }
    setIsOpen(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 border-t border-cyan-400/30 backdrop-blur-md">
      {/* Main Navigation Bar */}
      <div
        className="flex items-center justify-between p-4"
        style={{
          paddingBottom: `${uiSettings.safeAreaBottom + 16}px`,
          minHeight: `${uiSettings.minTouchTarget}px`,
        }}
      >
        {/* Home Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center justify-center w-12 h-12 bg-cyan-400/20 border border-cyan-400 text-cyan-400 rounded-full backdrop-blur hover:bg-cyan-400/30 transition-colors"
          aria-label="Home"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </button>

        {/* Quick Access Navigation */}
        <div className="flex-1 flex justify-center space-x-2 mx-4">
          {navigationItems.slice(0, 3).map(item => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item)}
              className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-cyan-400/30 text-cyan-400'
                  : 'bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400/20'
              }`}
              style={{ minHeight: `${uiSettings.minTouchTarget}px` }}
              aria-label={item.label}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-xs font-mono mt-1">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-12 h-12 bg-magenta-500/20 border border-magenta-500 text-magenta-400 rounded-full backdrop-blur hover:bg-magenta-500/30 transition-colors"
          aria-label="Menu"
        >
          <svg
            className={`w-6 h-6 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isOpen ? (
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

      {/* Expanded Menu */}
      {isOpen && (
        <div className="bg-black/95 border-t border-cyan-400/20 backdrop-blur-md">
          <div
            className="p-4 space-y-2"
            style={{ paddingBottom: `${uiSettings.safeAreaBottom + 16}px` }}
          >
            {navigationItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className={`w-full flex items-center space-x-4 p-4 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-cyan-400/30 text-cyan-400 border border-cyan-400/50'
                    : 'bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400/20 border border-transparent'
                }`}
                style={{ minHeight: `${uiSettings.minTouchTarget}px` }}
              >
                <span className="text-2xl">{item.icon}</span>
                <div className="flex-1 text-left">
                  <div className="font-mono font-medium">{item.label}</div>
                  <div className="text-xs text-cyan-300/70">{item.path}</div>
                </div>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Performance Indicator for Mobile */}
      <div className="absolute top-0 left-4 transform -translate-y-full">
        <MobilePerformanceIndicator />
      </div>
    </div>
  );
};

/**
 * Mobile Performance Indicator Component
 */
const MobilePerformanceIndicator: React.FC = () => {
  const fps = useFPS();
  const [mode] = usePerformanceMode();

  const getIndicatorColor = () => {
    if (fps >= 50) return 'text-green-400';
    if (fps >= 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getModeColor = () => {
    switch (mode) {
      case 'high':
        return 'text-cyan-400';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="bg-black/80 border border-cyan-400/30 rounded-t-lg px-3 py-1 backdrop-blur">
      <div className="flex items-center space-x-2 text-xs font-mono">
        <span className={getIndicatorColor()}>{fps} FPS</span>
        <span className="text-cyan-400/50">|</span>
        <span className={getModeColor()}>{mode.toUpperCase()}</span>
      </div>
    </div>
  );
};

// Import required hooks at the top level
import {
  useFPS,
  usePerformanceMode,
} from '../../shared/hooks/usePerformanceMonitor';

export default MobileNavigation;
