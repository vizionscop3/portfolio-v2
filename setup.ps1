# PowerShell Setup Script for Portfolio v2
# This script provides PowerShell-compatible commands for project setup

param(
    [string]$Command = "help"
)

function Show-Help {
    Write-Host "Portfolio v2 - PowerShell Setup Script" -ForegroundColor Green
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Available commands:" -ForegroundColor Yellow
    Write-Host "  setup     - Initial project setup"
    Write-Host "  install   - Install dependencies"
    Write-Host "  dev       - Start development server"
    Write-Host "  build     - Build for production"
    Write-Host "  test      - Run tests"
    Write-Host "  lint      - Run linting"
    Write-Host "  format    - Format code"
    Write-Host "  clean     - Clean build artifacts"
    Write-Host "  git-init  - Initialize git repository"
    Write-Host "  husky     - Setup git hooks"
    Write-Host ""
    Write-Host "Usage: .\setup.ps1 -Command <command>" -ForegroundColor Cyan
    Write-Host "Example: .\setup.ps1 -Command setup" -ForegroundColor Cyan
}

function Initialize-Project {
    Write-Host "[SETUP] Setting up Portfolio v2 project..." -ForegroundColor Green
    
    # Check if we're in the right directory
    if (-not (Test-Path "package.json")) {
        Write-Error "package.json not found. Please run this script from the project root."
        return
    }
    
    Write-Host "[INSTALL] Installing dependencies..." -ForegroundColor Yellow
    npm install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[SUCCESS] Dependencies installed successfully" -ForegroundColor Green
    } else {
        Write-Error "[ERROR] Failed to install dependencies"
        return
    }
    
    Write-Host "[HOOKS] Setting up git hooks..." -ForegroundColor Yellow
    npx husky init
    
    Write-Host "[SUCCESS] Project setup completed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Run: .\setup.ps1 -Command dev    # Start development server"
    Write-Host "  2. Run: .\setup.ps1 -Command test   # Run tests"
    Write-Host "  3. Run: .\setup.ps1 -Command build  # Build for production"
}

function Install-Dependencies {
    Write-Host "[INSTALL] Installing dependencies..." -ForegroundColor Yellow
    npm install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[SUCCESS] Dependencies installed successfully" -ForegroundColor Green
    } else {
        Write-Error "[ERROR] Failed to install dependencies"
    }
}

function Start-Development {
    Write-Host "[DEV] Starting development server..." -ForegroundColor Green
    npm run dev
}

function Build-Production {
    Write-Host "[BUILD] Building for production..." -ForegroundColor Yellow
    npm run build
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[SUCCESS] Build completed successfully" -ForegroundColor Green
        Write-Host "[INFO] Build output is in the 'dist' directory" -ForegroundColor Cyan
    } else {
        Write-Error "[ERROR] Build failed"
    }
}

function Run-Tests {
    Write-Host "[TEST] Running tests..." -ForegroundColor Yellow
    npm run test
}

function Run-Linting {
    Write-Host "[LINT] Running linter..." -ForegroundColor Yellow
    npm run lint
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[SUCCESS] Linting passed" -ForegroundColor Green
    } else {
        Write-Host "[WARNING] Linting issues found. Run 'npm run lint:fix' to auto-fix." -ForegroundColor Yellow
    }
}

function Format-Code {
    Write-Host "[FORMAT] Formatting code..." -ForegroundColor Yellow
    npm run format
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[SUCCESS] Code formatted successfully" -ForegroundColor Green
    } else {
        Write-Error "[ERROR] Code formatting failed"
    }
}

function Clean-Build {
    Write-Host "[CLEAN] Cleaning build artifacts..." -ForegroundColor Yellow
    
    if (Test-Path "dist") {
        Remove-Item -Recurse -Force "dist"
        Write-Host "[SUCCESS] Removed dist directory" -ForegroundColor Green
    }
    
    if (Test-Path "coverage") {
        Remove-Item -Recurse -Force "coverage"
        Write-Host "[SUCCESS] Removed coverage directory" -ForegroundColor Green
    }
    
    Write-Host "[SUCCESS] Clean completed" -ForegroundColor Green
}

function Initialize-Git {
    Write-Host "[GIT] Initializing git repository..." -ForegroundColor Yellow
    
    if (Test-Path ".git") {
        Write-Host "[WARNING] Git repository already exists" -ForegroundColor Yellow
        return
    }
    
    git init
    git add .
    git commit -m "chore: initial commit"
    
    Write-Host "[SUCCESS] Git repository initialized" -ForegroundColor Green
    Write-Host "[INFO] Don't forget to add your remote origin:" -ForegroundColor Cyan
    Write-Host "   git remote add origin <your-repo-url>" -ForegroundColor Gray
}

function Setup-Husky {
    Write-Host "[HUSKY] Setting up Husky git hooks..." -ForegroundColor Yellow
    
    npx husky init
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[SUCCESS] Husky setup completed" -ForegroundColor Green
    } else {
        Write-Error "[ERROR] Husky setup failed"
    }
}

# Main execution
switch ($Command.ToLower()) {
    "help" { Show-Help }
    "setup" { Initialize-Project }
    "install" { Install-Dependencies }
    "dev" { Start-Development }
    "build" { Build-Production }
    "test" { Run-Tests }
    "lint" { Run-Linting }
    "format" { Format-Code }
    "clean" { Clean-Build }
    "git-init" { Initialize-Git }
    "husky" { Setup-Husky }
    default {
        Write-Error "Unknown command: $Command"
        Show-Help
    }
}
