import React, { useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

export type TimeOfDay = 'dawn' | 'morning' | 'noon' | 'afternoon' | 'evening' | 'night' | 'midnight';
export type LightingMode = 'static' | 'dynamic' | 'auto' | 'cyberpunk-cycle';

interface DynamicLightingState {
  timeOfDay: TimeOfDay;
  transitionProgress: number;
  isTransitioning: boolean;
  intensity: number;
  mode: LightingMode;
  cycleSpeed: number;
  lastUpdateTime: number;
}

interface DynamicLightingControllerProps {
  children: (lightingState: DynamicLightingState, controls: LightingControls) => React.ReactNode;
  initialTimeOfDay?: TimeOfDay;
  initialMode?: LightingMode;
  cycleSpeed?: number;
  transitionDuration?: number;
  cyberpunkCycleInterval?: number;
}

interface LightingControls {
  setTimeOfDay: (time: TimeOfDay) => void;
  setMode: (mode: LightingMode) => void;
  setIntensity: (intensity: number) => void;
  setCycleSpeed: (speed: number) => void;
  nextTimeOfDay: () => void;
  previousTimeOfDay: () => void;
  toggleMode: () => void;
  resetToDefault: () => void;
}

const TIME_OF_DAY_SEQUENCE: TimeOfDay[] = [
  'midnight',
  'dawn', 
  'morning',
  'noon',
  'afternoon', 
  'evening',
  'night'
];

const CYBERPUNK_SEQUENCE: TimeOfDay[] = [
  'night',
  'midnight',
  'evening',
  'night'
];

/**
 * Dynamic Lighting Controller
 * Manages time-of-day transitions, automatic cycling, and lighting modes
 */
export const DynamicLightingController: React.FC<DynamicLightingControllerProps> = ({
  children,
  initialTimeOfDay = 'night',
  initialMode = 'static',
  cycleSpeed = 1.0,
  transitionDuration = 3000,
  cyberpunkCycleInterval = 30000,
}) => {
  const [lightingState, setLightingState] = useState<DynamicLightingState>({
    timeOfDay: initialTimeOfDay,
    transitionProgress: 0,
    isTransitioning: false,
    intensity: 1.0,
    mode: initialMode,
    cycleSpeed,
    lastUpdateTime: Date.now(),
  });

  const [transitionTarget, setTransitionTarget] = useState<TimeOfDay | null>(null);
  const [transitionStartTime, setTransitionStartTime] = useState<number | null>(null);

  // Auto-cycling effect
  useEffect(() => {
    if (lightingState.mode === 'auto' || lightingState.mode === 'cyberpunk-cycle') {
      const sequence = lightingState.mode === 'cyberpunk-cycle' 
        ? CYBERPUNK_SEQUENCE 
        : TIME_OF_DAY_SEQUENCE;

      const interval = lightingState.mode === 'cyberpunk-cycle'
        ? cyberpunkCycleInterval
        : (24000 / lightingState.cycleSpeed); // 24 seconds for full cycle at 1x speed

      const cycleInterval = setInterval(() => {
        const currentIndex = sequence.indexOf(lightingState.timeOfDay);
        const nextIndex = (currentIndex + 1) % sequence.length;
        const nextTime = sequence[nextIndex];
        
        setTransitionTarget(nextTime);
        setTransitionStartTime(Date.now());
        setLightingState(prev => ({
          ...prev,
          isTransitioning: true,
          transitionProgress: 0,
        }));
      }, interval);

      return () => clearInterval(cycleInterval);
    }
  }, [lightingState.mode, lightingState.cycleSpeed, lightingState.timeOfDay, cyberpunkCycleInterval]);

  // Handle transitions
  useFrame(() => {
    if (lightingState.isTransitioning && transitionTarget && transitionStartTime) {
      const elapsed = Date.now() - transitionStartTime;
      const progress = Math.min(elapsed / transitionDuration, 1);
      
      setLightingState(prev => ({
        ...prev,
        transitionProgress: progress,
      }));

      if (progress >= 1) {
        setLightingState(prev => ({
          ...prev,
          timeOfDay: transitionTarget,
          isTransitioning: false,
          transitionProgress: 0,
        }));
        setTransitionTarget(null);
        setTransitionStartTime(null);
      }
    }
  });

  // Dynamic lighting effects for cyberpunk mode
  useFrame((state) => {
    if (lightingState.mode === 'dynamic') {
      // Subtle intensity variations based on time
      const time = state.clock.getElapsedTime();
      const baseIntensity = lightingState.intensity;
      
      // Subtle breathing effect
      const breathingEffect = 1.0 + 0.05 * Math.sin(time * 0.8);
      
      // Random flicker for cyberpunk atmosphere
      const flickerEffect = 1.0 + 0.02 * (Math.random() - 0.5);
      
      const finalIntensity = baseIntensity * breathingEffect * flickerEffect;
      
      setLightingState(prev => ({
        ...prev,
        intensity: finalIntensity,
        lastUpdateTime: Date.now(),
      }));
    }
  });

  const controls: LightingControls = useMemo(() => ({
    setTimeOfDay: (time: TimeOfDay) => {
      if (time !== lightingState.timeOfDay && !lightingState.isTransitioning) {
        setTransitionTarget(time);
        setTransitionStartTime(Date.now());
        setLightingState(prev => ({
          ...prev,
          isTransitioning: true,
          transitionProgress: 0,
        }));
      }
    },

    setMode: (mode: LightingMode) => {
      setLightingState(prev => ({
        ...prev,
        mode,
        intensity: mode === 'dynamic' ? 1.0 : prev.intensity,
      }));
    },

    setIntensity: (intensity: number) => {
      setLightingState(prev => ({
        ...prev,
        intensity: Math.max(0, Math.min(2, intensity)),
      }));
    },

    setCycleSpeed: (speed: number) => {
      setLightingState(prev => ({
        ...prev,
        cycleSpeed: Math.max(0.1, Math.min(10, speed)),
      }));
    },

    nextTimeOfDay: () => {
      const currentIndex = TIME_OF_DAY_SEQUENCE.indexOf(lightingState.timeOfDay);
      const nextIndex = (currentIndex + 1) % TIME_OF_DAY_SEQUENCE.length;
      controls.setTimeOfDay(TIME_OF_DAY_SEQUENCE[nextIndex]);
    },

    previousTimeOfDay: () => {
      const currentIndex = TIME_OF_DAY_SEQUENCE.indexOf(lightingState.timeOfDay);
      const prevIndex = (currentIndex - 1 + TIME_OF_DAY_SEQUENCE.length) % TIME_OF_DAY_SEQUENCE.length;
      controls.setTimeOfDay(TIME_OF_DAY_SEQUENCE[prevIndex]);
    },

    toggleMode: () => {
      const modes: LightingMode[] = ['static', 'dynamic', 'auto', 'cyberpunk-cycle'];
      const currentIndex = modes.indexOf(lightingState.mode);
      const nextIndex = (currentIndex + 1) % modes.length;
      controls.setMode(modes[nextIndex]);
    },

    resetToDefault: () => {
      setLightingState({
        timeOfDay: initialTimeOfDay,
        transitionProgress: 0,
        isTransitioning: false,
        intensity: 1.0,
        mode: initialMode,
        cycleSpeed: cycleSpeed,
        lastUpdateTime: Date.now(),
      });
      setTransitionTarget(null);
      setTransitionStartTime(null);
    },
  }), [lightingState, initialTimeOfDay, initialMode, cycleSpeed]);

  return <>{children(lightingState, controls)}</>;
};

/**
 * Lighting Control UI Component
 */
export const LightingControlPanel: React.FC<{
  lightingState: DynamicLightingState;
  controls: LightingControls;
  className?: string;
}> = ({ lightingState, controls, className = '' }) => {
  return (
    <div className={`lighting-control-panel font-mono text-cyan-400 ${className}`}>
      {/* Time of Day Controls */}
      <div className="mb-4">
        <div className="text-xs uppercase tracking-wide mb-2">Time of Day</div>
        <div className="flex flex-wrap gap-1 mb-2">
          {TIME_OF_DAY_SEQUENCE.map((time) => (
            <button
              key={time}
              onClick={() => controls.setTimeOfDay(time)}
              className={`px-2 py-1 text-xs border transition-colors ${
                lightingState.timeOfDay === time
                  ? 'bg-cyan-400 text-black border-cyan-400'
                  : 'bg-transparent border-cyan-400/30 hover:border-cyan-400'
              }`}
            >
              {time}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={controls.previousTimeOfDay}
            className="px-3 py-1 text-xs bg-transparent border border-cyan-400/30 hover:border-cyan-400 transition-colors"
          >
            ← Prev
          </button>
          <button
            onClick={controls.nextTimeOfDay}
            className="px-3 py-1 text-xs bg-transparent border border-cyan-400/30 hover:border-cyan-400 transition-colors"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Mode Controls */}
      <div className="mb-4">
        <div className="text-xs uppercase tracking-wide mb-2">Mode</div>
        <div className="flex gap-1 mb-2">
          {(['static', 'dynamic', 'auto', 'cyberpunk-cycle'] as LightingMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => controls.setMode(mode)}
              className={`px-2 py-1 text-xs border transition-colors ${
                lightingState.mode === mode
                  ? 'bg-magenta-400 text-black border-magenta-400'
                  : 'bg-transparent border-magenta-400/30 hover:border-magenta-400'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Intensity Control */}
      <div className="mb-4">
        <div className="text-xs uppercase tracking-wide mb-2">
          Intensity: {lightingState.intensity.toFixed(2)}
        </div>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={lightingState.intensity}
          onChange={(e) => controls.setIntensity(parseFloat(e.target.value))}
          className="w-full accent-cyan-400"
        />
      </div>

      {/* Cycle Speed (for auto modes) */}
      {(lightingState.mode === 'auto' || lightingState.mode === 'cyberpunk-cycle') && (
        <div className="mb-4">
          <div className="text-xs uppercase tracking-wide mb-2">
            Cycle Speed: {lightingState.cycleSpeed.toFixed(1)}x
          </div>
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={lightingState.cycleSpeed}
            onChange={(e) => controls.setCycleSpeed(parseFloat(e.target.value))}
            className="w-full accent-magenta-400"
          />
        </div>
      )}

      {/* Status */}
      <div className="text-xs opacity-75">
        {lightingState.isTransitioning && (
          <div>Transitioning... {Math.round(lightingState.transitionProgress * 100)}%</div>
        )}
        <div>Mode: {lightingState.mode}</div>
      </div>

      {/* Reset Button */}
      <button
        onClick={controls.resetToDefault}
        className="mt-4 px-4 py-2 text-xs bg-transparent border border-red-400/30 text-red-400 hover:border-red-400 transition-colors w-full"
      >
        Reset to Default
      </button>
    </div>
  );
};

/**
 * Hook for using dynamic lighting controls
 */
export function useDynamicLighting(initialConfig?: {
  timeOfDay?: TimeOfDay;
  mode?: LightingMode;
  intensity?: number;
  cycleSpeed?: number;
}) {
  return {
    TimeOfDay: TIME_OF_DAY_SEQUENCE,
    CyberpunkSequence: CYBERPUNK_SEQUENCE,
    initialConfig: {
      initialTimeOfDay: initialConfig?.timeOfDay || 'night',
      initialMode: initialConfig?.mode || 'static',
      cycleSpeed: initialConfig?.cycleSpeed || 1.0,
      ...initialConfig,
    },
  };
}