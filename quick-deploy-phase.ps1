#!/usr/bin/env pwsh
# Quick Phase Deployment Script
# Usage: .\quick-deploy-phase.ps1 -Phase 8

param(
    [Parameter(Mandatory=$true)]
    [string]$Phase,
    
    [Parameter(Mandatory=$false)]
    [string]$Description = ""
)

Write-Host "🚀 Quick Phase Deployment for Phase $Phase" -ForegroundColor Cyan

# Phase mapping
$phaseNames = @{
    "1" = "infrastructure-setup"
    "2" = "scene-architecture" 
    "3" = "interactive-objects"
    "4" = "cyberpunk-navigation"
    "5" = "section-transitions"
    "6" = "content-personalization"
    "7" = "performance-monitoring"
    "8" = "accessibility-mobile"
    "9" = "seo-analytics"
    "10" = "visual-enhancements"
    "11" = "final-integration"
}

if (-not $phaseNames.ContainsKey($Phase)) {
    Write-Host "❌ Invalid phase number. Use 1-11." -ForegroundColor Red
    exit 1
}

$phaseName = $phaseNames[$Phase]
$branchName = "phase-$Phase-$phaseName"

try {
    # Create and switch to phase branch
    Write-Host "🌿 Creating branch: $branchName" -ForegroundColor Green
    
    # Ensure we're on main and up to date
    git checkout main
    git pull origin main
    
    # Create new branch
    $branchExists = git branch -a | Select-String -Pattern $branchName -Quiet
    if ($branchExists) {
        Write-Host "⚠️ Branch exists, switching to it..." -ForegroundColor Yellow
        git checkout $branchName
        git pull origin $branchName
    } else {
        git checkout -b $branchName
        
        # Initial commit for phase
        $commitMessage = "feat(phase-$Phase): initialize phase $Phase - $phaseName"
        if ($Description) {
            $commitMessage += "`n`n$Description"
        }
        $commitMessage += "`n`n🎯 Phase: $phaseName`n🚀 Ready for: Independent development and deployment"
        
        git commit --allow-empty -m $commitMessage
        git push -u origin $branchName
    }
    
    Write-Host "✅ Phase $Phase ready for development!" -ForegroundColor Green
    Write-Host "📁 Branch: $branchName" -ForegroundColor Yellow
    Write-Host "🌐 Will deploy to: phase-$phaseName environment" -ForegroundColor Blue
    
    # Show next steps
    Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
    Write-Host "1. Make your changes in this branch" -ForegroundColor White
    Write-Host "2. Commit and push to trigger deployment:" -ForegroundColor White
    Write-Host "   git add ." -ForegroundColor Gray
    Write-Host "   git commit -m 'feat(phase-$Phase): your changes'" -ForegroundColor Gray
    Write-Host "   git push origin $branchName" -ForegroundColor Gray
    Write-Host "3. Each push will deploy to its own Azure environment" -ForegroundColor White
    Write-Host "4. When ready, create PR to merge to main for production" -ForegroundColor White
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
