# Azure Deployment Script for 3D Interactive Portfolio
# Subscription: c6065296-91e7-45f3-a774-908e2225b4d0

param(
    [Parameter(Mandatory=$false)]
    [string]$ResourceGroupName = "rg-portfolio-3d-interactive",
    
    [Parameter(Mandatory=$false)]
    [string]$Location = "East US 2",
    
    [Parameter(Mandatory=$false)]
    [string]$SiteName = "portfolio-3d-interactive",
    
    [Parameter(Mandatory=$false)]
    [string]$Environment = "production",
    
    [Parameter(Mandatory=$false)]
    [string]$Phase = "11",
    
    [Parameter(Mandatory=$false)]
    [string]$SubscriptionId = "c6065296-91e7-45f3-a774-908e2225b4d0"
)

# Function to write colored output
function Write-ColorOutput($Color, $Message) {
    Write-Host $Message -ForegroundColor $Color
}

# Function to check if Azure CLI is installed
function Test-AzureCLI {
    try {
        $azVersion = az version --output json | ConvertFrom-Json
        Write-ColorOutput Green "✅ Azure CLI version $($azVersion.'azure-cli') detected"
        return $true
    }
    catch {
        Write-ColorOutput Red "❌ Azure CLI not found. Please install Azure CLI first."
        Write-ColorOutput Yellow "   Download from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
        return $false
    }
}

# Function to login to Azure
function Connect-Azure {
    Write-ColorOutput Cyan "🔐 Checking Azure authentication..."
    
    $currentAccount = az account show --output json 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput Yellow "⚠️  Not logged in to Azure. Initiating login..."
        az login
        if ($LASTEXITCODE -ne 0) {
            Write-ColorOutput Red "❌ Azure login failed"
            exit 1
        }
    }
    
    # Set the subscription
    az account set --subscription $SubscriptionId
    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput Red "❌ Failed to set subscription: $SubscriptionId"
        exit 1
    }
    
    $account = az account show --output json | ConvertFrom-Json
    Write-ColorOutput Green "✅ Authenticated as: $($account.user.name)"
    Write-ColorOutput Green "✅ Using subscription: $($account.name)"
}

# Function to create or update resource group
function New-ResourceGroupIfNotExists {
    Write-ColorOutput Cyan "📦 Checking resource group: $ResourceGroupName"
    
    $rg = az group show --name $ResourceGroupName --output json 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput Yellow "⚠️  Resource group not found. Creating..."
        az group create --name $ResourceGroupName --location $Location --tags "Project=3D-Interactive-Portfolio" "Environment=$Environment" "Phase=$Phase"
        
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput Green "✅ Resource group created: $ResourceGroupName"
        } else {
            Write-ColorOutput Red "❌ Failed to create resource group"
            exit 1
        }
    } else {
        Write-ColorOutput Green "✅ Resource group exists: $ResourceGroupName"
    }
}

# Function to deploy Azure resources
function Deploy-AzureResources {
    Write-ColorOutput Cyan "🚀 Deploying Azure Static Web App..."
    
    $templateFile = Join-Path $PSScriptRoot "azure-resources.json"
    
    if (-not (Test-Path $templateFile)) {
        Write-ColorOutput Red "❌ Template file not found: $templateFile"
        exit 1
    }
    
    # Deploy the ARM template
    $deployment = az deployment group create `
        --resource-group $ResourceGroupName `
        --template-file $templateFile `
        --parameters siteName=$SiteName location=$Location `
        --output json
    
    if ($LASTEXITCODE -eq 0) {
        $deploymentResult = $deployment | ConvertFrom-Json
        Write-ColorOutput Green "✅ Azure resources deployed successfully"
        
        # Extract outputs
        $staticWebAppUrl = $deploymentResult.properties.outputs.staticWebAppUrl.value
        $deploymentToken = $deploymentResult.properties.outputs.deploymentToken.value
        
        Write-ColorOutput Cyan "📊 Deployment Details:"
        Write-ColorOutput White "   🌐 URL: $staticWebAppUrl"
        Write-ColorOutput White "   🔑 Deployment Token: [REDACTED - Check Azure Portal]"
        
        # Save deployment info
        $deploymentInfo = @{
            ResourceGroupName = $ResourceGroupName
            SiteName = $SiteName
            StaticWebAppUrl = $staticWebAppUrl
            DeploymentToken = $deploymentToken
            Environment = $Environment
            Phase = $Phase
            DeploymentTime = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
        }
        
        $deploymentInfoPath = Join-Path $PSScriptRoot ".." ".deployment" "azure-deployment-info.json"
        New-Item -ItemType Directory -Path (Split-Path $deploymentInfoPath) -Force | Out-Null
        $deploymentInfo | ConvertTo-Json -Depth 10 | Set-Content -Path $deploymentInfoPath
        
        Write-ColorOutput Green "✅ Deployment info saved to: $deploymentInfoPath"
        return $deploymentInfo
    } else {
        Write-ColorOutput Red "❌ Failed to deploy Azure resources"
        exit 1
    }
}

