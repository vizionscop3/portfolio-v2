export type AssetType =
  | 'image'
  | 'texture'
  | 'model'
  | 'audio'
  | 'video'
  | 'font';

export type AssetPriority = 'critical' | 'high' | 'medium' | 'low';

export interface AssetItem {
  id: string;
  url: string;
  type: AssetType;
  priority: AssetPriority;
  size?: number;
  preload?: boolean;
  cached?: boolean;
  loadTime?: number;
  retryCount?: number;
  dependencies?: string[];
  metadata?: Record<string, unknown>;
}

export interface LoadingProgress {
  loaded: number;
  total: number;
  percentage: number;
  currentAsset?: AssetItem;
  phase: 'initializing' | 'loading' | 'complete' | 'error';
  errors: AssetLoadError[];
}

export interface AssetLoadError {
  assetId: string;
  url: string;
  error: Error;
  timestamp: number;
  retryCount: number;
}

export interface AssetLoaderConfig {
  maxConcurrentLoads: number;
  retryAttempts: number;
  retryDelay: number;
  timeout: number;
  enableCaching: boolean;
  cacheExpiration: number; // in milliseconds
  preloadCritical: boolean;
  progressThrottleMs: number;
}

export class AssetLoader {
  private config: AssetLoaderConfig;
  private assets: Map<string, AssetItem> = new Map();
  private loadedAssets: Map<string, unknown> = new Map();
  // Note: loadingQueue reserved for future priority queue implementation
  private activeLoads: Map<string, Promise<unknown>> = new Map();
  private progressCallbacks: Set<(progress: LoadingProgress) => void> =
    new Set();
  private cache: Map<
    string,
    { data: unknown; timestamp: number; size: number }
  > = new Map();
  private totalAssetsSize: number = 0;
  private loadedAssetsSize: number = 0;
  private errors: AssetLoadError[] = [];

  constructor(config: Partial<AssetLoaderConfig> = {}) {
    this.config = {
      maxConcurrentLoads: 4,
      retryAttempts: 3,
      retryDelay: 1000,
      timeout: 30000,
      enableCaching: true,
      cacheExpiration: 24 * 60 * 60 * 1000, // 24 hours
      preloadCritical: true,
      progressThrottleMs: 100,
      ...config,
    };

    this.initializeCache();
  }

  private initializeCache(): void {
    if (!this.config.enableCaching) return;

    try {
      const savedCache = localStorage.getItem('assetLoaderCache');
      if (savedCache) {
        const parsed = JSON.parse(savedCache);
        const now = Date.now();

        // Filter out expired cache entries
        Object.entries(parsed).forEach(([key, value]: [string, any]) => {
          if (now - value.timestamp < this.config.cacheExpiration) {
            this.cache.set(key, value);
          }
        });
      }
    } catch (error) {
      console.warn('Failed to load asset cache:', error);
    }
  }

