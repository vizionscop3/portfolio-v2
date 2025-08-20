import { Vector3 } from 'three';
import { SectionId } from './scene';

// Interactive Object Types
export interface InteractiveObject {
  id: string;
  name: string;
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;
  modelPath: string;
  section: SectionId;
  hoverEffects: HoverEffect[];
  clickAction: ClickAction;
  tooltip: TooltipConfig;
  accessibility: AccessibilityConfig;
}

export interface HoverEffect {
  type: 'glow' | 'scale' | 'rotate' | 'float';
  intensity: number;
  duration: number;
  easing: string;
}

export interface ClickAction {
  type: 'navigate' | 'modal' | 'external';
  target: string;
  data?: any;
}

export interface TooltipConfig {
  text: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  delay: number;
  showOnHover: boolean;
}

export interface AccessibilityConfig {
  ariaLabel: string;
  description: string;
  keyboardShortcut?: string;
  focusable: boolean;
}

// Room Environment Types
export interface RoomEnvironment {
  walls: WallConfig[];
  floor: FloorConfig;
  ceiling: CeilingConfig;
  furniture: FurnitureItem[];
  lighting: LightSource[];
  ambientSound?: AudioConfig;
}

export interface WallConfig {
  id: string;
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;
  material: MaterialConfig;
}

export interface FloorConfig {
  material: MaterialConfig;
  size: { width: number; height: number };
}

export interface CeilingConfig {
  material: MaterialConfig;
  height: number;
}

export interface FurnitureItem {
  id: string;
  type: 'desk' | 'bed' | 'closet' | 'shelf' | 'chair';
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;
  modelPath: string;
  materials: MaterialConfig[];
}

export interface LightSource {
  id: string;
  type: 'ambient' | 'directional' | 'point' | 'spot';
  position?: Vector3;
  target?: Vector3;
  intensity: number;
  color: string;
  castShadow: boolean;
}

export interface MaterialConfig {
  type: 'standard' | 'physical' | 'basic';
  color?: string;
  roughness?: number;
  metalness?: number;
  normalMap?: string;
  diffuseMap?: string;
  specularMap?: string;
}

export interface AudioConfig {
  src: string;
  volume: number;
  loop: boolean;
  autoplay: boolean;
}
