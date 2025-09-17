# Portfolio v2 - AI Coding Agent Instructions

## Project Architecture Overview

This is a modern React 18 + TypeScript portfolio featuring an immersive 3D interactive experience built with React Three
Fiber. The project follows a phase-based development methodology with professional CI/CD, comprehensive accessibility
features, and advanced performance monitoring.

### Key Technologies

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **3D Engine**: React Three Fiber, Three.js, @react-three/drei
- **State**: Zustand (lightweight), Context API for providers
- **Routing**: React Router DOM v6 with future flags enabled
- **Animation**: Framer Motion, custom WebGL effects
- **Testing**: Vitest, Testing Library, coverage reporting
- **Deployment**: Azure Static Web Apps with multi-environment setup

## Critical Architecture Patterns

### Provider Hierarchy (App.tsx)

```tsx
<ErrorBoundary>
  <BrowserRouter>
    <AnalyticsProvider>
      <AccessibilityProvider>
        <PipWindowProvider>
          <Layout>
            <PortfolioRouter />
            <PerformanceMonitor />
          </Layout>
        </PipWindowProvider>
      </AccessibilityProvider>
    </AnalyticsProvider>
  </BrowserRouter>
</ErrorBoundary>
```

### 3D Component Architecture (`src/components/3d/`)

- **ObjectManager.tsx**: Orchestrates 3D object lifecycle with LOD system
- **InteractiveObject.tsx**: Handles object interactions and hover effects
- **Scene3D.tsx**: Main 3D scene setup with lighting and controls
- **store.ts**: Zustand store for 3D object state management
- **cyberpunk/**: Themed 3D components (HolographicComputer, DigitalCodex, etc.)

### Error Handling & Logging

- **Global Setup**: `initializeLogging()` and `setupGlobalErrorHandlers()` in App.tsx
- **Professional Logging**: Use `logInfo`, `logError`, `logWarn`, `logDebug` from `utils/loggingService`
- **Error Boundaries**: Wrap components with `<ErrorBoundary>` for graceful failures
- **Performance Monitoring**: Built-in performance tracking via `usePerformanceMonitor`

### Accessibility Architecture

- **Provider Chain**: AccessibilityProvider → KeyboardAccessibilityProvider → ScreenReaderProvider
- **Preferences System**: `useAccessibilityPreferences` hook with CSS variable integration
- **3D Accessibility**: Special handling for `reduce3DEffects`, `simplifyVisuals`
- **WCAG Compliance**: Comprehensive keyboard navigation, screen reader support

## Development Workflows

### Essential Commands

```bash
# Development with hot reload
npm run dev

# Type-safe production build
npm run build:prod

# Testing with coverage
npm run test:coverage

# Linting and formatting
npm run lint:fix && npm run format
```

### Path Aliases (tsconfig.json)

```typescript
import { Component } from '@/components/MyComponent'; // src/components/
import { useHook } from '@/hooks/useHook'; // src/hooks/
import { utility } from '@/utils/utility'; // src/utils/
import type { Type } from '@/types'; // src/types/
```

### State Management Patterns

- **3D Objects**: Use `useInteractiveStore()` from `components/3d/store`
- **Accessibility**: Use specialized hooks like `useAccessibilityPreferences`, `useReducedMotion`
- **Performance**: Use `usePerformanceMonitor`, `useLODSystem` for optimization
- **Mobile**: Use `useMobile`, `useViewport`, `useBreakpoint` for responsive behavior

## Project-Specific Conventions

### Component Structure

```tsx
// Standard component pattern with accessibility
export const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => {
  const { announceSection } = useScreenReader();
  const { preferences } = useAccessibilityPreferences();

  return <section aria-label="Component description">{/* Component content */}</section>;
};
```

### 3D Component Pattern

```tsx
// 3D components should integrate with LOD and performance systems
export const My3DComponent: React.FC = () => {
  const { registerObject } = useLODSystem();
  const { reduce3DEffects } = use3DAccessibility();

  if (reduce3DEffects) {
    return <FallbackComponent />;
  }

  return <mesh ref={ref => registerObject(ref, 'componentId', config)}>{/* 3D content */}</mesh>;
};
```

### Error Handling Pattern

```typescript
try {
  // Risky operation
} catch (error) {
  logError('Operation failed', error, {
    component: 'ComponentName',
    context: additionalContext,
  });
  // Graceful fallback
}
```

## Critical Integration Points

### Performance System

- **LOD Management**: Objects auto-register with `useLODSystem` hook
- **Performance Monitoring**: `<PerformanceMonitor />` tracks FPS, memory, load times
- **Asset Loading**: Use `useAssetLoader` for progressive loading strategies

### Accessibility System

- **Screen Readers**: Call `announceSection()` when navigating to new sections
- **3D Accessibility**: Check `reduce3DEffects` before rendering complex 3D elements
- **Keyboard Navigation**: Use `useKeyboardNavigation` for custom key handlers

### Mobile/Responsive

- **Touch Handling**: Use utilities in `utils/touchHandler.ts` for 3D mobile interactions
- **Viewport Detection**: `useViewport()` and `useBreakpoint()` for responsive logic
- **Device Optimization**: Mobile devices auto-enable performance optimizations

## File Organization

### Adding New Components

- **UI Components**: `src/components/[category]/ComponentName.tsx`
- **3D Components**: `src/components/3d/[theme]/ComponentName.tsx`
- **Page Components**: `src/components/sections/SectionName.tsx`
- **Hooks**: `src/hooks/useFeatureName.ts`
- **Utils**: `src/utils/featureUtils.ts`
- **Types**: Export from `src/types/index.ts`

### Testing Strategy

- **Component Tests**: Mirror structure in `tests/` directory
- **Hook Tests**: Test custom hooks in `src/hooks/__tests__/`
- **Integration Tests**: Test provider interactions and 3D systems
- **Coverage**: Maintain >80% coverage, focus on critical paths

## Deployment & CI/CD

### Branch Strategy

- **main**: Production deployments to Azure Static Web Apps
- **develop**: Staging environment for testing
- **phase-\***: Feature branches for major development phases

### Build Optimization

- **Chunks**: Manual chunking configured in `vite.config.ts` (vendor, router, icons)
- **Compression**: Production builds include Brotli/Gzip compression
- **Bundle Analysis**: Use `npm run build:analyze` to inspect bundle sizes
- **Performance Budget**: Keep main bundle under 500KB, total under 2MB

### Azure Deployment

- **Configuration**: `staticwebapp.config.json` handles routing and headers
- **Environments**: Multiple Azure environments for different phases
- **Security**: CSP headers, XSS protection configured globally

## Common Pitfalls & Solutions

1. **3D Performance**: Always check `reduce3DEffects` before rendering complex 3D elements
2. **Memory Leaks**: Dispose of Three.js objects in useEffect cleanup functions
3. **Mobile Touch**: Use `touchHandler.ts` utilities instead of custom touch logic
4. **Accessibility**: Test with screen readers; use semantic HTML and ARIA attributes
5. **Bundle Size**: Lazy load heavy 3D components and use dynamic imports
6. **State Updates**: Prefer Zustand for 3D state; React Context for providers only

When working on this codebase, prioritize accessibility, performance, and maintainability. The 3D experience should
gracefully degrade on lower-end devices while maintaining full functionality for capable systems.