  private saveCache(): void {
    if (!this.config.enableCaching) return;

    try {
      const cacheData: Record<string, unknown> = {};
      this.cache.forEach((value, key) => {
        cacheData[key] = value;
      });
      localStorage.setItem('assetLoaderCache', JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to save asset cache:', error);
    }
  }

  registerAsset(
    asset: Omit<AssetItem, 'cached' | 'loadTime' | 'retryCount'>
  ): void {
    const assetItem: AssetItem = {
      ...asset,
      cached: this.cache.has(asset.url),
      loadTime: 0,
      retryCount: 0,
    };

    this.assets.set(asset.id, assetItem);
    this.totalAssetsSize += asset.size || 0;

    // Auto-preload critical assets
    if (this.config.preloadCritical && asset.priority === 'critical') {
      this.loadAsset(asset.id);
    }
  }

  registerAssets(
    assets: Array<Omit<AssetItem, 'cached' | 'loadTime' | 'retryCount'>>
  ): void {
    assets.forEach(asset => this.registerAsset(asset));
  }

  async loadAsset(assetId: string): Promise<unknown> {
    const asset = this.assets.get(assetId);
    if (!asset) {
      throw new Error(`Asset not found: ${assetId}`);
    }

    // Return cached asset if available
    if (this.loadedAssets.has(assetId)) {
      return this.loadedAssets.get(assetId);
    }

    // Return existing loading promise if already loading
    if (this.activeLoads.has(assetId)) {
      return this.activeLoads.get(assetId);
    }

    const loadPromise = this.performAssetLoad(asset);
    this.activeLoads.set(assetId, loadPromise);

    try {
      const result = await loadPromise;
      this.loadedAssets.set(assetId, result);
      this.activeLoads.delete(assetId);

      // Update progress
      this.loadedAssetsSize += asset.size || 0;
      this.updateProgress();

      return result;
    } catch (error) {
      this.activeLoads.delete(assetId);
      this.handleLoadError(asset, error as Error);
      throw error;
    }
  }

  private async performAssetLoad(asset: AssetItem): Promise<unknown> {
    const startTime = performance.now();

    // Check cache first
    if (this.config.enableCaching && this.cache.has(asset.url)) {
      const cached = this.cache.get(asset.url)!;
      const now = Date.now();

      if (now - cached.timestamp < this.config.cacheExpiration) {
        asset.loadTime = performance.now() - startTime;
        return cached.data;
      } else {
        this.cache.delete(asset.url);
      }
    }

    // Load dependencies first
    if (asset.dependencies?.length) {
      await Promise.all(asset.dependencies.map(depId => this.loadAsset(depId)));
    }

    let result: unknown;

    try {
      result = await this.loadByType(asset);
      asset.loadTime = performance.now() - startTime;

      // Cache the result
      if (this.config.enableCaching) {
        this.cache.set(asset.url, {
          data: result,
          timestamp: Date.now(),
          size: asset.size || 0,
        });
        this.saveCache();
      }

      return result;
    } catch (error) {
      const currentRetryCount = asset.retryCount || 0;
      if (currentRetryCount < this.config.retryAttempts) {
        asset.retryCount = currentRetryCount + 1;
        await this.delay(this.config.retryDelay);
        return this.performAssetLoad(asset);
      }
      throw error;
    }
  }

  private async loadByType(asset: AssetItem): Promise<unknown> {
    switch (asset.type) {
      case 'image':
        return this.loadImage(asset.url);
      case 'texture':
        return this.loadTexture(asset.url);
      case 'model':
        return this.loadModel(asset.url);
      case 'audio':
        return this.loadAudio(asset.url);
      case 'video':
        return this.loadVideo(asset.url);
      case 'font':
        return this.loadFont(asset.url);
      default:
        return fetch(asset.url).then(response => response.blob());
    }
  }

  private loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      const timeout = setTimeout(() => {
        reject(new Error(`Image load timeout: ${url}`));
      }, this.config.timeout);

      img.onload = () => {
        clearTimeout(timeout);
        resolve(img);
      };

      img.onerror = () => {
        clearTimeout(timeout);
        reject(new Error(`Failed to load image: ${url}`));
      };

      img.src = url;
    });
  }

  private async loadTexture(url: string): Promise<HTMLImageElement> {
    // For now, textures are loaded as images
    // This can be extended for WebGL texture creation
    return this.loadImage(url);
  }

  private async loadModel(url: string): Promise<ArrayBuffer> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load model: ${url}`);
    }
    return response.arrayBuffer();
  }

  private loadAudio(url: string): Promise<HTMLAudioElement> {
    return new Promise((resolve, reject) => {
      const audio = new Audio();

      const timeout = setTimeout(() => {
        reject(new Error(`Audio load timeout: ${url}`));
      }, this.config.timeout);

      const cleanup = () => {
        clearTimeout(timeout);
        audio.removeEventListener('canplaythrough', onLoad);
        audio.removeEventListener('error', onError);
      };

      const onLoad = () => {
        cleanup();
        resolve(audio);
      };

      const onError = () => {
        cleanup();
        reject(new Error(`Failed to load audio: ${url}`));
      };

      audio.addEventListener('canplaythrough', onLoad);
      audio.addEventListener('error', onError);
      audio.src = url;
    });
  }

  private loadVideo(url: string): Promise<HTMLVideoElement> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';

      const timeout = setTimeout(() => {
        reject(new Error(`Video load timeout: ${url}`));
      }, this.config.timeout);

      const cleanup = () => {
        clearTimeout(timeout);
        video.removeEventListener('canplaythrough', onLoad);
        video.removeEventListener('error', onError);
      };

      const onLoad = () => {
        cleanup();
        resolve(video);
      };

      const onError = () => {
        cleanup();
        reject(new Error(`Failed to load video: ${url}`));
      };

      video.addEventListener('canplaythrough', onLoad);
      video.addEventListener('error', onError);
      video.src = url;
    });
  }

  private async loadFont(url: string): Promise<void> {
    if ('fonts' in document) {
      const font = new FontFace('CustomFont', `url(${url})`);
      await font.load();
      document.fonts.add(font);
    } else {
      // Fallback for browsers without FontFace API
      const link = (
        typeof document !== 'undefined' ? document : ({} as any)
      ).createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      (typeof document !== 'undefined'
        ? document
        : ({} as any)
      ).head.appendChild(link);

      return new Promise(resolve => {
        link.onload = () => resolve();
        link.onerror = () => resolve(); // Don't reject, fonts are optional
      });
    }
  }

  async loadAssetsByPriority(
    priority: AssetPriority
  ): Promise<Map<string, unknown>> {
    const assetsToLoad = Array.from(this.assets.values())
      .filter(asset => asset.priority === priority)
      .map(asset => asset.id);

    const results = new Map<string, unknown>();

    for (const assetId of assetsToLoad) {
      try {
        const result = await this.loadAsset(assetId);
        results.set(assetId, result);
      } catch (error) {
        console.warn(`Failed to load asset ${assetId}:`, error);
      }
    }

    return results;
  }

  async preloadCriticalAssets(): Promise<void> {
    await this.loadAssetsByPriority('critical');
  }

  async loadAllAssets(): Promise<Map<string, unknown>> {
    // const allAssetIds = Array.from(this.assets.keys());
    const results = new Map<string, unknown>();

    // Load assets by priority
    const priorities: AssetPriority[] = ['critical', 'high', 'medium', 'low'];

    for (const priority of priorities) {
      const priorityResults = await this.loadAssetsByPriority(priority);
      priorityResults.forEach((value, key) => results.set(key, value));
    }

    return results;
  }

  getAsset(assetId: string): unknown | null {
    return this.loadedAssets.get(assetId) || null;
  }

  isAssetLoaded(assetId: string): boolean {
    return this.loadedAssets.has(assetId);
  }

  getLoadingProgress(): LoadingProgress {
    const loaded = this.loadedAssets.size;
    const total = this.assets.size;

    return {
      loaded,
      total,
      percentage: total > 0 ? (loaded / total) * 100 : 0,
      phase: this.getLoadingPhase(),
      errors: [...this.errors],
    };
  }

  private getLoadingPhase(): LoadingProgress['phase'] {
    if (this.errors.length > 0 && this.activeLoads.size === 0) {
      return 'error';
    }

    if (this.loadedAssets.size === this.assets.size) {
      return 'complete';
    }

    if (this.activeLoads.size > 0) {
      return 'loading';
    }

    return 'initializing';
  }

  onProgress(callback: (progress: LoadingProgress) => void): () => void {
    this.progressCallbacks.add(callback);
    return () => this.progressCallbacks.delete(callback);
  }

  private updateProgress(): void {
    const progress = this.getLoadingProgress();
    this.progressCallbacks.forEach(callback => callback(progress));
  }

  private handleLoadError(asset: AssetItem, error: Error): void {
    const loadError: AssetLoadError = {
      assetId: asset.id,
      url: asset.url,
      error,
      timestamp: Date.now(),
      retryCount: asset.retryCount || 0,
    };

    this.errors.push(loadError);
    this.updateProgress();
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  clearCache(): void {
    this.cache.clear();
    if (this.config.enableCaching) {
      localStorage.removeItem('assetLoaderCache');
    }
  }

  getCacheInfo(): { size: number; entries: number; totalSize: number } {
    let totalSize = 0;
    this.cache.forEach(entry => {
      totalSize += entry.size || 0;
    });

    return {
      size: totalSize,
      entries: this.cache.size,
      totalSize: this.totalAssetsSize,
    };
  }

  dispose(): void {
    this.activeLoads.clear();
    this.progressCallbacks.clear();
    this.loadedAssets.clear();
    this.saveCache();
  }
}

// Singleton instance
export const assetLoader = new AssetLoader();
