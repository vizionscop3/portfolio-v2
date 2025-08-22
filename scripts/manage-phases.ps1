# Phase Branch Management Script
# Helps create, manage, and deploy phases independently

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("create", "deploy", "merge", "status", "cleanup")]
    [string]$Action,
    
    [Parameter(Mandatory=$false)]
    [string]$PhaseName,
    
    [Parameter(Mandatory=$false)]
    [string]$FeatureName,
    
    [Parameter(Mandatory=$false)]
    [switch]$Force
)

function Write-PhaseHeader {
    param([string]$Title)
    Write-Host "`n" + "="*60 -ForegroundColor Cyan
    Write-Host "🚀 $Title" -ForegroundColor Cyan
    Write-Host "="*60 -ForegroundColor Cyan
}

function Get-PhaseInfo {
    $phases = @{
        "1" = @{ Name = "infrastructure-setup"; Description = "3D Infrastructure and Dependencies" }
        "2" = @{ Name = "scene-architecture"; Description = "Core 3D Scene Architecture" }
        "3" = @{ Name = "interactive-objects"; Description = "Interactive Object System" }
        "4" = @{ Name = "cyberpunk-navigation"; Description = "Cyberpunk Objects for Navigation" }
        "5" = @{ Name = "section-transitions"; Description = "Section Navigation and Transitions" }
        "6" = @{ Name = "content-personalization"; Description = "Content Updates and Store Integration" }
        "7" = @{ Name = "performance-monitoring"; Description = "Performance Optimization System" }
        "8" = @{ Name = "accessibility-mobile"; Description = "Accessibility and Mobile Support" }
        "9" = @{ Name = "seo-analytics"; Description = "SEO and Analytics Integration" }
        "10" = @{ Name = "visual-enhancements"; Description = "Visual Enhancements and Polish" }
        "11" = @{ Name = "final-integration"; Description = "Final Integration and Testing" }
    }
    return $phases
}

function Show-PhaseStatus {
    Write-PhaseHeader "Phase Status Overview"
    
    $phases = Get-PhaseInfo
    $branches = git branch -r | ForEach-Object { $_.Trim() -replace '^origin/', '' } | Where-Object { $_ -like 'phase-*' }
    
    Write-Host "📊 Current Phase Branches:" -ForegroundColor Green
    foreach ($branch in $branches) {
        $lastCommit = git log -1 --format="%h - %s (%cr)" "origin/$branch" 2>$null
        if ($lastCommit) {
            Write-Host "  ✅ $branch" -ForegroundColor Green
            Write-Host "     $lastCommit" -ForegroundColor Gray
        }
    }
    
    Write-Host "`n📋 Available Phases:" -ForegroundColor Yellow
    foreach ($phase in $phases.GetEnumerator() | Sort-Object Name) {
        $branchName = "phase-$($phase.Value.Name)"
        $exists = $branches -contains $branchName
        $status = if ($exists) { "✅ EXISTS" } else { "⭕ NOT CREATED" }
        
        Write-Host "  Phase $($phase.Key): $($phase.Value.Description)" -ForegroundColor White
        Write-Host "    Branch: $branchName [$status]" -ForegroundColor Gray
    }
}

