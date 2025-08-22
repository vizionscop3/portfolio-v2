# Project Structure & Organization

## Directory Structure

```
portfolio-v2/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── 3d/         # 3D-specific components (React Three Fiber)
│   │   │   ├── __tests__/     # 3D component tests
│   │   │   ├── cyberpunk/     # Themed 3D assets/components
│   │   │   └── *.tsx          # Core 3D components
│   │   ├── Portfolio.tsx      # Main portfolio component
│   │   └── Portfolio3D.tsx    # 3D portfolio wrapper
│   ├── hooks/          # Custom React hooks
│   ├── styles/         # Global styles and CSS
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   │   ├── cache.ts           # Caching utilities
│   │   ├── errorHandling.tsx  # Error boundaries & handlers
│   │   └── logger.ts          # Logging utilities
│   ├── App.tsx         # Root application component
│   ├── main.tsx        # Application entry point
│   └── env.d.ts        # Environment type definitions
├── tests/              # Test files and setup
├── .kiro/              # Kiro AI assistant configuration
└── dist/               # Production build output
```

## Component Organization

### 3D Components (`src/components/3d/`)

- **Scene3D.tsx**: Main 3D scene setup
- **InteractiveObject.tsx**: Interactive 3D objects
- **ObjectManager.tsx**: Manages 3D object lifecycle
- **store.ts**: Zustand state management for 3D interactions
- **types.ts**: 3D-specific TypeScript types
- **index.ts**: Barrel exports for clean imports

### Naming Conventions

- **Components**: PascalCase (e.g., `Portfolio3D.tsx`)
- **Utilities**: camelCase (e.g., `errorHandling.tsx`)
- **Types**: PascalCase interfaces/types in `types/` directory
- **Hooks**: camelCase starting with `use` (e.g., `usePortfolio.ts`)

## Architecture Patterns

### Error Handling

- Global error boundaries in `utils/errorHandling.tsx`
- Structured logging via `utils/logger.ts`
- Graceful fallbacks for 3D components

### State Management

- Zustand for lightweight, focused state management
- 3D-specific state isolated in `components/3d/store.ts`
- Component-level state for UI interactions

### Performance Optimization

- Code splitting with manual chunks (vendor, router, icons)
- Lazy loading for heavy 3D components
- Caching strategies in `utils/cache.ts`

## File Conventions

- Use TypeScript for all new files
- Export components as default exports
- Use named exports for utilities and types
- Include JSDoc comments for complex functions
- Test files should mirror source structure in `tests/`
