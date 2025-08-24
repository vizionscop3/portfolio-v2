import React, { useState, useEffect, useRef } from 'react';
import { LightingSystem } from './LightingSystem';
import { AdvancedPostProcessing, useAdvancedPostProcessing } from '../effects/AdvancedPostProcessing';
import { 
  DynamicLightingController, 
  LightingControlPanel,
  type TimeOfDay,
  type LightingMode 
} from './DynamicLightingController';
import { infrastructure3D } from '../Infrastructure3D';

interface AdvancedLightingProps {
  enableControls?: boolean;
  initialTimeOfDay?: TimeOfDay;
  initialMode?: LightingMode;
  enableShadows?: boolean;
  enableAmbientOcclusion?: boolean;
  enableBloom?: boolean;
  enableDynamicEffects?: boolean;
  cyberpunkMode?: boolean;
  onLightingChange?: (state: {
    timeOfDay: TimeOfDay;
    mode: LightingMode;
    intensity: number;
  }) => void;
}

/**
 * Advanced Lighting System
 * Combines cinematic lighting, ambient occlusion, dynamic effects, and user controls
 * Implements Phase 10 Task 10.1: Advanced lighting and shadows
 */
export const AdvancedLighting: React.FC<AdvancedLightingProps> = ({
  enableControls = false,
  initialTimeOfDay = 'night',
  initialMode = 'cyberpunk-cycle',
  enableShadows = true,
  enableAmbientOcclusion = true,
  enableBloom = true,
  enableDynamicEffects = true,
  cyberpunkMode = true,
  onLightingChange,
}) => {
  const performanceProfile = infrastructure3D.getPerformanceProfile();
  const [isControlPanelOpen, setIsControlPanelOpen] = useState(false);
  
  // Advanced post-processing controls
  const {
    config: postProcessingConfig,
    updateConfig: updatePostProcessingConfig,
    toggleDOF,
    toggleColorGrading,
    toggleVignette,
    setColorGradingMode,
    setQuality,
  } = useAdvancedPostProcessing({
    aoType: performanceProfile?.tier === 'low' ? 'none' : 'SSAO',
    aoIntensity: 0.5,
    enableBloom: enableBloom && (performanceProfile?.enablePostProcessing || false),
    bloomIntensity: cyberpunkMode ? 1.2 : 0.8,
    enableFXAA: true,
    enableDepthOfField: false,
    enableColorGrading: true,
    colorGradingMode: 'cyberpunk',
    enableVignette: true,
    enableToneMapping: true,
    enabled: enableAmbientOcclusion && (performanceProfile?.enablePostProcessing || false),
    quality: 'high',
  });

  // Keyboard shortcuts for lighting controls
  useEffect(() => {
    if (!enableControls) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      // Only handle if not typing in an input
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case 'l':
          if (event.ctrlKey) {
            event.preventDefault();
            setIsControlPanelOpen(!isControlPanelOpen);
          }
          break;
        case 'b':
          if (event.ctrlKey && event.shiftKey) {
            event.preventDefault();
            updatePostProcessingConfig({ enableBloom: !postProcessingConfig.enableBloom });
          }
          break;
        case 'd':
          if (event.ctrlKey && event.shiftKey) {
            event.preventDefault();
            toggleDOF();
          }
          break;
        case 'v':
          if (event.ctrlKey && event.shiftKey) {
            event.preventDefault();
            toggleVignette();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [enableControls, isControlPanelOpen, toggleDOF, toggleVignette, postProcessingConfig, updatePostProcessingConfig]);

  // Store lighting state in ref to avoid stale closure
  const lightingStateRef = useRef<{ timeOfDay: TimeOfDay; mode: LightingMode; intensity: number } | null>(null);

  return (
    <DynamicLightingController
      initialTimeOfDay={initialTimeOfDay}
      initialMode={initialMode}
      cycleSpeed={cyberpunkMode ? 0.5 : 1.0}
      cyberpunkCycleInterval={cyberpunkMode ? 45000 : 30000}
      transitionDuration={4000}
    >
      {(lightingState, controls) => {
        // Store current lighting state
        if (!lightingStateRef.current || 
            lightingStateRef.current.timeOfDay !== lightingState.timeOfDay ||
            lightingStateRef.current.mode !== lightingState.mode ||
            lightingStateRef.current.intensity !== lightingState.intensity) {
          
          lightingStateRef.current = {
            timeOfDay: lightingState.timeOfDay,
            mode: lightingState.mode,
            intensity: lightingState.intensity,
          };
          
          // Notify parent of lighting changes
          if (onLightingChange) {
            onLightingChange(lightingStateRef.current);
          }
        }

        return (
          <>
            {/* Main Lighting System */}
            <LightingSystem
              timeOfDay={lightingState.timeOfDay}
              intensity={lightingState.intensity}
              enableShadows={enableShadows && (performanceProfile?.enableShadows || false)}
              enableDynamicLighting={enableDynamicEffects && lightingState.mode === 'dynamic'}
              cyberpunkMode={cyberpunkMode}
            />

            {/* Advanced Post-Processing Effects */}
            <AdvancedPostProcessing
              aoType={postProcessingConfig.aoType}
              aoIntensity={postProcessingConfig.aoIntensity}
              enableBloom={postProcessingConfig.enableBloom}
              bloomIntensity={postProcessingConfig.bloomIntensity}
              enableFXAA={postProcessingConfig.enableFXAA}
              enableDepthOfField={postProcessingConfig.enableDepthOfField}
              enableColorGrading={postProcessingConfig.enableColorGrading}
              colorGradingMode={postProcessingConfig.colorGradingMode}
              enableVignette={postProcessingConfig.enableVignette}
              enableToneMapping={postProcessingConfig.enableToneMapping}
              enabled={postProcessingConfig.enabled}
              quality={postProcessingConfig.quality}
            />

            {/* Control Panel */}
            {enableControls && (
              <>
                {/* Toggle Button */}
                <div className="absolute top-4 right-4 z-50">
                  <button
                    onClick={() => setIsControlPanelOpen(!isControlPanelOpen)}
                    className="px-3 py-2 text-xs bg-black/80 border border-cyan-400/50 text-cyan-400 font-mono hover:border-cyan-400 transition-colors backdrop-blur-sm"
                    title="Toggle Lighting Controls (Ctrl+L)"
                  >
                    {isControlPanelOpen ? '✕ CLOSE' : '☀ LIGHTING'}
                  </button>
                </div>

                {/* Control Panel */}
                {isControlPanelOpen && (
                  <div className="absolute top-16 right-4 z-40 w-80 max-h-[80vh] overflow-y-auto">
                    <div className="bg-black/90 border border-cyan-400/30 p-4 backdrop-blur-md">
                      <div className="text-cyan-400 font-mono text-sm font-bold mb-4 border-b border-cyan-400/30 pb-2">
                        ADVANCED LIGHTING CONTROLS
                      </div>
                      
                      {/* Dynamic Lighting Controls */}
                      <LightingControlPanel
                        lightingState={lightingState}
                        controls={controls}
                        className="mb-6"
                      />

                      {/* Advanced Post-Processing Controls */}
                      <div className="border-t border-cyan-400/30 pt-4">
                        <div className="text-xs uppercase tracking-wide mb-3 text-cyan-400">
                          Advanced Post-Processing
                        </div>
                        
                        {/* Quality Setting */}
                        <div className="mb-3">
                          <div className="text-xs mb-2">Quality</div>
                          <div className="flex gap-1">
                            {(['high', 'medium', 'low'] as const).map((quality) => (
                              <button
                                key={quality}
                                onClick={() => setQuality(quality)}
                                className={`px-2 py-1 text-xs border transition-colors ${
                                  postProcessingConfig.quality === quality
                                    ? 'bg-cyan-400 text-black border-cyan-400'
                                    : 'bg-transparent border-cyan-400/30 hover:border-cyan-400'
                                }`}
                              >
                                {quality}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* AO Controls */}
                        <div className="mb-3">
                          <div className="text-xs mb-2">Ambient Occlusion</div>
                          <div className="flex gap-1 mb-2">
                            {(['none', 'SSAO'] as const).map((type) => (
                              <button
                                key={type}
                                onClick={() => updatePostProcessingConfig({ aoType: type })}
                                disabled={!performanceProfile?.enablePostProcessing}
                                className={`px-2 py-1 text-xs border transition-colors ${
                                  postProcessingConfig.aoType === type
                                    ? 'bg-magenta-400 text-black border-magenta-400'
                                    : 'bg-transparent border-magenta-400/30 hover:border-magenta-400 disabled:opacity-50'
                                }`}
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                          {postProcessingConfig.aoType !== 'none' && (
                            <div>
                              <div className="text-xs mb-1">Intensity: {postProcessingConfig.aoIntensity?.toFixed(2)}</div>
                              <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={postProcessingConfig.aoIntensity || 0.5}
                                onChange={(e) => updatePostProcessingConfig({ aoIntensity: parseFloat(e.target.value) })}
                                className="w-full accent-magenta-400"
                              />
                            </div>
                          )}
                        </div>

                        {/* Depth of Field */}
                        <div className="mb-3">
                          <label className="flex items-center gap-2 mb-2">
                            <input
                              type="checkbox"
                              checked={postProcessingConfig.enableDepthOfField || false}
                              onChange={toggleDOF}
                              disabled={performanceProfile?.tier === 'low'}
                              className="accent-cyan-400"
                            />
                            <span className="text-xs">Depth of Field</span>
                          </label>
                        </div>

                        {/* Color Grading */}
                        <div className="mb-3">
                          <div className="flex items-center gap-2 mb-2">
                            <input
                              type="checkbox"
                              checked={postProcessingConfig.enableColorGrading || false}
                              onChange={toggleColorGrading}
                              className="accent-cyan-400"
                            />
                            <span className="text-xs">Color Grading</span>
                          </div>
                          {postProcessingConfig.enableColorGrading && (
                            <div className="flex gap-1">
                              {(['cyberpunk', 'cinematic', 'warm', 'cool', 'vintage'] as const).map((mode) => (
                                <button
                                  key={mode}
                                  onClick={() => setColorGradingMode(mode)}
                                  className={`px-1 py-1 text-xs border transition-colors ${
                                    postProcessingConfig.colorGradingMode === mode
                                      ? 'bg-cyan-400 text-black border-cyan-400'
                                      : 'bg-transparent border-cyan-400/30 hover:border-cyan-400'
                                  }`}
                                >
                                  {mode}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Bloom */}
                        <div className="mb-3">
                          <div className="flex items-center gap-2 mb-2">
                            <input
                              type="checkbox"
                              checked={postProcessingConfig.enableBloom || false}
                              onChange={(e) => updatePostProcessingConfig({ enableBloom: e.target.checked })}
                              disabled={!performanceProfile?.enablePostProcessing}
                              className="accent-cyan-400"
                            />
                            <label className="text-xs">Bloom</label>
                          </div>
                          {postProcessingConfig.enableBloom && (
                            <div>
                              <div className="text-xs mb-1">Intensity: {postProcessingConfig.bloomIntensity?.toFixed(2)}</div>
                              <input
                                type="range"
                                min="0"
                                max="2"
                                step="0.1"
                                value={postProcessingConfig.bloomIntensity || 0.8}
                                onChange={(e) => updatePostProcessingConfig({ bloomIntensity: parseFloat(e.target.value) })}
                                className="w-full accent-cyan-400"
                              />
                            </div>
                          )}
                        </div>

                        {/* Other Effects */}
                        <div className="mb-3">
                          <label className="flex items-center gap-2 mb-1">
                            <input
                              type="checkbox"
                              checked={postProcessingConfig.enableVignette || false}
                              onChange={toggleVignette}
                              className="accent-cyan-400"
                            />
                            <span className="text-xs">Vignette</span>
                          </label>
                          
                          <label className="flex items-center gap-2 mb-1">
                            <input
                              type="checkbox"
                              checked={postProcessingConfig.enableFXAA || false}
                              onChange={(e) => updatePostProcessingConfig({ enableFXAA: e.target.checked })}
                              className="accent-cyan-400"
                            />
                            <span className="text-xs">Anti-aliasing (FXAA)</span>
                          </label>
                          
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={postProcessingConfig.enableToneMapping || false}
                              onChange={(e) => updatePostProcessingConfig({ enableToneMapping: e.target.checked })}
                              className="accent-cyan-400"
                            />
                            <span className="text-xs">Tone Mapping</span>
                          </label>
                        </div>
                      </div>

                      {/* Performance Info */}
                      <div className="border-t border-cyan-400/30 pt-4 text-xs opacity-75">
                        <div className="mb-2">Performance Tier: {performanceProfile?.tier.toUpperCase()}</div>
                        <div className="mb-2">Shadows: {performanceProfile?.enableShadows ? 'ON' : 'OFF'}</div>
                        <div className="mb-2">Post-FX: {performanceProfile?.enablePostProcessing ? 'ON' : 'OFF'}</div>
                        <div>Max Lights: {performanceProfile?.maxLights}</div>
                      </div>

                      {/* Keyboard Shortcuts */}
                      <div className="border-t border-cyan-400/30 pt-4 text-xs opacity-75">
                        <div className="font-bold mb-2">Shortcuts:</div>
                        <div>Ctrl+L: Toggle Panel</div>
                        <div>Ctrl+Shift+B: Toggle Bloom</div>
                        <div>Ctrl+Shift+D: Toggle DOF</div>
                        <div>Ctrl+Shift+V: Toggle Vignette</div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Performance Warning */}
            {!performanceProfile?.enablePostProcessing && enableAmbientOcclusion && (
              <div className="absolute bottom-4 right-4 z-30 max-w-xs">
                <div className="bg-yellow-900/80 border border-yellow-400/50 p-3 text-yellow-200 text-xs font-mono backdrop-blur-sm">
                  <div className="font-bold mb-1">⚠ PERFORMANCE NOTICE</div>
                  <div>Post-processing effects disabled due to hardware limitations.</div>
                </div>
              </div>
            )}
          </>
        );
      }}
    </DynamicLightingController>
  );
};

export default AdvancedLighting;