import { describe, expect, it } from 'vitest';

describe('InteractiveObject Components', () => {
  describe('Store', () => {
    it('should export store functions', async () => {
      // Test that the store module exports the expected functions
      const store = await import('../store');
      expect(store.useInteractiveStore).toBeDefined();
    });
  });

  describe('Types', () => {
    it('should export type definitions', async () => {
      // Test that types can be imported without errors
      const types = await import('../types');
      expect(types).toBeDefined();
    });
  });

  describe('Components', () => {
    it('should export Tooltip component', async () => {
      // Test that the Tooltip component can be imported
      const components = await import('../Tooltip');
      expect(components.Tooltip).toBeDefined();
    });
  });
});
