/**
 * Keyboard Navigation System for 3D Portfolio
 *
 * This system provides comprehensive keyboard navigation for the cyberpunk portfolio,
 * including focus management, keyboard shortcuts, and accessibility features.
 */

import { RefObject } from 'react';

export interface NavigableObject {
  id: string;
  element?: RefObject<HTMLElement>;
  section: string;
  tooltip: string;
  position: { x: number; y: number; z: number };
  priority: number;
  isVisible: boolean;
  isInteractable: boolean;
  ariaLabel?: string;
  ariaDescription?: string;
}

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  action: () => void;
  description: string;
  category: 'navigation' | 'interaction' | 'accessibility';
}

export interface KeyboardNavigationOptions {
  enableArrowKeyNavigation?: boolean;
  enableTabNavigation?: boolean;
  enableShortcuts?: boolean;
  enableSpatialNavigation?: boolean;
  focusVisibleOnly?: boolean;
  announceChanges?: boolean;
  debugMode?: boolean;
}

export class KeyboardNavigation {
  private objects: Map<string, NavigableObject> = new Map();
  private shortcuts: Map<string, KeyboardShortcut> = new Map();
  private currentFocusIndex: number = -1;
  private focusOrder: string[] = [];
  private options: KeyboardNavigationOptions;
  private isEnabled: boolean = true;
  private keydownListener?: (event: KeyboardEvent) => void;
  private focusChangeCallbacks: Set<
    (objectId: string | null, action?: string) => void
  > = new Set();
  private announceCallback?: (message: string) => void;

  constructor(options: KeyboardNavigationOptions = {}) {
    this.options = {
      enableArrowKeyNavigation: true,
      enableTabNavigation: true,
      enableShortcuts: true,
      enableSpatialNavigation: true,
      focusVisibleOnly: true,
      announceChanges: false,
      debugMode: false,
      ...options,
    };

    this.setupEventListeners();
    this.setupDefaultShortcuts();
  }

  /**
   * Register a navigable object
   */
  public registerObject(object: NavigableObject): void {
    this.objects.set(object.id, {
      ...object,
      ariaLabel: object.ariaLabel || object.tooltip,
      ariaDescription:
        object.ariaDescription || `Navigate to ${object.section} section`,
    });

    this.updateFocusOrder();

    if (this.options.debugMode) {
      console.log(
        `Keyboard Navigation: Registered object ${object.id} for ${object.section}`
      );
    }
  }

  /**
   * Unregister a navigable object
   */
  public unregisterObject(objectId: string): void {
    this.objects.delete(objectId);
    this.updateFocusOrder();

    if (this.currentFocusIndex >= this.focusOrder.length) {
      this.currentFocusIndex = Math.max(0, this.focusOrder.length - 1);
    }
  }

  /**
   * Update object visibility or interactability
   */
  public updateObject(
    objectId: string,
    updates: Partial<NavigableObject>
  ): void {
    const object = this.objects.get(objectId);
    if (object) {
      Object.assign(object, updates);
      this.updateFocusOrder();
    }
  }

  /**
   * Register a keyboard shortcut
   */
  public registerShortcut(shortcut: KeyboardShortcut): void {
    const key = this.getShortcutKey(shortcut);
    this.shortcuts.set(key, shortcut);

    if (this.options.debugMode) {
      console.log(
        `Keyboard Navigation: Registered shortcut ${key} for ${shortcut.description}`
      );
    }
  }

  /**
   * Focus on a specific object
   */
  public focusObject(objectId: string): boolean {
    const index = this.focusOrder.indexOf(objectId);
    if (index !== -1) {
      this.setFocus(index);
      return true;
    }
    return false;
  }

  /**
   * Get currently focused object
   */
  public getCurrentFocus(): NavigableObject | null {
    if (
      this.currentFocusIndex >= 0 &&
      this.currentFocusIndex < this.focusOrder.length
    ) {
      const objectId = this.focusOrder[this.currentFocusIndex];
      return this.objects.get(objectId) || null;
    }
    return null;
  }

