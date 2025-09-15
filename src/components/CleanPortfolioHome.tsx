import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePipWindow } from '../hooks/usePipWindow';

const CleanPortfolioHome: React.FC = () => {
  const navigate = useNavigate();
  const { activePipWindows, closePipWindow } = usePipWindow();

  // Handle section navigation
  const handleSectionClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen matte-dark-bg relative overflow-hidden">
      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section with New Content */}
        <section className="min-h-screen flex items-center justify-center px-4 relative">
          <div className="text-center max-w-6xl mx-auto">
            {/* Welcome Message */}
            <div className="mb-16">
              <h1 className="text-6xl md:text-8xl lg:text-9xl mb-8 leading-tight">
                <span className="block tt-frantz-welcome tracking-wider">
                  WELCOME TO VIZIONSCOPE
                </span>
              </h1>

              <div className="my-16"></div>

              <h2 className="text-4xl md:text-6xl lg:text-7xl mb-8 leading-tight">
                <span className="block tt-frantz-menu tracking-wider">
                  Hi I'm Lee Aulder
                </span>
              </h2>
            </div>
          </div>
        </section>
      </div>

      {/* PIP Windows */}
      {activePipWindows.map(window => (
        <React.Fragment key={window.id}>
          {/* Overlay */}
          <div
            className="pip-overlay"
            onClick={() => closePipWindow(window.id)}
          />

          {/* PIP Window */}
          <div className="pip-window">
            <div className="pip-header">
              <h2 className="pip-title">{window.title}</h2>
              <button
                className="pip-close"
                onClick={() => closePipWindow(window.id)}
              >
                ✕
              </button>
            </div>
            <div className="pip-content">{window.content}</div>
          </div>
        </React.Fragment>
      ))}

      {/* Merch Store Door */}
      <div className="merch-door" onClick={() => handleSectionClick('/merch')}>
        <div className="merch-door-icon">🚪</div>
        <div className="merch-door-text">MERCH</div>
        <div className="merch-door-text">STORE</div>
      </div>

      {/* Contact Door */}
      <div
        className="contact-door"
        onClick={() => handleSectionClick('/contact')}
      >
        <div className="contact-door-icon">📧</div>
        <div className="contact-door-text">CONTACT</div>
        <div className="contact-door-text">ME</div>
      </div>
    </div>
  );
};

export default CleanPortfolioHome;
