# Portfolio v2

A modern, immersive portfolio website built with React, TypeScript, and Three.js. Features both 2D and 3D experiences
with a multi-content platform showcasing technical projects, blog posts, fashion content, and merchandise.

## 🚀 Features

### Core Features

- **Immersive 3D Experience**: Interactive 3D room environment with WebGL
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dual Mode**: Seamless switching between 2D and 3D portfolio views
- **TypeScript**: Full type safety and modern development experience
- **Performance**: Optimized builds with automatic quality adjustment
- **Multi-Content Platform**: Tech projects, blog, fashion, and merch sections

### 3D Features

- **Interactive 3D Room**: Realistic room environment with furniture and lighting
- **Smart Camera System**: Smooth transitions between portfolio sections
- **Performance Optimization**: Automatic quality adjustment based on device capabilities
- **WebGL Detection**: Graceful fallback to 2D mode for unsupported devices
- **Real-time Monitoring**: Performance tracking with automatic degradation
- **Material System**: Advanced PBR materials with texture caching

### Quality & Performance

- **Code Quality**: ESLint, Prettier, and automated formatting
- **Testing**: Comprehensive test suite with Vitest
- **CI/CD**: Automated workflows with GitHub Actions
- **Caching**: Optimized caching strategies for performance
- **Error Handling**: Comprehensive error boundaries and logging

## 🛠️ Tech Stack

### Frontend

- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Full type safety and developer experience
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Lightning-fast build tool and dev server

### 3D Graphics

- **Three.js**: 3D graphics library
- **React Three Fiber**: React renderer for Three.js
- **React Three Drei**: Useful helpers and abstractions
- **React Three Postprocessing**: Post-processing effects

### Development & Quality

- **Vitest**: Fast unit testing framework
- **ESLint**: Code linting and quality enforcement
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality gates
- **TypeScript**: Static type checking

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm or yarn package manager
- Git
- Modern browser with WebGL support (for 3D features)

## 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/vizionscop3/portfolio-v2.git
   cd portfolio-v2
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`

## 🚀 Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run preview         # Preview production build

# Code Quality
npm run type-check      # TypeScript type checking
npm run lint           # Run ESLint
npm run lint:fix       # Fix ESLint issues
npm run format         # Format code with Prettier
npm run format:check   # Check code formatting

# Testing
npm run test           # Run tests
npm run test:coverage  # Run tests with coverage
```

## 🏗️ Project Structure

```
portfolio-v2/
├── .kiro/                    # Kiro IDE specifications
│   └── specs/
│       └── 3d-interactive-portfolio/
├── public/                   # Static assets
├── src/
│   ├── components/          # React components
│   │   ├── 3d/             # 3D-specific components
│   │   │   ├── SceneManager.tsx
│   │   │   ├── RoomEnvironment.tsx
│   │   │   ├── CameraController.tsx
│   │   │   ├── LightingSystem.tsx
│   │   │   └── Scene3D.tsx
│   │   ├── ui/             # UI components
│   │   ├── Portfolio.tsx   # Main portfolio component
│   │   └── Portfolio3D.tsx # 3D portfolio wrapper
│   ├── types/              # TypeScript definitions
│   │   ├── scene.ts        # 3D scene types
│   │   ├── interactive.ts  # Interactive object types
│   │   └── performance.ts  # Performance monitoring types
│   ├── utils/              # Utility functions
│   │   ├── webgl-detection.ts
│   │   ├── performance-monitor.ts
│   │   ├── scene-setup.ts
│   │   ├── MaterialSystem.ts
│   │   └── CameraPresets.ts
│   └── styles/             # Global styles
├── docs/                   # Documentation
└── tests/                  # Test files
```

## 🎮 3D Features

### Scene Architecture

- **SceneManager**: Orchestrates the entire 3D scene with lighting and post-processing
- **RoomEnvironment**: Creates a realistic 3D room with furniture foundations
- **CameraController**: Manages smooth camera transitions between portfolio sections
- **LightingSystem**: Implements realistic 3-point lighting with shadows

### Performance System

- **WebGL Detection**: Automatically detects device capabilities
- **Performance Tiers**: Adjusts quality based on device performance (high/medium/low)
- **Real-time Monitoring**: Tracks FPS, memory usage, and draw calls
- **Automatic Degradation**: Reduces quality when performance drops

### Room Layout

- **Desk Area**: Tech/programming section with computer setup
- **Bed Area**: Blog/reading section with books
- **Closet Area**: Fashion section with wardrobe
- **Shelf Area**: Merchandise display section

## 🔄 Git Workflow

This project follows a professional Git workflow with feature branches:

### Current Branches

- `main`: Production-ready code
- `feature/3d-infrastructure-setup`: Phase 1 - 3D infrastructure and dependencies
- `feature/3d-scene-architecture`: Phase 2 - Core 3D scene architecture

### Commit Convention

```
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: adding tests
chore: maintenance tasks
```

## � Deployment

### Build Process

```bash
npm run build
```

### Deployment Targets

- **Vercel**: Automatic deployment from main branch
- **Netlify**: Alternative deployment option
- **GitHub Pages**: Static hosting option

## 🧪 Testing

### Test Coverage

- Infrastructure verification tests
- WebGL detection tests
- Performance monitoring tests
- Component unit tests

### Running Tests

```bash
npm run test              # Run all tests
npm run test:coverage     # Generate coverage report
npm run test:watch        # Watch mode for development
```

## 🛡️ Browser Support

### 3D Mode Requirements

- WebGL 1.0 or 2.0 support
- Modern browsers (Chrome 56+, Firefox 51+, Safari 15+, Edge 79+)
- Sufficient GPU memory for 3D rendering

### 2D Fallback

- Automatic fallback for unsupported devices
- Full functionality maintained in 2D mode
- Progressive enhancement approach

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Ensure all tests pass: `npm run test`
5. Check code quality: `npm run lint && npm run type-check`
6. Commit with conventional format: `git commit -m 'feat: add amazing feature'`
7. Push to your branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

### Development Guidelines

- Write tests for new features
- Follow TypeScript best practices
- Maintain 3D performance considerations
- Update documentation as needed
- Ensure cross-browser compatibility

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Three.js Community**: For the amazing 3D graphics library
- **React Three Fiber**: For the excellent React integration
- **Vite Team**: For the blazing fast build tool
- **React Team**: For the incredible framework
- **Open Source Contributors**: For all the amazing tools and libraries

---

**Built with ❤️ using React, Three.js, and modern web technologies**
