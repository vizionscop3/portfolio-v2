# Phase-Based Deployment Guide

## 🚀 Overview

This guide explains how to deploy individual phases/features of your portfolio independently using Azure Static Web Apps
with multiple environments.

## 🏗️ Architecture

### Deployment Environments

1. **Phase Foundation** (`phase-1` to `phase-3`)
   - Infrastructure setup, scene architecture, interactive objects
   - Environment: `phase-foundation`

2. **Phase Content** (`phase-4` to `phase-6`)
   - Cyberpunk navigation, transitions, content personalization
   - Environment: `phase-content`

3. **Phase Optimization** (`phase-7` to `phase-9`)
   - Performance monitoring, accessibility, SEO
   - Environment: `phase-optimization`

4. **Phase Polish** (`phase-10` to `phase-11`)
   - Visual enhancements, final integration
   - Environment: `phase-polish`

5. **Feature Preview** (`feature/*` branches)
   - Individual feature development and testing
   - Environment: `feature-preview`

6. **Production** (`main` branch)
   - Final production deployment
   - Environment: `production`

## 📋 Setup Instructions

### 1. Azure Resources Setup

Run the Azure setup script to create multiple Static Web Apps:

```powershell
# Navigate to your project directory
cd "c:\Users\User\Documents\portfolio v2"

# Run the Azure setup script
.\scripts\setup-phase-deployment.ps1 -ResourceGroupName "portfolio-rg" -Location "East US 2"
```

This creates 6 Azure Static Web Apps for different phase groups.

### 2. GitHub Secrets Configuration

After running the setup script, add these secrets to your GitHub repository:

1. Go to `https://github.com/vizionscop3/portfolio-v2/settings/secrets/actions`
2. Add the deployment tokens provided by the setup script:
   - `AZURE_STATIC_WEB_APPS_API_TOKEN_PHASE_FOUNDATION`
   - `AZURE_STATIC_WEB_APPS_API_TOKEN_PHASE_CONTENT`
   - `AZURE_STATIC_WEB_APPS_API_TOKEN_PHASE_OPTIMIZATION`
   - `AZURE_STATIC_WEB_APPS_API_TOKEN_PHASE_POLISH`
   - `AZURE_STATIC_WEB_APPS_API_TOKEN_FEATURE_PREVIEW`
   - `AZURE_STATIC_WEB_APPS_API_TOKEN_PHASE_PREVIEW`

## 🌿 Branch Management

### Creating a New Phase Branch

```powershell
# Create a new phase branch (e.g., Phase 8)
.\scripts\manage-phases.ps1 -Action create -PhaseName 8

# Or create a feature branch manually
git checkout -b feature/new-3d-animation
```

### Working on a Phase

```powershell
# Switch to your phase branch
git checkout phase-8-accessibility-mobile

# Make your changes
# ... edit files ...

# Commit changes
git add .
git commit -m "feat(phase-8): implement mobile touch controls

✨ Added touch gesture support for 3D navigation
📱 Optimized for mobile performance
♿ Enhanced accessibility features

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to trigger deployment
git push origin phase-8-accessibility-mobile
```

### Deploying a Phase

```powershell
# Deploy current branch
.\scripts\manage-phases.ps1 -Action deploy

# Or deploy specific phase
.\scripts\manage-phases.ps1 -Action deploy -PhaseName phase-8-accessibility-mobile
```

## 🚀 Deployment Process

### Automatic Deployment

1. **Push to Phase Branch**: Triggers deployment to phase-specific environment
2. **Quality Checks**: TypeScript, linting, testing (warnings allowed)
3. **Build**: Creates optimized production build with environment info
4. **Deploy**: Deploys to dedicated Azure Static Web App
5. **Preview URL**: Available in GitHub Actions logs and PR comments

### Manual Deployment Commands

