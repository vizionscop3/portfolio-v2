// This file contains utility functions for managing phase-related data and logic.

export interface Phase {
  id: string;
  name: string;
  description?: string;
  order: number;
}

export const phases: Phase[] = [
  { id: 'phase1', name: 'Phase 1', description: 'Initial phase', order: 1 },
  { id: 'phase2', name: 'Phase 2', description: 'Development phase', order: 2 },
  { id: 'phase3', name: 'Phase 3', description: 'Testing phase', order: 3 },
  { id: 'phase4', name: 'Phase 4', description: 'Deployment phase', order: 4 },
];

export const getPhaseById = (id: string): Phase | undefined => {
  return phases.find(phase => phase.id === id);
};

export const getNextPhase = (currentPhaseId: string): Phase | undefined => {
  const currentPhase = getPhaseById(currentPhaseId);
  if (!currentPhase) return undefined;

  const nextPhase = phases.find(phase => phase.order === currentPhase.order + 1);
  return nextPhase;
};

export const getPreviousPhase = (currentPhaseId: string): Phase | undefined => {
  const currentPhase = getPhaseById(currentPhaseId);
  if (!currentPhase) return undefined;

  const previousPhase = phases.find(phase => phase.order === currentPhase.order - 1);
  return previousPhase;
};