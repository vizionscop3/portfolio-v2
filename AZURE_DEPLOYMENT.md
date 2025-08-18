# Azure Deployment Configuration

This document outlines the deployment strategy for Portfolio v2 to Microsoft Azure.

## 🏗️ Recommended Azure Architecture

### Azure Static Web Apps (Recommended)

**Why Azure Static Web Apps?**

- Perfect for React/TypeScript SPAs
- Built-in CI/CD with GitHub integration
- Global CDN distribution
- Custom domains and SSL certificates
- Serverless API support (if needed later)
- Cost-effective for portfolio sites

### Architecture Overview

```
GitHub Repository
       ↓
GitHub Actions (CI/CD)
       ↓
Azure Static Web Apps
       ↓
Global CDN Distribution
```

## 📋 Deployment Prerequisites

### 1. Azure Account Setup

- Azure subscription (free tier available)
- Resource group for the portfolio project
- Azure CLI installed locally

### 2. GitHub Repository

- ✅ Repository with all source code
- ✅ GitHub Actions workflows configured
- Branch protection rules (recommended)

### 3. Build Configuration

- ✅ Vite build configured (`npm run build`)
- ✅ TypeScript compilation working
- Output directory: `dist/`

## 🚀 Deployment Steps

### Step 1: Create Azure Static Web App

```powershell
# Login to Azure
az login

# Create resource group
az group create --name "rg-portfolio-v2" --location "East US"

# Create Static Web App
az staticwebapp create \
  --name "portfolio-v2" \
  --resource-group "rg-portfolio-v2" \
  --source "https://github.com/yourusername/portfolio-v2" \
  --location "East US2" \
  --branch "main" \
  --app-location "/" \
  --api-location "" \
  --output-location "dist"
```

### Step 2: Configure GitHub Actions

Azure will automatically create a GitHub Actions workflow file:
`.github/workflows/azure-static-web-apps-<random-name>.yml`

### Step 3: Environment Variables

Configure in Azure portal under Static Web App → Configuration:

```
VITE_API_URL=https://api.yourportfolio.com
VITE_ANALYTICS_ID=your-analytics-id
VITE_ENVIRONMENT=production
```

### Step 4: Custom Domain (Optional)

```powershell
# Add custom domain
az staticwebapp hostname set \
  --name "portfolio-v2" \
  --resource-group "rg-portfolio-v2" \
  --hostname "www.yourportfolio.com"
```

## 🔧 Configuration Files

### Azure Static Web Apps Configuration

Create `staticwebapp.config.json`:

```json
{
  "routes": [
    {
      "route": "/*",
      "serve": "/index.html",
      "statusCode": 200
    }
  ],
  "mimeTypes": {
    ".json": "application/json"
  },
  "defaultHeaders": {
    "content-security-policy": "default-src https: 'unsafe-eval' 'unsafe-inline'; object-src 'none'",
    "cache-control": "must-revalidate, max-age=6000"
  }
}
```

### Build Optimization

Update `vite.config.ts` for production:

```typescript
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['./src/utils/logger', './src/utils/cache'],
        },
      },
    },
  },
});
```

## 🌐 Alternative Azure Options

### 1. Azure App Service

- Better for dynamic content
- More expensive than Static Web Apps
- Supports server-side rendering

### 2. Azure CDN + Storage Account

- Most cost-effective
- Requires manual CI/CD setup
- No built-in GitHub integration

### 3. Azure Container Apps

- Overkill for static sites
- Better for complex applications
- Docker containerization required

## 📊 Monitoring & Analytics

### Application Insights Integration

```typescript
// Add to src/main.tsx
import { ApplicationInsights } from '@microsoft/applicationinsights-web';

const appInsights = new ApplicationInsights({
  config: {
    instrumentationKey: 'your-instrumentation-key',
  },
});

appInsights.loadAppInsights();
appInsights.trackPageView();
```

### Performance Monitoring

- Azure Monitor for uptime monitoring
- Application Insights for user analytics
- Lighthouse CI in GitHub Actions (already configured)

## 💰 Cost Estimation

### Azure Static Web Apps

- **Free Tier**: 100GB bandwidth, 0.5GB storage
- **Standard Tier**: $9/month + usage
- **Estimated Monthly Cost**: $0-15 (depending on traffic)

### Additional Costs

- Custom domain: Free with Azure
- SSL Certificate: Free (Let's Encrypt)
- Application Insights: Free tier available

## 🔒 Security Best Practices

### 1. Environment Variables

- Never commit secrets to repository
- Use Azure Key Vault for sensitive data
- Configure CORS policies

### 2. Content Security Policy

- Configured in staticwebapp.config.json
- Prevents XSS attacks
- Restricts resource loading

### 3. HTTPS Enforcement

- Automatic with Azure Static Web Apps
- Redirect HTTP to HTTPS
- HSTS headers enabled

## 📈 Scaling Considerations

### Traffic Growth

- Static Web Apps auto-scales globally
- CDN edge locations worldwide
- No server management required

### Feature Expansion

- Easy to add Azure Functions for APIs
- Integration with Azure services
- Microservices architecture support

## 🚀 Deployment Checklist

- [ ] Azure account created and configured
- [ ] Resource group created
- [ ] Static Web App resource created
- [ ] GitHub repository connected
- [ ] Environment variables configured
- [ ] Custom domain configured (if needed)
- [ ] SSL certificate verified
- [ ] Performance testing completed
- [ ] Monitoring configured
- [ ] Backup and disaster recovery planned

## 📚 Next Steps

1. **Create Azure resources** using the provided commands
2. **Configure environment variables** in Azure portal
3. **Test deployment** with a staging branch
4. **Set up monitoring** with Application Insights
5. **Configure custom domain** if desired
6. **Implement CI/CD optimizations**

---

**Ready for Azure deployment!** 🚀

This configuration provides a professional, scalable, and cost-effective deployment solution for your portfolio website.
