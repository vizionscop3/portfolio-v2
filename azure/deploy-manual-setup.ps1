# Manual Azure Setup Guide for 3D Interactive Portfolio
# When subscription is not directly accessible via CLI

param(
    [Parameter(Mandatory=$false)]
    [string]$ResourceGroupName = "rg-portfolio-3d-interactive",
    
    [Parameter(Mandatory=$false)]
    [string]$Location = "East US 2",
    
    [Parameter(Mandatory=$false)]
    [string]$SiteName = "portfolio-3d-interactive"
)

# Function to write colored output
function Write-ColorOutput($Color, $Message) {
    Write-Host $Message -ForegroundColor $Color
}

function Show-ManualSetupInstructions {
    Write-ColorOutput Cyan "=== MANUAL AZURE SETUP INSTRUCTIONS ==="
    Write-ColorOutput White ""
    
    Write-ColorOutput Green "STEP 1: Azure Portal Setup"
    Write-ColorOutput White "1. Go to https://portal.azure.com"
    Write-ColorOutput White "2. Navigate to subscription: c6065296-91e7-45f3-a774-908e2225b4d0"
    Write-ColorOutput White "3. Click 'Create a resource' -> 'Static Web App'"
    Write-ColorOutput White ""
    
    Write-ColorOutput Green "STEP 2: Static Web App Configuration"
    Write-ColorOutput Yellow "Resource Details:"
    Write-ColorOutput White "   • Subscription: c6065296-91e7-45f3-a774-908e2225b4d0"
    Write-ColorOutput White "   • Resource Group: $ResourceGroupName (create new if needed)"
    Write-ColorOutput White "   • Name: $SiteName"
    Write-ColorOutput White "   • Plan Type: Free"
    Write-ColorOutput White "   • Region: $Location"
    Write-ColorOutput White ""
    
    Write-ColorOutput Yellow "Deployment Details:"
    Write-ColorOutput White "   • Source: GitHub"
    Write-ColorOutput White "   • GitHub account: vizionscop3"
    Write-ColorOutput White "   • Organization: vizionscop3"
    Write-ColorOutput White "   • Repository: portfolio-v2"
    Write-ColorOutput White "   • Branch: phase-11-completed"
    Write-ColorOutput White ""
    
    Write-ColorOutput Yellow "Build Details:"
    Write-ColorOutput White "   • Build Presets: Custom"
    Write-ColorOutput White "   • App Location: /"
    Write-ColorOutput White "   • Api Location: (leave empty)"
    Write-ColorOutput White "   • Output Location: dist"
    Write-ColorOutput White ""
    
    Write-ColorOutput Green "STEP 3: Configure GitHub Actions"
    Write-ColorOutput White "1. After Static Web App is created, go to 'Configuration' -> 'General'"
    Write-ColorOutput White "2. Copy the 'Deployment token'"
    Write-ColorOutput White "3. Go to GitHub repository: https://github.com/vizionscop3/portfolio-v2"
    Write-ColorOutput White "4. Go to Settings -> Secrets and variables -> Actions"
    Write-ColorOutput White "5. Create new repository secret:"
    Write-ColorOutput Yellow "   Name: AZURE_STATIC_WEB_APPS_API_TOKEN"
    Write-ColorOutput Yellow "   Value: [Paste the deployment token from Azure]"
    Write-ColorOutput White ""
    
    Write-ColorOutput Green "STEP 4: Create Azure Credentials (for advanced workflows)"
    Write-ColorOutput White "1. In Azure Portal, go to 'App registrations' -> 'New registration'"
    Write-ColorOutput White "2. Name: 'portfolio-3d-github-actions'"
    Write-ColorOutput White "3. After creation, go to 'Certificates & secrets' -> 'New client secret'"
    Write-ColorOutput White "4. Copy the client secret value"
    Write-ColorOutput White "5. Go to your Static Web App -> 'Access control (IAM)' -> 'Add role assignment'"
    Write-ColorOutput White "6. Role: 'Static Web App Contributor'"
    Write-ColorOutput White "7. Assign to the app registration you created"
    Write-ColorOutput White ""
    
    Write-ColorOutput Green "STEP 5: Additional GitHub Secrets"
    Write-ColorOutput White "Add these secrets to your GitHub repository:"
    Write-ColorOutput Yellow "AZURE_CREDENTIALS:"
    Write-ColorOutput White @"
{
  "clientId": "[App registration client ID]",
  "clientSecret": "[Client secret value]",
  "subscriptionId": "c6065296-91e7-45f3-a774-908e2225b4d0",
  "tenantId": "[Your tenant ID]"
}
"@
    Write-ColorOutput White ""
    
    Write-ColorOutput Green "STEP 6: Test the Setup"
    Write-ColorOutput White "1. Go to GitHub repository Actions tab"
    Write-ColorOutput White "2. Run the 'Azure Deployment - Phased Rollout' workflow"
    Write-ColorOutput White "3. Select:"
    Write-ColorOutput Yellow "   • Phase: 1"
    Write-ColorOutput Yellow "   • Environment: staging"
    Write-ColorOutput Yellow "   • Skip tests: false"
    Write-ColorOutput White ""
    
    Write-ColorOutput Cyan "=== EXPECTED RESULTS ==="
    Write-ColorOutput White ""
    Write-ColorOutput Green "Azure Static Web App URL:"
    Write-ColorOutput Yellow "https://$SiteName.azurestaticapps.net"
    Write-ColorOutput White ""
    Write-ColorOutput Green "Staging URLs (for each phase):"
    for ($i = 1; $i -le 11; $i++) {
        Write-ColorOutput Yellow "Phase $i staging: https://$SiteName-phase-$i.azurestaticapps.net"
    }
    Write-ColorOutput White ""
    
    Write-ColorOutput Cyan "=== TROUBLESHOOTING ==="
    Write-ColorOutput White ""
    Write-ColorOutput Red "If GitHub Actions fail:"
    Write-ColorOutput White "1. Check that AZURE_STATIC_WEB_APPS_API_TOKEN is correctly set"
    Write-ColorOutput White "2. Verify the repository branch is 'phase-11-completed'"
    Write-ColorOutput White "3. Ensure build settings in Azure match the configuration"
    Write-ColorOutput White "4. Check GitHub Actions logs for specific error messages"
    Write-ColorOutput White ""
    
    Write-ColorOutput Red "If deployment fails:"
    Write-ColorOutput White "1. Verify Azure Static Web App has correct build settings"
    Write-ColorOutput White "2. Check that node_modules and dist folders are not in Git"
    Write-ColorOutput White "3. Ensure package.json has correct build scripts"
    Write-ColorOutput White "4. Test build locally with: npm run build"
    Write-ColorOutput White ""
}

