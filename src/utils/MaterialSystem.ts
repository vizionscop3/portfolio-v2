import * as THREE from 'three';
import { MaterialConfig } from '../types/interactive';

/**
 * Material system for managing textures and materials efficiently
 */
export class MaterialSystem {
  private static instance: MaterialSystem;
  private textureLoader: THREE.TextureLoader;
  private materialCache: Map<string, THREE.Material> = new Map();
  private textureCache: Map<string, THREE.Texture> = new Map();

  constructor() {
    this.textureLoader = new THREE.TextureLoader();
  }

  static getInstance(): MaterialSystem {
    if (!MaterialSystem.instance) {
      MaterialSystem.instance = new MaterialSystem();
    }
    return MaterialSystem.instance;
  }

  /**
   * Create or retrieve cached material
   */
  createMaterial(config: MaterialConfig, id?: string): THREE.Material {
    const cacheKey = id || this.generateMaterialKey(config);

    if (this.materialCache.has(cacheKey)) {
      return this.materialCache.get(cacheKey)!;
    }

    let material: THREE.Material;

    switch (config.type) {
      case 'standard':
        material = this.createStandardMaterial(config);
        break;
      case 'physical':
        material = this.createPhysicalMaterial(config);
        break;
      case 'basic':
        material = this.createBasicMaterial(config);
        break;
      default:
        material = this.createStandardMaterial(config);
    }

    this.materialCache.set(cacheKey, material);
    return material;
  }

  /**
   * Create standard material with PBR properties
   */
  private createStandardMaterial(
    config: MaterialConfig
  ): THREE.MeshStandardMaterial {
    const material = new THREE.MeshStandardMaterial({
      color: config.color || '#ffffff',
      roughness: config.roughness ?? 0.8,
      metalness: config.metalness ?? 0.1,
    });

    // Load textures if provided
    if (config.diffuseMap) {
      material.map = this.loadTexture(config.diffuseMap);
    }

    if (config.normalMap) {
      material.normalMap = this.loadTexture(config.normalMap);
    }

    if (config.specularMap) {
      material.roughnessMap = this.loadTexture(config.specularMap);
    }

    return material;
  }

  /**
   * Create physical material with advanced PBR
   */
  private createPhysicalMaterial(
    config: MaterialConfig
  ): THREE.MeshPhysicalMaterial {
    const material = new THREE.MeshPhysicalMaterial({
      color: config.color || '#ffffff',
      roughness: config.roughness ?? 0.8,
      metalness: config.metalness ?? 0.1,
      clearcoat: 0.1,
      clearcoatRoughness: 0.1,
    });

    // Load textures if provided
    if (config.diffuseMap) {
      material.map = this.loadTexture(config.diffuseMap);
    }

    if (config.normalMap) {
      material.normalMap = this.loadTexture(config.normalMap);
    }

    return material;
  }

  /**
   * Create basic material (no lighting)
   */
  private createBasicMaterial(config: MaterialConfig): THREE.MeshBasicMaterial {
    const material = new THREE.MeshBasicMaterial({
      color: config.color || '#ffffff',
    });

    if (config.diffuseMap) {
      material.map = this.loadTexture(config.diffuseMap);
    }

    return material;
  }

  /**
   * Load and cache texture
   */
  private loadTexture(path: string): THREE.Texture {
    if (this.textureCache.has(path)) {
      return this.textureCache.get(path)!;
    }

    const texture = this.textureLoader.load(path);

    // Configure texture settings
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;

    this.textureCache.set(path, texture);
    return texture;
  }

  /**
   * Generate cache key for material configuration
   */
  private generateMaterialKey(config: MaterialConfig): string {
    return JSON.stringify({
      type: config.type,
      color: config.color,
      roughness: config.roughness,
      metalness: config.metalness,
      diffuseMap: config.diffuseMap,
      normalMap: config.normalMap,
      specularMap: config.specularMap,
    });
  }

  /**
   * Create room-specific materials with optimized settings
   */
  createRoomMaterials(performanceMode: 'high' | 'medium' | 'low') {
    const materials = {
      wall: this.createMaterial(
        {
          type: 'standard',
          color: '#f5f5f5',
          roughness: 0.9,
          metalness: 0.0,
          ...(performanceMode === 'high' &&
            {
              // In a real implementation, these would be actual texture paths
              // diffuseMap: '/textures/wall_diffuse.jpg',
              // normalMap: '/textures/wall_normal.jpg',
            }),
        },
        'room_wall'
      ),

      floor: this.createMaterial(
        {
          type: 'standard',
          color: '#8B4513',
          roughness: 0.7,
          metalness: 0.1,
          ...(performanceMode === 'high' &&
            {
              // diffuseMap: '/textures/wood_diffuse.jpg',
              // normalMap: '/textures/wood_normal.jpg',
            }),
        },
        'room_floor'
      ),

      ceiling: this.createMaterial(
        {
          type: 'standard',
          color: '#ffffff',
          roughness: 0.8,
          metalness: 0.0,
        },
        'room_ceiling'
      ),

      furniture: this.createMaterial(
        {
          type: 'standard',
          color: '#654321',
          roughness: 0.6,
          metalness: 0.2,
          ...(performanceMode === 'high' &&
            {
              // diffuseMap: '/textures/wood_dark_diffuse.jpg',
              // normalMap: '/textures/wood_normal.jpg',
            }),
        },
        'furniture_wood'
      ),

      metal: this.createMaterial(
        {
          type: 'standard',
          color: '#c0c0c0',
          roughness: 0.2,
          metalness: 0.8,
        },
        'metal_chrome'
      ),

      fabric: this.createMaterial(
        {
          type: 'standard',
          color: '#4a4a4a',
          roughness: 0.9,
          metalness: 0.0,
        },
        'fabric_dark'
      ),
    };

    return materials;
  }

  /**
   * Dispose of cached materials and textures
   */
  dispose(): void {
    this.materialCache.forEach(material => {
      material.dispose();
    });

    this.textureCache.forEach(texture => {
      texture.dispose();
    });

    this.materialCache.clear();
    this.textureCache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      materials: this.materialCache.size,
      textures: this.textureCache.size,
    };
  }
}

export default MaterialSystem;
