import React, { useMemo } from 'react';
import { 
  EffectComposer, 
  Bloom, 
  SSAO,
  FXAA,
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { infrastructure3D } from '../Infrastructure3D';

interface AmbientOcclusionProps {
  aoType?: 'SSAO' | 'none';
  aoIntensity?: number;
  enableBloom?: boolean;
  bloomIntensity?: number;
  enableFXAA?: boolean;
  enabled?: boolean;
}

/**
 * Advanced Ambient Occlusion and Post-Processing Effects
 * Uses @react-three/postprocessing for better React Three Fiber integration
 */
export const AmbientOcclusion: React.FC<AmbientOcclusionProps> = ({
  aoType = 'SSAO',
  aoIntensity = 0.5,
  enableBloom = true,
  bloomIntensity = 0.8,
  enableFXAA = true,
  enabled = true,
}) => {
  const performanceProfile = infrastructure3D.getPerformanceProfile();

  // Performance-based configuration
  const effectConfig = useMemo(() => {
    if (!performanceProfile || !enabled) {
      return {
        enableAO: false,
        enableBloom: false,
        enableFXAA: false,
      };
    }

    const { tier, enablePostProcessing } = performanceProfile;

    if (!enablePostProcessing) {
      return {
        enableAO: false,
        enableBloom: false,
        enableFXAA: false,
      };
    }

    switch (tier) {
      case 'high':
        return {
          enableAO: aoType === 'SSAO',
          enableBloom: enableBloom,
          enableFXAA: enableFXAA,
          aoSamples: 32,
          aoRadius: 16,
          aoIntensity: aoIntensity,
          bloomThreshold: 0.85,
          bloomStrength: bloomIntensity,
          bloomRadius: 0.4,
          bloomMipmapBlur: true,
        };
      case 'medium':
        return {
          enableAO: aoType === 'SSAO',
          enableBloom: enableBloom,
          enableFXAA: enableFXAA,
          aoSamples: 16,
          aoRadius: 12,
          aoIntensity: aoIntensity * 0.8,
          bloomThreshold: 0.9,
          bloomStrength: bloomIntensity * 0.8,
          bloomRadius: 0.3,
          bloomMipmapBlur: false,
        };
      case 'low':
        return {
          enableAO: false,
          enableBloom: enableBloom,
          enableFXAA: enableFXAA,
          aoSamples: 8,
          aoRadius: 8,
          aoIntensity: aoIntensity * 0.5,
          bloomThreshold: 1.0,
          bloomStrength: bloomIntensity * 0.6,
          bloomRadius: 0.2,
          bloomMipmapBlur: false,
        };
      default:
        return {
          enableAO: false,
          enableBloom: false,
          enableFXAA: false,
        };
    }
  }, [performanceProfile, enabled, aoType, aoIntensity, enableBloom, bloomIntensity, enableFXAA]);

  // Don't render if no effects are enabled
  if (!effectConfig.enableAO && !effectConfig.enableBloom && !effectConfig.enableFXAA) {
    return null;
  }

  // Create effects array
  const effects = [];
  
  if (effectConfig.enableAO) {
    effects.push(
      <SSAO
        key="ssao"
        samples={effectConfig.aoSamples}
        radius={effectConfig.aoRadius}
        intensity={effectConfig.aoIntensity}
        bias={0.05}
        distanceThreshold={1.0}
        rangeThreshold={0.5}
        luminanceInfluence={0.9}
        blendFunction={BlendFunction.MULTIPLY}
      />
    );
  }

  if (effectConfig.enableBloom) {
    effects.push(
      <Bloom
        key="bloom"
        intensity={effectConfig.bloomStrength}
        luminanceThreshold={effectConfig.bloomThreshold}
        luminanceSmoothing={0.025}
        radius={effectConfig.bloomRadius}
        mipmapBlur={effectConfig.bloomMipmapBlur}
        blendFunction={BlendFunction.SCREEN}
      />
    );
  }

  if (effectConfig.enableFXAA) {
    effects.push(
      <FXAA
        key="fxaa"
        blendFunction={BlendFunction.NORMAL}
      />
    );
  }

  return (
    <EffectComposer>
      {effects}
    </EffectComposer>
  );
};

/**
 * Hook to control ambient occlusion settings
 */
export function useAmbientOcclusion(initialConfig?: Partial<AmbientOcclusionProps>) {
  const [config, setConfig] = React.useState<AmbientOcclusionProps>({
    aoType: 'SSAO',
    aoIntensity: 0.5,
    enableBloom: true,
    bloomIntensity: 0.8,
    enableFXAA: true,
    enabled: true,
    ...initialConfig,
  });

  const updateConfig = React.useCallback((updates: Partial<AmbientOcclusionProps>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  return {
    config,
    updateConfig,
    toggleAO: () => updateConfig({ aoType: config.aoType === 'none' ? 'SSAO' : 'none' }),
    toggleBloom: () => updateConfig({ enableBloom: !config.enableBloom }),
    setIntensity: (intensity: number) => updateConfig({ aoIntensity: intensity }),
    setBloomIntensity: (intensity: number) => updateConfig({ bloomIntensity: intensity }),
  };
}