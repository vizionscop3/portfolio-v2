/**
 * Level of Detail (LOD) System for 3D Portfolio
 *
 * This system automatically adjusts model detail based on:
 * - Camera distance from objects
 * - Current performance metrics
 * - Device capabilities
 * - Viewport size and visibility (frustum culling)
 */

import * as THREE from 'three';
import { PerformanceMonitor, performanceMonitor } from './performance';

export interface LODLevel {
  distance: number;
  model?: THREE.Object3D;
  geometry?: THREE.BufferGeometry;
  material?: THREE.Material;
  visible: boolean;
  polygonCount: number;
  priority: 'high' | 'medium' | 'low';
}

export interface LODConfiguration {
  objectId: string;
  baseModel: THREE.Object3D;
  levels: LODLevel[];
  enableFrustumCulling: boolean;
  enableOcclusionCulling: boolean;
  minimumScreenSize: number; // Minimum pixels before culling
  hysteresis: number; // Distance hysteresis to prevent LOD flickering
}

export interface LODSystemOptions {
  enableAutoOptimization: boolean;
  performanceThreshold: number; // FPS threshold for automatic LOD adjustment
  maxDrawCalls: number;
  maxPolygons: number;
  enableDebugMode: boolean;
  updateFrequency: number; // milliseconds
}

export class LODSystem {
  private configurations: Map<string, LODConfiguration> = new Map();
  private lastUpdateTime: number = 0;
  private performanceMonitor: PerformanceMonitor;
  private camera: THREE.Camera | null = null;
  private scene: THREE.Scene | null = null;
  private frustum: THREE.Frustum = new THREE.Frustum();
  private cameraMatrix: THREE.Matrix4 = new THREE.Matrix4();
  private tempVector: THREE.Vector3 = new THREE.Vector3();
  private debugInfo: Map<string, Record<string, unknown>> = new Map();
  private options: LODSystemOptions;
  private currentQuality: 'high' | 'medium' | 'low' = 'high';

  constructor(options: Partial<LODSystemOptions> = {}) {
    this.options = {
      enableAutoOptimization: true,
      performanceThreshold: 45, // Target 45+ FPS
      maxDrawCalls: 100,
      maxPolygons: 50000,
      enableDebugMode: false,
      updateFrequency: 100,
      ...options,
    };

    this.performanceMonitor = performanceMonitor;

    // Subscribe to performance changes for automatic optimization
    if (this.options.enableAutoOptimization) {
      this.setupPerformanceBasedOptimization();
    }
  }

  /**
   * Initialize the LOD system with camera and scene references
   */
  public initialize(camera: THREE.Camera, scene: THREE.Scene): void {
    this.camera = camera;
    this.scene = scene;
  }

  /**
   * Register an object for LOD management
   */
  public registerObject(config: LODConfiguration): void {
    // Validate configuration
    this.validateConfiguration(config);

    // Set up LOD levels
    this.setupLODLevels(config);

    // Store configuration
    this.configurations.set(config.objectId, config);

    if (this.options.enableDebugMode) {
      // eslint-disable-next-line no-console
      console.log(
        `LOD: Registered object ${config.objectId} with ${config.levels.length} LOD levels`
      );
    }
  }

  /**
   * Update LOD system - call this in your render loop
   */
  public update(): void {
    const now = Date.now();
    if (now - this.lastUpdateTime < this.options.updateFrequency) {
      return;
    }

    if (!this.camera || !this.scene) {
      return;
    }

    this.lastUpdateTime = now;

    // Update frustum for culling
    this.updateFrustum();

    // Update each registered object's LOD
    for (const [objectId, config] of this.configurations) {
      this.updateObjectLOD(objectId, config);
    }

    // Update performance-based optimizations
    if (this.options.enableAutoOptimization) {
      this.updatePerformanceBasedLOD();
    }

    // Update debug information
    if (this.options.enableDebugMode) {
      this.updateDebugInfo();
    }
  }

