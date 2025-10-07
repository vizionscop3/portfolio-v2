/**
 * Touch Handler for 3D Portfolio
 *
 * Provides comprehensive touch gesture recognition and handling
 * for mobile 3D interactions including pan, pinch, tap, and swipe.
 */

export interface TouchPoint {
  id: number;
  x: number;
  y: number;
  timestamp: number;
}

export interface GestureState {
  type:
    | 'none'
    | 'pan'
    | 'pinch'
    | 'tap'
    | 'double-tap'
    | 'swipe'
    | 'long-press';
  startTime: number;
  duration: number;
  distance: number;
  velocity: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  scale?: number;
  rotation?: number;
  center: { x: number; y: number };
  delta: { x: number; y: number };
}

export interface TouchHandlerOptions {
  enablePan?: boolean;
  enablePinch?: boolean;
  enableTap?: boolean;
  enableDoubleTap?: boolean;
  enableSwipe?: boolean;
  enableLongPress?: boolean;
  panThreshold?: number;
  pinchThreshold?: number;
  swipeThreshold?: number;
  swipeVelocityThreshold?: number;
  doubleTapDelay?: number;
  longPressDelay?: number;
  preventDefault?: boolean;
}

export class TouchHandler {
  private element: HTMLElement;
  private options: Required<TouchHandlerOptions>;
  private touches: Map<number, TouchPoint> = new Map();
  private gestureState: GestureState | null = null;
  private lastTapTime = 0;
  private longPressTimer: NodeJS.Timeout | null = null;
  private isLongPressing = false;

  // Event callbacks
  private onGestureStart?: (gesture: GestureState) => void;
  private onGestureMove?: (gesture: GestureState) => void;
  private onGestureEnd?: (gesture: GestureState) => void;
  private onTap?: (point: { x: number; y: number }) => void;
  private onDoubleTap?: (point: { x: number; y: number }) => void;
  private onLongPress?: (point: { x: number; y: number }) => void;
  private onSwipe?: (
    direction: 'up' | 'down' | 'left' | 'right',
    velocity: number
  ) => void;
  private onPan?: (
    delta: { x: number; y: number },
    velocity: { x: number; y: number }
  ) => void;
  private onPinch?: (scale: number, center: { x: number; y: number }) => void;

  constructor(element: HTMLElement, options: TouchHandlerOptions = {}) {
    this.element = element;
    this.options = {
      enablePan: true,
      enablePinch: true,
      enableTap: true,
      enableDoubleTap: true,
      enableSwipe: true,
      enableLongPress: true,
      panThreshold: 10,
      pinchThreshold: 0.1,
      swipeThreshold: 30,
      swipeVelocityThreshold: 0.5,
      doubleTapDelay: 300,
      longPressDelay: 500,
      preventDefault: true,
      ...options,
    };

    this.bindEvents();
  }

  private bindEvents() {
    this.element.addEventListener(
      'touchstart',
      this.handleTouchStart.bind(this),
      { passive: false }
    );
    this.element.addEventListener(
      'touchmove',
      this.handleTouchMove.bind(this),
      { passive: false }
    );
    this.element.addEventListener('touchend', this.handleTouchEnd.bind(this), {
      passive: false,
    });
    this.element.addEventListener(
      'touchcancel',
      this.handleTouchCancel.bind(this),
      { passive: false }
    );
  }

  private handleTouchStart(event: TouchEvent) {
    if (this.options.preventDefault) {
      event.preventDefault();
    }

    const currentTime = Date.now();
    this.updateTouches(event);

    // Cancel long press timer if new touch starts
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }

    const touchCount = this.touches.size;
    const firstTouch = Array.from(this.touches.values())[0];

