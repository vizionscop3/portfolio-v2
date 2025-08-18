# Custom Domain Setup Guide - vizionscop3.com

This guide walks through setting up the custom domain `vizionscop3.com` for your Azure Static Web App portfolio.

## Overview

- **Azure Static Web App**: `portfolio-v2`
- **Azure URL**: `https://happy-flower-01a5d2404.1.azurestaticapps.net`
- **Custom Domain**: `vizionscop3.com`
- **DNS Provider**: Hostinger
- **SSL Certificate**: Automatically managed by Azure

## Step 1: Add Custom Domain in Azure Portal

1. **Navigate to Azure Portal**
   - Go to your `portfolio-v2` Static Web App
   - Click on **Settings** → **Custom domains**

2. **Add Domain**
   - Click **"+ Add"**
   - Enter: `vizionscop3.com`
   - Select **"CNAME"** as record type
   - Click **"Next"**

3. **Note the DNS Information** Azure will provide:
   - **CNAME Target**: `happy-flower-01a5d2404.1.azurestaticapps.net`
   - **TXT Record** (for validation): Copy the provided value

## Step 2: Configure DNS Records in Hostinger

### Required DNS Records

| Type  | Name | Points To / Value                            | TTL   |
| ----- | ---- | -------------------------------------------- | ----- |
| CNAME | @    | happy-flower-01a5d2404.1.azurestaticapps.net | 14400 |
| CNAME | www  | happy-flower-01a5d2404.1.azurestaticapps.net | 14400 |
| TXT   | @    | [Azure validation string]                    | 14400 |

### In Hostinger DNS Panel:

1. **Delete existing A records** for `@` and `www` (if any)
2. **Add CNAME for root domain**:
   - Type: `CNAME`
   - Name: `@`
   - Points to: `happy-flower-01a5d2404.1.azurestaticapps.net`
   - TTL: `14400`

3. **Add CNAME for www subdomain**:
   - Type: `CNAME`
   - Name: `www`
   - Points to: `happy-flower-01a5d2404.1.azurestaticapps.net`
   - TTL: `14400`

4. **Add TXT record for validation**:
   - Type: `TXT`
   - Name: `@`
   - Points to: `[Paste the Azure validation string here]`
   - TTL: `14400`

## Step 3: Verify Domain in Azure

1. **Return to Azure Portal**
2. **Click "Validate"** on your custom domain
3. **Wait for validation** (can take 5-60 minutes)
4. **Enable HTTPS** once validation completes

## Step 4: Test Your Domain

After DNS propagation (15 minutes to 48 hours):

- **Primary domain**: https://vizionscop3.com
- **WWW subdomain**: https://www.vizionscop3.com
- **Original Azure URL**: https://happy-flower-01a5d2404.1.azurestaticapps.net (still works)

## Troubleshooting

### Domain Not Resolving

- **Check DNS propagation**: Use https://dnschecker.org
- **Verify CNAME records**: Ensure no trailing dots
- **Wait longer**: DNS can take up to 48 hours

### Validation Failing

- **Confirm TXT record**: Copy exact value from Azure
- **Check TTL**: Lower TTL (300) for faster propagation
- **Remove duplicates**: Ensure no conflicting records

### SSL Certificate Issues

- **Wait for auto-provisioning**: Can take 30-60 minutes
- **Force refresh**: Try incognito/private browsing
- **Check validation**: Ensure domain validation succeeded

## DNS Propagation Timeline

| Time        | Expected Status             |
| ----------- | --------------------------- |
| 0-5 min     | Records added to Hostinger  |
| 5-15 min    | Some DNS servers updated    |
| 15-60 min   | Most regions resolved       |
| 1-24 hours  | Global propagation complete |
| 24-48 hours | Maximum propagation time    |

## Security Features

Your custom domain includes:

✅ **Free SSL Certificate** (Let's Encrypt via Azure)  
✅ **HTTPS Redirect** (automatic)  
✅ **HSTS Headers** (configured in staticwebapp.config.json)  
✅ **CDN Integration** (Azure Front Door)  
✅ **DDoS Protection** (Azure built-in)

## Additional Configuration

### Email Setup (Optional)

If you want to use custom email (e.g., contact@vizionscop3.com):

- Add MX records for your email provider
- Common providers: Google Workspace, Microsoft 365, Hostinger Email

### Subdomain Setup (Optional)

For additional subdomains (e.g., blog.vizionscop3.com):

- Add additional CNAME records in Hostinger
- Configure in Azure Static Web Apps custom domains

## Best Practices

1. **Always use HTTPS**: Azure automatically redirects HTTP to HTTPS
2. **Monitor expiration**: Domain and SSL certificates
3. **Backup DNS**: Keep records documented
4. **Test regularly**: Verify site accessibility from different locations
5. **Performance monitoring**: Use Azure Application Insights

## Support Resources

- **Azure Documentation**:
  [Custom domains for Static Web Apps](https://docs.microsoft.com/en-us/azure/static-web-apps/custom-domain)
- **Hostinger Support**: DNS management documentation
- **DNS Checking Tools**: dnschecker.org, whatsmydns.net
- **SSL Checker**: ssllabs.com/ssltest

## Next Steps After Setup

1. ✅ Verify domain works: https://vizionscop3.com
2. ✅ Test www redirect: https://www.vizionscop3.com
3. ✅ Check SSL certificate: Look for green padlock
4. ✅ Update business cards/social media with new domain
5. ✅ Set up Google Analytics with new domain
6. ✅ Submit to search engines for indexing

---

**Domain Setup Complete!** 🚀

Your professional portfolio will be accessible at:

- **Primary**: https://vizionscop3.com
- **WWW**: https://www.vizionscop3.com