  /**
   * Navigate to next object
   */
  public focusNext(): boolean {
    if (this.focusOrder.length === 0) return false;

    const nextIndex = (this.currentFocusIndex + 1) % this.focusOrder.length;
    this.setFocus(nextIndex);
    return true;
  }

  /**
   * Navigate to previous object
   */
  public focusPrevious(): boolean {
    if (this.focusOrder.length === 0) return false;

    const prevIndex =
      this.currentFocusIndex <= 0
        ? this.focusOrder.length - 1
        : this.currentFocusIndex - 1;
    this.setFocus(prevIndex);
    return true;
  }

  /**
   * Spatial navigation - find nearest object in direction
   */
  public navigateInDirection(
    direction: 'up' | 'down' | 'left' | 'right'
  ): boolean {
    if (!this.options.enableSpatialNavigation) return false;

    const currentObject = this.getCurrentFocus();
    if (!currentObject) return false;

    const candidates = this.getNavigableCandidates();
    const nearest = this.findNearestInDirection(
      currentObject,
      candidates,
      direction
    );

    if (nearest) {
      return this.focusObject(nearest.id);
    }

    return false;
  }

  /**
   * Activate (click) currently focused object
   */
  public activateCurrentObject(): boolean {
    const currentObject = this.getCurrentFocus();
    if (currentObject && currentObject.isInteractable) {
      this.notifyFocusChange(currentObject.id, 'activate');
      return true;
    }
    return false;
  }

  /**
   * Subscribe to focus changes
   */
  public onFocusChange(
    callback: (objectId: string | null, action?: string) => void
  ): () => void {
    this.focusChangeCallbacks.add(callback);
    return () => this.focusChangeCallbacks.delete(callback);
  }

  /**
   * Set announce callback for screen readers
   */
  public setAnnounceCallback(callback: (message: string) => void): void {
    this.announceCallback = callback;
  }

