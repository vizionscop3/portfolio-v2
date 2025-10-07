import { AssetItem, assetLoader } from './assetLoader';

// Asset categories for the portfolio
export const ASSET_CATEGORIES = {
  CRITICAL: 'critical',
  TEXTURES: 'textures',
  MODELS: 'models',
  IMAGES: 'images',
  AUDIO: 'audio',
  FONTS: 'fonts',
  UI: 'ui',
} as const;

// Portfolio-specific assets
export const portfolioAssets: Array<
  Omit<AssetItem, 'cached' | 'loadTime' | 'retryCount'>
> = [
  // Critical system assets
  {
    id: 'main-font',
    url: '/fonts/inter-variable.woff2',
    type: 'font',
    priority: 'critical',
    size: 45000,
    preload: true,
    metadata: { category: ASSET_CATEGORIES.CRITICAL },
  },
  {
    id: 'cyberpunk-font',
    url: '/fonts/orbitron-variable.woff2',
    type: 'font',
    priority: 'critical',
    size: 38000,
    preload: true,
    metadata: { category: ASSET_CATEGORIES.CRITICAL },
  },

  // 3D Models - Critical interactive objects
  {
    id: 'holographic-computer',
    url: '/models/holographic-computer.glb',
    type: 'model',
    priority: 'critical',
    size: 850000,
    preload: true,
    metadata: {
      category: ASSET_CATEGORIES.MODELS,
      section: 'tech',
      description: 'Main holographic computer for tech section navigation',
    },
  },
  {
    id: 'digital-codex',
    url: '/models/digital-codex.glb',
    type: 'model',
    priority: 'critical',
    size: 720000,
    preload: true,
    metadata: {
      category: ASSET_CATEGORIES.MODELS,
      section: 'blog',
      description: 'Digital book for blog section navigation',
    },
  },
  {
    id: 'neon-wardrobe',
    url: '/models/neon-wardrobe.glb',
    type: 'model',
    priority: 'critical',
    size: 950000,
    preload: true,
    metadata: {
      category: ASSET_CATEGORIES.MODELS,
      section: 'fashion',
      description: 'Neon wardrobe pod for fashion section',
    },
  },
  {
    id: 'merch-display',
    url: '/models/merch-display.glb',
    type: 'model',
    priority: 'high',
    size: 680000,
    metadata: {
      category: ASSET_CATEGORIES.MODELS,
      section: 'merch',
      description: 'Holographic merchandise display',
    },
  },
  {
    id: 'audio-station',
    url: '/models/audio-station.glb',
    type: 'model',
    priority: 'high',
    size: 890000,
    metadata: {
      category: ASSET_CATEGORIES.MODELS,
      section: 'about',
      description: 'Futuristic audio engineering station',
    },
  },

  // Room environment models
  {
    id: 'room-environment',
    url: '/models/cyberpunk-room.glb',
    type: 'model',
    priority: 'critical',
    size: 1200000,
    preload: true,
    metadata: {
      category: ASSET_CATEGORIES.MODELS,
      description: 'Main cyberpunk room environment',
    },
  },
  {
    id: 'city-skyline',
    url: '/models/city-skyline.glb',
    type: 'model',
    priority: 'medium',
    size: 1500000,
    metadata: {
      category: ASSET_CATEGORIES.MODELS,
      description: 'Background city skyline visible through window',
    },
  },

  // Textures - High priority for visual quality
  {
    id: 'hologram-texture',
    url: '/textures/hologram-material.jpg',
    type: 'texture',
    priority: 'high',
    size: 320000,
    metadata: {
      category: ASSET_CATEGORIES.TEXTURES,
      usage: 'holographic effects on interactive objects',
    },
  },
  {
    id: 'neon-glow-texture',
    url: '/textures/neon-glow.jpg',
    type: 'texture',
    priority: 'high',
    size: 280000,
    metadata: {
      category: ASSET_CATEGORIES.TEXTURES,
      usage: 'neon lighting effects',
    },
  },
  {
    id: 'metal-surface-texture',
    url: '/textures/cyberpunk-metal.jpg',
    type: 'texture',
    priority: 'high',
    size: 450000,
    metadata: {
      category: ASSET_CATEGORIES.TEXTURES,
      usage: 'metallic surfaces on objects and room',
    },
  },
  {
    id: 'glass-material-texture',
    url: '/textures/futuristic-glass.jpg',
    type: 'texture',
    priority: 'medium',
    size: 380000,
    metadata: {
      category: ASSET_CATEGORIES.TEXTURES,
      usage: 'transparent glass materials',
    },
  },
  {
    id: 'particle-texture',
    url: '/textures/particle-sprite.png',
    type: 'texture',
    priority: 'medium',
    size: 15000,
    metadata: {
      category: ASSET_CATEGORIES.TEXTURES,
      usage: 'particle effects and atmospheric elements',
    },
  },

  // UI Images - Portfolio content
  {
    id: 'profile-avatar',
    url: '/images/denward-avatar.jpg',
    type: 'image',
    priority: 'high',
    size: 85000,
    preload: true,
    metadata: {
      category: ASSET_CATEGORIES.IMAGES,
      section: 'about',
    },
  },
  {
    id: 'hero-background',
    url: '/images/cyberpunk-hero-bg.jpg',
    type: 'image',
    priority: 'critical',
    size: 650000,
    preload: true,
    metadata: {
      category: ASSET_CATEGORIES.IMAGES,
      usage: 'main hero section background',
    },
  },

  // Project showcase images
  {
    id: 'project-1-preview',
    url: '/images/projects/project-1-preview.jpg',
    type: 'image',
    priority: 'medium',
    size: 180000,
    metadata: {
      category: ASSET_CATEGORIES.IMAGES,
      section: 'tech',
      project: 'project-1',
    },
  },
  {
    id: 'project-2-preview',
    url: '/images/projects/project-2-preview.jpg',
    type: 'image',
    priority: 'medium',
    size: 195000,
    metadata: {
      category: ASSET_CATEGORIES.IMAGES,
      section: 'tech',
      project: 'project-2',
    },
  },
  {
    id: 'project-3-preview',
    url: '/images/projects/project-3-preview.jpg',
    type: 'image',
    priority: 'medium',
    size: 210000,
    metadata: {
      category: ASSET_CATEGORIES.IMAGES,
      section: 'tech',
      project: 'project-3',
    },
  },

  // Fashion gallery images
  {
    id: 'fashion-item-1',
    url: '/images/fashion/fashion-1.jpg',
    type: 'image',
    priority: 'low',
    size: 320000,
    metadata: {
      category: ASSET_CATEGORIES.IMAGES,
      section: 'fashion',
    },
  },
  {
    id: 'fashion-item-2',
    url: '/images/fashion/fashion-2.jpg',
    type: 'image',
    priority: 'low',
    size: 340000,
    metadata: {
      category: ASSET_CATEGORIES.IMAGES,
      section: 'fashion',
    },
  },
  {
    id: 'fashion-item-3',
    url: '/images/fashion/fashion-3.jpg',
    type: 'image',
    priority: 'low',
    size: 315000,
    metadata: {
      category: ASSET_CATEGORIES.IMAGES,
      section: 'fashion',
    },
  },

  // Audio assets
  {
    id: 'ambient-cyberpunk',
    url: '/audio/ambient-cyberpunk.mp3',
    type: 'audio',
    priority: 'low',
    size: 2800000,
    metadata: {
      category: ASSET_CATEGORIES.AUDIO,
      usage: 'background ambient music',
      duration: '180s',
    },
  },
  {
    id: 'interaction-sound',
    url: '/audio/interaction-beep.mp3',
    type: 'audio',
    priority: 'medium',
    size: 25000,
    metadata: {
      category: ASSET_CATEGORIES.AUDIO,
      usage: 'object interaction feedback',
    },
  },
  {
    id: 'hologram-hum',
    url: '/audio/hologram-hum.mp3',
    type: 'audio',
    priority: 'low',
    size: 180000,
    metadata: {
      category: ASSET_CATEGORIES.AUDIO,
      usage: 'holographic object ambient sound',
    },
  },

  // UI Icons and graphics
  {
    id: 'loading-icon',
    url: '/images/icons/loading-spinner.svg',
    type: 'image',
    priority: 'critical',
    size: 3500,
    preload: true,
    metadata: {
      category: ASSET_CATEGORIES.UI,
      usage: 'loading screens and progress indicators',
    },
  },
  {
    id: 'error-icon',
    url: '/images/icons/error-indicator.svg',
    type: 'image',
    priority: 'high',
    size: 2800,
    metadata: {
      category: ASSET_CATEGORIES.UI,
      usage: 'error states and feedback',
    },
  },
];

