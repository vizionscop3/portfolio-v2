/**
 * Test suite for Level of Detail (LOD) System
 */

import * as THREE from 'three';
import { LODSystem, LODConfiguration } from '../lodSystem';

describe('LODSystem', () => {
  let lodSystem: LODSystem;
  let mockCamera: THREE.PerspectiveCamera;
  let mockScene: THREE.Scene;
  let mockObject: THREE.Object3D;

  beforeEach(() => {
    lodSystem = new LODSystem({
      enableAutoOptimization: false,
      enableDebugMode: true
    });

    mockCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    mockCamera.position.set(0, 0, 10);

    mockScene = new THREE.Scene();
    mockObject = new THREE.Object3D();
    mockObject.position.set(0, 0, 0);
    
    // Add mock geometry for calculations
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    mockObject.add(mesh);

    lodSystem.initialize(mockCamera, mockScene);
  });

  afterEach(() => {
    lodSystem.dispose();
  });

  describe('initialization', () => {
    test('should initialize with default options', () => {
      const system = new LODSystem();
      expect(system).toBeDefined();
    });

    test('should initialize with custom options', () => {
      const system = new LODSystem({
        enableAutoOptimization: false,
        performanceThreshold: 30,
        maxDrawCalls: 50,
        maxPolygons: 25000,
        enableDebugMode: true,
        updateFrequency: 200
      });
      expect(system).toBeDefined();
    });
  });

  describe('object registration', () => {
    test('should register a valid LOD configuration', () => {
      const config: LODConfiguration = {
        objectId: 'test-object',
        baseModel: mockObject,
        levels: [
          {
            distance: 10,
            visible: false,
            polygonCount: 1000,
            priority: 'high'
          },
          {
            distance: 25,
            visible: false,
            polygonCount: 500,
            priority: 'medium'
          },
          {
            distance: 50,
            visible: false,
            polygonCount: 200,
            priority: 'low'
          }
        ],
        enableFrustumCulling: true,
        enableOcclusionCulling: false,
        minimumScreenSize: 10,
        hysteresis: 2
      };

      expect(() => lodSystem.registerObject(config)).not.toThrow();
    });

    test('should throw error for invalid configuration', () => {
      const invalidConfig = {
        objectId: '',
        baseModel: mockObject,
        levels: [],
        enableFrustumCulling: true,
        enableOcclusionCulling: false,
        minimumScreenSize: 10,
        hysteresis: 2
      } as LODConfiguration;

      expect(() => lodSystem.registerObject(invalidConfig)).toThrow();
    });

    test('should sort LOD levels by distance', () => {
      const config: LODConfiguration = {
        objectId: 'test-object',
        baseModel: mockObject,
        levels: [
          {
            distance: 50,
            visible: false,
            polygonCount: 200,
            priority: 'low'
          },
          {
            distance: 10,
            visible: false,
            polygonCount: 1000,
            priority: 'high'
          },
          {
            distance: 25,
            visible: false,
            polygonCount: 500,
            priority: 'medium'
          }
        ],
        enableFrustumCulling: true,
        enableOcclusionCulling: false,
        minimumScreenSize: 10,
        hysteresis: 2
      };

      lodSystem.registerObject(config);
      
      // The levels should be automatically sorted by distance
      expect(config.levels[0].distance).toBe(10);
      expect(config.levels[1].distance).toBe(25);
      expect(config.levels[2].distance).toBe(50);
    });
  });

  describe('LOD updates', () => {
    let testConfig: LODConfiguration;

    beforeEach(() => {
      testConfig = {
        objectId: 'test-object',
        baseModel: mockObject,
        levels: [
          {
            distance: 10,
            visible: false,
            polygonCount: 1000,
            priority: 'high'
          },
          {
            distance: 25,
            visible: false,
            polygonCount: 500,
            priority: 'medium'
          },
          {
            distance: 50,
            visible: false,
            polygonCount: 200,
            priority: 'low'
          }
        ],
        enableFrustumCulling: true,
        enableOcclusionCulling: false,
        minimumScreenSize: 10,
        hysteresis: 2
      };

      lodSystem.registerObject(testConfig);
    });

    test('should update LOD system without errors', () => {
      expect(() => lodSystem.update()).not.toThrow();
    });

    test('should select appropriate LOD level based on distance', () => {
      // Position camera at different distances
      mockCamera.position.set(0, 0, 5);
      lodSystem.update();
      
      const stats = lodSystem.getStatistics();
      expect(stats.totalObjects).toBe(1);
    });

    test('should handle frustum culling', () => {
      // Position object outside camera frustum
      mockObject.position.set(1000, 0, 0);
      lodSystem.update();
      
      const stats = lodSystem.getStatistics();
      expect(stats.frustumCulled).toBeGreaterThan(0);
    });
  });

  describe('statistics', () => {
    test('should return accurate statistics', () => {
      const stats = lodSystem.getStatistics();
      
      expect(stats).toHaveProperty('totalObjects');
      expect(stats).toHaveProperty('visibleObjects');
      expect(stats).toHaveProperty('totalPolygons');
      expect(stats).toHaveProperty('currentQuality');
      expect(stats).toHaveProperty('frustumCulled');
      expect(stats).toHaveProperty('occlusionCulled');
    });

    test('should track polygon counts correctly', () => {
      const config: LODConfiguration = {
        objectId: 'test-object',
        baseModel: mockObject,
        levels: [
          {
            distance: 10,
            visible: true,
            polygonCount: 1000,
            priority: 'high'
          }
        ],
        enableFrustumCulling: false,
        enableOcclusionCulling: false,
        minimumScreenSize: 0,
        hysteresis: 0
      };

      lodSystem.registerObject(config);
      lodSystem.update();
      
      const stats = lodSystem.getStatistics();
      expect(stats.totalPolygons).toBe(1000);
    });
  });

  describe('quality management', () => {
    test('should set quality level', () => {
      lodSystem.setQualityLevel('low');
      const stats = lodSystem.getStatistics();
      expect(stats.currentQuality).toBe('low');
    });

    test('should switch between quality levels', () => {
      lodSystem.setQualityLevel('high');
      expect(lodSystem.getStatistics().currentQuality).toBe('high');
      
      lodSystem.setQualityLevel('medium');
      expect(lodSystem.getStatistics().currentQuality).toBe('medium');
      
      lodSystem.setQualityLevel('low');
      expect(lodSystem.getStatistics().currentQuality).toBe('low');
    });
  });

  describe('debug information', () => {
    test('should provide debug info for registered objects', () => {
      const config: LODConfiguration = {
        objectId: 'debug-test',
        baseModel: mockObject,
        levels: [
          {
            distance: 10,
            visible: false,
            polygonCount: 500,
            priority: 'high'
          }
        ],
        enableFrustumCulling: true,
        enableOcclusionCulling: false,
        minimumScreenSize: 10,
        hysteresis: 2
      };

      lodSystem.registerObject(config);
      lodSystem.update();
      
      const debugInfo = lodSystem.getObjectDebugInfo('debug-test');
      expect(debugInfo).toBeDefined();
      expect(debugInfo).toHaveProperty('distance');
      expect(debugInfo).toHaveProperty('activeLODIndex');
      expect(debugInfo).toHaveProperty('isInFrustum');
      expect(debugInfo).toHaveProperty('screenSize');
    });
  });

  describe('disposal', () => {
    test('should clean up resources on disposal', () => {
      const config: LODConfiguration = {
        objectId: 'dispose-test',
        baseModel: mockObject,
        levels: [
          {
            distance: 10,
            visible: false,
            polygonCount: 500,
            priority: 'high'
          }
        ],
        enableFrustumCulling: true,
        enableOcclusionCulling: false,
        minimumScreenSize: 10,
        hysteresis: 2
      };

      lodSystem.registerObject(config);
      expect(lodSystem.getStatistics().totalObjects).toBe(1);
      
      lodSystem.dispose();
      expect(lodSystem.getStatistics().totalObjects).toBe(0);
    });
  });

  describe('performance optimization', () => {
    test('should adjust LOD based on polygon budget', () => {
      const system = new LODSystem({
        enableAutoOptimization: true,
        maxPolygons: 1000
      });

      const highPolyConfig: LODConfiguration = {
        objectId: 'high-poly-object',
        baseModel: mockObject,
        levels: [
          {
            distance: 10,
            visible: true,
            polygonCount: 5000, // Exceeds budget
            priority: 'high'
          },
          {
            distance: 50,
            visible: false,
            polygonCount: 500,
            priority: 'low'
          }
        ],
        enableFrustumCulling: false,
        enableOcclusionCulling: false,
        minimumScreenSize: 0,
        hysteresis: 0
      };

      system.initialize(mockCamera, mockScene);
      system.registerObject(highPolyConfig);
      system.update();

      const stats = system.getStatistics();
      // System should automatically reduce quality due to high polygon count
      expect(stats.currentQuality).not.toBe('high');
      
      system.dispose();
    });
  });
});

