/**
 * Test suite for LOD System React Hooks
 */

import { renderHook, act } from '@testing-library/react';
import * as THREE from 'three';
import {
  useLODSystem,
  useLODObject,
  useLODStatistics,
  usePerformanceLOD,
} from '../useLODSystem';
import { getLODSystem } from '../../utils/lodSystem';

// Mock the LOD system
jest.mock('../../utils/lodSystem', () => ({
  getLODSystem: jest.fn(),
}));

// Mock performance monitor
jest.mock('../usePerformanceMonitor', () => ({
  usePerformanceMonitor: () => ({
    currentPerformanceMode: 'high',
  }),
}));

describe('useLODSystem', () => {
  let mockLODSystem: any;

  beforeEach(() => {
    mockLODSystem = {
      initialize: jest.fn(),
      registerObject: jest.fn(),
      setQualityLevel: jest.fn(),
      update: jest.fn(),
      getStatistics: jest.fn(() => ({
        totalObjects: 5,
        visibleObjects: 3,
        totalPolygons: 15000,
        currentQuality: 'high',
        frustumCulled: 1,
        occlusionCulled: 1,
      })),
      getObjectDebugInfo: jest.fn(() => ({
        distance: 10,
        activeLODIndex: 0,
        isInFrustum: true,
        screenSize: 50,
        polygonCount: 1000,
        isVisible: true,
      })),
      dispose: jest.fn(),
    };

    (getLODSystem as jest.Mock).mockReturnValue(mockLODSystem);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize LOD system', () => {
    const { result } = renderHook(() => useLODSystem());

    expect(result.current.lodSystem).toBeDefined();
    expect(result.current.isInitialized).toBe(false);
    expect(getLODSystem).toHaveBeenCalled();
  });

  test('should initialize with custom options', () => {
    const options = {
      enableAutoOptimization: false,
      performanceThreshold: 30,
      enableDebugMode: true,
    };

    renderHook(() => useLODSystem(options));
    expect(getLODSystem).toHaveBeenCalledWith(options);
  });

  test('should initialize camera and scene', () => {
    const { result } = renderHook(() => useLODSystem());
    const mockCamera = new THREE.PerspectiveCamera();
    const mockScene = new THREE.Scene();

    act(() => {
      result.current.initialize(mockCamera, mockScene);
    });

    expect(mockLODSystem.initialize).toHaveBeenCalledWith(
      mockCamera,
      mockScene
    );
    expect(result.current.isInitialized).toBe(true);
  });

  test('should register objects', () => {
    const { result } = renderHook(() => useLODSystem());
    const mockConfig = {
      objectId: 'test-object',
      baseModel: new THREE.Object3D(),
      levels: [],
      enableFrustumCulling: true,
      enableOcclusionCulling: false,
      minimumScreenSize: 10,
      hysteresis: 2,
    };

    act(() => {
      result.current.registerObject(mockConfig);
    });

    expect(mockLODSystem.registerObject).toHaveBeenCalledWith(mockConfig);
  });

  test('should set quality level', () => {
    const { result } = renderHook(() => useLODSystem());

    act(() => {
      result.current.setQualityLevel('medium');
    });

    expect(mockLODSystem.setQualityLevel).toHaveBeenCalledWith('medium');
  });

  test('should update LOD system', () => {
    const { result } = renderHook(() => useLODSystem());
    const mockCamera = new THREE.PerspectiveCamera();
    const mockScene = new THREE.Scene();

    // Initialize first
    act(() => {
      result.current.initialize(mockCamera, mockScene);
    });

    // Then update
    act(() => {
      result.current.update();
    });

    expect(mockLODSystem.update).toHaveBeenCalled();
  });

  test('should get object debug info', () => {
    const { result } = renderHook(() => useLODSystem());

    const debugInfo = result.current.getObjectDebugInfo('test-object');

    expect(mockLODSystem.getObjectDebugInfo).toHaveBeenCalledWith(
      'test-object'
    );
    expect(debugInfo).toEqual({
      distance: 10,
      activeLODIndex: 0,
      isInFrustum: true,
      screenSize: 50,
      polygonCount: 1000,
      isVisible: true,
    });
  });

  test('should dispose on unmount', () => {
    const { unmount } = renderHook(() => useLODSystem());

    unmount();

    expect(mockLODSystem.dispose).toHaveBeenCalled();
  });
});