// Asset dependency mapping
export const assetDependencies = {
  'holographic-computer': ['hologram-texture', 'metal-surface-texture'],
  'digital-codex': ['hologram-texture', 'glass-material-texture'],
  'neon-wardrobe': ['neon-glow-texture', 'metal-surface-texture'],
  'merch-display': ['hologram-texture', 'glass-material-texture'],
  'audio-station': ['metal-surface-texture', 'neon-glow-texture'],
  'room-environment': [
    'metal-surface-texture',
    'glass-material-texture',
    'particle-texture',
  ],
};

// Initialize the asset loader with portfolio assets
export function initializeAssetLoader(): void {
  // Register all assets with dependencies
  portfolioAssets.forEach(asset => {
    const dependencies =
      assetDependencies[asset.id as keyof typeof assetDependencies];
    assetLoader.registerAsset({
      ...asset,
      dependencies,
    });
  });
}

// Utility functions for asset management
export function getAssetsBySection(sectionId: string): string[] {
  return portfolioAssets
    .filter(asset => asset.metadata?.section === sectionId)
    .map(asset => asset.id);
}

export function getAssetsByCategory(category: string): string[] {
  return portfolioAssets
    .filter(asset => asset.metadata?.category === category)
    .map(asset => asset.id);
}

export function getCriticalAssets(): string[] {
  return portfolioAssets
    .filter(asset => asset.priority === 'critical')
    .map(asset => asset.id);
}

