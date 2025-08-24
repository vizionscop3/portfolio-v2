# 🔑 AZURE STATIC WEB APPS API TOKEN - HOW TO FIND

## What You Need: Azure Static Web Apps API Token

The URI/parameter you're looking for is the **Azure Static Web Apps API Token** that needs to be configured in GitHub
Secrets.

### 🎯 Step-by-Step Instructions

#### 1. **Access Azure Portal**

```
URL: https://portal.azure.com
Navigate to: Static Web Apps > portfolio-v2-phase-4-features
```

#### 2. **Find the API Token**

1. **Login to Azure Portal**: https://portal.azure.com
2. **Search for**: "Static Web Apps" in the search bar
3. **Select**: `portfolio-v2-phase-4-features`
4. **Click**: "Manage deployment token" (or "Overview" > "Manage deployment token")
5. **Copy**: The entire token value

#### 3. **Add Token to GitHub Secrets**

1. **Go to GitHub**: https://github.com/vizionscop3/portfolio-v2
2. **Click**: Settings > Secrets and variables > Actions
3. **Click**: "New repository secret"
4. **Name**: `AZURE_STATIC_WEB_APPS_API_TOKEN_PORTFOLIO_V2_PHASE_4_FEATURES`
5. **Value**: Paste the token from Azure Portal
6. **Click**: "Add secret"

### 🚨 Alternative Method (Using Azure CLI)

If you can't find it in the portal, use this command:

```powershell
az staticwebapp secrets list --name "portfolio-v2-phase-4-features" --resource-group "rg-portfolio-3d-interactive"
```

### 📋 Current Configuration

Your workflow file expects this secret:

```yaml
azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_PORTFOLIO_V2_PHASE_4_FEATURES }}
```

### ✅ Files Cleaned Up

I've removed these empty/problematic files:

- ❌ `azure-deploy.ps1` (empty)
- ❌ `AZURE_DEPLOYMENT.md` (empty)
- ❌ `AZURE_DEPLOYMENT_ALTERNATIVES.md` (empty)
- ❌ `BLANK_SCREEN_FIX.md` (empty)
- ❌ `CUSTOM_DOMAIN_SETUP.md` (empty)
- ❌ `SUBDOMAIN_SETUP.md` (empty)
- ❌ `.eslintrc-new.cjs` (empty - could conflict)
- ❌ `.github/workflows/azure-static-web-apps.yml` (empty - could conflict)
- ❌ `scripts/quick-ssl-test.ps1` (empty)
- ❌ `scripts/verify-ssl-certificates.ps1` (empty)
- ❌ `src/utils/errorHandling.ts` (empty - could cause import errors)

### 🔍 Verification Steps

1. **Check GitHub Actions**: https://github.com/vizionscop3/portfolio-v2/actions
2. **Look for**: The latest workflow run for `phase-4-advanced-features`
3. **Status**: Should show green checkmark when token is configured

### 🎯 Expected Outcome

Once the API token is configured:

1. ✅ GitHub Actions will run successfully
2. ✅ Azure will deploy your optimized build
3. ✅ https://vizionscope.com will show your portfolio (not the welcome page)

### 🆘 If You Can't Find the Token

Run this command to get detailed information:

```powershell
az staticwebapp show --name "portfolio-v2-phase-4-features" --resource-group "rg-portfolio-3d-interactive" --query "properties.repositoryToken"
```

---

**The most important URI you need is the Azure Static Web Apps API Token from the Azure Portal!** 🔑
