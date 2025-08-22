import { getPhaseData, calculatePhaseProgress } from '../../src/utils/phaseManager';

describe('Phase Manager Utility Functions', () => {
  describe('getPhaseData', () => {
    it('should return correct phase data for a given phase ID', () => {
      const phaseId = 'phase1';
      const expectedData = { id: 'phase1', name: 'Phase 1', description: 'Description for Phase 1' };
      const result = getPhaseData(phaseId);
      expect(result).toEqual(expectedData);
    });

    it('should return undefined for an invalid phase ID', () => {
      const phaseId = 'invalidPhase';
      const result = getPhaseData(phaseId);
      expect(result).toBeUndefined();
    });
  });

  describe('calculatePhaseProgress', () => {
    it('should calculate progress correctly based on current and total phases', () => {
      const currentPhase = 2;
      const totalPhases = 5;
      const expectedProgress = 40; // 2 out of 5 phases
      const result = calculatePhaseProgress(currentPhase, totalPhases);
      expect(result).toBe(expectedProgress);
    });

    it('should return 100% if current phase equals total phases', () => {
      const currentPhase = 5;
      const totalPhases = 5;
      const expectedProgress = 100;
      const result = calculatePhaseProgress(currentPhase, totalPhases);
      expect(result).toBe(expectedProgress);
    });

    it('should return 0% if current phase is 0', () => {
      const currentPhase = 0;
      const totalPhases = 5;
      const expectedProgress = 0;
      const result = calculatePhaseProgress(currentPhase, totalPhases);
      expect(result).toBe(expectedProgress);
    });
  });
});