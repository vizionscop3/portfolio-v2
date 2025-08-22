import React, { useRef, useEffect, useState, useMemo } from 'react';
import { infrastructure3D } from '../Infrastructure3D';

interface AmbientSoundSystemProps {
  enableBackgroundMusic?: boolean;
  enableSpatialAudio?: boolean;
  enableInteractiveAudio?: boolean;
  enableUIFeedback?: boolean;
  masterVolume?: number;
  musicVolume?: number;
  effectsVolume?: number;
  enabled?: boolean;
  timeOfDay?: 'dawn' | 'morning' | 'noon' | 'afternoon' | 'evening' | 'night' | 'midnight';
}

interface SoundEffect {
  id: string;
  buffer?: AudioBuffer;
  source?: AudioBufferSourceNode;
  gainNode?: GainNode;
  pannerNode?: PannerNode;
  position?: [number, number, number];
  volume?: number;
  loop?: boolean;
  playing?: boolean;
}

/**
 * Ambient Sound System Component
 * Provides immersive spatial audio and dynamic soundscapes
 */
export const AmbientSoundSystem: React.FC<AmbientSoundSystemProps> = ({
  enableBackgroundMusic = true,
  enableSpatialAudio = true,
  enableInteractiveAudio = true,
  enableUIFeedback = true,
  masterVolume = 0.3,
  musicVolume = 0.4,
  effectsVolume = 0.6,
  enabled = true,
  timeOfDay = 'night',
}) => {
  const performanceProfile = infrastructure3D.getPerformanceProfile();
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const musicGainRef = useRef<GainNode | null>(null);
  const effectsGainRef = useRef<GainNode | null>(null);
  const soundEffectsRef = useRef<Map<string, SoundEffect>>(new Map());
  const [isInitialized, setIsInitialized] = useState(false);

  // Performance-based audio configuration
  const audioConfig = useMemo(() => {
    if (!performanceProfile || !enabled) {
      return {
        backgroundMusic: false,
        spatialAudio: false,
        interactiveAudio: false,
        uiFeedback: false,
        quality: 'low',
      };
    }

    const { tier } = performanceProfile;

    switch (tier) {
      case 'high':
        return {
          backgroundMusic: enableBackgroundMusic,
          spatialAudio: enableSpatialAudio,
          interactiveAudio: enableInteractiveAudio,
          uiFeedback: enableUIFeedback,
          quality: 'high',
          maxConcurrentSounds: 8,
        };
      case 'medium':
        return {
          backgroundMusic: enableBackgroundMusic,
          spatialAudio: enableSpatialAudio,
          interactiveAudio: enableInteractiveAudio,
          uiFeedback: enableUIFeedback,
          quality: 'medium',
          maxConcurrentSounds: 4,
        };
      case 'low':
        return {
          backgroundMusic: enableBackgroundMusic,
          spatialAudio: false,
          interactiveAudio: enableInteractiveAudio,
          uiFeedback: enableUIFeedback,
          quality: 'low',
          maxConcurrentSounds: 2,
        };
      default:
        return { backgroundMusic: false, spatialAudio: false, interactiveAudio: false };
    }
  }, [
    performanceProfile,
    enabled,
    enableBackgroundMusic,
    enableSpatialAudio,
    enableInteractiveAudio,
    enableUIFeedback,
  ]);

  // Initialize audio context
  const initializeAudio = async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      // Create master gain node
      if (!masterGainRef.current) {
        masterGainRef.current = audioContextRef.current.createGain();
        masterGainRef.current.connect(audioContextRef.current.destination);
        masterGainRef.current.gain.value = masterVolume;
      }

      // Create music gain node
      if (!musicGainRef.current) {
        musicGainRef.current = audioContextRef.current.createGain();
        musicGainRef.current.connect(masterGainRef.current);
        musicGainRef.current.gain.value = musicVolume;
      }

      // Create effects gain node
      if (!effectsGainRef.current) {
        effectsGainRef.current = audioContextRef.current.createGain();
        effectsGainRef.current.connect(masterGainRef.current);
        effectsGainRef.current.gain.value = effectsVolume;
      }

      setIsInitialized(true);
    } catch (error) {
      console.warn('Audio initialization failed:', error);
    }
  };

  // Initialize audio on user interaction
  useEffect(() => {
    if (!audioConfig.backgroundMusic && !audioConfig.interactiveAudio) return;

    const handleUserInteraction = () => {
      if (!isInitialized) {
        initializeAudio();
      }
    };

    // Add event listeners for user interaction
    window.addEventListener('click', handleUserInteraction, { once: true });
    window.addEventListener('keydown', handleUserInteraction, { once: true });
    window.addEventListener('touchstart', handleUserInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [audioConfig, isInitialized]);

  // Create procedural audio buffers for cyberpunk sounds
  const createProceduralAudio = (type: 'ambient' | 'hum' | 'click' | 'hover' | 'whoosh'): AudioBuffer | null => {
    if (!audioContextRef.current) return null;

    let duration: number;
    let frequency: number;
    let waveform: 'sine' | 'square' | 'sawtooth' | 'triangle';

    switch (type) {
      case 'ambient':
        duration = 30; // 30 seconds loop
        frequency = 60; // Low frequency hum
        waveform = 'sine';
        break;
      case 'hum':
        duration = 5;
        frequency = 120;
        waveform = 'sawtooth';
        break;
      case 'click':
        duration = 0.1;
        frequency = 800;
        waveform = 'square';
        break;
      case 'hover':
        duration = 0.3;
        frequency = 400;
        waveform = 'sine';
        break;
      case 'whoosh':
        duration = 1;
        frequency = 200;
        waveform = 'triangle';
        break;
      default:
        duration = 1;
        frequency = 440;
        waveform = 'sine';
    }

    const sampleRate = audioContextRef.current.sampleRate;
    const buffer = audioContextRef.current.createBuffer(1, duration * sampleRate, sampleRate);
    const channelData = buffer.getChannelData(0);

    for (let i = 0; i < channelData.length; i++) {
      const t = i / sampleRate;
      let sample = 0;

      switch (waveform) {
        case 'sine':
          sample = Math.sin(2 * Math.PI * frequency * t);
          break;
        case 'square':
          sample = Math.sign(Math.sin(2 * Math.PI * frequency * t));
          break;
        case 'sawtooth':
          sample = 2 * (t * frequency - Math.floor(t * frequency + 0.5));
          break;
        case 'triangle':
          sample = 2 * Math.abs(2 * (t * frequency - Math.floor(t * frequency + 0.5))) - 1;
          break;
      }

      // Apply envelope for click and hover sounds
      if (type === 'click' || type === 'hover') {
        const envelope = Math.exp(-t * 10); // Exponential decay
        sample *= envelope;
      }

      // Add cyberpunk-style modulation
      if (type === 'ambient' || type === 'hum') {
        const modulation = 1 + 0.1 * Math.sin(2 * Math.PI * 0.5 * t); // 0.5 Hz modulation
        sample *= modulation;
      }

      channelData[i] = sample * 0.1; // Keep volume low
    }

    return buffer;
  };

  // Play sound effect
  const playSound = (
    type: 'ambient' | 'hum' | 'click' | 'hover' | 'whoosh',
    options: {
      position?: [number, number, number];
      volume?: number;
      loop?: boolean;
      id?: string;
    } = {}
  ) => {
    if (!audioContextRef.current || !effectsGainRef.current || !isInitialized) return;

    const { position, volume = 1, loop = false, id = `${type}-${Date.now()}` } = options;

    // Create audio buffer if it doesn't exist
    const buffer = createProceduralAudio(type);
    if (!buffer) return;

    // Create source node
    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.loop = loop;

    // Create gain node for volume control
    const gainNode = audioContextRef.current.createGain();
    gainNode.gain.value = volume;

    // Create panner node for spatial audio if position is provided
    let pannerNode: PannerNode | undefined;
    if (audioConfig.spatialAudio && position) {
      pannerNode = audioContextRef.current.createPanner();
      pannerNode.panningModel = 'HRTF';
      pannerNode.distanceModel = 'inverse';
      pannerNode.refDistance = 1;
      pannerNode.maxDistance = 10;
      pannerNode.rolloffFactor = 1;
      pannerNode.coneInnerAngle = 360;
      pannerNode.coneOuterAngle = 0;
      pannerNode.coneOuterGain = 0;
      pannerNode.positionX.value = position[0];
      pannerNode.positionY.value = position[1];
      pannerNode.positionZ.value = position[2];
    }

    // Connect audio nodes
    if (pannerNode) {
      source.connect(gainNode);
      gainNode.connect(pannerNode);
      pannerNode.connect(effectsGainRef.current);
    } else {
      source.connect(gainNode);
      gainNode.connect(effectsGainRef.current);
    }

    // Store sound effect
    const soundEffect: SoundEffect = {
      id,
      buffer,
      source,
      gainNode,
      pannerNode,
      position,
      volume,
      loop,
      playing: true,
    };

    soundEffectsRef.current.set(id, soundEffect);

    // Start playback
    source.start();

    // Clean up when sound ends
    source.onended = () => {
      soundEffectsRef.current.delete(soundEffect.id);
    };

    return id;
  };

  // Stop sound effect
  const stopSound = (id: string) => {
    const sound = soundEffectsRef.current.get(id);
    if (sound && sound.source) {
      sound.source.stop();
      soundEffectsRef.current.delete(id);
    }
  };

  // Time-of-day ambient soundscape
  useEffect(() => {
    if (!audioConfig.backgroundMusic || !isInitialized) return;

    let ambientId: string | undefined;

    const startAmbientSound = () => {
      // Stop existing ambient sound
      if (ambientId) {
        stopSound(ambientId);
      }

      // Play new ambient sound based on time of day
      ambientId = playSound('ambient', {
        volume: 0.3,
        loop: true,
        id: `ambient-${timeOfDay}`,
      });
    };

    // Delay to ensure audio context is ready
    const timeout = setTimeout(startAmbientSound, 1000);

    return () => {
      clearTimeout(timeout);
      if (ambientId) {
        stopSound(ambientId);
      }
    };
  }, [timeOfDay, audioConfig.backgroundMusic, isInitialized]);

  // Update volume controls
  useEffect(() => {
    if (masterGainRef.current) {
      masterGainRef.current.gain.value = masterVolume;
    }
    if (musicGainRef.current) {
      musicGainRef.current.gain.value = musicVolume;
    }
    if (effectsGainRef.current) {
      effectsGainRef.current.gain.value = effectsVolume;
    }
  }, [masterVolume, musicVolume, effectsVolume]);

  // Note: Audio functions are available through the useAmbientSound hook

  // Global audio event handlers
  useEffect(() => {
    if (!audioConfig.uiFeedback || !isInitialized) return;

    const handleClick = () => {
      playSound('click', { volume: 0.5 });
    };

    const handleHover = () => {
      playSound('hover', { volume: 0.3 });
    };

    // Add global event listeners for UI feedback
    document.addEventListener('click', handleClick);
    
    // Add hover listeners to interactive elements
    const interactiveElements = document.querySelectorAll('button, a, [role="button"]');
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', handleHover);
    });

    return () => {
      document.removeEventListener('click', handleClick);
      interactiveElements.forEach(element => {
        element.removeEventListener('mouseenter', handleHover);
      });
    };
  }, [audioConfig.uiFeedback, isInitialized]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Stop all sounds
      soundEffectsRef.current.forEach((sound) => {
        if (sound.source) {
          sound.source.stop();
        }
      });
      soundEffectsRef.current.clear();

      // Close audio context
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  if (!audioConfig.backgroundMusic && !audioConfig.interactiveAudio) {
    return null;
  }

  return (
    <>
      {/* Audio context indicator */}
      {!isInitialized && (audioConfig.backgroundMusic || audioConfig.interactiveAudio) && (
        <div className="absolute bottom-4 right-4 z-50">
          <div className="bg-black/80 border border-cyan-400/50 px-3 py-2 text-xs font-mono text-cyan-400">
            Click anywhere to enable audio
          </div>
        </div>
      )}

      {/* Audio controls for debugging */}
      {process.env.NODE_ENV === 'development' && isInitialized && (
        <div className="absolute top-20 right-4 z-50 bg-black/80 border border-cyan-400/30 p-2">
          <div className="text-xs font-mono text-cyan-400 mb-2">Audio Debug</div>
          <div className="text-xs text-white">
            <div>Context State: {audioContextRef.current?.state}</div>
            <div>Active Sounds: {soundEffectsRef.current.size}</div>
            <div>Time of Day: {timeOfDay}</div>
          </div>
        </div>
      )}
    </>
  );
};

/**
 * Hook for controlling ambient sound system
 */
export function useAmbientSound() {
  const soundSystemRef = useRef<{
    playSound: (type: string, options?: any) => string | undefined;
    stopSound: (id: string) => void;
    isInitialized: boolean;
  } | null>(null);

  const playUISound = (type: 'click' | 'hover' | 'whoosh' = 'click') => {
    if (soundSystemRef.current?.isInitialized) {
      soundSystemRef.current.playSound(type, { volume: 0.5 });
    }
  };

  const playSpatialSound = (
    type: 'hum' | 'ambient',
    position: [number, number, number],
    options: { volume?: number; loop?: boolean } = {}
  ): string | undefined => {
    if (soundSystemRef.current?.isInitialized) {
      return soundSystemRef.current.playSound(type, { position, ...options });
    }
    return undefined;
  };

  return {
    playUISound,
    playSpatialSound,
    soundSystemRef,
  };
}

export default AmbientSoundSystem;