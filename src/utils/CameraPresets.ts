import * as THREE from 'three';
import { SectionId } from '../types/scene';

export interface CameraPreset {
  position: THREE.Vector3;
  target: THREE.Vector3;
  fov: number;
  name: string;
  description: string;
}

/**
 * Camera preset manager for smooth transitions between different viewpoints
 */
export class CameraPresets {
  private static instance: CameraPresets;
  private presets: Map<SectionId, CameraPreset> = new Map();
  private customPresets: Map<string, CameraPreset> = new Map();

  constructor() {
    this.initializeDefaultPresets();
  }

  static getInstance(): CameraPresets {
    if (!CameraPresets.instance) {
      CameraPresets.instance = new CameraPresets();
    }
    return CameraPresets.instance;
  }

  /**
   * Initialize default camera presets for each section
   */
  private initializeDefaultPresets(): void {
    // About section - Overview of the room
    this.presets.set('about', {
      position: new THREE.Vector3(0, 5, 10),
      target: new THREE.Vector3(0, 2, 0),
      fov: 75,
      name: 'Room Overview',
      description: 'General view of the tech room',
    });

    // Tech section - Focus on desk/computer area
    this.presets.set('tech', {
      position: new THREE.Vector3(-3, 3, -2),
      target: new THREE.Vector3(-3, 1.5, -4),
      fov: 60,
      name: 'Tech Workspace',
      description: 'Close-up of the desk and computer setup',
    });

    // Blog section - Focus on bed/reading area
    this.presets.set('blog', {
      position: new THREE.Vector3(3, 2.5, 4),
      target: new THREE.Vector3(3, 1.2, 2),
      fov: 65,
      name: 'Reading Corner',
      description: 'Cozy reading area with books',
    });

    // Fashion section - Focus on closet area
    this.presets.set('fashion', {
      position: new THREE.Vector3(6, 4, -2),
      target: new THREE.Vector3(4, 2, -4),
      fov: 70,
      name: 'Fashion Closet',
      description: 'Wardrobe and fashion display area',
    });

    // Merch section - Focus on shelf/display area
    this.presets.set('merch', {
      position: new THREE.Vector3(-4, 3, 4),
      target: new THREE.Vector3(-4, 1.5, 2),
      fov: 65,
      name: 'Merchandise Display',
      description: 'Product showcase and merchandise area',
    });
  }

  /**
   * Get camera preset for a specific section
   */
  getPreset(sectionId: SectionId): CameraPreset | null {
    return this.presets.get(sectionId) || null;
  }

  /**
   * Get all available presets
   */
  getAllPresets(): Map<SectionId, CameraPreset> {
    return new Map(this.presets);
  }

  /**
   * Add or update a camera preset
   */
  setPreset(sectionId: SectionId, preset: CameraPreset): void {
    this.presets.set(sectionId, preset);
  }

  /**
   * Create a custom preset
   */
  createCustomPreset(id: string, preset: CameraPreset): void {
    this.customPresets.set(id, preset);
  }

  /**
   * Get custom preset
   */
  getCustomPreset(id: string): CameraPreset | null {
    return this.customPresets.get(id) || null;
  }

  /**
   * Calculate smooth transition path between two presets
   */
  calculateTransitionPath(
    from: CameraPreset,
    to: CameraPreset,
    steps: number = 60
  ): CameraPreset[] {
    const path: CameraPreset[] = [];

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;

      // Use ease-in-out cubic for smooth transitions
      const easedT = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      const position = new THREE.Vector3().lerpVectors(
        from.position,
        to.position,
        easedT
      );
      const target = new THREE.Vector3().lerpVectors(
        from.target,
        to.target,
        easedT
      );
      const fov = THREE.MathUtils.lerp(from.fov, to.fov, easedT);

      path.push({
        position,
        target,
        fov,
        name: `Transition ${i}/${steps}`,
        description: `Transition from ${from.name} to ${to.name}`,
      });
    }

