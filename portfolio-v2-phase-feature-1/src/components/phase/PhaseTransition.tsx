import React from 'react';

interface PhaseTransitionProps {
  currentPhase: string;
  nextPhase: string;
  onTransitionEnd: () => void;
}

const PhaseTransition: React.FC<PhaseTransitionProps> = ({ currentPhase, nextPhase, onTransitionEnd }) => {
  const handleTransition = () => {
    // Logic for handling the transition effect
    // This could include animations or state updates
    onTransitionEnd();
  };

  React.useEffect(() => {
    handleTransition();
  }, [currentPhase, nextPhase]);

  return (
    <div className="phase-transition">
      <h2>Transitioning from {currentPhase} to {nextPhase}</h2>
      {/* Additional UI elements for the transition can be added here */}
    </div>
  );
};

export default PhaseTransition;