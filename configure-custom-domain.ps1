# Azure Custom Domain Configuration Script
# This script adds the custom domain to your Azure Static Web App

# Variables - Update these with your actual values
$resourceGroupName = "portfolio-rg"  # Replace with your resource group name
$staticWebAppName = "portfolio-swa"   # Replace with your static web app name
$customDomain = "lifeofvizion.com"

Write-Host "🔗 Adding custom domain to Azure Static Web App..." -ForegroundColor Cyan

# Check if logged in to Azure
$account = az account show 2>$null
if (-not $account) {
    Write-Host "❌ Not logged in to Azure. Please run 'az login' first." -ForegroundColor Red
    exit 1
}

# List available Static Web Apps to help identify the correct names
Write-Host "📋 Available Static Web Apps:" -ForegroundColor Yellow
az staticwebapp list --query "[].{Name:name, ResourceGroup:resourceGroup, DefaultHostname:defaultHostname}" --output table

Write-Host "`n🔧 To add your custom domain, run:" -ForegroundColor Green
Write-Host "az staticwebapp hostname set --name `"YOUR_APP_NAME`" --resource-group `"YOUR_RESOURCE_GROUP`" --hostname `"$customDomain`"" -ForegroundColor White

Write-Host "`n📖 Custom Domain Setup Instructions:" -ForegroundColor Cyan
Write-Host "1. Find your Static Web App name and resource group from the list above"
Write-Host "2. Update the variables in this script with the correct values"
Write-Host "3. Run: az staticwebapp hostname set --name YOUR_APP_NAME --resource-group YOUR_RESOURCE_GROUP --hostname $customDomain"
Write-Host "4. Verify DNS settings are pointing to your Azure Static Web App"

Write-Host "`n🌐 DNS Configuration:" -ForegroundColor Magenta
Write-Host "Make sure your DNS CNAME record points to:"
Write-Host "lifeofvizion.com -> YOUR_AZURE_STATIC_WEB_APP_URL"
