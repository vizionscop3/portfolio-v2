import React, { useMemo, useRef } from 'react';
import { 
  EffectComposer, 
  Bloom, 
  DepthOfField,
  ChromaticAberration,
  ColorAverage,
  HueSaturation,
  BrightnessContrast,
  SSAO,
  FXAA,
  Vignette,
  ToneMapping,
} from '@react-three/postprocessing';
import { BlendFunction, ToneMappingMode } from 'postprocessing';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { infrastructure3D } from '../Infrastructure3D';

interface AdvancedPostProcessingProps {
  // Existing effects
  aoType?: 'SSAO' | 'none';
  aoIntensity?: number;
  enableBloom?: boolean;
  bloomIntensity?: number;
  enableFXAA?: boolean;
  
  // New advanced effects
  enableDepthOfField?: boolean;
  dofFocusDistance?: number;
  dofFocalLength?: number;
  dofBokehScale?: number;
  
  enableChromaticAberration?: boolean;
  chromaticAberrationIntensity?: number;
  
  enableColorGrading?: boolean;
  colorGradingMode?: 'cyberpunk' | 'cinematic' | 'warm' | 'cool' | 'vintage';
  
  enableVignette?: boolean;
  vignetteIntensity?: number;
  
  enableToneMapping?: boolean;
  toneMappingMode?: 'reinhard' | 'uncharted2' | 'cineon' | 'aces';
  
  enabled?: boolean;
  quality?: 'high' | 'medium' | 'low';
}

/**
 * Advanced Post-Processing Effects System
 * Implements Task 10.2: Enhanced post-processing with depth of field, color grading, and atmospheric effects
 */
