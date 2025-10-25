import { useContext } from 'react';
import {
  PipWindowContext,
  PipWindowContextType,
} from '../../app/providers/contexts/PipWindowContext';

export const usePipWindow = (): PipWindowContextType => {
  const context = useContext(PipWindowContext);
  if (!context) {
    throw new Error('usePipWindow must be used within a PipWindowProvider');
  }
  return context;
};
