/**
 * Advanced Lighting System - Phase 10 Task 10.1
 * 
 * Complete implementation of advanced lighting and shadows including:
 * - Realistic shadow mapping with performance-aware quality settings
 * - Ambient occlusion (SAO/SSAO) for depth perception
 * - Dynamic lighting effects with time-of-day variations
 * - Cinematic three-point lighting setup
 * - Post-processing effects (bloom, FXAA)
 * - Performance optimization and hardware-aware adaptation
 */

export { LightingSystem } from './LightingSystem';
export { AmbientOcclusion, useAmbientOcclusion } from './AmbientOcclusion';
export { 
  DynamicLightingController, 
  LightingControlPanel,
  useDynamicLighting,
  type TimeOfDay,
  type LightingMode 
} from './DynamicLightingController';
export { AdvancedLighting as default } from './AdvancedLighting';

// Re-export for convenience
export { AdvancedLighting } from './AdvancedLighting';

/**
 * Usage Examples:
 * 
 * Basic Usage:
 * ```tsx
 * import AdvancedLighting from './lighting';
 * 
 * <AdvancedLighting
 *   cyberpunkMode={true}
 *   enableControls={true}
 *   initialTimeOfDay="night"
 *   initialMode="cyberpunk-cycle"
 * />
 * ```
 * 
 * Custom Configuration:
 * ```tsx
 * import { AdvancedLighting } from './lighting';
 * 
 * <AdvancedLighting
 *   enableShadows={true}
 *   enableAmbientOcclusion={true}
 *   enableBloom={true}
 *   enableDynamicEffects={true}
 *   onLightingChange={(state) => console.log(state)}
 * />
 * ```
 * 
 * Individual Components:
 * ```tsx
 * import { LightingSystem, AmbientOcclusion, DynamicLightingController } from './lighting';
 * 
 * <DynamicLightingController initialTimeOfDay="evening">
 *   {(lightingState, controls) => (
 *     <>
 *       <LightingSystem 
 *         timeOfDay={lightingState.timeOfDay}
 *         intensity={lightingState.intensity}
 *         enableShadows={true}
 *       />
 *       <AmbientOcclusion 
 *         aoType="SAO"
 *         enableBloom={true}
 *       />
 *     </>
 *   )}
 * </DynamicLightingController>
 * ```
 */