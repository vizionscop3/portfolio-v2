# Azure Phase-Based Deployment Setup Script
# Creates multiple Azure Static Web Apps for independent phase deployment

param(
    [Parameter(Mandatory=$true)]
    [string]$ResourceGroupName,
    
    [Parameter(Mandatory=$true)]
    [string]$Location = "East US 2",
    
    [Parameter(Mandatory=$false)]
    [string]$GitHubRepo = "vizionscop3/portfolio-v2"
)

Write-Host "🚀 Setting up Azure Static Web Apps for Phase-Based Deployment" -ForegroundColor Cyan

# Login to Azure if not already logged in
if (-not (Get-AzContext)) {
    Write-Host "🔑 Logging into Azure..." -ForegroundColor Yellow
    Connect-AzAccount
}

# Create resource group if it doesn't exist
$rg = Get-AzResourceGroup -Name $ResourceGroupName -ErrorAction SilentlyContinue
if (-not $rg) {
    Write-Host "📦 Creating resource group: $ResourceGroupName" -ForegroundColor Green
    New-AzResourceGroup -Name $ResourceGroupName -Location $Location
}

# Define Static Web Apps for each phase group
$staticWebApps = @(
    @{
        Name = "portfolio-phase-foundation"
        Description = "Phases 1-3: Infrastructure, Scene Architecture, Interactive Objects"
        SecretName = "AZURE_STATIC_WEB_APPS_API_TOKEN_PHASE_FOUNDATION"
    },
    @{
        Name = "portfolio-phase-content"
        Description = "Phases 4-6: Cyberpunk Navigation, Transitions, Content"
        SecretName = "AZURE_STATIC_WEB_APPS_API_TOKEN_PHASE_CONTENT"
    },
    @{
        Name = "portfolio-phase-optimization"
        Description = "Phases 7-9: Performance, Accessibility, SEO"
        SecretName = "AZURE_STATIC_WEB_APPS_API_TOKEN_PHASE_OPTIMIZATION"
    },
    @{
        Name = "portfolio-phase-polish"
        Description = "Phases 10-11: Visual Enhancements, Final Integration"
        SecretName = "AZURE_STATIC_WEB_APPS_API_TOKEN_PHASE_POLISH"
    },
    @{
        Name = "portfolio-feature-preview"
        Description = "Feature branch previews and experimental features"
        SecretName = "AZURE_STATIC_WEB_APPS_API_TOKEN_FEATURE_PREVIEW"
    },
    @{
        Name = "portfolio-phase-preview"
        Description = "General phase preview environment"
        SecretName = "AZURE_STATIC_WEB_APPS_API_TOKEN_PHASE_PREVIEW"
    }
)

$deploymentTokens = @{}

foreach ($app in $staticWebApps) {
    Write-Host "🌐 Creating Static Web App: $($app.Name)" -ForegroundColor Green
    Write-Host "   Description: $($app.Description)" -ForegroundColor Gray
    
    try {
        # Create the Static Web App
        $staticWebApp = New-AzStaticWebApp `
            -ResourceGroupName $ResourceGroupName `
            -Name $app.Name `
            -Location $Location `
            -RepositoryUrl "https://github.com/$GitHubRepo" `
            -Branch "main" `
            -AppLocation "/" `
            -OutputLocation "dist" `
            -SkuName "Free"
        
        # Get the deployment token
        $deploymentToken = Get-AzStaticWebAppSecret -ResourceGroupName $ResourceGroupName -Name $app.Name
        $deploymentTokens[$app.SecretName] = $deploymentToken.Properties.ApiKey
        
        Write-Host "✅ Created: $($app.Name)" -ForegroundColor Green
        Write-Host "   URL: https://$($staticWebApp.DefaultHostname)" -ForegroundColor Blue
        Write-Host "   Deployment Token: $($app.SecretName)" -ForegroundColor Yellow
        
    } catch {
        Write-Host "❌ Failed to create $($app.Name): $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Output GitHub Secrets configuration
Write-Host "`n🔐 GitHub Repository Secrets Configuration" -ForegroundColor Cyan
Write-Host "Add these secrets to your GitHub repository at:" -ForegroundColor Yellow
Write-Host "https://github.com/$GitHubRepo/settings/secrets/actions" -ForegroundColor Blue
Write-Host ""

foreach ($token in $deploymentTokens.GetEnumerator()) {
    Write-Host "Secret Name: $($token.Key)" -ForegroundColor Green
    Write-Host "Secret Value: $($token.Value)" -ForegroundColor Gray
    Write-Host "---" -ForegroundColor DarkGray
}

# Create summary file
$summaryPath = "azure-phase-deployment-summary.json"
$summary = @{
    ResourceGroup = $ResourceGroupName
    Location = $Location
    GitHubRepo = $GitHubRepo
    CreatedAt = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    StaticWebApps = $staticWebApps | ForEach-Object {
        @{
            Name = $_.Name
            Description = $_.Description
            SecretName = $_.SecretName
            URL = if ($deploymentTokens.ContainsKey($_.SecretName)) { 
                "https://$($_.Name).azurestaticapps.net" 
            } else { 
                "Failed to create" 
            }
        }
    }
    DeploymentTokens = $deploymentTokens
}

$summary | ConvertTo-Json -Depth 3 | Out-File -FilePath $summaryPath -Encoding UTF8
Write-Host "`n📄 Summary saved to: $summaryPath" -ForegroundColor Cyan

Write-Host "`n🎉 Setup Complete!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Add the deployment tokens as GitHub repository secrets" -ForegroundColor White
Write-Host "2. Push to any phase-* or feature/* branch to trigger deployment" -ForegroundColor White
Write-Host "3. Each phase will deploy to its own isolated environment" -ForegroundColor White
Write-Host "4. Merge to main for production deployment to the main Static Web App" -ForegroundColor White
