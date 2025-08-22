import React from 'react';

interface PhaseIndicatorProps {
  currentPhase: string;
  phases: string[];
}

export const PhaseIndicator: React.FC<PhaseIndicatorProps> = ({ currentPhase, phases }) => {
  return (
    <div className="phase-indicator">
      {phases.map((phase, index) => (
        <div
          key={index}
          className={`phase ${phase === currentPhase ? 'active' : ''}`}
        >
          {phase}
        </div>
      ))}
    </div>
  );
};

export default PhaseIndicator;