  /**
   * Enable/disable keyboard navigation
   */
  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    if (enabled && !this.keydownListener) {
      this.setupEventListeners();
    } else if (!enabled && this.keydownListener) {
      this.removeEventListeners();
    }
  }

  /**
   * Get all available keyboard shortcuts
   */
  public getShortcuts(): KeyboardShortcut[] {
    return Array.from(this.shortcuts.values());
  }

  /**
   * Clean up event listeners
   */
  public dispose(): void {
    this.removeEventListeners();
    this.objects.clear();
    this.shortcuts.clear();
    this.focusChangeCallbacks.clear();
  }

  private setupEventListeners(): void {
    this.keydownListener = (event: KeyboardEvent) => {
      if (!this.isEnabled) return;

      // Handle shortcuts first
      if (this.options.enableShortcuts && this.handleShortcut(event)) {
        return;
      }

      // Handle navigation keys
      this.handleNavigationKeys(event);
    };

    document.addEventListener('keydown', this.keydownListener);
  }

  private removeEventListeners(): void {
    if (this.keydownListener) {
      document.removeEventListener('keydown', this.keydownListener);
      this.keydownListener = undefined;
    }
  }

  private handleNavigationKeys(event: KeyboardEvent): void {
    let handled = false;

    switch (event.key) {
      case 'Tab':
        if (this.options.enableTabNavigation) {
          event.preventDefault();
          handled = event.shiftKey ? this.focusPrevious() : this.focusNext();
        }
        break;

      case 'ArrowUp':
        if (this.options.enableArrowKeyNavigation) {
          event.preventDefault();
          handled = this.navigateInDirection('up');
        }
        break;

      case 'ArrowDown':
        if (this.options.enableArrowKeyNavigation) {
          event.preventDefault();
          handled = this.navigateInDirection('down');
        }
        break;

      case 'ArrowLeft':
        if (this.options.enableArrowKeyNavigation) {
          event.preventDefault();
          handled = this.navigateInDirection('left');
        }
        break;

      case 'ArrowRight':
        if (this.options.enableArrowKeyNavigation) {
          event.preventDefault();
          handled = this.navigateInDirection('right');
        }
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        handled = this.activateCurrentObject();
        break;

      case 'Escape':
        event.preventDefault();
        this.setFocus(-1); // Clear focus
        handled = true;
        break;
    }

    if (handled && this.options.debugMode) {
      console.log(`Keyboard Navigation: Handled ${event.key}`);
    }
  }

  private handleShortcut(event: KeyboardEvent): boolean {
    const key = this.getShortcutKey({
      key: event.key,
      ctrlKey: event.ctrlKey,
      altKey: event.altKey,
      shiftKey: event.shiftKey,
    } as KeyboardShortcut);

    const shortcut = this.shortcuts.get(key);
    if (shortcut) {
      event.preventDefault();
      shortcut.action();

      if (this.options.announceChanges && this.announceCallback) {
        this.announceCallback(`Executed shortcut: ${shortcut.description}`);
      }

      return true;
    }

    return false;
  }

  private updateFocusOrder(): void {
    const navigableObjects = Array.from(this.objects.values())
      .filter(obj => (this.options.focusVisibleOnly ? obj.isVisible : true))
      .filter(obj => obj.isInteractable)
      .sort((a, b) => {
        // Sort by priority first, then by spatial position
        if (a.priority !== b.priority) {
          return a.priority - b.priority;
        }

        // Spatial sorting: top to bottom, left to right
        const yDiff = b.position.y - a.position.y;
        if (Math.abs(yDiff) > 0.5) {
          return yDiff > 0 ? -1 : 1;
        }

        return a.position.x - b.position.x;
      });

    this.focusOrder = navigableObjects.map(obj => obj.id);

    // Adjust current focus index if needed
    if (this.currentFocusIndex >= 0) {
      const currentObjectId = this.focusOrder[this.currentFocusIndex];
      const newIndex = this.focusOrder.indexOf(currentObjectId);
      this.currentFocusIndex = newIndex;
    }
  }

  private setFocus(index: number): void {
    this.currentFocusIndex = index;

    if (index >= 0 && index < this.focusOrder.length) {
      const objectId = this.focusOrder[index];
      const object = this.objects.get(objectId);

      if (object) {
        this.notifyFocusChange(objectId);

        if (this.options.announceChanges && this.announceCallback) {
          this.announceCallback(
            `Focused on ${object.ariaLabel}. ${object.ariaDescription}`
          );
        }
      }
    } else {
      this.notifyFocusChange(null);
    }
  }

  private getNavigableCandidates(): NavigableObject[] {
    return this.focusOrder
      .map(id => this.objects.get(id))
      .filter((obj): obj is NavigableObject => obj !== undefined);
  }

  private findNearestInDirection(
    current: NavigableObject,
    candidates: NavigableObject[],
    direction: 'up' | 'down' | 'left' | 'right'
  ): NavigableObject | null {
    const filtered = candidates.filter(candidate => {
      if (candidate.id === current.id) return false;

      switch (direction) {
        case 'up':
          return candidate.position.y > current.position.y;
        case 'down':
          return candidate.position.y < current.position.y;
        case 'left':
          return candidate.position.x < current.position.x;
        case 'right':
          return candidate.position.x > current.position.x;
        default:
          return false;
      }
    });

    if (filtered.length === 0) return null;

    // Find nearest by distance
    return filtered.reduce((nearest, candidate) => {
      const nearestDistance = this.calculateDistance(
        current.position,
        nearest.position
      );
      const candidateDistance = this.calculateDistance(
        current.position,
        candidate.position
      );

      return candidateDistance < nearestDistance ? candidate : nearest;
    });
  }

  private calculateDistance(
    pos1: { x: number; y: number; z: number },
    pos2: { x: number; y: number; z: number }
  ): number {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    const dz = pos1.z - pos2.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  private notifyFocusChange(objectId: string | null, action?: string): void {
    this.focusChangeCallbacks.forEach(callback => {
      try {
        callback(objectId, action);
      } catch (error) {
        console.error(
          'Keyboard Navigation: Error in focus change callback:',
          error
        );
      }
    });
  }

  private getShortcutKey(shortcut: Partial<KeyboardShortcut>): string {
    const modifiers = [];
    if (shortcut.ctrlKey) modifiers.push('ctrl');
    if (shortcut.altKey) modifiers.push('alt');
    if (shortcut.shiftKey) modifiers.push('shift');

    return [...modifiers, shortcut.key?.toLowerCase()].join('+');
  }

  private setupDefaultShortcuts(): void {
    // Navigation shortcuts
    this.registerShortcut({
      key: 'h',
      action: () => this.focusNext(),
      description: 'Focus next interactive object',
      category: 'navigation',
    });

    this.registerShortcut({
      key: 'H',
      shiftKey: true,
      action: () => this.focusPrevious(),
      description: 'Focus previous interactive object',
      category: 'navigation',
    });

    // Section shortcuts
    this.registerShortcut({
      key: '1',
      action: () => this.focusSection('about'),
      description: 'Navigate to About section',
      category: 'navigation',
    });

    this.registerShortcut({
      key: '2',
      action: () => this.focusSection('tech'),
      description: 'Navigate to Tech section',
      category: 'navigation',
    });

    this.registerShortcut({
      key: '3',
      action: () => this.focusSection('blog'),
      description: 'Navigate to Blog section',
      category: 'navigation',
    });

    this.registerShortcut({
      key: '4',
      action: () => this.focusSection('fashion'),
      description: 'Navigate to Fashion section',
      category: 'navigation',
    });

    this.registerShortcut({
      key: '5',
      action: () => this.focusSection('merch'),
      description: 'Navigate to Merch section',
      category: 'navigation',
    });

    // Accessibility shortcuts
    this.registerShortcut({
      key: '?',
      shiftKey: true,
      action: () => this.showKeyboardHelp(),
      description: 'Show keyboard shortcuts help',
      category: 'accessibility',
    });

    this.registerShortcut({
      key: 'm',
      action: () => this.toggleKeyboardNavigation(),
      description: 'Toggle keyboard navigation mode',
      category: 'accessibility',
    });
  }

  private focusSection(section: string): void {
    const sectionObjects = Array.from(this.objects.values())
      .filter(
        obj => obj.section === section && obj.isVisible && obj.isInteractable
      )
      .sort((a, b) => a.priority - b.priority);

    if (sectionObjects.length > 0) {
      this.focusObject(sectionObjects[0].id);
    }
  }

  private showKeyboardHelp(): void {
    if (this.announceCallback) {
      const shortcuts = this.getShortcuts()
        .map(s => `${this.getShortcutDisplayName(s)}: ${s.description}`)
        .join('. ');

      this.announceCallback(`Keyboard shortcuts available: ${shortcuts}`);
    }
  }

  private toggleKeyboardNavigation(): void {
    this.setEnabled(!this.isEnabled);
    if (this.announceCallback) {
      this.announceCallback(
        `Keyboard navigation ${this.isEnabled ? 'enabled' : 'disabled'}`
      );
    }
  }

  private getShortcutDisplayName(shortcut: KeyboardShortcut): string {
    const modifiers = [];
    if (shortcut.ctrlKey) modifiers.push('Ctrl');
    if (shortcut.altKey) modifiers.push('Alt');
    if (shortcut.shiftKey) modifiers.push('Shift');

    return [...modifiers, shortcut.key.toUpperCase()].join(' + ');
  }
}

// Singleton instance for global access
let keyboardNavigationInstance: KeyboardNavigation | null = null;

export const getKeyboardNavigation = (
  options?: KeyboardNavigationOptions
): KeyboardNavigation => {
  if (!keyboardNavigationInstance) {
    keyboardNavigationInstance = new KeyboardNavigation(options);
  }
  return keyboardNavigationInstance;
};
