import { create } from 'zustand';

interface TransitionState {
  transitionState: {
    isTransitioning: boolean;
    type: 'idle' | 'transitioning' | 'complete';
  };
  setTransitionState: (
    isTransitioning: boolean,
    type?: 'idle' | 'transitioning' | 'complete'
  ) => void;
}

export const useTransitionStore = create<TransitionState>(set => ({
  transitionState: {
    isTransitioning: false,
    type: 'idle',
  },
  setTransitionState: (isTransitioning, type = 'idle') =>
    set({
      transitionState: {
        isTransitioning,
        type: isTransitioning ? 'transitioning' : type,
      },
    }),
}));