# Function to configure GitHub Actions
function Set-GitHubSecrets {
    param($DeploymentInfo)
    
    Write-ColorOutput Cyan "🔧 Configuring GitHub Actions secrets..."
    
    # Check if GitHub CLI is available
    try {
        $ghVersion = gh --version
        Write-ColorOutput Green "✅ GitHub CLI detected"
    }
    catch {
        Write-ColorOutput Yellow "⚠️  GitHub CLI not found. Please configure secrets manually:"
        Write-ColorOutput White "   AZURE_STATIC_WEB_APPS_API_TOKEN: $($DeploymentInfo.DeploymentToken)"
        return
    }
    
    # Set GitHub secrets (if authenticated)
    try {
        gh secret set AZURE_STATIC_WEB_APPS_API_TOKEN --body $DeploymentInfo.DeploymentToken
        Write-ColorOutput Green "✅ GitHub secret AZURE_STATIC_WEB_APPS_API_TOKEN configured"
    }
    catch {
        Write-ColorOutput Yellow "⚠️  Could not set GitHub secrets automatically"
        Write-ColorOutput White "   Please set manually in GitHub repository settings:"
        Write-ColorOutput White "   AZURE_STATIC_WEB_APPS_API_TOKEN: [Get from Azure Portal]"
    }
}

# Function to create staging environments
function New-StagingEnvironments {
    param($SiteName, $MaxEnvironments = 3)
    
    Write-ColorOutput Cyan "🏗️  Setting up staging environments for phased deployment..."
    
    for ($i = 1; $i -le $MaxEnvironments; $i++) {
        $stagingName = "phase-$i-staging"
        Write-ColorOutput White "   Creating staging environment: $stagingName"
        
        # Note: Staging environments in Azure Static Web Apps are created automatically
        # when branches are pushed. We're documenting the expected environments here.
        Write-ColorOutput Green "   ✅ Environment planned: $stagingName"
    }
    
    Write-ColorOutput Green "✅ Staging environment plan completed"
}

# Function to validate deployment
function Test-Deployment {
    param($Url)
    
    Write-ColorOutput Cyan "🏥 Validating deployment..."
    
    try {
        $response = Invoke-WebRequest -Uri $Url -Method Head -UseBasicParsing -TimeoutSec 30
        if ($response.StatusCode -eq 200) {
            Write-ColorOutput Green "✅ Deployment is responding (Status: $($response.StatusCode))"
            return $true
        }
    }
    catch {
        Write-ColorOutput Yellow "⚠️  Deployment not yet accessible (this is normal for new deployments)"
        Write-ColorOutput White "   URL will be available once first deployment completes"
        return $false
    }
}

# Function to display final instructions
function Show-NextSteps {
    param($DeploymentInfo)
    
    Write-ColorOutput Cyan "📋 Next Steps for Phased Deployment:"
    Write-ColorOutput White ""
    Write-ColorOutput Green "1. GitHub Actions Configuration:"
    Write-ColorOutput White "   - Repository secrets have been configured"
    Write-ColorOutput White "   - Workflow will trigger on manual dispatch"
    Write-ColorOutput White ""
    Write-ColorOutput Green "2. Start Phase 1 Deployment:"
    Write-ColorOutput White "   - Go to GitHub repository Actions tab"
    Write-ColorOutput White "   - Run 'Azure Deployment - Phased Rollout' workflow"
    Write-ColorOutput White "   - Select Phase 1 and staging environment"
    Write-ColorOutput White ""
    Write-ColorOutput Green "3. Monitor Deployment:"
    Write-ColorOutput White "   - Watch GitHub Actions logs for progress"
    Write-ColorOutput White "   - Check Azure Portal for Static Web App status"
    Write-ColorOutput White "   - URL: $($DeploymentInfo.StaticWebAppUrl)"
    Write-ColorOutput White ""
    Write-ColorOutput Green "4. Progressive Deployment:"
    Write-ColorOutput White "   - Deploy phases 1-11 incrementally"
    Write-ColorOutput White "   - Test each phase before proceeding"
    Write-ColorOutput White "   - Use staging environment for validation"
    Write-ColorOutput White ""
    Write-ColorOutput Cyan "🌐 Azure Static Web App URL: $($DeploymentInfo.StaticWebAppUrl)"
    Write-ColorOutput Cyan "📊 Azure Portal: https://portal.azure.com/#@/resource$($DeploymentInfo.ResourceId)"
}

# Main deployment flow
function Start-AzureDeployment {
    Write-ColorOutput Cyan "🚀 Starting Azure deployment setup for 3D Interactive Portfolio"
    Write-ColorOutput White "   Subscription: $SubscriptionId"
    Write-ColorOutput White "   Resource Group: $ResourceGroupName"
    Write-ColorOutput White "   Location: $Location"
    Write-ColorOutput White "   Environment: $Environment"
    Write-ColorOutput White "   Phase: $Phase"
    Write-ColorOutput White ""
    
    # Prerequisites check
    if (-not (Test-AzureCLI)) { exit 1 }
    
    # Azure authentication
    Connect-Azure
    
    # Create resource group
    New-ResourceGroupIfNotExists
    
    # Deploy Azure resources
    $deploymentInfo = Deploy-AzureResources
    
    # Configure GitHub Actions
    Set-GitHubSecrets -DeploymentInfo $deploymentInfo
    
    # Set up staging environments
    New-StagingEnvironments -SiteName $SiteName
    
    # Validate deployment
    Test-Deployment -Url $deploymentInfo.StaticWebAppUrl
    
    # Show next steps
    Show-NextSteps -DeploymentInfo $deploymentInfo
    
    Write-ColorOutput Green "🎉 Azure deployment setup completed successfully!"
}

# Execute main deployment
try {
    Start-AzureDeployment
}
catch {
    Write-ColorOutput Red "💥 Deployment setup failed: $($_.Exception.Message)"
    exit 1
}