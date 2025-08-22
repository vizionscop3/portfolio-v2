# 🚀 Phase-Based Deployment System

Your portfolio now supports **independent phase deployment** where each feature/phase can be deployed to its own
environment for isolated testing and development.

## ⚡ Quick Start

### Deploy a New Phase

```powershell
# Deploy Phase 8 (Accessibility and Mobile Support)
.\quick-deploy-phase.ps1 -Phase 8

# Make your changes...
git add .
git commit -m "feat(phase-8): implement mobile touch controls"
git push origin phase-8-accessibility-mobile
```

**✨ That's it!** Your phase automatically deploys to its own environment.

## 🌍 Environment Structure

| Phase Group      | Phases     | Environment          | Example URL                                        |
| ---------------- | ---------- | -------------------- | -------------------------------------------------- |
| **Foundation**   | 1-3        | `phase-foundation`   | `portfolio-phase-foundation.azurestaticapps.net`   |
| **Content**      | 4-6        | `phase-content`      | `portfolio-phase-content.azurestaticapps.net`      |
| **Optimization** | 7-9        | `phase-optimization` | `portfolio-phase-optimization.azurestaticapps.net` |
| **Polish**       | 10-11      | `phase-polish`       | `portfolio-phase-polish.azurestaticapps.net`       |
| **Features**     | feature/\* | `feature-preview`    | `portfolio-feature-preview.azurestaticapps.net`    |
| **Production**   | main       | `production`         | `happy-flower-01a9d340f.azurestaticapps.net`       |

## 📋 Current Phase Status

Based on your task file, here are the available phases:

- ✅ **Phase 1-7**: Completed (Infrastructure → Performance)
- 🚧 **Phase 8**: Accessibility and Mobile Support (In Progress)
- 📋 **Phase 9**: SEO and Analytics Integration (Planned)
- 📋 **Phase 10**: Visual Enhancements and Polish (Planned)
- 📋 **Phase 11**: Final Integration and Testing (Planned)

## 🔧 Setup Required

### 1. Azure Resources

Run the setup script to create Azure Static Web Apps:

```powershell
.\scripts\setup-phase-deployment.ps1 -ResourceGroupName "portfolio-rg"
```

### 2. GitHub Secrets

Add the deployment tokens from the setup script to your GitHub repository secrets.

## 🌿 Workflow Examples

### Working on Phase 8

```powershell
# Start Phase 8
.\quick-deploy-phase.ps1 -Phase 8

# Switch to the branch
git checkout phase-8-accessibility-mobile

# Make changes for accessibility features
# ... edit files ...

# Commit and deploy
git add .
git commit -m "feat(phase-8): implement screen reader support

✨ Added ARIA labels and live regions
♿ Enhanced keyboard navigation
📱 Improved mobile accessibility

Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin phase-8-accessibility-mobile
```

### Creating a Feature Branch

```powershell
# Create feature branch
git checkout -b feature/new-3d-animation

# Develop feature
# ... make changes ...

# Deploy to feature environment
git add .
git commit -m "feat: add new 3D hover animation"
git push origin feature/new-3d-animation
```

### Merging to Production

```powershell
# When phase is complete, create PR to main
gh pr create --title "Phase 8: Accessibility and Mobile Support" --body "Ready for production deployment"

# Or merge directly (if you have permissions)
git checkout main
git merge phase-8-accessibility-mobile
git push origin main
```

## 🔍 Monitoring

### GitHub Actions

Check deployment status: `https://github.com/vizionscop3/portfolio-v2/actions`

### Environment Indicator

Each deployed environment shows a visual indicator in the top-right corner:

- 🚧 **Yellow**: Phase environment
- 🧪 **Purple**: Feature environment
- 🚀 **Green**: Production environment
- 🔧 **Blue**: Development environment

## 🎯 Benefits

### ✅ **Independent Development**

- Each phase has its own URL for testing
- No conflicts between different features
- Isolated debugging and validation

### ✅ **Faster Iteration**

- Deploy phases as you complete them
- Get feedback early and often
- Reduce risk of large deployments

### ✅ **Collaboration Ready**

- Multiple team members can work on different phases
- Clear separation of concerns
- Easy code review process

## 🛠️ Troubleshooting

### Common Issues

1. **Branch doesn't deploy**
   - Ensure branch name starts with `phase-` or `feature/`
   - Check GitHub Actions for build errors

2. **Missing deployment environment**
   - Run the Azure setup script
   - Add GitHub secrets for deployment tokens

3. **Build failures**
   - Phase deployments allow more warnings than production
   - Check TypeScript and linting errors

### Get Help

```powershell
# Check current status
git status
git branch --show-current

# View deployment history
gh run list --limit 5

# Check what phases exist
.\scripts\manage-phases.ps1 -Action status
```

---

**🎉 Your portfolio is now ready for phase-based deployment!**

Each phase can be developed, tested, and deployed independently, giving you maximum flexibility and safety in your
development workflow.
