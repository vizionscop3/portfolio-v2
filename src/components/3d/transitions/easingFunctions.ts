import { Euler, Vector3 } from 'three';
import { EasingFunction } from './types';

export const easingFunctions: Record<string, EasingFunction> = {
  linear: (t: number) => t,

  easeInOut: (t: number) => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  },

  easeIn: (t: number) => {
    return t * t;
  },

  easeOut: (t: number) => {
    return t * (2 - t);
  },

  bounce: (t: number) => {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  },
};

export const interpolateVector3 = (
  start: Vector3,
  end: Vector3,
  t: number
): Vector3 => {
  return new Vector3().lerpVectors(start, end, t);
};

export const interpolateEuler = (
  start: Euler,
  end: Euler,
  t: number
): Euler => {
  return new Euler(
    start.x + (end.x - start.x) * t,
    start.y + (end.y - start.y) * t,
    start.z + (end.z - start.z) * t,
    start.order
  );
};
