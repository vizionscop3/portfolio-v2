import React from 'react';

interface PhaseIndicatorProps {
  currentPhase: string;
  phases?: string[];
}

export const PhaseIndicator: React.FC<PhaseIndicatorProps> = ({
  currentPhase,
  phases = [],
}) => {
  // Validate phases is an array before using .map
  const validPhases = Array.isArray(phases) ? phases : [];

  return (
    <div className="phase-indicator">
      {validPhases.map((phase, index) => (
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