function Show-LocalTestInstructions {
    Write-ColorOutput Cyan "=== LOCAL TESTING BEFORE DEPLOYMENT ==="
    Write-ColorOutput White ""
    
    Write-ColorOutput Green "Run these commands to verify everything works:"
    Write-ColorOutput Yellow "# 1. Install dependencies"
    Write-ColorOutput White "npm ci"
    Write-ColorOutput White ""
    
    Write-ColorOutput Yellow "# 2. Run health checks"
    Write-ColorOutput White "npm run health:check"
    Write-ColorOutput White ""
    
    Write-ColorOutput Yellow "# 3. Test build process"
    Write-ColorOutput White "npm run build"
    Write-ColorOutput White ""
    
    Write-ColorOutput Yellow "# 4. Test preview"
    Write-ColorOutput White "npm run preview"
    Write-ColorOutput White ""
    
    Write-ColorOutput Yellow "# 5. Validate phase-specific builds"
    Write-ColorOutput White "npm run build:phase-1"
    Write-ColorOutput White "npm run build:phase-11"
    Write-ColorOutput White ""
}

function Generate-AzureCLICommands {
    Write-ColorOutput Cyan "=== ALTERNATIVE: Azure CLI Commands ==="
    Write-ColorOutput White ""
    Write-ColorOutput Yellow "If you have access to a different subscription or tenant:"
    Write-ColorOutput White ""
    
    Write-ColorOutput Green "# Login to Azure (will open browser)"
    Write-ColorOutput White "az login"
    Write-ColorOutput White ""
    
    Write-ColorOutput Green "# List available subscriptions"
    Write-ColorOutput White "az account list --output table"
    Write-ColorOutput White ""
    
    Write-ColorOutput Green "# Set the correct subscription"
    Write-ColorOutput White "az account set --subscription 'Your-Subscription-Name-Or-ID'"
    Write-ColorOutput White ""
    
    Write-ColorOutput Green "# Create resource group"
    Write-ColorOutput White "az group create --name $ResourceGroupName --location '$Location'"
    Write-ColorOutput White ""
    
    Write-ColorOutput Green "# Create Static Web App"
    Write-ColorOutput White @"
az staticwebapp create \
    --name $SiteName \
    --resource-group $ResourceGroupName \
    --source https://github.com/vizionscop3/portfolio-v2 \
    --location '$Location' \
    --branch phase-11-completed \
    --app-location '/' \
    --output-location 'dist' \
    --login-with-github
"@
    Write-ColorOutput White ""
}

