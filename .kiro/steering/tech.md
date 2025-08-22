# Tech Stack & Build System

## Core Technologies

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite (fast development and optimized production builds)
- **Styling**: Tailwind CSS with custom theme extensions
- **3D Graphics**: React Three Fiber (@react-three/fiber) with Three.js
- **3D Utilities**: @react-three/drei for common 3D components
- **State Management**: Zustand for lightweight state management
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Animations**: Framer Motion 3D

## Development Tools

- **TypeScript**: Strict mode enabled with comprehensive type checking
- **ESLint**: Code linting with React and TypeScript rules
- **Prettier**: Code formatting with lint-staged integration
- **Husky**: Git hooks for pre-commit checks
- **Vitest**: Testing framework with coverage reporting
- **Testing Library**: React testing utilities

## Common Commands

### Development

```bash
npm run dev          # Start development server (localhost:5173)
npm run type-check   # TypeScript type checking
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues automatically
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
```

### Testing

```bash
npm run test         # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

### Build & Deploy

```bash
npm run build        # Build for production (outputs to dist/)
npm run preview      # Preview production build (localhost:4173)
```

## Path Aliases

Use TypeScript path aliases for clean imports:

- `@/*` → `./src/*`
- `@/components/*` → `./src/components/*`
- `@/hooks/*` → `./src/hooks/*`
- `@/utils/*` → `./src/utils/*`
- `@/types/*` → `./src/types/*`
- `@/styles/*` → `./src/styles/*`

## Requirements

- Node.js >= 18.0.0
- Modern browser with WebGL support for 3D features
