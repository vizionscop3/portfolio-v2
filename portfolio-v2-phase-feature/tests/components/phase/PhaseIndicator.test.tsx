import React from 'react';
import { render, screen } from '@testing-library/react';
import PhaseIndicator from '../../../src/components/phase/PhaseIndicator';

describe('PhaseIndicator', () => {
  it('renders the current phase correctly', () => {
    const currentPhase = 'Phase 1';
    render(<PhaseIndicator currentPhase={currentPhase} />);
    
    const phaseElement = screen.getByText(/Phase 1/i);
    expect(phaseElement).toBeInTheDocument();
  });

  it('displays a default message when no phase is provided', () => {
    render(<PhaseIndicator />);
    
    const defaultElement = screen.getByText(/No phase selected/i);
    expect(defaultElement).toBeInTheDocument();
  });

  // Add more tests as needed
});