  /**
   * Get current LOD statistics
   */
  public getStatistics(): {
    totalObjects: number;
    visibleObjects: number;
    totalPolygons: number;
    currentQuality: string;
    frustumCulled: number;
    occlusionCulled: number;
  } {
    let visibleObjects = 0;
    let totalPolygons = 0;
    let frustumCulled = 0;
    let occlusionCulled = 0;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [_, config] of this.configurations) {
      const activeLevel = this.getActiveLODLevel(config);
      if (activeLevel?.visible) {
        visibleObjects++;
        totalPolygons += activeLevel.polygonCount;
      } else {
        if (this.isObjectInFrustum(config.baseModel)) {
          occlusionCulled++;
        } else {
          frustumCulled++;
        }
      }
    }

    return {
      totalObjects: this.configurations.size,
      visibleObjects,
      totalPolygons,
      currentQuality: this.currentQuality,
      frustumCulled,
      occlusionCulled,
    };
  }

  /**
   * Force a quality level for all objects
   */
  public setQualityLevel(quality: 'high' | 'medium' | 'low'): void {
    this.currentQuality = quality;

    // Update all objects to use the new quality level
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [_, config] of this.configurations) {
      this.applyQualityBasedLOD(config, quality);
    }
  }

  /**
   * Get debug information for specific object
   */
  public getObjectDebugInfo(
    objectId: string
  ): Record<string, unknown> | undefined {
    return this.debugInfo.get(objectId);
  }

  /**
   * Clean up LOD system
   */
  public dispose(): void {
    this.configurations.clear();
    this.debugInfo.clear();
  }

  private validateConfiguration(config: LODConfiguration): void {
    if (!config.objectId || !config.baseModel || !config.levels.length) {
      throw new Error('Invalid LOD configuration: missing required properties');
    }

    // Sort levels by distance
    config.levels.sort((a, b) => a.distance - b.distance);

    // Validate distance ordering
    for (let i = 1; i < config.levels.length; i++) {
      if (config.levels[i].distance <= config.levels[i - 1].distance) {
        throw new Error(
          `Invalid LOD configuration: distances must be in ascending order for ${config.objectId}`
        );
      }
    }
  }

  private setupLODLevels(config: LODConfiguration): void {
    // If no models are provided, generate simplified versions
    for (let i = 0; i < config.levels.length; i++) {
      const level = config.levels[i];

      if (!level.model && !level.geometry) {
        // Generate simplified geometry based on level
        const simplificationRatio = 1 - i * 0.3; // 100%, 70%, 40%, etc.
        level.geometry = this.createSimplifiedGeometry(
          config.baseModel,
          simplificationRatio
        );
        level.polygonCount = this.calculatePolygonCount(level.geometry);
      }
    }
  }

  private updateFrustum(): void {
    if (!this.camera) return;

    this.cameraMatrix.multiplyMatrices(
      this.camera.projectionMatrix,
      this.camera.matrixWorldInverse
    );
    this.frustum.setFromProjectionMatrix(this.cameraMatrix);
  }

  private updateObjectLOD(_objectId: string, config: LODConfiguration): void {
    const distance = this.calculateDistance(config.baseModel);
    const isInFrustum = config.enableFrustumCulling
      ? this.isObjectInFrustum(config.baseModel)
      : true;
    const screenSize = this.calculateScreenSize(config.baseModel);

    // Cull if too small on screen
    if (screenSize < config.minimumScreenSize) {
      this.setObjectVisibility(config, false);
      return;
    }

    // Cull if outside frustum
    if (!isInFrustum) {
      this.setObjectVisibility(config, false);
      return;
    }

    // Select appropriate LOD level
    const lodLevel = this.selectLODLevel(config, distance);
    this.applyLODLevel(config, lodLevel);
  }

  private calculateDistance(object: THREE.Object3D): number {
    if (!this.camera) return 0;

    object.getWorldPosition(this.tempVector);
    return this.camera.position.distanceTo(this.tempVector);
  }

  private isObjectInFrustum(object: THREE.Object3D): boolean {
    // Use bounding sphere for fast frustum test
    let boundingSphere: THREE.Sphere | null = null;

    // Try to find geometry in the object hierarchy
    object.traverse(child => {
      if (child instanceof THREE.Mesh && child.geometry && !boundingSphere) {
        child.geometry.computeBoundingSphere();
        const sphere = child.geometry.boundingSphere;
        if (sphere) {
          boundingSphere = sphere;
        }
      }
    });

    if (!boundingSphere) return true; // Assume visible if no geometry found

    // Transform bounding sphere to world space - use type assertion for safety
    try {
      const sphere = boundingSphere as THREE.Sphere;
      const worldSphere = new THREE.Sphere(
        sphere.center.clone(),
        sphere.radius
      );
      worldSphere.applyMatrix4(object.matrixWorld);
      return this.frustum.intersectsSphere(worldSphere);
    } catch {
      return true; // Default to visible if transformation fails
    }
  }

  private calculateScreenSize(object: THREE.Object3D): number {
    if (!this.camera) return 1000;

    let boundingSphere: THREE.Sphere | null = null;

    // Try to find geometry in the object hierarchy
    object.traverse(child => {
      if (child instanceof THREE.Mesh && child.geometry && !boundingSphere) {
        child.geometry.computeBoundingSphere();
        const sphere = child.geometry.boundingSphere;
        if (sphere) {
          boundingSphere = sphere;
        }
      }
    });

    if (!boundingSphere) return 1000; // Default large size if no geometry

    const distance = this.calculateDistance(object);
    const fov = (this.camera as THREE.PerspectiveCamera).fov || 75;
    const screenHeight = window.innerHeight;

    // Calculate projected size - use type assertion for safety
    try {
      const sphere = boundingSphere as THREE.Sphere;
      const projectedRadius =
        (sphere.radius * screenHeight) /
        (2 * distance * Math.tan((fov * Math.PI) / 360));
      return projectedRadius * 2;
    } catch {
      return 1000; // Default size if calculation fails
    }
  }

  private selectLODLevel(config: LODConfiguration, distance: number): LODLevel {
    // Add hysteresis to prevent flickering
    const hysteresis = config.hysteresis || 5;
    const currentLevel = this.getActiveLODLevel(config);

    let selectedLevel = config.levels[config.levels.length - 1]; // Default to lowest detail

    for (let i = 0; i < config.levels.length; i++) {
      const level = config.levels[i];
      let threshold = level.distance;

      // Apply hysteresis if switching to lower detail
      if (currentLevel && i > config.levels.indexOf(currentLevel)) {
        threshold += hysteresis;
      } else if (currentLevel && i < config.levels.indexOf(currentLevel)) {
        threshold -= hysteresis;
      }

      if (distance <= threshold) {
        selectedLevel = level;
        break;
      }
    }

    return selectedLevel;
  }

  private applyLODLevel(config: LODConfiguration, level: LODLevel): void {
    // Hide all LOD levels
    config.levels.forEach(l => {
      if (l.model) {
        l.model.visible = false;
      }
    });

    // Show selected level
    const modelToShow = level.model || this.createModelFromLevel(level, config);
    if (modelToShow) {
      modelToShow.visible = true;
      modelToShow.position.copy(config.baseModel.position);
      modelToShow.rotation.copy(config.baseModel.rotation);
      modelToShow.scale.copy(config.baseModel.scale);
    }

    // Update base model visibility
    config.baseModel.visible = level === config.levels[0];
  }

  private getActiveLODLevel(config: LODConfiguration): LODLevel | null {
    return config.levels.find(level => level.visible) || null;
  }

  private setObjectVisibility(
    config: LODConfiguration,
    visible: boolean
  ): void {
    config.baseModel.visible = visible;
    config.levels.forEach(level => {
      if (level.model) {
        level.model.visible = visible;
      }
    });
  }

  private setupPerformanceBasedOptimization(): void {
    // Monitor performance and adjust LOD accordingly
    setInterval(() => {
      const fps = this.performanceMonitor.getAverageFps();

      if (fps < this.options.performanceThreshold) {
        // Performance is poor, reduce quality
        if (this.currentQuality === 'high') {
          this.setQualityLevel('medium');
        } else if (this.currentQuality === 'medium') {
          this.setQualityLevel('low');
        }
      } else if (fps > this.options.performanceThreshold + 10) {
        // Performance is good, increase quality if possible
        if (this.currentQuality === 'low') {
          this.setQualityLevel('medium');
        } else if (this.currentQuality === 'medium') {
          this.setQualityLevel('high');
        }
      }
    }, 2000); // Check every 2 seconds
  }

  private updatePerformanceBasedLOD(): void {
    const stats = this.getStatistics();

    // If polygon count is too high, force lower quality
    if (stats.totalPolygons > this.options.maxPolygons) {
      if (this.currentQuality !== 'low') {
        this.setQualityLevel('low');
      }
    }
  }

  private applyQualityBasedLOD(
    config: LODConfiguration,
    quality: 'high' | 'medium' | 'low'
  ): void {
    let targetIndex: number;

    switch (quality) {
      case 'high':
        targetIndex = 0;
        break;
      case 'medium':
        targetIndex = Math.min(1, config.levels.length - 1);
        break;
      case 'low':
        targetIndex = config.levels.length - 1;
        break;
    }

    const targetLevel = config.levels[targetIndex];
    if (targetLevel) {
      this.applyLODLevel(config, targetLevel);
    }
  }

  private createSimplifiedGeometry(
    baseModel: THREE.Object3D,
    ratio: number
  ): THREE.BufferGeometry {
    // This is a simplified implementation
    // In a real scenario, you'd use algorithms like QEM (Quadric Error Metrics) for mesh simplification

    let baseGeometry: THREE.BufferGeometry | null = null;

    baseModel.traverse(child => {
      if (child instanceof THREE.Mesh && child.geometry) {
        baseGeometry = child.geometry;
        return;
      }
    });

    if (!baseGeometry) {
      return new THREE.BoxGeometry(1, 1, 1);
    }

    // Simple decimation by removing vertices
    const geometry = (baseGeometry as THREE.BufferGeometry).clone();
    const positions = geometry.attributes.position;

    if (positions && ratio < 1) {
      const originalCount = positions.count;
      const targetCount = Math.floor(originalCount * ratio);
      const newPositions = new Float32Array(targetCount * 3);

      const step = originalCount / targetCount;
      for (let i = 0; i < targetCount; i++) {
        const sourceIndex = Math.floor(i * step);
        newPositions[i * 3] = positions.array[sourceIndex * 3];
        newPositions[i * 3 + 1] = positions.array[sourceIndex * 3 + 1];
        newPositions[i * 3 + 2] = positions.array[sourceIndex * 3 + 2];
      }

      geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(newPositions, 3)
      );
    }

    return geometry;
  }

  private calculatePolygonCount(geometry: THREE.BufferGeometry): number {
    if (geometry.index) {
      return geometry.index.count / 3;
    } else {
      return geometry.attributes.position.count / 3;
    }
  }

  private createModelFromLevel(
    level: LODLevel,
    _config: LODConfiguration
  ): THREE.Object3D | null {
    if (level.geometry) {
      const mesh = new THREE.Mesh(level.geometry, level.material);
      return mesh;
    }
    return null;
  }

  private updateDebugInfo(): void {
    for (const [objectId, config] of this.configurations) {
      const distance = this.calculateDistance(config.baseModel);
      const activeLevel = this.getActiveLODLevel(config);
      const isInFrustum = this.isObjectInFrustum(config.baseModel);
      const screenSize = this.calculateScreenSize(config.baseModel);

      this.debugInfo.set(objectId, {
        distance,
        activeLODIndex: activeLevel ? config.levels.indexOf(activeLevel) : -1,
        isInFrustum,
        screenSize,
        polygonCount: activeLevel?.polygonCount || 0,
        isVisible: config.baseModel.visible,
      });
    }
  }
}

// Singleton instance for global access
let lodSystemInstance: LODSystem | null = null;

export const getLODSystem = (
  options?: Partial<LODSystemOptions>
): LODSystem => {
  if (!lodSystemInstance) {
    lodSystemInstance = new LODSystem(options);
  }
  return lodSystemInstance;
};
