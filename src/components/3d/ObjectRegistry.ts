import { Euler, Vector3 } from 'three';

export interface ObjectDefinition {
  id: string;
  type: 'computer' | 'book' | 'closet' | 'merchandise' | 'personal';
  position: Vector3;
  rotation?: Euler;
  scale?: Vector3;
  tooltip: string;
  section: string;
  modelPath?: string;
  isVisible: boolean;
  priority: number; // For loading order
}

export interface ObjectPlacement {
  position: Vector3;
  rotation: Euler;
  scale: Vector3;
}

export class ObjectRegistry {
  private objects: Map<string, ObjectDefinition> = new Map();
  private placements: Map<string, ObjectPlacement> = new Map();

  // Register a new interactive object
  registerObject(definition: ObjectDefinition): void {
    this.objects.set(definition.id, definition);

    // Set default placement if not exists
    if (!this.placements.has(definition.id)) {
      this.placements.set(definition.id, {
        position: definition.position.clone(),
        rotation: definition.rotation?.clone() || new Euler(0, 0, 0),
        scale: definition.scale?.clone() || new Vector3(1, 1, 1),
      });
    }
  }

  // Get object definition by ID
  getObject(id: string): ObjectDefinition | undefined {
    return this.objects.get(id);
  }

  // Get all objects of a specific type
  getObjectsByType(type: ObjectDefinition['type']): ObjectDefinition[] {
    return Array.from(this.objects.values()).filter(obj => obj.type === type);
  }

  // Get all visible objects
  getVisibleObjects(): ObjectDefinition[] {
    return Array.from(this.objects.values()).filter(obj => obj.isVisible);
  }

  // Get objects sorted by priority (for loading order)
  getObjectsByPriority(): ObjectDefinition[] {
    return Array.from(this.objects.values()).sort(
      (a, b) => a.priority - b.priority
    );
  }

  // Update object placement
  updatePlacement(id: string, placement: Partial<ObjectPlacement>): void {
    const currentPlacement = this.placements.get(id);
    if (currentPlacement) {
      this.placements.set(id, {
        position: placement.position || currentPlacement.position,
        rotation: placement.rotation || currentPlacement.rotation,
        scale: placement.scale || currentPlacement.scale,
      });
    }
  }

  // Get object placement
  getPlacement(id: string): ObjectPlacement | undefined {
    return this.placements.get(id);
  }

  // Set object visibility
  setVisibility(id: string, visible: boolean): void {
    const object = this.objects.get(id);
    if (object) {
      object.isVisible = visible;
    }
  }

  // Remove object from registry
  removeObject(id: string): void {
    this.objects.delete(id);
    this.placements.delete(id);
  }

  // Get all object IDs
  getAllObjectIds(): string[] {
    return Array.from(this.objects.keys());
  }

  // Clear all objects
  clear(): void {
    this.objects.clear();
    this.placements.clear();
  }
}

// Create a singleton instance
export const objectRegistry = new ObjectRegistry();