```powershell
# Check status of all phases
.\scripts\manage-phases.ps1 -Action status

# Deploy a specific phase
git checkout phase-7-performance-monitoring
git push origin phase-7-performance-monitoring

# Create pull request for review
gh pr create --title "Phase 7: Performance Monitoring System" --body "Ready for review and testing"
```

## 🔄 Merging to Production

### When Ready for Production

```powershell
# Merge phase to main (production)
.\scripts\manage-phases.ps1 -Action merge -PhaseName phase-7-performance-monitoring

# Or manually via GitHub PR
gh pr create --base main --head phase-7-performance-monitoring
```

### Production Deployment

Once merged to `main`, the original Azure Static Web Apps workflow (`azure-static-web-apps-happy-flower-01a9d340f.yml`)
handles production deployment.

## 📊 Monitoring Deployments

### GitHub Actions

1. Visit: `https://github.com/vizionscop3/portfolio-v2/actions`
2. Check "Phase-Based Deployment" workflow
3. View deployment logs and status

### Azure Portal

1. Visit Azure Portal
2. Navigate to your Resource Group
3. Check each Static Web App for deployment history

### Preview URLs

Each phase gets its own URL pattern:

- Foundation: `https://portfolio-phase-foundation.azurestaticapps.net`
- Content: `https://portfolio-phase-content.azurestaticapps.net`
- Optimization: `https://portfolio-phase-optimization.azurestaticapps.net`
- Polish: `https://portfolio-phase-polish.azurestaticapps.net`
- Features: `https://portfolio-feature-preview.azurestaticapps.net`

## 🛠️ Troubleshooting

### Common Issues

1. **Deployment Token Missing**

   ```
   Error: azure_static_web_apps_api_token not found
   ```

   **Solution**: Add the required GitHub secret from Azure setup output

2. **Build Failures**

   ```
   Error: TypeScript compilation failed
   ```

   **Solution**: Fix TypeScript errors or push to feature branch for looser checks

3. **Branch Not Deploying**
   ```
   No deployment triggered
   ```
   **Solution**: Ensure branch name matches pattern `phase-*` or `feature/*`

### Debug Commands

```powershell
# Check current branch and status
git status
git branch --show-current

# View recent commits
git log --oneline -10

# Check GitHub Actions status
gh run list --limit 5

# Check Azure Static Web App status
az staticwebapp show --name portfolio-phase-optimization --resource-group portfolio-rg
```

## 🧹 Maintenance

### Cleanup Merged Branches

```powershell
# Clean up merged branches
.\scripts\manage-phases.ps1 -Action cleanup

# Force cleanup without confirmation
.\scripts\manage-phases.ps1 -Action cleanup -Force
```

### Update All Phases

```powershell
# Update all phase branches from main
$phases = git branch | Where-Object { $_ -like '*phase-*' }
foreach ($phase in $phases) {
    $phaseName = $phase.Trim('* ')
    git checkout $phaseName
    git merge main
    git push origin $phaseName
}
```

## 📈 Benefits of This Setup

### ✅ **Independent Development**

- Each phase has its own environment
- No conflicts between different features
- Isolated testing and validation

### ✅ **Progressive Deployment**

- Deploy phases incrementally
- Test each phase independently
- Reduce deployment risk

### ✅ **Collaboration Friendly**

- Multiple developers can work on different phases
- Clear phase boundaries and responsibilities
- Easy code review process

### ✅ **Quality Assurance**

- Automated testing for each phase
- Preview environments for stakeholder review
- Production-like testing environment

## 🎯 Best Practices

1. **Phase Naming**: Use descriptive phase names that match your task structure
2. **Commit Messages**: Use conventional commits with phase context
3. **Testing**: Test each phase thoroughly before merging to main
4. **Documentation**: Update phase README files with progress and notes
5. **Cleanup**: Regularly clean up merged branches to keep repository tidy

---

**🚀 Your portfolio is now ready for phase-based deployment!**

Each phase can be developed, tested, and deployed independently, giving you maximum flexibility in your development
workflow.