export function getPreloadAssets(): string[] {
  return portfolioAssets
    .filter(asset => asset.preload === true)
    .map(asset => asset.id);
}

export function getTotalAssetSize(): number {
  return portfolioAssets.reduce((total, asset) => total + (asset.size || 0), 0);
}

export function getAssetSizeByPriority(): Record<string, number> {
  const sizeByPriority: Record<string, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };

  portfolioAssets.forEach(asset => {
    sizeByPriority[asset.priority] += asset.size || 0;
  });

  return sizeByPriority;
}

// Progressive loading strategy
export const loadingStrategy = {
  // Phase 1: Critical assets for basic functionality
  phase1: getCriticalAssets(),

  // Phase 2: High priority assets for immediate sections
  phase2: portfolioAssets
    .filter(asset => asset.priority === 'high')
    .map(asset => asset.id),

  // Phase 3: Medium priority assets for secondary content
  phase3: portfolioAssets
    .filter(asset => asset.priority === 'medium')
    .map(asset => asset.id),

  // Phase 4: Low priority assets loaded on demand
  phase4: portfolioAssets
    .filter(asset => asset.priority === 'low')
    .map(asset => asset.id),
};

// Asset loading configuration for different performance modes
export const performanceConfigs = {
  high: {
    preloadPhases: ['phase1', 'phase2', 'phase3'],
    enableCaching: true,
    maxConcurrentLoads: 6,
    loadAudio: true,
  },
  medium: {
    preloadPhases: ['phase1', 'phase2'],
    enableCaching: true,
    maxConcurrentLoads: 4,
    loadAudio: false,
  },
  low: {
    preloadPhases: ['phase1'],
    enableCaching: true,
    maxConcurrentLoads: 2,
    loadAudio: false,
  },
};

// Initialize asset loader when module is imported
initializeAssetLoader();
