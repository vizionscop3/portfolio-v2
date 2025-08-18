# Azure Deployment Script for Portfolio v2
# This script helps deploy the portfolio to Azure Static Web Apps

param(
    [string]$Command = "help",
    [string]$ResourceGroup = "rg-portfolio-v2",
    [string]$AppName = "portfolio-v2",
    [string]$Location = "East US 2",
    [string]$GitHubRepo = "",
    [string]$Branch = "main"
)

function Show-Help {
    Write-Host "Portfolio v2 - Azure Deployment Script" -ForegroundColor Green
    Write-Host "======================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Available commands:" -ForegroundColor Yellow
    Write-Host "  help          - Show this help message"
    Write-Host "  login         - Login to Azure"
    Write-Host "  create-rg     - Create resource group"
    Write-Host "  create-swa    - Create Static Web App"
    Write-Host "  deploy        - Full deployment (create all resources)"
    Write-Host "  status        - Check deployment status"
    Write-Host "  delete        - Delete all resources (be careful!)"
    Write-Host ""
    Write-Host "Parameters:" -ForegroundColor Cyan
    Write-Host "  -ResourceGroup  : Azure resource group name (default: rg-portfolio-v2)"
    Write-Host "  -AppName        : Static Web App name (default: portfolio-v2)"
    Write-Host "  -Location       : Azure region (default: East US 2)"
    Write-Host "  -GitHubRepo     : GitHub repository URL"
    Write-Host "  -Branch         : Git branch to deploy (default: main)"
    Write-Host ""
    Write-Host "Example:" -ForegroundColor Green
    Write-Host "  .\azure-deploy.ps1 -Command deploy -GitHubRepo 'https://github.com/username/portfolio-v2'"
}

function Test-AzureCLI {
    try {
        $azVersion = az version --output tsv 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[SUCCESS] Azure CLI is installed" -ForegroundColor Green
            return $true
        }
    }
    catch {
        Write-Host "[ERROR] Azure CLI is not installed or not in PATH" -ForegroundColor Red
        Write-Host "Please install Azure CLI: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli" -ForegroundColor Yellow
        return $false
    }
}

function Login-Azure {
    Write-Host "[LOGIN] Logging into Azure..." -ForegroundColor Yellow
    
    if (-not (Test-AzureCLI)) {
        return $false
    }
    
    az login
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[SUCCESS] Logged into Azure successfully" -ForegroundColor Green
        
        # Show current subscription
        $subscription = az account show --query "name" --output tsv
        Write-Host "[INFO] Current subscription: $subscription" -ForegroundColor Cyan
        return $true
    } else {
        Write-Host "[ERROR] Failed to login to Azure" -ForegroundColor Red
        return $false
    }
}

function Create-ResourceGroup {
    Write-Host "[CREATE] Creating resource group: $ResourceGroup" -ForegroundColor Yellow
    
    az group create --name $ResourceGroup --location $Location
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[SUCCESS] Resource group created: $ResourceGroup" -ForegroundColor Green
        return $true
    } else {
        Write-Host "[ERROR] Failed to create resource group" -ForegroundColor Red
        return $false
    }
}

function Create-StaticWebApp {
    if ([string]::IsNullOrEmpty($GitHubRepo)) {
        Write-Host "[ERROR] GitHub repository URL is required" -ForegroundColor Red
        Write-Host "Use: -GitHubRepo 'https://github.com/username/portfolio-v2'" -ForegroundColor Yellow
        return $false
    }
    
    Write-Host "[CREATE] Creating Static Web App: $AppName" -ForegroundColor Yellow
    Write-Host "[INFO] Repository: $GitHubRepo" -ForegroundColor Cyan
    Write-Host "[INFO] Branch: $Branch" -ForegroundColor Cyan
    
    az staticwebapp create `
        --name $AppName `
        --resource-group $ResourceGroup `
        --source $GitHubRepo `
        --location $Location `
        --branch $Branch `
        --app-location "/" `
        --api-location "" `
        --output-location "dist"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[SUCCESS] Static Web App created: $AppName" -ForegroundColor Green
        
        # Get the URL
        $appUrl = az staticwebapp show --name $AppName --resource-group $ResourceGroup --query "defaultHostname" --output tsv
        Write-Host "[INFO] App URL: https://$appUrl" -ForegroundColor Cyan
        Write-Host "[INFO] GitHub Actions workflow has been created automatically" -ForegroundColor Cyan
        
        return $true
    } else {
        Write-Host "[ERROR] Failed to create Static Web App" -ForegroundColor Red
        return $false
    }
}