export const AdvancedPostProcessing: React.FC<AdvancedPostProcessingProps> = ({
  // Existing
  aoType = 'SSAO',
  aoIntensity = 0.5,
  enableBloom = true,
  bloomIntensity = 0.8,
  enableFXAA = true,
  
  // New effects
  enableDepthOfField = false,
  dofFocusDistance = 5.0,
  dofFocalLength = 0.1,
  dofBokehScale = 2.0,
  
  enableChromaticAberration = true,
  chromaticAberrationIntensity = 0.5,
  
  enableColorGrading = true,
  colorGradingMode = 'cyberpunk',
  
  enableVignette = true,
  vignetteIntensity = 0.3,
  
  enableToneMapping = true,
  toneMappingMode = 'aces',
  
  enabled = true,
  quality = 'high',
}) => {
  // useThree hook not needed for this component
  const performanceProfile = infrastructure3D.getPerformanceProfile();
  const depthOfFieldRef = useRef<any>(null);

  // Performance-based configuration
  const effectConfig = useMemo(() => {
    if (!performanceProfile || !enabled) {
      return {
        enableAO: false,
        enableBloom: false,
        enableFXAA: false,
        enableDOF: false,
        enableColorGrading: false,
        enableVignette: false,
        enableChromaticAberration: false,
        enableToneMapping: false,
      };
    }

    const { tier, enablePostProcessing } = performanceProfile;
    const actualQuality = quality === 'high' && tier === 'low' ? 'medium' : quality;

    if (!enablePostProcessing) {
      return {
        enableAO: false,
        enableBloom: enableBloom && tier !== 'low',
        enableFXAA: enableFXAA,
        enableDOF: false,
        enableColorGrading: enableColorGrading && tier !== 'low',
        enableVignette: enableVignette,
        enableChromaticAberration: false,
        enableToneMapping: enableToneMapping,
      };
    }

    switch (tier) {
      case 'high':
        return {
          enableAO: aoType === 'SSAO',
          enableBloom: enableBloom,
          enableFXAA: enableFXAA,
          enableDOF: enableDepthOfField,
          enableColorGrading: enableColorGrading,
          enableVignette: enableVignette,
          enableChromaticAberration: enableChromaticAberration,
          enableToneMapping: enableToneMapping,
          
          // Quality settings
          aoSamples: actualQuality === 'high' ? 32 : 16,
          aoRadius: actualQuality === 'high' ? 16 : 12,
          bloomThreshold: 0.85,
          bloomStrength: bloomIntensity,
          bloomRadius: actualQuality === 'high' ? 0.4 : 0.3,
          bloomMipmapBlur: actualQuality === 'high',
          
          dofResolutionScale: actualQuality === 'high' ? 1.0 : 0.8,
          chromaticIntensity: chromaticAberrationIntensity,
        };
      case 'medium':
        return {
          enableAO: aoType === 'SSAO',
          enableBloom: enableBloom,
          enableFXAA: enableFXAA,
          enableDOF: enableDepthOfField && actualQuality !== 'low',
          enableColorGrading: enableColorGrading,
          enableVignette: enableVignette,
          enableChromaticAberration: enableChromaticAberration && actualQuality !== 'low',
          enableToneMapping: enableToneMapping,
          
          aoSamples: 16,
          aoRadius: 12,
          bloomThreshold: 0.9,
          bloomStrength: bloomIntensity * 0.8,
          bloomRadius: 0.3,
          bloomMipmapBlur: false,
          
          dofResolutionScale: 0.75,
          chromaticIntensity: chromaticAberrationIntensity * 0.7,
        };
      case 'low':
        return {
          enableAO: false,
          enableBloom: enableBloom,
          enableFXAA: enableFXAA,
          enableDOF: false,
          enableColorGrading: enableColorGrading,
          enableVignette: enableVignette,
          enableChromaticAberration: false,
          enableToneMapping: enableToneMapping,
          
          bloomThreshold: 1.0,
          bloomStrength: bloomIntensity * 0.6,
          bloomRadius: 0.2,
          bloomMipmapBlur: false,
          
          chromaticIntensity: 0,
        };
      default:
        return { enableAO: false, enableBloom: false, enableFXAA: false };
    }
  }, [
    performanceProfile, 
    enabled, 
    quality,
    aoType, 
    aoIntensity, 
    enableBloom, 
    bloomIntensity, 
    enableFXAA,
    enableDepthOfField,
    enableColorGrading,
    enableVignette,
    enableChromaticAberration,
    enableToneMapping,
    chromaticAberrationIntensity
  ]);

  // Color grading configurations
  const colorGradingConfig = useMemo(() => {
    const configs = {
      cyberpunk: {
        hue: 0.1,
        saturation: 0.3,
        brightness: 0.1,
        contrast: 0.2,
        averageColor: new THREE.Color(0x00ffff),
      },
      cinematic: {
        hue: -0.05,
        saturation: 0.1,
        brightness: -0.1,
        contrast: 0.3,
        averageColor: new THREE.Color(0x2c3e50),
      },
      warm: {
        hue: 0.05,
        saturation: 0.2,
        brightness: 0.05,
        contrast: 0.1,
        averageColor: new THREE.Color(0xffa500),
      },
      cool: {
        hue: -0.1,
        saturation: 0.1,
        brightness: -0.05,
        contrast: 0.15,
        averageColor: new THREE.Color(0x87ceeb),
      },
      vintage: {
        hue: 0.08,
        saturation: -0.2,
        brightness: -0.1,
        contrast: 0.25,
        averageColor: new THREE.Color(0xdeb887),
      },
    };
    return configs[colorGradingMode];
  }, [colorGradingMode]);

  // Dynamic focus for depth of field
  useFrame((state) => {
    if (effectConfig.enableDOF && depthOfFieldRef.current) {
      // Subtle focus breathing effect
      const time = state.clock.getElapsedTime();
      const breathing = Math.sin(time * 0.5) * 0.2;
      depthOfFieldRef.current.target = dofFocusDistance + breathing;
    }
  });

  // Tone mapping mode conversion
  const getToneMappingMode = (mode: string) => {
    switch (mode) {
      case 'reinhard': return ToneMappingMode.REINHARD2;
      case 'uncharted2': return ToneMappingMode.UNCHARTED2;
      case 'cineon': return ToneMappingMode.CINEON;
      case 'aces': return ToneMappingMode.ACES_FILMIC;
      default: return ToneMappingMode.ACES_FILMIC;
    }
  };

  // Don't render if no effects are enabled
  if (!Object.values(effectConfig).some(Boolean)) {
    return null;
  }

  // Create effects array for better performance
  const effects = [];
  let effectIndex = 0;

  // Tone mapping (should be first)
  if (effectConfig.enableToneMapping) {
    effects.push(
      <ToneMapping
        key={`tone-mapping-${effectIndex++}`}
        mode={getToneMappingMode(toneMappingMode)}
        resolution={256}
        whitePoint={4.0}
        middleGrey={0.6}
        minLuminance={0.01}
        averageLuminance={1.0}
        adaptationRate={1.0}
      />
    );
  }

  // SSAO for ambient occlusion
  if (effectConfig.enableAO) {
    effects.push(
      <SSAO
        key={`ssao-${effectIndex++}`}
        samples={effectConfig.aoSamples || 16}
        radius={effectConfig.aoRadius || 12}
        intensity={aoIntensity}
        bias={0.05}
        distanceThreshold={1.0}
        rangeThreshold={0.5}
        luminanceInfluence={0.9}
        blendFunction={BlendFunction.MULTIPLY}
      />
    );
  }

  // Depth of Field
  if (effectConfig.enableDOF) {
    effects.push(
      <DepthOfField
        key={`dof-${effectIndex++}`}
        ref={depthOfFieldRef}
        focusDistance={dofFocusDistance}
        focalLength={dofFocalLength}
        bokehScale={dofBokehScale}
        height={480 * (effectConfig.dofResolutionScale || 1.0)}
      />
    );
  }

  // Bloom for glow effects
  if (effectConfig.enableBloom) {
    effects.push(
      <Bloom
        key={`bloom-${effectIndex++}`}
        intensity={effectConfig.bloomStrength || bloomIntensity}
        luminanceThreshold={effectConfig.bloomThreshold || 0.9}
        luminanceSmoothing={0.025}
        radius={effectConfig.bloomRadius || 0.3}
        mipmapBlur={effectConfig.bloomMipmapBlur || false}
        blendFunction={BlendFunction.SCREEN}
      />
    );
  }

  // Color grading
  if (effectConfig.enableColorGrading && colorGradingConfig) {
    effects.push(
      <ColorAverage
        key={`color-average-${effectIndex++}`}
        blendFunction={BlendFunction.SOFT_LIGHT}
      />
    );
    
    effects.push(
      <HueSaturation
        key={`hue-sat-${effectIndex++}`}
        hue={colorGradingConfig.hue}
        saturation={colorGradingConfig.saturation}
        blendFunction={BlendFunction.NORMAL}
      />
    );
    
    effects.push(
      <BrightnessContrast
        key={`brightness-contrast-${effectIndex++}`}
        brightness={colorGradingConfig.brightness}
        contrast={colorGradingConfig.contrast}
        blendFunction={BlendFunction.NORMAL}
      />
    );
  }

  // Chromatic Aberration
  if (effectConfig.enableChromaticAberration) {
    effects.push(
      <ChromaticAberration
        key={`chromatic-${effectIndex++}`}
        offset={new THREE.Vector2(
          (effectConfig.chromaticIntensity || chromaticAberrationIntensity) * 0.001,
          (effectConfig.chromaticIntensity || chromaticAberrationIntensity) * 0.001
        )}
        blendFunction={BlendFunction.NORMAL}
      />
    );
  }

  // Vignette
  if (effectConfig.enableVignette) {
    effects.push(
      <Vignette
        key={`vignette-${effectIndex++}`}
        offset={0.3}
        darkness={vignetteIntensity}
        blendFunction={BlendFunction.MULTIPLY}
      />
    );
  }

  // FXAA (should be last)
  if (effectConfig.enableFXAA) {
    effects.push(
      <FXAA
        key={`fxaa-${effectIndex++}`}
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
 * Hook to control advanced post-processing settings
 */
export function useAdvancedPostProcessing(initialConfig?: Partial<AdvancedPostProcessingProps>) {
  const [config, setConfig] = React.useState<AdvancedPostProcessingProps>({
    aoType: 'SSAO',
    aoIntensity: 0.5,
    enableBloom: true,
    bloomIntensity: 0.8,
    enableFXAA: true,
    enableDepthOfField: false,
    dofFocusDistance: 5.0,
    dofFocalLength: 0.1,
    dofBokehScale: 2.0,
    enableChromaticAberration: true,
    chromaticAberrationIntensity: 0.5,
    enableColorGrading: true,
    colorGradingMode: 'cyberpunk',
    enableVignette: true,
    vignetteIntensity: 0.3,
    enableToneMapping: true,
    toneMappingMode: 'aces',
    enabled: true,
    quality: 'high',
    ...initialConfig,
  });

  const updateConfig = React.useCallback((updates: Partial<AdvancedPostProcessingProps>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  return {
    config,
    updateConfig,
    toggleDOF: () => updateConfig({ enableDepthOfField: !config.enableDepthOfField }),
    toggleColorGrading: () => updateConfig({ enableColorGrading: !config.enableColorGrading }),
    toggleVignette: () => updateConfig({ enableVignette: !config.enableVignette }),
    setColorGradingMode: (mode: AdvancedPostProcessingProps['colorGradingMode']) => 
      updateConfig({ colorGradingMode: mode }),
    setQuality: (quality: 'high' | 'medium' | 'low') => updateConfig({ quality }),
  };
}