describe('useLODObject', () => {
  let mockLODSystem: any;

  beforeEach(() => {
    mockLODSystem = {
      registerObject: jest.fn(),
      getObjectDebugInfo: jest.fn(() => ({
        distance: 15,
        activeLODIndex: 1,
        isInFrustum: true,
        screenSize: 30,
      })),
    };
  });

  test('should register object with LOD system', () => {
    const mockObject = new THREE.Object3D();
    const options = {
      enableFrustumCulling: true,
      distances: [5, 10, 20, 40],
    };

    const { result } = renderHook(() =>
      useLODObject('test-object', mockObject, mockLODSystem, options)
    );

    // Wait for registration
    expect(mockLODSystem.registerObject).toHaveBeenCalled();
    expect(result.current.isRegistered).toBe(true);
  });

  test('should not register without base model', () => {
    const { result } = renderHook(() =>
      useLODObject('test-object', null, mockLODSystem)
    );

    expect(mockLODSystem.registerObject).not.toHaveBeenCalled();
    expect(result.current.isRegistered).toBe(false);
  });

  test('should update debug info periodically', async () => {
    jest.useFakeTimers();

    const mockObject = new THREE.Object3D();
    renderHook(() => useLODObject('test-object', mockObject, mockLODSystem));

    // Fast forward time to trigger debug info update
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(mockLODSystem.getObjectDebugInfo).toHaveBeenCalledWith(
      'test-object'
    );

    jest.useRealTimers();
  });
});

describe('useLODStatistics', () => {
  let mockLODSystem: any;

  beforeEach(() => {
    mockLODSystem = {
      getStatistics: jest.fn(() => ({
        totalObjects: 10,
        visibleObjects: 7,
        totalPolygons: 25000,
        currentQuality: 'medium',
        frustumCulled: 2,
        occlusionCulled: 1,
      })),
    };
  });

  test('should return current statistics', () => {
    const { result } = renderHook(() => useLODStatistics(mockLODSystem));

    expect(result.current).toEqual({
      totalObjects: 10,
      visibleObjects: 7,
      totalPolygons: 25000,
      currentQuality: 'medium',
      frustumCulled: 2,
      occlusionCulled: 1,
    });
  });

  test('should update statistics at specified interval', () => {
    jest.useFakeTimers();

    renderHook(() => useLODStatistics(mockLODSystem, 500));

    // Fast forward time
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(mockLODSystem.getStatistics).toHaveBeenCalledTimes(2); // Initial + 2 updates

    jest.useRealTimers();
  });
});

describe('usePerformanceLOD', () => {
  let mockLODSystem: any;

  beforeEach(() => {
    mockLODSystem = {
      setQualityLevel: jest.fn(),
    };
  });

  test('should initialize with high quality', () => {
    const { result } = renderHook(() =>
      usePerformanceLOD(mockLODSystem, 60, true)
    );

    expect(result.current.currentQuality).toBe('high');
  });

  test('should manually set quality', () => {
    const { result } = renderHook(() =>
      usePerformanceLOD(mockLODSystem, 60, true)
    );

    act(() => {
      result.current.setQuality('low');
    });

    expect(mockLODSystem.setQualityLevel).toHaveBeenCalledWith('low');
    expect(result.current.currentQuality).toBe('low');
  });

  test('should not adjust quality when disabled', () => {
    jest.useFakeTimers();

    renderHook(() => usePerformanceLOD(mockLODSystem, 60, false));

    // Fast forward time
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(mockLODSystem.setQualityLevel).not.toHaveBeenCalled();

    jest.useRealTimers();
  });

  test('should adjust quality based on performance', () => {
    jest.useFakeTimers();

    const { result } = renderHook(() =>
      usePerformanceLOD(mockLODSystem, 60, true)
    );

    // Simulate poor performance by not adding frames
    act(() => {
      jest.advanceTimersByTime(4000);
    });

    // Should reduce quality due to poor performance
    expect(result.current.currentQuality).toBe('medium');

    jest.useRealTimers();
  });
});
