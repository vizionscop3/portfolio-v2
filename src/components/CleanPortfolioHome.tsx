import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { usePipWindow } from '../shared/hooks/usePipWindow';
import { MerchStorePIP } from './merch/MerchStorePIP';

const CleanPortfolioHome: React.FC = () => {
  const navigate = useNavigate();
  const { activePipWindows, closePipWindow, openPipWindow } = usePipWindow();
  const [isDoorOpening, setIsDoorOpening] = useState(false);
  const [isDoorOpen, setIsDoorOpen] = useState(false);
  const [isDoorReturning, setIsDoorReturning] = useState(false);
  const [cartItems, setCartItems] = useState<{ [key: string]: number }>({});

  const getTotalItems = () => {
    return Object.values(cartItems).reduce((sum, count) => sum + count, 0);
  };

  // Handle door opening animation and PIP window
  const handleDoorClick = () => {
    if (isDoorOpening || isDoorOpen) return;

    setIsDoorOpening(true);

    // Start door opening animation
    setTimeout(() => {
      // Open merch store PIP window
      openPipWindow(
        'merch-store',
        'Merch Store',
        <MerchStorePIP
          onClose={() => {
            closePipWindow('merch-store');
          }}
          onMoreClick={() => {
            closePipWindow('merch-store');
            navigate('/merch');
          }}
          cartItems={cartItems}
          setCartItems={setCartItems}
        />
      );

      // Start door return animation after PIP window opens
      setTimeout(() => {
        setIsDoorOpening(false);
        setIsDoorOpen(false);
        setIsDoorReturning(true);

        // Reset returning state after animation completes
        setTimeout(() => {
          setIsDoorReturning(false);
        }, 800); // Match doorReturn animation duration
      }, 500); // Small delay to let PIP window appear first
    }, 1500); // Match door animation duration
  };

  return (
    <div className="min-h-screen matte-dark-bg relative overflow-hidden">
      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section with New Content */}
        <section className="min-h-screen flex items-start justify-center px-4 relative pt-20">
          <div className="text-center max-w-6xl mx-auto">
            {/* Welcome Message */}
            <div className="mb-8">
              <h1 className="text-6xl md:text-8xl lg:text-9xl mb-8 leading-tight">
                <span className="block tt-frantz-welcome tracking-wider">
                  WELCOME TO VIZIONSCOPE
                </span>
              </h1>

              <div className="my-8"></div>

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
              <div className="pip-header-controls">
                {window.id === 'merch-store' && (
                  <div className="cart-indicator">
                    <ShoppingCart size={16} />
                    {getTotalItems() > 0 && (
                      <span className="cart-count">{getTotalItems()}</span>
                    )}
                  </div>
                )}
                <button
                  className="pip-close"
                  onClick={() => closePipWindow(window.id)}
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="pip-content">{window.content}</div>
          </div>
        </React.Fragment>
      ))}

      {/* Gothic Merch Store Door */}
      <div
        className={`merch-door ${isDoorOpening ? 'opening' : ''} ${isDoorOpen ? 'open' : ''} ${isDoorReturning ? 'returning' : ''}`}
        onClick={handleDoorClick}
      >
        {/* Door knob */}
        <div className="door-knob"></div>

        {/* Gothic decorative elements */}
        <div className="gothic-ornament">
          <div className="crescent-moon">☽</div>
          <div className="stars">
            <span className="star star-1">✦</span>
            <span className="star star-2">✧</span>
            <span className="star star-3">✦</span>
            <span className="star star-4">✧</span>
            <span className="star star-5">✦</span>
          </div>
        </div>
        <div className="merch-door-text">MERCH</div>
        <div className="merch-door-text">STORE</div>
      </div>
    </div>
  );
};

export default CleanPortfolioHome;
