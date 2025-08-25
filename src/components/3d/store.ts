import { Euler, Vector3 } from 'three';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { InteractiveObjectStore, TooltipData } from './types';

// Extended types for object management
export interface ObjectDefinition {
  id: string;
  type: 'computer' | 'book' | 'closet' | 'merchandise' | 'personal' | 'bed';
  position: Vector3;
  rotation?: Euler;
  scale?: Vector3;
  tooltip: string;
  section: string;
  modelPath?: string;
  isVisible: boolean;
  priority: number;
}

export interface ObjectPlacement {
  position: Vector3;
  rotation: Euler;
  scale: Vector3;
}

export interface ObjectState {
  isLoaded: boolean;
  isVisible: boolean;
  isHovered: boolean;
  isClicked: boolean;
  loadingProgress: number;
}

interface ExtendedInteractiveObjectStore extends InteractiveObjectStore {
  // Object management
  objects: Map<string, ObjectDefinition>;
  objectStates: Map<string, ObjectState>;
  placements: Map<string, ObjectPlacement>;

  // Loading management
  loadingQueue: string[];
  currentlyLoading: string | null;

  // Actions
  addObject: (object: ObjectDefinition) => void;
  removeObject: (id: string) => void;
  updateObjectState: (id: string, state: Partial<ObjectState>) => void;
  updatePlacement: (id: string, placement: Partial<ObjectPlacement>) => void;
  setObjectVisibility: (id: string, visible: boolean) => void;
  getVisibleObjects: () => ObjectDefinition[];
  getObjectState: (id: string) => ObjectState | undefined;
  addToLoadingQueue: (id: string) => void;
  removeFromLoadingQueue: (id: string) => void;
  setCurrentlyLoading: (id: string | null) => void;
}

const defaultObjectState: ObjectState = {
  isLoaded: false,
  isVisible: true,
  isHovered: false,
  isClicked: false,
  loadingProgress: 0,
};

export const useInteractiveStore = create<ExtendedInteractiveObjectStore>()(
  subscribeWithSelector((set, get) => ({
    // Basic interactive state
    hoveredObject: null,
    tooltipData: {
      text: '',
      position: { x: 0, y: 0 },
      visible: false,
    },

    // Object management state
    objects: new Map<string, ObjectDefinition>(),
    objectStates: new Map<string, ObjectState>(),
    placements: new Map<string, ObjectPlacement>(),

    // Loading management state
    loadingQueue: [],
    currentlyLoading: null,

    // Basic actions
    setHoveredObject: (id: string | null) => {
      set({ hoveredObject: id });
    },

    setTooltip: (data: TooltipData) => {
      set({ tooltipData: data });
    },

    // Object management actions
    addObject: (object: ObjectDefinition) => {
      set(state => {
        const newObjects = new Map(state.objects);
        const newStates = new Map(state.objectStates);
        const newPlacements = new Map(state.placements);

        newObjects.set(object.id, object);
        newStates.set(object.id, { ...defaultObjectState });
        newPlacements.set(object.id, {
          position: object.position.clone(),
          rotation: object.rotation?.clone() || new Euler(0, 0, 0),
          scale: object.scale?.clone() || new Vector3(1, 1, 1),
        });

        return {
          objects: newObjects,
          objectStates: newStates,
          placements: newPlacements,
        };
      });
    },

    removeObject: (id: string) => {
      set(state => {
        const newObjects = new Map(state.objects);
        const newStates = new Map(state.objectStates);
        const newPlacements = new Map(state.placements);

        newObjects.delete(id);
        newStates.delete(id);
        newPlacements.delete(id);

        return {
          objects: newObjects,
          objectStates: newStates,
          placements: newPlacements,
        };
      });
    },

    updateObjectState: (id: string, stateUpdate: Partial<ObjectState>) => {
      set(state => {
        const newStates = new Map(state.objectStates);
        const currentState = newStates.get(id);

        if (currentState) {
          newStates.set(id, { ...currentState, ...stateUpdate });
        }

        return { objectStates: newStates };
      });
    },

    updatePlacement: (
      id: string,
      placementUpdate: Partial<ObjectPlacement>
    ) => {
      set(state => {
        const newPlacements = new Map(state.placements);
        const currentPlacement = newPlacements.get(id);

        if (currentPlacement) {
          newPlacements.set(id, {
            position: placementUpdate.position || currentPlacement.position,
            rotation: placementUpdate.rotation || currentPlacement.rotation,
            scale: placementUpdate.scale || currentPlacement.scale,
          });
        }

        return { placements: newPlacements };
      });
    },

    setObjectVisibility: (id: string, visible: boolean) => {
      set(state => {
        const newObjects = new Map(state.objects);
        const object = newObjects.get(id);

        if (object) {
          newObjects.set(id, { ...object, isVisible: visible });
        }

        return { objects: newObjects };
      });
    },

    getVisibleObjects: () => {
      const { objects } = get();
      return Array.from(objects.values()).filter(obj => obj.isVisible);
    },

    getObjectState: (id: string) => {
      const { objectStates } = get();
      return objectStates.get(id);
    },

    // Loading management actions
    addToLoadingQueue: (id: string) => {
      set(state => ({
        loadingQueue: [
          ...state.loadingQueue.filter(queueId => queueId !== id),
          id,
        ],
      }));
    },

    removeFromLoadingQueue: (id: string) => {
      set(state => ({
        loadingQueue: state.loadingQueue.filter(queueId => queueId !== id),
      }));
    },

    setCurrentlyLoading: (id: string | null) => {
      set({ currentlyLoading: id });
    },
  }))
);
