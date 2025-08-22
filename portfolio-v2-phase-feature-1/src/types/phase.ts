// This file exports types and interfaces related to the phase feature.

export interface Phase {
  id: string;
  name: string;
  description?: string;
  order: number;
}

export interface PhaseTransition {
  from: Phase;
  to: Phase;
  duration: number; // in milliseconds
}

export interface PhaseContextType {
  currentPhase: Phase;
  setCurrentPhase: (phase: Phase) => void;
  transitionToPhase: (phase: Phase, duration?: number) => void;
}