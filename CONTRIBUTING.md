# Contributing to Portfolio v2

Thank you for your interest in contributing to this project! This document provides guidelines and information for
contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- Git

**Windows Users:** See our [PowerShell Setup Guide](POWERSHELL_GUIDE.md) for Windows-specific instructions and the
included PowerShell setup script.

### Setup

1. **Fork the repository**

   ```bash
   # Clone your fork
   git clone https://github.com/yourusername/portfolio-v2.git
   cd portfolio-v2
   ```

   **PowerShell:**

   ```powershell
   # Clone your fork
   git clone https://github.com/yourusername/portfolio-v2.git
   cd "portfolio-v2"
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

   **PowerShell:**

   ```powershell
   Copy-Item .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

## 🔄 Development Workflow

### Branching Strategy

We use a Git Flow-inspired branching strategy:

- **`main`**: Production-ready code
- **`develop`**: Integration branch for features
- **`feature/*`**: New features
- **`bugfix/*`**: Bug fixes
- **`hotfix/*`**: Critical production fixes

### Creating a Feature

1. **Create a branch from develop**

   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

   **PowerShell:**

   ```powershell
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write tests for new functionality
   - Follow the existing code style
   - Update documentation as needed

3. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

4. **Push and create a Pull Request**

   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```text
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

#### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `ci`: CI/CD changes

#### Examples

```text
feat(portfolio): add new project section
fix(navigation): resolve mobile menu toggle issue
docs(readme): update installation instructions
```

## � Automated Workflows

This project includes several automated GitHub Actions workflows to maintain code quality and security:

### CI/CD Pipeline (`ci-cd.yml`)

- **Quality Checks**: Linting, type checking, formatting validation
- **Testing**: Unit tests with coverage reporting
- **Security**: Automated security audits
- **Building**: Production builds with artifact uploads
- **Deployment**: Automated deployments to staging/production environments

### Cross-Platform Testing (`cross-platform.yml`)

- **Multi-OS Testing**: Tests on Ubuntu, Windows, and macOS
- **Node.js Versions**: Tests with Node.js 18 and 20
- **PowerShell Compatibility**: Windows-specific PowerShell command testing

### Dependency Management (`dependency-management.yml`)

- **Weekly Scans**: Automated checks for deprecated packages
- **Security Fixes**: Automatic vulnerability fixes with PR creation
- **Update Reports**: Detailed dependency update reports
- **Issue Creation**: Automatic GitHub issues for maintenance tasks

### How Workflows Help

1. **Automatic Fixes**: Security vulnerabilities are automatically fixed when possible
2. **Compatibility**: Ensures code works across different platforms and Node.js versions
3. **Quality**: Maintains consistent code quality through automated checks
4. **Maintenance**: Creates issues and PRs for package updates and security fixes

### Workflow Triggers

- **Push/PR**: Quality checks run on every push and pull request
- **Weekly**: Dependency scans run every Sunday at 2 AM UTC
- **Manual**: All workflows can be triggered manually from GitHub Actions tab

## �🧪 Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

- Write unit tests for utility functions
- Write component tests for React components
- Use descriptive test names
- Test both happy path and error scenarios

### Test Structure

```javascript
describe('Component/Function Name', () => {
  it('should do something specific', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

## 🎨 Code Style

### ESLint and Prettier

We use ESLint and Prettier for code formatting:

```bash
# Check linting
npm run lint

# Fix linting issues
npm run lint:fix

# Check formatting
npm run format:check

# Fix formatting
npm run format
```

### Style Guidelines

- Use TypeScript for type safety
- Use functional components with hooks
- Follow React best practices
- Use meaningful variable and function names
- Write self-documenting code
- Add comments for complex logic

## 🏗️ Project Structure

```
portfolio-v2/
├── src/
│   ├── components/      # Reusable React components
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page components
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript type definitions
│   └── styles/         # Global styles
├── tests/              # Test files
├── public/             # Static assets
└── docs/               # Documentation
```

## 🚦 Pull Request Process

1. **Before submitting**:
   - Ensure all tests pass
   - Update documentation
   - Add/update tests for your changes
   - Follow the code style guidelines

2. **Pull Request checklist**:
   - [ ] Tests pass locally
   - [ ] Code follows style guidelines
   - [ ] Documentation updated
   - [ ] Self-review completed
   - [ ] Related issue linked

3. **Review process**:
   - At least one approval required
   - CI/CD checks must pass
   - Address reviewer feedback
   - Squash commits if requested

## 🐛 Reporting Bugs

1. **Search existing issues** first
2. **Use the bug report template**
3. **Provide detailed information**:
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details
   - Screenshots if applicable

## 💡 Suggesting Features

1. **Check existing feature requests**
2. **Use the feature request template**
3. **Provide clear description**:
   - Problem statement
   - Proposed solution
   - Alternative solutions considered
   - Implementation details

## 🔒 Security

If you discover a security vulnerability:

1. **Do not** create a public issue
2. **Email** directly to: security@johndeveloper.dev
3. **Include** detailed information about the vulnerability
4. **Allow** reasonable time for the issue to be addressed

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

## 🙏 Recognition

Contributors will be recognized in:

- README.md contributors section
- Release notes
- Project documentation

## ❓ Questions

If you have questions about contributing:

1. Check the [FAQ](FAQ.md)
2. Search existing [discussions](https://github.com/yourusername/portfolio-v2/discussions)
3. Create a new discussion
4. Join our [Discord community](https://discord.gg/portfolio-v2)

## 🎯 Areas for Contribution

We especially welcome contributions in:

- **Performance optimizations**
- **Accessibility improvements**
- **Cross-browser compatibility**
- **Mobile responsiveness**
- **Test coverage**
- **Documentation**
- **New features** (see our [roadmap](ROADMAP.md))

Thank you for contributing to Portfolio v2! 🚀
