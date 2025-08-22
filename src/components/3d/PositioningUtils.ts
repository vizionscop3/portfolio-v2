import { Box3, Object3D, Vector3 } from 'three';

export interface RoomBounds {
  min: Vector3;
  max: Vector3;
}

export interface PlacementConstraints {
  minDistance?: number; // Minimum distance from other objects
  surfaceOnly?: boolean; // Only place on surfaces (floor, desk, etc.)
  allowedSurfaces?: string[]; // Specific surfaces allowed
  roomBounds?: RoomBounds; // Boundaries within the room
}

export class PositioningUtils {
  private static readonly ROOM_BOUNDS: RoomBounds = {
    min: new Vector3(-5, 0, -5),
    max: new Vector3(5, 3, 5),
  };

  // Predefined surface positions in the room
  private static readonly SURFACES = {
    floor: { y: 0, normal: new Vector3(0, 1, 0) },
    desk: { y: 0.8, normal: new Vector3(0, 1, 0) },
    bed: { y: 0.6, normal: new Vector3(0, 1, 0) },
    shelf: { y: 1.5, normal: new Vector3(0, 1, 0) },
    wall: { y: 1.5, normal: new Vector3(0, 0, 1) },
  };

  // Calculate optimal position for an object based on constraints
  static calculateOptimalPosition(
    objectId: string,
    preferredPosition: Vector3,
    constraints: PlacementConstraints = {},
    existingObjects: Map<string, Vector3> = new Map()
  ): Vector3 {
    let position = preferredPosition.clone();

    // Apply room bounds constraint
    const bounds = constraints.roomBounds || this.ROOM_BOUNDS;
    position.clamp(bounds.min, bounds.max);

    // Apply surface constraint
    if (constraints.surfaceOnly) {
      position = this.snapToSurface(position, constraints.allowedSurfaces);
    }

    // Apply minimum distance constraint
    if (constraints.minDistance) {
      position = this.ensureMinimumDistance(
        position,
        constraints.minDistance,
        existingObjects,
        objectId
      );
    }

    return position;
  }

  // Snap position to the nearest allowed surface
  private static snapToSurface(
    position: Vector3,
    allowedSurfaces?: string[]
  ): Vector3 {
    const surfaces = allowedSurfaces || Object.keys(this.SURFACES);
    let closestSurface = surfaces[0];
    let minDistance = Infinity;

    // Find the closest allowed surface
    for (const surfaceName of surfaces) {
      const surface = this.SURFACES[surfaceName as keyof typeof this.SURFACES];
      if (surface) {
        const distance = Math.abs(position.y - surface.y);
        if (distance < minDistance) {
          minDistance = distance;
          closestSurface = surfaceName;
        }
      }
    }

    // Snap to the closest surface
    const surface = this.SURFACES[closestSurface as keyof typeof this.SURFACES];
    if (surface) {
      position.y = surface.y;
    }

    return position;
  }

  // Ensure minimum distance from other objects
  private static ensureMinimumDistance(
    position: Vector3,
    minDistance: number,
    existingObjects: Map<string, Vector3>,
    excludeId: string
  ): Vector3 {
    const adjustedPosition = position.clone();
    const maxAttempts = 10;
    let attempts = 0;

    while (attempts < maxAttempts) {
      let tooClose = false;

      for (const [id, objPos] of existingObjects) {
        if (id === excludeId) continue;

        const distance = adjustedPosition.distanceTo(objPos);
        if (distance < minDistance) {
          // Move away from the conflicting object
          const direction = adjustedPosition.clone().sub(objPos).normalize();
          adjustedPosition.add(
            direction.multiplyScalar(minDistance - distance + 0.1)
          );
          tooClose = true;
        }
      }

      if (!tooClose) break;
      attempts++;
    }

    return adjustedPosition;
  }

  // Calculate appropriate scale based on object type and room size
  static calculateOptimalScale(
    objectType: string,
    baseScale: Vector3 = new Vector3(1, 1, 1),
    roomSize: Vector3 = new Vector3(10, 3, 10)
  ): Vector3 {
    const scaleFactors = {
      computer: 0.8,
      book: 0.6,
      closet: 1.2,
      merchandise: 0.4,
      personal: 0.5,
    };

    const factor = scaleFactors[objectType as keyof typeof scaleFactors] || 1.0;

    // Adjust scale based on room size (smaller rooms = smaller objects)
    const roomSizeFactor = Math.min(roomSize.x, roomSize.z) / 10;
    const finalFactor = factor * roomSizeFactor;

    return baseScale.clone().multiplyScalar(finalFactor);
  }

  // Generate grid-based positions for systematic placement
  static generateGridPositions(
    gridSize: { x: number; z: number },
    spacing: number,
    centerPosition: Vector3 = new Vector3(0, 0, 0)
  ): Vector3[] {
    const positions: Vector3[] = [];
    const startX = centerPosition.x - ((gridSize.x - 1) * spacing) / 2;
    const startZ = centerPosition.z - ((gridSize.z - 1) * spacing) / 2;

    for (let x = 0; x < gridSize.x; x++) {
      for (let z = 0; z < gridSize.z; z++) {
        positions.push(
          new Vector3(
            startX + x * spacing,
            centerPosition.y,
            startZ + z * spacing
          )
        );
      }
    }

    return positions;
  }

  // Calculate bounding box for an object
  static calculateBoundingBox(object: Object3D): Box3 {
    const box = new Box3();
    box.setFromObject(object);
    return box;
  }

  // Check if two objects would overlap
  static checkOverlap(
    pos1: Vector3,
    scale1: Vector3,
    pos2: Vector3,
    scale2: Vector3,
    margin: number = 0.1
  ): boolean {
    const box1 = new Box3(
      pos1.clone().sub(scale1.clone().multiplyScalar(0.5 + margin)),
      pos1.clone().add(scale1.clone().multiplyScalar(0.5 + margin))
    );

    const box2 = new Box3(
      pos2.clone().sub(scale2.clone().multiplyScalar(0.5 + margin)),
      pos2.clone().add(scale2.clone().multiplyScalar(0.5 + margin))
    );

    return box1.intersectsBox(box2);
  }

  // Get predefined positions for specific object types
  static getPredefinedPositions(): Record<string, Vector3> {
    return {
      // Desk area - for computer/tech objects
      'desk-computer': new Vector3(-2, 0.8, -1),
      'desk-keyboard': new Vector3(-1.8, 0.8, -0.8),
      'desk-mouse': new Vector3(-1.5, 0.8, -0.9),

      // Bed area - for books/reading materials
      'bed-book': new Vector3(2, 0.6, 1),
      'bed-pillow': new Vector3(2.5, 0.6, 1.5),

      // Closet area - for fashion items
      'closet-main': new Vector3(-3, 0, 2),
      'closet-door': new Vector3(-2.8, 1.5, 2),

      // Shelf area - for merchandise
      'shelf-item1': new Vector3(3, 1.5, -2),
      'shelf-item2': new Vector3(3, 1.5, -1.5),
      'shelf-item3': new Vector3(3, 1.5, -1),

      // Personal items - scattered around
      'personal-headphones': new Vector3(-1, 0.8, -1.2),
      'personal-mixer': new Vector3(-0.5, 0.8, -1.5),
      'personal-photo': new Vector3(1, 1.2, -2.5),
    };
  }
}
