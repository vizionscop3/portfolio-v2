# Portfolio v2

A modern, professional portfolio website built with React, TypeScript, and Vite. Features a multi-content platform
showcasing technical projects, blog posts, fashion content, and merchandise.

## 🚀 Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **TypeScript**: Full type safety and modern development experience
- **Performance**: Optimized builds with Vite
- **Code Quality**: ESLint, Prettier, and automated formatting
- **Testing**: Comprehensive test suite with Vitest
- **CI/CD**: Automated workflows with GitHub Actions
- **Caching**: Optimized caching strategies for performance
- **Error Handling**: Comprehensive error boundaries and logging
- **Multi-Content Platform**: Tech projects, blog, fashion, and merch sections

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Testing**: Vitest, @vitest/coverage-v8
- **Linting**: ESLint, Prettier
- **Git Hooks**: Husky, lint-staged

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm or yarn package manager
- Git

## 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd portfolio-v2
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

## 🚀 Development

### Start development server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Other useful commands

```bash
# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Formatting
npm run format
npm run format:check

# Testing
npm run test
npm run test:coverage
```

## 🏗️ Building for Production

```bash
# Build the project
npm run build

# Preview the build
npm run preview
```

## 🧪 Testing

This project uses Vitest for testing with coverage reporting.

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📁 Project Structure

```
portfolio-v2/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable React components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript type definitions
│   ├── styles/         # Global styles
│   └── main.tsx        # Application entry point
├── tests/              # Test files
├── .github/            # GitHub workflows
└── docs/               # Documentation
```

## 🔄 Git Workflow

This project follows a professional Git workflow:

1. **Feature Branches**: Create feature branches from `main`
2. **Conventional Commits**: Use conventional commit messages
3. **Pull Requests**: All changes go through PR review
4. **Automated Checks**: CI/CD runs tests and linting
5. **Protected Main**: Main branch is protected

### Commit Message Format

```
type(scope): description

feat: add new portfolio section
fix: resolve mobile navigation issue
docs: update installation guide
```

## 🚀 Deployment

### Automatic Deployment

- **Production**: Pushes to `main` trigger automatic deployment
- **Preview**: Pull requests generate preview deployments

### Manual Deployment

```bash
# Build and deploy
npm run build
# Deploy dist/ folder to your hosting platform
```

## 🛡️ Error Handling & Logging

- **Error Boundaries**: React error boundaries catch and display errors gracefully
- **Console Logging**: Structured logging in development
- **Performance Monitoring**: Built-in performance metrics
- **User Feedback**: Error reporting and user feedback systems

## 🏎️ Performance & Caching

- **Code Splitting**: Automatic code splitting with Vite
- **Asset Optimization**: Optimized images and assets
- **Browser Caching**: Proper cache headers
- **Service Worker**: Offline capabilities (optional)

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'feat: add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Write tests for new features
- Follow the existing code style
- Update documentation as needed
- Ensure all CI checks pass

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Your Name**

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite team for the blazing fast build tool
- Tailwind CSS for the utility-first CSS framework
- All open source contributors

---

**Built with ❤️ and modern web technologies**
