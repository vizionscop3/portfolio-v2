# Alternative Azure Deployment Guide

This document provides alternative methods for deploying to Microsoft Azure when you encounter login issues with Azure
CLI.

## Method 1: GitHub Actions with Service Principal (Recommended)

### Prerequisites

1. Azure subscription
2. GitHub repository
3. Azure Static Web Apps resource

### Setup Steps

1. **Create Azure Static Web Apps Resource**
   - Go to Azure Portal (portal.azure.com)
   - Search for "Static Web Apps"
   - Click "Create"
   - Fill in basic information:
     - Subscription: Your subscription
     - Resource Group: Create new or use existing
     - Name: `portfolio-static-app`
     - Plan type: Free
     - Region: Your preferred region
   - Deployment details:
     - Source: GitHub
     - GitHub account: Connect your account
     - Organization: Your GitHub username
     - Repository: Your portfolio repository
     - Branch: main
     - Build presets: Custom
     - App location: `/`
     - Api location: (leave empty)
     - Output location: `dist`

2. **Automatic Deployment**
   - Azure will automatically create a workflow file in your repository
   - The workflow includes the deployment token as a GitHub secret
   - Every push to main branch will trigger deployment

### Manual Token Setup (if needed)

If you need to set up the deployment token manually:

1. Go to your Azure Static Web App resource
2. Click "Manage deployment token"
3. Copy the deployment token
4. In your GitHub repository:
   - Go to Settings → Secrets and variables → Actions
   - Create new secret: `AZURE_STATIC_WEB_APPS_API_TOKEN`
   - Paste the deployment token

## Method 2: VS Code Extension

### Prerequisites

- Visual Studio Code
- Azure Static Web Apps extension

### Setup Steps

1. **Install Extension**

   ```
   code --install-extension ms-azuretools.vscode-azurestaticwebapps
   ```

2. **Deploy from VS Code**
   - Open VS Code in your project directory
   - Open Command Palette (Ctrl+Shift+P)
   - Type "Azure Static Web Apps: Create Static Web App..."
   - Follow the prompts
   - Select your subscription
   - Enter app name
   - Select region
   - Choose build preset: "Custom"
   - App location: `/`
   - Output location: `dist`

## Method 3: Azure Portal Manual Upload

### Prerequisites

- Built application files
- Azure subscription

### Setup Steps

1. **Build Your Application**

   ```bash
   npm run build
   ```

2. **Create Static Web App in Portal**
   - Go to Azure Portal
   - Create Static Web Apps resource
   - Choose "Other" as source

3. **Manual Upload**
   - In Azure Portal, go to your Static Web App
   - Click "Browse" to open the site
   - Use Azure Storage Explorer or Portal to upload `dist` folder contents

## Method 4: GitHub Actions with Azure Login

If you want to use Azure CLI in GitHub Actions:

1. **Create Service Principal**

   ```bash
   az ad sp create-for-rbac --name "portfolio-deploy" --role contributor --scopes /subscriptions/{subscription-id} --sdk-auth
   ```

2. **Store Credentials**
   - Copy the JSON output
   - Add as GitHub secret: `AZURE_CREDENTIALS`

3. **Use in Workflow**

   ```yaml
   - uses: azure/login@v1
     with:
       creds: ${{ secrets.AZURE_CREDENTIALS }}

   - name: Deploy to Azure
     run: az staticwebapp deploy --name portfolio-static-app --resource-group your-rg --source dist
   ```

## Troubleshooting

### Common Issues

1. **Azure CLI Login Problems**
   - Use browser-based authentication: `az login --use-device-code`
   - Clear Azure CLI cache: `az account clear`
   - Use service principal authentication

2. **GitHub Actions Failures**
   - Check secrets are properly set
   - Verify deployment token is valid
   - Ensure build output directory is correct (`dist`)

3. **Build Failures**
   - Run `npm run build` locally first
   - Check for TypeScript errors
   - Verify all dependencies are in package.json

### Support Resources

- [Azure Static Web Apps Documentation](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [GitHub Actions for Azure](https://docs.microsoft.com/en-us/azure/developer/github/github-actions)
- [Azure CLI Authentication](https://docs.microsoft.com/en-us/cli/azure/authenticate-azure-cli)

## Security Best Practices

1. **Never commit deployment tokens to repository**
2. **Use GitHub secrets for sensitive information**
3. **Regularly rotate deployment tokens**
4. **Use least privilege access for service principals**
5. **Enable branch protection rules**

## Next Steps

After successful deployment:

1. Configure custom domain (optional)
2. Set up staging environments
3. Configure authentication (if needed)
4. Set up monitoring and analytics
5. Implement CI/CD optimizations