function Deploy-Full {
    Write-Host "[DEPLOY] Starting full Azure deployment..." -ForegroundColor Green
    
    if (-not (Login-Azure)) {
        return $false
    }
    
    if (-not (Create-ResourceGroup)) {
        return $false
    }
    
    if (-not (Create-StaticWebApp)) {
        return $false
    }
    
    Write-Host ""
    Write-Host "[SUCCESS] Deployment completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Check your GitHub repository for the new workflow file"
    Write-Host "2. Push changes to trigger the first deployment"
    Write-Host "3. Configure environment variables in Azure portal"
    Write-Host "4. Set up custom domain (optional)"
}

function Get-Status {
    Write-Host "[STATUS] Checking deployment status..." -ForegroundColor Yellow
    
    # Check if resource group exists
    $rgExists = az group exists --name $ResourceGroup
    if ($rgExists -eq "true") {
        Write-Host "[SUCCESS] Resource group exists: $ResourceGroup" -ForegroundColor Green
    } else {
        Write-Host "[WARNING] Resource group not found: $ResourceGroup" -ForegroundColor Yellow
        return
    }
    
    # Check Static Web App
    $swaExists = az staticwebapp show --name $AppName --resource-group $ResourceGroup --output tsv 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[SUCCESS] Static Web App exists: $AppName" -ForegroundColor Green
        
        $appUrl = az staticwebapp show --name $AppName --resource-group $ResourceGroup --query "defaultHostname" --output tsv
        $repositoryUrl = az staticwebapp show --name $AppName --resource-group $ResourceGroup --query "repositoryUrl" --output tsv
        
        Write-Host "[INFO] App URL: https://$appUrl" -ForegroundColor Cyan
        Write-Host "[INFO] Connected repo: $repositoryUrl" -ForegroundColor Cyan
    } else {
        Write-Host "[WARNING] Static Web App not found: $AppName" -ForegroundColor Yellow
    }
}

function Remove-Resources {
    Write-Host "[WARNING] This will delete ALL resources in the resource group!" -ForegroundColor Red
    $confirmation = Read-Host "Are you sure you want to continue? (yes/no)"
    
    if ($confirmation -eq "yes") {
        Write-Host "[DELETE] Deleting resource group: $ResourceGroup" -ForegroundColor Red
        
        az group delete --name $ResourceGroup --yes --no-wait
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[SUCCESS] Resource group deletion initiated" -ForegroundColor Green
            Write-Host "[INFO] Deletion is running in the background" -ForegroundColor Cyan
        } else {
            Write-Host "[ERROR] Failed to delete resource group" -ForegroundColor Red
        }
    } else {
        Write-Host "[INFO] Deletion cancelled" -ForegroundColor Cyan
    }
}

# Main execution
switch ($Command.ToLower()) {
    "help" { Show-Help }
    "login" { Login-Azure }
    "create-rg" { 
        if (Login-Azure) { 
            Create-ResourceGroup 
        }
    }
    "create-swa" { 
        if (Login-Azure) { 
            Create-StaticWebApp 
        }
    }
    "deploy" { Deploy-Full }
    "status" { 
        if (Login-Azure) { 
            Get-Status 
        }
    }
    "delete" { 
        if (Login-Azure) { 
            Remove-Resources 
        }
    }
    default {
        Write-Error "Unknown command: $Command"
        Show-Help
    }
}
