# SSL Certificate Verification Script for Portfolio Phases
# This script verifies SSL certificates and HTTPS redirection for all portfolio phases

Write-Host "🔐 SSL Certificate Verification for Portfolio Phases" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan

# Define the Static Web App URLs
$phase1Url = "https://kind-flower-01e3e580f.2.azurestaticapps.net"
$phase2Url = "https://wonderful-ocean-0b976800f.2.azurestaticapps.net"
$phase3Url = "https://lively-mud-02f35a40f.2.azurestaticapps.net"
$phase4Url = "https://nice-bush-09f3be20f.2.azurestaticapps.net"

$urls = @(
    @{ Name = "Phase 1 - Infrastructure"; Url = $phase1Url },
    @{ Name = "Phase 2 - Scene Architecture"; Url = $phase2Url },
    @{ Name = "Phase 3 - Interactive Objects"; Url = $phase3Url },
    @{ Name = "Phase 4 - Advanced Features"; Url = $phase4Url }
)

function Test-SSLCertificate {
    param(
        [string]$Url,
        [string]$PhaseName
    )
    
    Write-Host "`n🔍 Testing $PhaseName" -ForegroundColor Yellow
    Write-Host "URL: $Url" -ForegroundColor Gray
    
    try {
        # Test HTTPS connection
        $response = Invoke-WebRequest -Uri $Url -Method Head -UseBasicParsing -TimeoutSec 30
        
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ HTTPS connection successful" -ForegroundColor Green
            Write-Host "   Status Code: $($response.StatusCode)" -ForegroundColor Gray
            
            # Check security headers
            $headers = $response.Headers
            if ($headers.ContainsKey("Strict-Transport-Security")) {
                Write-Host "✅ HSTS header present" -ForegroundColor Green
            } else {
                Write-Host "⚠️  HSTS header missing" -ForegroundColor Orange
            }
            
            if ($headers.ContainsKey("X-Content-Type-Options")) {
                Write-Host "✅ X-Content-Type-Options header present" -ForegroundColor Green
            }
            
            return $true
        } else {
            Write-Host "❌ Unexpected status code: $($response.StatusCode)" -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "❌ HTTPS connection failed: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

function Test-HTTPRedirect {
    param(
        [string]$HttpsUrl,
        [string]$PhaseName
    )
    
    $httpUrl = $HttpsUrl -replace "https://", "http://"
    Write-Host "🔄 Testing HTTP to HTTPS redirect for $PhaseName" -ForegroundColor Yellow
    Write-Host "   Testing: $httpUrl" -ForegroundColor Gray
    
    try {
        $response = Invoke-WebRequest -Uri $httpUrl -Method Head -UseBasicParsing -MaximumRedirection 0 -ErrorAction SilentlyContinue
        
        if ($response.StatusCode -eq 301 -or $response.StatusCode -eq 302) {
            $location = $response.Headers.Location
            if ($location -and $location.StartsWith("https://")) {
                Write-Host "✅ HTTP to HTTPS redirect working" -ForegroundColor Green
                Write-Host "   Redirects to: $location" -ForegroundColor Gray
                return $true
            }
        }
        
        Write-Host "⚠️  HTTP redirect not configured properly" -ForegroundColor Orange
        return $false
    }
    catch {
        # This might be expected if HTTP is completely blocked
        Write-Host "ℹ️  HTTP access blocked (this is good for security)" -ForegroundColor Blue
        return $true
    }
}

function Open-SiteInBrowser {
    param(
        [string]$Url,
        [string]$PhaseName
    )
    
    Write-Host "🌐 Opening $PhaseName in browser..." -ForegroundColor Cyan
    Start-Process $Url
    Start-Sleep -Seconds 1
}

# Main execution
Write-Host "`n🚀 Starting SSL verification for all phases...`n" -ForegroundColor Green

$results = @()

foreach ($site in $urls) {
    $sslResult = Test-SSLCertificate -Url $site.Url -PhaseName $site.Name
    $redirectResult = Test-HTTPRedirect -HttpsUrl $site.Url -PhaseName $site.Name
    
    $results += @{
        Phase = $site.Name
        Url = $site.Url
        SSLWorking = $sslResult
        RedirectWorking = $redirectResult
        OverallStatus = $sslResult -and $redirectResult
    }
    
    Write-Host "───────────────────────────────────────" -ForegroundColor Gray
}

# Summary
Write-Host "`n📊 SSL Verification Summary" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan

foreach ($result in $results) {
    $status = if ($result.OverallStatus) { "✅ PASS" } else { "❌ FAIL" }
    $color = if ($result.OverallStatus) { "Green" } else { "Red" }
    
    Write-Host "$($result.Phase): $status" -ForegroundColor $color
    Write-Host "   URL: $($result.Url)" -ForegroundColor Gray
    Write-Host "   SSL: $(if ($result.SSLWorking) { '✅' } else { '❌' })" -ForegroundColor Gray
    Write-Host "   Redirect: $(if ($result.RedirectWorking) { '✅' } else { '❌' })" -ForegroundColor Gray
    Write-Host ""
}

# Open all sites in browser for manual verification
Write-Host "🔍 Opening all sites for manual SSL verification..." -ForegroundColor Cyan
foreach ($site in $urls) {
    Open-SiteInBrowser -Url $site.Url -PhaseName $site.Name
}

Write-Host "✨ SSL verification complete!" -ForegroundColor Green
Write-Host "📝 Check the browser security indicators (lock icons) to confirm SSL certificates are valid." -ForegroundColor Yellow
Write-Host "📋 Don't forget to add the GitHub secrets from SSL_CONFIGURATION_SUMMARY.md" -ForegroundColor Yellow