# Generate deployment configuration file
function Create-DeploymentConfig {
    $config = @{
        azureConfig = @{
            subscriptionId = "c6065296-91e7-45f3-a774-908e2225b4d0"
            resourceGroupName = $ResourceGroupName
            siteName = $SiteName
            location = $Location
            planType = "Free"
        }
        githubConfig = @{
            repository = "vizionscop3/portfolio-v2"
            branch = "phase-11-completed"
            appLocation = "/"
            apiLocation = ""
            outputLocation = "dist"
        }
        deploymentPhases = @(1..11 | ForEach-Object { 
            @{
                phase = $_
                name = switch ($_) {
                    1 { "Core 3D Infrastructure" }
                    2 { "Interactive Objects Foundation" }
                    3 { "Camera Controls & Navigation" }
                    4 { "Room Layout & Environment" }
                    5 { "Basic Lighting System" }
                    6 { "Materials, Textures & LOD" }
                    7 { "Transitions & Animations" }
                    8 { "Accessibility & Mobile Optimization" }
                    9 { "SEO & Analytics Integration" }
                    10 { "Visual Enhancements & Effects" }
                    11 { "Error Handling & Final Optimization" }
                }
                buildCommand = "npm run build:phase-$_"
                testCommand = "npm run test:phase-$_"
            }
        })
    }
    
    $configPath = Join-Path $PSScriptRoot ".." ".deployment" "azure-manual-config.json"
    New-Item -ItemType Directory -Path (Split-Path $configPath) -Force | Out-Null
    $config | ConvertTo-Json -Depth 10 | Set-Content -Path $configPath
    
    Write-ColorOutput Green "Deployment configuration saved to: $configPath"
}

# Main execution
Write-ColorOutput Cyan "AZURE DEPLOYMENT - MANUAL SETUP MODE"
Write-ColorOutput White "Subscription not directly accessible via CLI"
Write-ColorOutput White "Generating manual setup instructions..."
Write-ColorOutput White ""

Show-ManualSetupInstructions
Show-LocalTestInstructions
Generate-AzureCLICommands
Create-DeploymentConfig

Write-ColorOutput Green ""
Write-ColorOutput Green "=== SETUP COMPLETE ==="
Write-ColorOutput White "Follow the manual setup instructions above to configure Azure Static Web Apps"
Write-ColorOutput White "All configuration files and GitHub Actions workflows are ready"
Write-ColorOutput White ""
Write-ColorOutput Cyan "Next: Complete Azure Portal setup and configure GitHub secrets"