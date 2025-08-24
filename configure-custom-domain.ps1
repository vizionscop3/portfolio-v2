# Azure Custom Domain Configuration Script
# This script adds the custom domain to your Azure Static Web App

# Variables - Update these with your actual values
$resourceGroupName = "rg-portfolio-3d-interactive"  # Your resource group name
$staticWebAppName = "portfolio-v2-phase-4-features"   # Your static web app name
$customDomain = "vizionscope.com"

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
Write-Host "az staticwebapp hostname set --name `"portfolio-v2-phase-4-features`" --resource-group `"rg-portfolio-3d-interactive`" --hostname `"vizionscope.com`" --validation-method `"dns-txt-token`"" -ForegroundColor White

Write-Host "`n✅ Domain Added Successfully!" -ForegroundColor Green
Write-Host "vizionscope.com has been added to your Azure Static Web App" -ForegroundColor White

Write-Host "`n📖 DNS Configuration Required:" -ForegroundColor Cyan
Write-Host "1. Add TXT record to your DNS provider:"
Write-Host "   Type: TXT"
Write-Host "   Host: @"
Write-Host "   Value: _5f6gcjw1g5k8s2ex9o9029xy8tytmsr" -ForegroundColor Yellow
Write-Host "2. Wait for DNS propagation (up to 12 hours)"
Write-Host "3. Azure will automatically validate and provision SSL certificate"

Write-Host "`n🔍 Verification Commands:" -ForegroundColor Magenta
Write-Host "Check TXT record: nslookup -type=TXT vizionscope.com"
Write-Host "Check domain status: az staticwebapp hostname list --name `"portfolio-v2-phase-4-features`" --resource-group `"rg-portfolio-3d-interactive`""

Write-Host "`n🌐 DNS Configuration:" -ForegroundColor Magenta
Write-Host "After TXT validation completes, add traffic routing:"
Write-Host "Option A - ALIAS record (recommended): vizionscope.com -> nice-bush-09f3be20f.2.azurestaticapps.net"
Write-Host "Option B - A record: Get IP from Azure portal after validation"
