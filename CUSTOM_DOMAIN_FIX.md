# Custom Domain Setup for Azure Static Web Apps

## 🚨 Current Issue

Your custom domain `lifeofvizion.com` shows a 404 error because:

1. ✅ DNS is correctly pointing to Azure (you see the Azure 404 page)
2. ❌ Custom domain is NOT configured in Azure Static Web Apps
3. ✅ Static Web App routing configuration has been added

## 🔧 Solution Steps

### Step 1: Configure Custom Domain in Azure Portal

Since your Static Web App was created through GitHub Actions, you need to add the custom domain through the Azure
Portal:

1. **Go to Azure Portal**: https://portal.azure.com
2. **Find your Static Web App**:
   - Search for "Static Web Apps"
   - Look for a resource with hostname `happy-flower-01a5d2404.1.azurestaticapps.net`
3. **Add Custom Domain**:
   - Click on your Static Web App
   - In the left menu, click "Custom domains"
   - Click "+ Add"
   - Enter: `lifeofvizion.com`
   - Follow the verification process

### Step 2: Verify DNS Configuration

Make sure your DNS settings in Hostinger are correct:

**Required DNS Records:**

```
Type: CNAME
Name: @  (or lifeofvizion.com)
Value: happy-flower-01a5d2404.1.azurestaticapps.net
TTL: 3600
```

**Or use A Record if CNAME for apex domain isn't supported:**

```
Type: A
Name: @
Value: [IP address provided by Azure]
TTL: 3600
```

### Step 3: Wait for Propagation

- DNS changes can take 24-48 hours to fully propagate
- Azure domain verification may take a few minutes
- Test with: https://www.whatsmydns.net/#CNAME/lifeofvizion.com

### Step 4: Alternative CLI Method (if you can find the resource)

If you can identify the exact Static Web App name and resource group:

```powershell
# Find the resource
az staticwebapp list --output table

# Add custom domain (replace with actual values)
az staticwebapp hostname set \
  --name "YOUR_STATIC_WEB_APP_NAME" \
  --resource-group "YOUR_RESOURCE_GROUP" \
  --hostname "lifeofvizion.com"
```

## 🔍 Troubleshooting

### Check if deployment is working:

```
✅ Default URL: https://happy-flower-01a5d2404.1.azurestaticapps.net
```

### Common Issues:

1. **Still seeing 404**: Domain not added to Azure Static Web Apps
2. **DNS errors**: Check Hostinger DNS configuration
3. **SSL issues**: Wait for Azure to provision SSL certificate

## 📋 Next Steps After Domain Works

1. **Test the site thoroughly**
2. **Set up SSL certificate** (Azure handles this automatically)
3. **Configure redirect from www to apex domain** (if needed)
4. **Update any hardcoded URLs** in your application

## 🆘 If Still Not Working

Try these diagnostic steps:

1. **Check current DNS**: `nslookup lifeofvizion.com`
2. **Verify in browser**: Open incognito/private browsing
3. **Clear DNS cache**: `ipconfig /flushdns` (Windows)
4. **Check Azure deployment**: Look at GitHub Actions logs

---

The `staticwebapp.config.json` file has been added to handle routing correctly once the custom domain is configured.
