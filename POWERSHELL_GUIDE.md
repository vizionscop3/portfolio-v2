# PowerShell Setup Guide

This guide provides PowerShell-specific instructions for working with the Portfolio v2 project on Windows.

## 🚨 Important PowerShell Differences

PowerShell uses different syntax than bash for certain operations:

| Operation             | Bash                   | PowerShell                    |
| --------------------- | ---------------------- | ----------------------------- |
| Command chaining      | `command1 && command2` | `command1; command2`          |
| Copy files            | `cp file1 file2`       | `Copy-Item file1 file2`       |
| Environment variables | `$VAR`                 | `$env:VAR`                    |
| Path separators       | `/`                    | `\` (automatic in most cases) |

## 🛠️ Quick Setup

### Option 1: Using the Setup Script (Recommended)

```powershell
# Clone the repository
git clone https://github.com/yourusername/portfolio-v2.git
cd "portfolio-v2"

# Run the setup script
.\setup.ps1 -Command setup
```

### Option 2: Manual Setup

```powershell
# Clone the repository
git clone https://github.com/yourusername/portfolio-v2.git
cd "portfolio-v2"

# Install dependencies
npm install

# Setup git hooks
npx husky init

# Start development server
npm run dev
```

## 📋 Available PowerShell Commands

The included `setup.ps1` script provides convenient PowerShell commands:

```powershell
# Show help
.\setup.ps1 -Command help

# Initial project setup
.\setup.ps1 -Command setup

# Install dependencies
.\setup.ps1 -Command install

# Start development server
.\setup.ps1 -Command dev

# Build for production
.\setup.ps1 -Command build

# Run tests
.\setup.ps1 -Command test

# Run linting
.\setup.ps1 -Command lint

# Format code
.\setup.ps1 -Command format

# Clean build artifacts
.\setup.ps1 -Command clean

# Initialize git repository
.\setup.ps1 -Command git-init

# Setup git hooks
.\setup.ps1 -Command husky
```

## 🔧 Common Development Tasks

### Starting Development

```powershell
# Navigate to project directory
cd "C:\path\to\portfolio-v2"

# Start development server
npm run dev
# OR
.\setup.ps1 -Command dev
```

### Running Tests

```powershell
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Building for Production

```powershell
# Build the application
npm run build

# Preview the production build
npm run preview
```

### Code Quality

```powershell
# Check linting
npm run lint

# Fix linting issues
npm run lint:fix

# Check formatting
npm run format:check

# Fix formatting
npm run format
```

## 🐛 Common Issues and Solutions

### Issue: Command chaining with `&&` fails

**Problem:**

```powershell
# This fails in PowerShell
cd "C:\path\to\project" && npm install
```

**Solution:**

```powershell
# Use semicolon instead
cd "C:\path\to\project"; npm install

# Or use separate commands
cd "C:\path\to\project"
npm install
```

### Issue: Path with spaces causes errors

**Problem:**

```powershell
# This might fail
cd C:\Users\User\Documents\portfolio v2
```

**Solution:**

```powershell
# Use quotes around paths with spaces
cd "C:\Users\User\Documents\portfolio v2"
```

### Issue: npm audit warnings about deprecated packages

**Problem:**

```
npm warn deprecated @humanwhocodes/config-array@0.13.0
npm warn deprecated eslint@8.57.1
```

**Solution:** These are warnings for dependencies that will be automatically updated by our GitHub Actions workflows. To
address immediately:

```powershell
# Check for updates
npx npm-check-updates

# Update specific packages
npm update eslint @humanwhocodes/config-array

# Or let the automated workflow handle it
```

### Issue: Husky installation deprecated warning

**Problem:**

```
husky - install command is DEPRECATED
```

**Solution:** This is expected with newer versions of Husky. The setup script handles this correctly:

```powershell
# Proper Husky setup
npx husky init
```

### Issue: Security vulnerabilities in npm audit

**Problem:**

```
5 moderate severity vulnerabilities
```

**Solution:**

```powershell
# Automatic fix (be careful, may introduce breaking changes)
npm audit fix

# Force fix (more aggressive, may break things)
npm audit fix --force

# Manual review recommended
npm audit
```

## 🔒 Security Best Practices

### Handling npm audit results

1. **Review vulnerabilities:**

   ```powershell
   npm audit
   ```

2. **Fix non-breaking updates:**

   ```powershell
   npm audit fix
   ```

3. **For breaking changes, update manually:**

   ```powershell
   npm update <package-name>
   ```

4. **Test after updates:**
   ```powershell
   npm run test
   npm run build
   ```

## 🚀 Deployment Commands

### Building for different environments

```powershell
# Development build
npm run build:dev

# Production build
npm run build

# Build with type checking
npm run build:check
```

### Environment Variables

```powershell
# Set environment variables in PowerShell
$env:NODE_ENV = "production"
$env:API_URL = "https://api.example.com"

# Run build with environment variables
npm run build
```

## 🎯 VS Code Integration

### Recommended Extensions

Install these VS Code extensions for better PowerShell support:

- PowerShell (ms-vscode.powershell)
- ESLint (dbaeumer.vscode-eslint)
- Prettier (esbenp.prettier-vscode)
- TypeScript Importer (pmneo.tsimporter)

### Integrated Terminal

Configure VS Code to use PowerShell:

1. Open VS Code settings (Ctrl+,)
2. Search for "terminal.integrated.defaultProfile.windows"
3. Set to "PowerShell"

## 🔄 Git Workflow in PowerShell

### Common Git operations

```powershell
# Clone repository
git clone https://github.com/yourusername/portfolio-v2.git
cd "portfolio-v2"

# Create and switch to new branch
git checkout -b "feature/new-feature"

# Stage and commit changes
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin "feature/new-feature"

# Switch back to main
git checkout main

# Pull latest changes
git pull origin main
```

### Git hooks with Husky

The project uses Husky for git hooks. These run automatically:

- **pre-commit**: Runs linting and formatting
- **commit-msg**: Validates commit message format
- **pre-push**: Runs tests before pushing

## 📚 Additional Resources

- [PowerShell Documentation](https://docs.microsoft.com/en-us/powershell/)
- [npm CLI Documentation](https://docs.npmjs.com/cli/)
- [Git for Windows](https://gitforwindows.org/)
- [VS Code PowerShell Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.PowerShell)

## 🆘 Getting Help

If you encounter issues:

1. Check this guide first
2. Review the main [CONTRIBUTING.md](CONTRIBUTING.md)
3. Search existing [GitHub issues](https://github.com/yourusername/portfolio-v2/issues)
4. Create a new issue with:
   - PowerShell version: `$PSVersionTable.PSVersion`
   - Node.js version: `node --version`
   - npm version: `npm --version`
   - Error messages and steps to reproduce
