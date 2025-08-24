# VizionScope.com Custom Domain Setup Guide

## Current Status ✅

- **Domain**: vizionscope.com
- **Azure Static Web App**: portfolio-v2-phase-4-features
- **Resource Group**: rg-portfolio-3d-interactive
- **Default URL**: nice-bush-09f3be20f.2.azurestaticapps.net
- **Status**: Validating (DNS TXT record required)

## Required DNS Configuration

### Step 1: Add TXT Record for Domain Validation

Add the following TXT record to your DNS provider for vizionscope.com:

```
Type: TXT
Host: @ (or leave blank/root domain)
Value: _5f6gcjw1g5k8s2ex9o9029xy8tytmsr
TTL: 300 (or your provider's minimum)
```

### Step 2: Add A Record or ALIAS for Traffic Routing

After the TXT validation completes, you'll need to add one of these records:

**Option A: A Record (if your DNS provider doesn't support ALIAS)**

```
Type: A
Host: @ (or leave blank/root domain)
Value: [Get IP from Azure - will be provided after validation]
TTL: 3600
```

**Option B: ALIAS Record (recommended if supported)**

```
Type: ALIAS
Host: @ (or leave blank/root domain)
Value: nice-bush-09f3be20f.2.azurestaticapps.net
TTL: 3600
```

### Step 3: Add CNAME for www subdomain (optional but recommended)

```
Type: CNAME
Host: www
Value: vizionscope.com
TTL: 3600
```

## DNS Provider Instructions

### Common DNS Providers:

#### Cloudflare

1. Login to Cloudflare dashboard
2. Select your domain (vizionscope.com)
3. Go to DNS settings
4. Add the TXT record with Host "@" and the validation value
5. After validation, add ALIAS record pointing to your Azure Static Web App

#### GoDaddy

1. Login to GoDaddy account
2. Go to DNS Management for vizionscope.com
3. Add TXT record with Host "@" and the validation value
4. After validation, add A record or forwarding

#### Namecheap

1. Login to Namecheap account
2. Go to Domain List → Manage → Advanced DNS
3. Add TXT record with Host "@" and the validation value
4. After validation, add ALIAS or A record

## Verification Steps

1. **Check TXT Record Propagation**:

   ```powershell
   nslookup -type=TXT vizionscope.com
   ```

2. **Monitor Azure Portal**:
   - Status should change from "Validating" to "Validated"
   - This can take up to 12 hours for DNS changes

3. **Test Domain Access**:
   ```powershell
   curl -I https://vizionscope.com
   ```

## Security Notes

- SSL/TLS certificates are automatically provided by Azure
- HTTPS will be enforced automatically
- HTTP traffic will redirect to HTTPS

## Troubleshooting

### If validation fails:

1. Verify TXT record is correctly added
2. Check DNS propagation using online tools
3. Ensure TTL is set to 300 or lower for faster propagation
4. Contact your DNS provider if issues persist

### Common issues:

- DNS propagation can take 24-48 hours
- Some providers require specific formatting for TXT records
- Ensure no existing conflicting records

## Current Configuration Files Updated

- `configure-custom-domain.ps1` - Updated with vizionscope.com settings
- `VIZIONSCOPE_DOMAIN_SETUP.md` - This comprehensive guide

## Next Steps After DNS Validation

1. Domain status will change to "Ready" in Azure portal
2. Configure any additional subdomains if needed
3. Update any hardcoded URLs in your application
4. Test all functionality with the new domain
5. Update SEO settings and social media links