    return path;
  }

  /**
   * Get optimal viewing angle for an object at a specific position
   */
  getOptimalViewingAngle(
    objectPosition: THREE.Vector3,
    objectSize: number = 1,
    preferredDistance: number = 5
  ): CameraPreset {
    // Calculate position that provides good viewing angle
    const direction = new THREE.Vector3(1, 0.5, 1).normalize();
    const position = objectPosition
      .clone()
      .add(direction.multiplyScalar(preferredDistance));

    // Ensure camera is above ground level
    position.y = Math.max(position.y, 1.5);

    return {
      position,
      target: objectPosition.clone(),
      fov: this.calculateOptimalFOV(objectSize, preferredDistance),
      name: 'Optimal View',
      description: 'Calculated optimal viewing angle',
    };
  }

  /**
   * Calculate optimal FOV based on object size and distance
   */
  private calculateOptimalFOV(objectSize: number, distance: number): number {
    // Calculate FOV that fits the object comfortably in view
    const angle = 2 * Math.atan(objectSize / (2 * distance));
    const fovDegrees = THREE.MathUtils.radToDeg(angle) * 1.5; // Add some padding

    // Clamp FOV to reasonable range
    return THREE.MathUtils.clamp(fovDegrees, 30, 90);
  }

  /**
   * Find the closest preset to a given camera position
   */
  findClosestPreset(
    position: THREE.Vector3,
    threshold: number = 5
  ): SectionId | null {
    let closestSection: SectionId | null = null;
    let closestDistance = Infinity;

    for (const [sectionId, preset] of this.presets.entries()) {
      const distance = position.distanceTo(preset.position);
      if (distance < threshold && distance < closestDistance) {
        closestDistance = distance;
        closestSection = sectionId;
      }
    }

    return closestSection;
  }

  /**
   * Generate cinematic camera path for showcase
   */
  generateCinematicPath(duration: number = 30): CameraPreset[] {
    const path: CameraPreset[] = [];
    const sections: SectionId[] = ['about', 'tech', 'blog', 'fashion', 'merch'];
    const stepsPerSection = Math.floor((duration * 60) / sections.length); // 60 FPS

    for (let i = 0; i < sections.length; i++) {
      const currentSection = sections[i];
      const nextSection = sections[(i + 1) % sections.length];

      const currentPreset = this.getPreset(currentSection)!;
      const nextPreset = this.getPreset(nextSection)!;

      const sectionPath = this.calculateTransitionPath(
        currentPreset,
        nextPreset,
        stepsPerSection
      );

      path.push(...sectionPath);
    }

    return path;
  }

  /**
   * Validate camera preset (ensure it's within room bounds)
   */
  validatePreset(preset: CameraPreset): boolean {
    const roomBounds = {
      min: new THREE.Vector3(-8, 0.5, -8),
      max: new THREE.Vector3(8, 10, 8),
    };

    return (
      preset.position.x >= roomBounds.min.x &&
      preset.position.x <= roomBounds.max.x &&
      preset.position.y >= roomBounds.min.y &&
      preset.position.y <= roomBounds.max.y &&
      preset.position.z >= roomBounds.min.z &&
      preset.position.z <= roomBounds.max.z &&
      preset.fov >= 10 &&
      preset.fov <= 120
    );
  }

  /**
   * Export presets to JSON
   */
  exportPresets(): string {
    const data = {
      presets: Array.from(this.presets.entries()).map(([id, preset]) => ({
        id,
        ...preset,
        position: preset.position.toArray(),
        target: preset.target.toArray(),
      })),
      customPresets: Array.from(this.customPresets.entries()).map(
        ([id, preset]) => ({
          id,
          ...preset,
          position: preset.position.toArray(),
          target: preset.target.toArray(),
        })
      ),
    };

    return JSON.stringify(data, null, 2);
  }

  /**
   * Import presets from JSON
   */
  importPresets(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);

      if (data.presets) {
        data.presets.forEach((item: any) => {
          const preset: CameraPreset = {
            position: new THREE.Vector3().fromArray(item.position),
            target: new THREE.Vector3().fromArray(item.target),
            fov: item.fov,
            name: item.name,
            description: item.description,
          };

          if (this.validatePreset(preset)) {
            this.presets.set(item.id as SectionId, preset);
          }
        });
      }

      if (data.customPresets) {
        data.customPresets.forEach((item: any) => {
          const preset: CameraPreset = {
            position: new THREE.Vector3().fromArray(item.position),
            target: new THREE.Vector3().fromArray(item.target),
            fov: item.fov,
            name: item.name,
            description: item.description,
          };

          if (this.validatePreset(preset)) {
            this.customPresets.set(item.id, preset);
          }
        });
      }

      return true;
    } catch (error) {
      console.error('Failed to import camera presets:', error);
      return false;
    }
  }
}

export default CameraPresets;
