import React from 'react';
import { render, screen } from '@testing-library/react';
import PhaseTransition from '../../../src/components/phase/PhaseTransition';

describe('PhaseTransition Component', () => {
  test('renders without crashing', () => {
    render(<PhaseTransition />);
    const phaseTransitionElement = screen.getByTestId('phase-transition');
    expect(phaseTransitionElement).toBeInTheDocument();
  });

  test('displays the correct phase transition message', () => {
    const { rerender } = render(<PhaseTransition currentPhase="Phase 1" nextPhase="Phase 2" />);
    expect(screen.getByText(/Transitioning from Phase 1 to Phase 2/i)).toBeInTheDocument();

    rerender(<PhaseTransition currentPhase="Phase 2" nextPhase="Phase 3" />);
    expect(screen.getByText(/Transitioning from Phase 2 to Phase 3/i)).toBeInTheDocument();
  });

  test('handles phase transition correctly', () => {
    const { rerender } = render(<PhaseTransition currentPhase="Phase 1" nextPhase="Phase 2" />);
    expect(screen.getByText(/Transitioning from Phase 1 to Phase 2/i)).toBeInTheDocument();

    // Simulate a transition effect
    rerender(<PhaseTransition currentPhase="Phase 2" nextPhase="Phase 3" />);
    expect(screen.getByText(/Transitioning from Phase 2 to Phase 3/i)).toBeInTheDocument();
  });
});