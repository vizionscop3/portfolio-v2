# DNS Verification Script for vizionscope.com
# This script helps verify DNS configuration and Azure domain validation

param(
    [switch]$CheckTXT,
    [switch]$CheckA,
    [switch]$CheckAzure,
    [switch]$All
)

$domain = "vizionscope.com"
$expectedTXT = "_5f6gcjw1g5k8s2ex9o9029xy8tytmsr"
$staticWebAppName = "portfolio-v2-phase-4-features"
$resourceGroup = "rg-portfolio-3d-interactive"

function Test-TXTRecord {
    Write-Host "`n🔍 Checking TXT Record..." -ForegroundColor Cyan
    try {
        $txtRecords = Resolve-DnsName -Name $domain -Type TXT -ErrorAction Stop
        $found = $false
        
        foreach ($record in $txtRecords) {
            if ($record.Strings -contains $expectedTXT) {
                Write-Host "✅ TXT record found: $($record.Strings)" -ForegroundColor Green
                $found = $true
                break
            }
        }
        
        if (-not $found) {
            Write-Host "❌ Expected TXT record not found" -ForegroundColor Red
            Write-Host "Expected: $expectedTXT" -ForegroundColor Yellow
            Write-Host "Found records:" -ForegroundColor Yellow
            foreach ($record in $txtRecords) {
                Write-Host "  - $($record.Strings)" -ForegroundColor White
            }
        }
    }
    catch {
        Write-Host "❌ No TXT records found for $domain" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Test-ARecord {
    Write-Host "`n🔍 Checking A Record..." -ForegroundColor Cyan
    try {
        $aRecords = Resolve-DnsName -Name $domain -Type A -ErrorAction Stop
        Write-Host "✅ A record(s) found:" -ForegroundColor Green
        foreach ($record in $aRecords) {
            Write-Host "  - $($record.IPAddress)" -ForegroundColor White
        }
    }
    catch {
        Write-Host "❌ No A records found for $domain" -ForegroundColor Red
        Write-Host "This is normal during initial TXT validation phase" -ForegroundColor Yellow
    }
}

function Test-AzureDomainStatus {
    Write-Host "`n🔍 Checking Azure Domain Status..." -ForegroundColor Cyan
    try {
        $result = az staticwebapp hostname list --name $staticWebAppName --resource-group $resourceGroup 2>$null
        if ($result) {
            $domains = $result | ConvertFrom-Json
            if ($domains.Count -gt 0) {
                foreach ($domain in $domains) {
                    $status = if ($domain.validationToken) { "Validating" } else { "Validated" }
                    Write-Host "✅ Domain: $($domain.hostname) - Status: $status" -ForegroundColor Green
                }
            } else {
                Write-Host "❌ No custom domains configured" -ForegroundColor Red
            }
        } else {
            Write-Host "❌ Unable to retrieve domain status from Azure" -ForegroundColor Red
        }
    }
    catch {
        Write-Host "❌ Error checking Azure status: $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Test-HTTPSConnectivity {
    Write-Host "`n🔍 Testing HTTPS Connectivity..." -ForegroundColor Cyan
    try {
        $response = Invoke-WebRequest -Uri "https://$domain" -Method Head -TimeoutSec 10 -ErrorAction Stop
        Write-Host "✅ HTTPS connection successful - Status: $($response.StatusCode)" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ HTTPS connection failed" -ForegroundColor Red
        Write-Host "This is expected during DNS setup phase" -ForegroundColor Yellow
    }
}

# Main execution
Write-Host "🌐 DNS and Azure Domain Verification for $domain" -ForegroundColor Magenta
Write-Host "================================================" -ForegroundColor Magenta

if ($CheckTXT -or $All) {
    Test-TXTRecord
}

if ($CheckA -or $All) {
    Test-ARecord
}

if ($CheckAzure -or $All) {
    Test-AzureDomainStatus
}

if ($All) {
    Test-HTTPSConnectivity
}

if (-not ($CheckTXT -or $CheckA -or $CheckAzure -or $All)) {
    Write-Host "`nUsage Examples:" -ForegroundColor Yellow
    Write-Host "  .\verify-dns.ps1 -CheckTXT     # Check only TXT record"
    Write-Host "  .\verify-dns.ps1 -CheckA      # Check only A record"
    Write-Host "  .\verify-dns.ps1 -CheckAzure  # Check Azure domain status"
    Write-Host "  .\verify-dns.ps1 -All         # Run all checks"
    Write-Host ""
    Write-Host "Running TXT check by default..." -ForegroundColor Cyan
    Test-TXTRecord
}

Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Add TXT record: _5f6gcjw1g5k8s2ex9o9029xy8tytmsr" -ForegroundColor White
Write-Host "2. Wait for DNS propagation (15 minutes - 48 hours)" -ForegroundColor White
Write-Host "3. Azure will automatically validate and provision SSL" -ForegroundColor White
Write-Host "4. After validation, configure A record for traffic routing" -ForegroundColor White