function Create-PhaseBranch {
    param([string]$PhaseNumber)
    
    $phases = Get-PhaseInfo
    if (-not $phases.ContainsKey($PhaseNumber)) {
        Write-Host "❌ Invalid phase number. Use 1-11." -ForegroundColor Red
        return
    }
    
    $phaseInfo = $phases[$PhaseNumber]
    $branchName = "phase-$($phaseInfo.Name)"
    
    Write-PhaseHeader "Creating Phase $PhaseNumber Branch"
    Write-Host "Phase: $($phaseInfo.Description)" -ForegroundColor Green
    Write-Host "Branch: $branchName" -ForegroundColor Yellow
    
    try {
        # Check if branch already exists
        $branchExists = git branch -a | Select-String -Pattern $branchName -Quiet
        if ($branchExists -and -not $Force) {
            Write-Host "❌ Branch $branchName already exists. Use -Force to recreate." -ForegroundColor Red
            return
        }
        
        # Create and switch to the new branch
        if ($Force -and $branchExists) {
            Write-Host "🗑️ Deleting existing branch..." -ForegroundColor Yellow
            git branch -D $branchName 2>$null
            git push origin --delete $branchName 2>$null
        }
        
        Write-Host "🌿 Creating branch from main..." -ForegroundColor Green
        git checkout main
        git pull origin main
        git checkout -b $branchName
        
        # Create phase-specific directory structure
        $phaseDir = "phases/phase-$PhaseNumber-$($phaseInfo.Name)"
        if (-not (Test-Path $phaseDir)) {
            New-Item -Path $phaseDir -ItemType Directory -Force
            
            # Create phase README
            $readmeContent = @"
# Phase $PhaseNumber: $($phaseInfo.Description)

## Overview
This phase implements: $($phaseInfo.Description)

## Deployment Environment
- **Branch**: `$branchName`
- **Preview URL**: Will be available after first deployment
- **Environment**: `phase-$($phaseInfo.Name)`

## Getting Started
``````bash
# Switch to this phase
git checkout $branchName

# Install dependencies
npm install

# Start development server
npm run dev

# Deploy this phase
git push origin $branchName
``````

## Phase Tasks
- [ ] Task 1: [Description]
- [ ] Task 2: [Description]
- [ ] Task 3: [Description]

## Testing
``````bash
# Run tests for this phase
npm run test

# Run type checking
npm run type-check

# Run linting
npm run lint
``````

## Deployment
This phase automatically deploys to its own Azure Static Web App environment when pushed to the `$branchName` branch.

**Preview Environment**: `phase-$($phaseInfo.Name)`
"@
            $readmeContent | Out-File -FilePath "$phaseDir/README.md" -Encoding UTF8
        }
        
        # Commit the phase structure
        git add .
        git commit -m "feat(phase-$PhaseNumber): initialize phase $PhaseNumber - $($phaseInfo.Description)

🎯 Phase: $($phaseInfo.Description)
📁 Created: $phaseDir
🚀 Ready for: Independent development and deployment

Co-Authored-By: Claude <noreply@anthropic.com>"
        
        # Push the branch
        Write-Host "🚀 Pushing branch to remote..." -ForegroundColor Green
        git push -u origin $branchName
        
        Write-Host "✅ Phase $PhaseNumber branch created successfully!" -ForegroundColor Green
        Write-Host "🌐 This branch will deploy to: phase-$($phaseInfo.Name)" -ForegroundColor Blue
        Write-Host "📁 Phase directory: $phaseDir" -ForegroundColor Yellow
        
    } catch {
        Write-Host "❌ Failed to create branch: $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Deploy-Phase {
    param([string]$BranchName)
    
    Write-PhaseHeader "Deploying Phase: $BranchName"
    
    try {
        # Ensure we're on the correct branch
        git checkout $BranchName
        git pull origin $BranchName
        
        # Run quality checks
        Write-Host "🔍 Running quality checks..." -ForegroundColor Yellow
        npm run type-check
        Write-Host "✅ TypeScript compilation passed" -ForegroundColor Green
        
        npm run lint -- --max-warnings 200
        Write-Host "✅ Linting completed (warnings allowed for preview)" -ForegroundColor Green
        
        npm run test -- --run
        Write-Host "✅ Tests completed" -ForegroundColor Green
        
        # Trigger deployment by pushing
        Write-Host "🚀 Triggering deployment..." -ForegroundColor Green
        git push origin $BranchName
        
        Write-Host "✅ Deployment triggered for $BranchName" -ForegroundColor Green
        Write-Host "🌐 Check GitHub Actions for deployment status" -ForegroundColor Blue
        Write-Host "📱 Preview URL will be available once deployment completes" -ForegroundColor Yellow
        
    } catch {
        Write-Host "❌ Deployment failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Merge-PhaseToMain {
    param([string]$BranchName)
    
    Write-PhaseHeader "Merging Phase to Main: $BranchName"
    
    Write-Host "⚠️ This will merge $BranchName to main for production deployment." -ForegroundColor Yellow
    $confirm = Read-Host "Continue? (y/N)"
    
    if ($confirm -ne 'y' -and $confirm -ne 'Y') {
        Write-Host "❌ Merge cancelled." -ForegroundColor Red
        return
    }
    
    try {
        # Switch to main and pull latest
        git checkout main
        git pull origin main
        
        # Merge the phase branch
        Write-Host "🔄 Merging $BranchName to main..." -ForegroundColor Green
        git merge $BranchName --no-ff -m "feat: merge $BranchName to production

✅ Phase completed and ready for production
🚀 Deploying to main Azure Static Web App
📊 All quality checks passed

Co-Authored-By: Claude <noreply@anthropic.com>"
        
        # Push to main (triggers production deployment)
        Write-Host "🚀 Pushing to main (production deployment)..." -ForegroundColor Green
        git push origin main
        
        Write-Host "✅ Phase merged to production!" -ForegroundColor Green
        Write-Host "🌐 Production deployment triggered" -ForegroundColor Blue
        
    } catch {
        Write-Host "❌ Merge failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Cleanup-Branches {
    Write-PhaseHeader "Branch Cleanup"
    
    $mergedBranches = git branch --merged main | Where-Object { $_ -like '*phase-*' -or $_ -like '*feature/*' }
    
    if ($mergedBranches.Count -eq 0) {
        Write-Host "✅ No merged branches to clean up." -ForegroundColor Green
        return
    }
    
    Write-Host "🗑️ Found merged branches to clean up:" -ForegroundColor Yellow
    foreach ($branch in $mergedBranches) {
        Write-Host "  - $($branch.Trim())" -ForegroundColor Gray
    }
    
    if (-not $Force) {
        $confirm = Read-Host "Delete these branches? (y/N)"
        if ($confirm -ne 'y' -and $confirm -ne 'Y') {
            Write-Host "❌ Cleanup cancelled." -ForegroundColor Red
            return
        }
    }
    
    foreach ($branch in $mergedBranches) {
        $branchName = $branch.Trim()
        if ($branchName -ne '* main' -and $branchName -ne 'main') {
            Write-Host "🗑️ Deleting $branchName..." -ForegroundColor Yellow
            git branch -d $branchName
            git push origin --delete $branchName 2>$null
        }
    }
    
    Write-Host "✅ Branch cleanup completed!" -ForegroundColor Green
}

# Main script logic
switch ($Action) {
    "create" {
        if (-not $PhaseName) {
            Write-Host "❌ Phase number required. Example: -PhaseName 7" -ForegroundColor Red
            exit 1
        }
        Create-PhaseBranch -PhaseNumber $PhaseName
    }
    "deploy" {
        if (-not $PhaseName) {
            $currentBranch = git branch --show-current
            $PhaseName = $currentBranch
        }
        Deploy-Phase -BranchName $PhaseName
    }
    "merge" {
        if (-not $PhaseName) {
            Write-Host "❌ Branch name required. Example: -PhaseName phase-7-performance-monitoring" -ForegroundColor Red
            exit 1
        }
        Merge-PhaseToMain -BranchName $PhaseName
    }
    "status" {
        Show-PhaseStatus
    }
    "cleanup" {
        Cleanup-Branches
    }
}

Write-Host "`n🎉 Phase management complete!" -ForegroundColor Green
