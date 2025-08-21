import React from 'react';
import { useTransitionStore } from './store';

interface FadeOverlayProps {
  className?: string;
}

export const FadeOverlay: React.FC<FadeOverlayProps> = ({ className = '' }) => {
  const { transitionState } = useTransitionStore();

  if (!transitionState.isTransitioning || transitionState.fadeOpacity === 0) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 pointer-events-none transition-opacity duration-100 ${className}`}
      style={{
        backgroundColor: '#000000',
        opacity: transitionState.fadeOpacity,
      }}
    />
  );
};

export default FadeOverlay;
