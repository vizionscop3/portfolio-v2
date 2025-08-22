import { Euler, Vector3, Object3D } from 'three';

export interface InteractiveObjectProps {
  id: string;
  position: Vector3;
  rotation?: Euler;
  scale?: Vector3;
  tooltip: string;
  section: string;
  children: React.ReactNode;
  onClick?: () => void;
  onHover?: (hovered: boolean) => void;
  onRef?: (ref: Object3D | null) => void;
}

export interface ObjectState {
  isHovered: boolean;
  isClicked: boolean;
  glowIntensity: number;
  scale: number;
}

export interface TooltipData {
  text: string;
  position: { x: number; y: number };
  visible: boolean;
}

export interface InteractiveObjectStore {
  hoveredObject: string | null;
  tooltipData: TooltipData;
  setHoveredObject: (id: string | null) => void;
  setTooltip: (data: TooltipData) => void;
}
// Room layout definitions for object placement
export interface RoomLayout {
  deskArea: {
    position: Vector3;
    size: Vector3;
    objects: string[];
  };
  bedArea: {
    position: Vector3;
    size: Vector3;
    objects: string[];
  };
  closetArea: {
    position: Vector3;
    size: Vector3;
    objects: string[];
  };
  shelfArea: {
    position: Vector3;
    size: Vector3;
    objects: string[];
  };
}

export interface PlacementConstraints {
  minDistance?: number;
  surfaceOnly?: boolean;
  allowedSurfaces?: string[];
  roomBounds?: {
    min: Vector3;
    max: Vector3;
  };
}