    if (touchCount === 1) {
      // Single touch - potential tap, long press, or pan start
      this.gestureState = {
        type: 'none',
        startTime: currentTime,
        duration: 0,
        distance: 0,
        velocity: 0,
        center: { x: firstTouch.x, y: firstTouch.y },
        delta: { x: 0, y: 0 },
      };

      // Start long press detection
      if (this.options.enableLongPress) {
        this.longPressTimer = setTimeout(() => {
          if (
            this.gestureState &&
            this.gestureState.distance < this.options.panThreshold
          ) {
            this.isLongPressing = true;
            this.onLongPress?.({ x: firstTouch.x, y: firstTouch.y });
          }
        }, this.options.longPressDelay);
      }
    } else if (touchCount === 2 && this.options.enablePinch) {
      // Two touches - pinch gesture
      const touches = Array.from(this.touches.values());
      const center = this.calculateCenter(touches);

      this.gestureState = {
        type: 'pinch',
        startTime: currentTime,
        duration: 0,
        distance: this.calculateDistance(touches[0], touches[1]),
        velocity: 0,
        scale: 1,
        center,
        delta: { x: 0, y: 0 },
      };

      this.onGestureStart?.(this.gestureState);
    }
  }

  private handleTouchMove(event: TouchEvent) {
    if (this.options.preventDefault) {
      event.preventDefault();
    }

    this.updateTouches(event);

    if (!this.gestureState) return;

    const currentTime = Date.now();
    const touchCount = this.touches.size;
    const touches = Array.from(this.touches.values());

    this.gestureState.duration = currentTime - this.gestureState.startTime;

    if (touchCount === 1 && touches.length > 0) {
      // Single touch movement
      const touch = touches[0];
      const deltaX = touch.x - this.gestureState.center.x;
      const deltaY = touch.y - this.gestureState.center.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      this.gestureState.delta = { x: deltaX, y: deltaY };
      this.gestureState.distance = distance;
      this.gestureState.velocity =
        distance / Math.max(this.gestureState.duration, 1);

      // Check if movement exceeds pan threshold
      if (
        distance > this.options.panThreshold &&
        this.gestureState.type === 'none'
      ) {
        this.gestureState.type = 'pan';
        this.isLongPressing = false;

        if (this.longPressTimer) {
          clearTimeout(this.longPressTimer);
          this.longPressTimer = null;
        }

        this.onGestureStart?.(this.gestureState);
      }

      if (this.gestureState.type === 'pan' && this.options.enablePan) {
        const velocity = {
          x: deltaX / Math.max(this.gestureState.duration, 1),
          y: deltaY / Math.max(this.gestureState.duration, 1),
        };
        this.onPan?.(this.gestureState.delta, velocity);
        this.onGestureMove?.(this.gestureState);
      }
    } else if (touchCount === 2 && this.gestureState.type === 'pinch') {
      // Pinch gesture
      const currentDistance = this.calculateDistance(touches[0], touches[1]);
      const scale = currentDistance / this.gestureState.distance;
      const center = this.calculateCenter(touches);

      this.gestureState.scale = scale;
      this.gestureState.center = center;

      if (Math.abs(scale - 1) > this.options.pinchThreshold) {
        this.onPinch?.(scale, center);
        this.onGestureMove?.(this.gestureState);
      }
    }
  }

  private handleTouchEnd(event: TouchEvent) {
    if (this.options.preventDefault) {
      event.preventDefault();
    }

    const currentTime = Date.now();
    this.updateTouches(event);

    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }

    if (!this.gestureState) return;

    const touchCount = this.touches.size;
    this.gestureState.duration = currentTime - this.gestureState.startTime;

    // Handle gesture end
    if (touchCount === 0) {
      // All touches ended
      if (this.gestureState.type === 'none' && !this.isLongPressing) {
        // Tap gesture
        if (
          this.gestureState.duration < 300 &&
          this.gestureState.distance < this.options.panThreshold
        ) {
          this.handleTapGesture(this.gestureState.center, currentTime);
        }
      } else if (this.gestureState.type === 'pan' && this.options.enableSwipe) {
        // Check for swipe
        this.handleSwipeGesture(this.gestureState);
      }

      this.onGestureEnd?.(this.gestureState);
      this.gestureState = null;
      this.isLongPressing = false;
    }
  }

  private handleTouchCancel(event: TouchEvent) {
    this.updateTouches(event);

    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }

    if (this.gestureState) {
      this.onGestureEnd?.(this.gestureState);
      this.gestureState = null;
    }

    this.isLongPressing = false;
    this.touches.clear();
  }

  private updateTouches(event: TouchEvent) {
    // Clear current touches
    this.touches.clear();

    // Add current touches
    for (let i = 0; i < event.touches.length; i++) {
      const touch = event.touches[i];
      const rect = this.element.getBoundingClientRect();

      this.touches.set(touch.identifier, {
        id: touch.identifier,
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
        timestamp: Date.now(),
      });
    }
  }

  private handleTapGesture(
    point: { x: number; y: number },
    currentTime: number
  ) {
    if (
      this.options.enableDoubleTap &&
      currentTime - this.lastTapTime < this.options.doubleTapDelay
    ) {
      // Double tap
      this.onDoubleTap?.(point);
    } else if (this.options.enableTap) {
      // Single tap
      this.onTap?.(point);
    }

    this.lastTapTime = currentTime;
  }

  private handleSwipeGesture(gestureState: GestureState) {
    if (gestureState.distance < this.options.swipeThreshold) return;
    if (gestureState.velocity < this.options.swipeVelocityThreshold) return;

    const deltaX = gestureState.delta.x;
    const deltaY = gestureState.delta.y;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    let direction: 'up' | 'down' | 'left' | 'right';

    if (absX > absY) {
      direction = deltaX > 0 ? 'right' : 'left';
    } else {
      direction = deltaY > 0 ? 'down' : 'up';
    }

    this.onSwipe?.(direction, gestureState.velocity);
  }

  private calculateDistance(touch1: TouchPoint, touch2: TouchPoint): number {
    const dx = touch1.x - touch2.x;
    const dy = touch1.y - touch2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  private calculateCenter(touches: TouchPoint[]): { x: number; y: number } {
    const sumX = touches.reduce((sum, touch) => sum + touch.x, 0);
    const sumY = touches.reduce((sum, touch) => sum + touch.y, 0);

    return {
      x: sumX / touches.length,
      y: sumY / touches.length,
    };
  }

  // Public API for setting event handlers
  public onTapHandler(callback: (point: { x: number; y: number }) => void) {
    this.onTap = callback;
    return this;
  }

  public onDoubleTapHandler(
    callback: (point: { x: number; y: number }) => void
  ) {
    this.onDoubleTap = callback;
    return this;
  }

  public onLongPressHandler(
    callback: (point: { x: number; y: number }) => void
  ) {
    this.onLongPress = callback;
    return this;
  }

  public onSwipeHandler(
    callback: (
      direction: 'up' | 'down' | 'left' | 'right',
      velocity: number
    ) => void
  ) {
    this.onSwipe = callback;
    return this;
  }

  public onPanHandler(
    callback: (
      delta: { x: number; y: number },
      velocity: { x: number; y: number }
    ) => void
  ) {
    this.onPan = callback;
    return this;
  }

  public onPinchHandler(
    callback: (scale: number, center: { x: number; y: number }) => void
  ) {
    this.onPinch = callback;
    return this;
  }

  public onGestureStartHandler(callback: (gesture: GestureState) => void) {
    this.onGestureStart = callback;
    return this;
  }

  public onGestureMoveHandler(callback: (gesture: GestureState) => void) {
    this.onGestureMove = callback;
    return this;
  }

  public onGestureEndHandler(callback: (gesture: GestureState) => void) {
    this.onGestureEnd = callback;
    return this;
  }

  public destroy() {
    this.element.removeEventListener(
      'touchstart',
      this.handleTouchStart.bind(this)
    );
    this.element.removeEventListener(
      'touchmove',
      this.handleTouchMove.bind(this)
    );
    this.element.removeEventListener(
      'touchend',
      this.handleTouchEnd.bind(this)
    );
    this.element.removeEventListener(
      'touchcancel',
      this.handleTouchCancel.bind(this)
    );

    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
    }

    this.touches.clear();
    this.gestureState = null;
  }
}

export default TouchHandler;