describe('LOD Configurations', () => {
  test('should create valid distance thresholds', () => {
    const { LOD_DISTANCES } = require('../lodConfigurations');
    
    expect(LOD_DISTANCES.CLOSE).toBeLessThan(LOD_DISTANCES.MEDIUM);
    expect(LOD_DISTANCES.MEDIUM).toBeLessThan(LOD_DISTANCES.FAR);
    expect(LOD_DISTANCES.FAR).toBeLessThan(LOD_DISTANCES.VERY_FAR);
  });

  test('should create polygon counts in descending order', () => {
    const { POLYGON_COUNTS } = require('../lodConfigurations');
    
    expect(POLYGON_COUNTS.HIGH).toBeGreaterThan(POLYGON_COUNTS.MEDIUM);
    expect(POLYGON_COUNTS.MEDIUM).toBeGreaterThan(POLYGON_COUNTS.LOW);
    expect(POLYGON_COUNTS.LOW).toBeGreaterThan(POLYGON_COUNTS.MINIMAL);
  });

  test('should adjust LOD for performance modes', () => {
    const { adjustLODForPerformance, getPerformanceDistanceMultiplier } = require('../lodConfigurations');
    
    const mockConfig: LODConfiguration = {
      objectId: 'test',
      baseModel: new THREE.Object3D(),
      levels: [
        { distance: 10, visible: false, polygonCount: 1000, priority: 'high' as const },
        { distance: 20, visible: false, polygonCount: 500, priority: 'medium' as const }
      ],
      enableFrustumCulling: true,
      enableOcclusionCulling: false,
      minimumScreenSize: 10,
      hysteresis: 2
    };

    const highMultiplier = getPerformanceDistanceMultiplier('high');
    const mediumMultiplier = getPerformanceDistanceMultiplier('medium');
    const lowMultiplier = getPerformanceDistanceMultiplier('low');

    expect(highMultiplier).toBeGreaterThan(mediumMultiplier);
    expect(mediumMultiplier).toBeGreaterThan(lowMultiplier);

    const adjustedConfig = adjustLODForPerformance(mockConfig, 'low');
    expect(adjustedConfig.levels[0].distance).toBeLessThan(10);
  });
});