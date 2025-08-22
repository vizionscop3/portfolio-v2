import React, { useCallback, useEffect, useRef } from 'react';
import { Euler, Vector3, Object3D } from 'three';
import { InteractiveObject } from './InteractiveObject';
import { PlacementConstraints, PositioningUtils } from './PositioningUtils';
import {
  AudioEngineeringStation,
  DigitalCodex,
  HolographicComputer,
  NeonWardrobePod,
} from './cyberpunk/index';
import { ObjectDefinition, useInteractiveStore } from './store';
import { useLODSystem } from '../../hooks/useLODSystem';
import {
  createAllLODConfigurations,
  adjustLODForPerformance
} from '../../utils/lodConfigurations';
import { usePerformanceMonitor } from '../../hooks/usePerformanceMonitor';

interface ObjectManagerProps {
  children?: React.ReactNode;
  onObjectClick?: (section: string) => void;
}

export const ObjectManager: React.FC<ObjectManagerProps> = ({
  children,
  onObjectClick,
}) => {
  const { objects, objectStates, placements, addObject, getVisibleObjects } =
    useInteractiveStore();
  
  // LOD System integration
  const { registerObject } = useLODSystem();
  const { mode: currentPerformanceMode } = usePerformanceMonitor();
  const objectRefsMap = useRef<Map<string, Object3D>>(new Map());

  const initializeDefaultObjects = useCallback(() => {
    const defaultObjects: ObjectDefinition[] = [
      {
        id: 'desk-computer',
        type: 'computer',
        position: new Vector3(-2, 0.8, -1),
        rotation: new Euler(0, Math.PI / 4, 0),
        scale: new Vector3(0.8, 0.8, 0.8),
        tooltip: 'Tech Skills',
        section: 'tech',
        isVisible: true,
        priority: 1,
      },
      {
        id: 'bed-book',
        type: 'book',
        position: new Vector3(2, 0.6, 1),
        rotation: new Euler(0, -Math.PI / 6, 0),
        scale: new Vector3(0.6, 0.6, 0.6),
        tooltip: 'Blog',
        section: 'blog',
        isVisible: true,
        priority: 2,
      },
      {
        id: 'closet-main',
        type: 'closet',
        position: new Vector3(-3, 0, 2),
        rotation: new Euler(0, Math.PI / 2, 0),
        scale: new Vector3(1.2, 1.2, 1.2),
        tooltip: 'Fashion',
        section: 'fashion',
        isVisible: true,
        priority: 3,
      },
      {
        id: 'shelf-merch',
        type: 'merchandise',
        position: new Vector3(3, 1.5, -2),
        rotation: new Euler(0, -Math.PI / 2, 0),
        scale: new Vector3(0.4, 0.4, 0.4),
        tooltip: 'Merch',
        section: 'merch',
        isVisible: true,
        priority: 4,
      },
      {
        id: 'desk-headphones',
        type: 'personal',
        position: new Vector3(-1, 0.8, -1.2),
        rotation: new Euler(0, 0, 0),
        scale: new Vector3(0.5, 0.5, 0.5),
        tooltip: 'About Me',
        section: 'about',
        isVisible: true,
        priority: 5,
      },
    ];

    // Add objects with optimized positioning
    defaultObjects.forEach(object => {
      const constraints: PlacementConstraints = {
        minDistance: 0.5,
        surfaceOnly: true,
        allowedSurfaces: getSurfacesForObjectType(object.type),
      };

      const existingPositions = new Map<string, Vector3>();
      objects.forEach((obj, id) => {
        if (id !== object.id) {
          existingPositions.set(id, obj.position);
        }
      });

      const optimizedPosition = PositioningUtils.calculateOptimalPosition(
        object.id,
        object.position,
        constraints,
        existingPositions
      );

      const optimizedScale = PositioningUtils.calculateOptimalScale(
        object.type,
        object.scale
      );

      addObject({
        ...object,
        position: optimizedPosition,
        scale: optimizedScale,
      });
    });
  }, [addObject, objects]);

  // Initialize default objects for the portfolio
  useEffect(() => {
    initializeDefaultObjects();
  }, [initializeDefaultObjects]);

  // Register objects with LOD system when refs are available
  useEffect(() => {
    if (objectRefsMap.current.size === 0) return;

    const models = {
      holographicComputer: objectRefsMap.current.get('desk-computer'),
      digitalCodex: objectRefsMap.current.get('bed-book'),
      neonWardrobePod: objectRefsMap.current.get('closet-main'),
      holographicMerchDisplay: objectRefsMap.current.get('shelf-merch'),
      audioEngineeringStation: objectRefsMap.current.get('desk-headphones')
    };

    // Create and register LOD configurations
    const lodConfigurations = createAllLODConfigurations(models);
    
    lodConfigurations.forEach(config => {
      try {
        // Adjust configuration based on current performance
        const adjustedConfig = adjustLODForPerformance(config, currentPerformanceMode);
        registerObject(adjustedConfig);
      } catch (error) {
        console.warn(`Failed to register LOD for ${config.objectId}:`, error);
      }
    });
  }, [registerObject, currentPerformanceMode]);

  // Callback to register object refs for LOD system
  const handleObjectRef = useCallback((objectId: string, ref: Object3D | null) => {
    if (ref) {
      objectRefsMap.current.set(objectId, ref);
    } else {
      objectRefsMap.current.delete(objectId);
    }
  }, []);

  const getSurfacesForObjectType = (
    type: ObjectDefinition['type']
  ): string[] => {
    switch (type) {
      case 'computer':
        return ['desk'];
      case 'book':
        return ['bed', 'desk'];
      case 'closet':
        return ['floor'];
      case 'merchandise':
        return ['shelf', 'desk'];
      case 'personal':
        return ['desk', 'shelf'];
      default:
        return ['floor'];
    }
  };

  const handleObjectClick = useCallback(
    (objectId: string) => {
      const object = objects.get(objectId);
      if (object && onObjectClick) {
        onObjectClick(object.section);
      }
    },
    [objects, onObjectClick]
  );

  const handleObjectHover = useCallback(
    (_objectId: string, _hovered: boolean) => {
      // Update object state for hover effects
      // This will be handled by the InteractiveObject component itself
    },
    []
  );

  // Render visible objects
  const visibleObjects = getVisibleObjects();

  return (
    <>
      {visibleObjects.map(object => {
        const placement = placements.get(object.id);
        const state = objectStates.get(object.id);

        if (!placement || !state?.isVisible) return null;

        return (
          <InteractiveObject
            key={object.id}
            id={object.id}
            position={placement.position}
            rotation={placement.rotation}
            scale={placement.scale}
            tooltip={object.tooltip}
            section={object.section}
            onClick={() => handleObjectClick(object.id)}
            onHover={hovered => handleObjectHover(object.id, hovered)}
            onRef={ref => handleObjectRef(object.id, ref)}
          >
            {/* Render cyberpunk objects based on type */}
            {object.type === 'computer' ? (
              <HolographicComputer
                position={[0, 0, 0]}
                scale={1}
                isActive={state?.isHovered || false}
              />
            ) : object.type === 'book' ? (
              <DigitalCodex
                position={[0, 0, 0]}
                scale={1}
                isActive={state?.isHovered || false}
              />
            ) : object.type === 'closet' ? (
              <NeonWardrobePod
                position={[0, 0, 0]}
                scale={1}
                isActive={state?.isHovered || false}
              />
            ) : object.type === 'personal' ? (
              <AudioEngineeringStation
                position={[0, 0, 0]}
                scale={1}
                isActive={state?.isHovered || false}
              />
            ) : (
              /* Placeholder geometry for merchandise and other object types */
              <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial
                  color={getColorForObjectType(object.type)}
                  transparent
                  opacity={0.8}
                />
              </mesh>
            )}
          </InteractiveObject>
        );
      })}
      {children}
    </>
  );
};

// Helper function to get colors for different object types
const getColorForObjectType = (type: ObjectDefinition['type']): string => {
  switch (type) {
    case 'computer':
      return '#3b82f6'; // Blue
    case 'book':
      return '#10b981'; // Green
    case 'closet':
      return '#8b5cf6'; // Purple
    case 'merchandise':
      return '#f59e0b'; // Orange
    case 'personal':
      return '#ef4444'; // Red
    default:
      return '#6b7280'; // Gray
  }
};
