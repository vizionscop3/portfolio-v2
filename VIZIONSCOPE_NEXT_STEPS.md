# 🚀 VIZIONSCOPE.COM SETUP - QUICK ACTION GUIDE

## ✅ COMPLETED

- Domain `vizionscope.com` added to Azure Static Web App
- Azure is ready to validate domain ownership

## 🔄 IMMEDIATE ACTION REQUIRED

### Step 1: Add DNS TXT Record

Go to your domain registrar (where you purchased vizionscope.com) and add:

```
Type: TXT
Host: @ (or root/blank)
Value: _5f6gcjw1g5k8s2ex9o9029xy8tytmsr
TTL: 300-3600
```

### Step 2: Verify TXT Record

After adding the record, run this command to check:

```powershell
.\verify-dns.ps1 -CheckTXT
```

### Step 3: Monitor Azure Validation

Check Azure portal or run:

```powershell
.\verify-dns.ps1 -CheckAzure
```

## 📋 WHAT HAPPENS NEXT

1. **DNS Propagation** (15 mins - 48 hours)
   - Your TXT record propagates globally
2. **Azure Validation** (automatic)
   - Azure detects your TXT record
   - Status changes to "Validated"
   - SSL certificate is automatically provisioned

3. **Traffic Routing** (after validation)
   - Add A record: `20.33.134.215`
   - Or use ALIAS: `nice-bush-09f3be20f.2.azurestaticapps.net`

## 🛠️ HELPFUL SCRIPTS

- `.\verify-dns.ps1 -All` - Complete DNS check
- `.\configure-custom-domain.ps1` - Setup reference
- Check `VIZIONSCOPE_DOMAIN_SETUP.md` for detailed guide

## 🌐 DOMAIN REGISTRAR EXAMPLES

### Namecheap

1. Login → Domain List → Manage
2. Advanced DNS → Add Record
3. Type: TXT, Host: @, Value: (paste TXT value)

### GoDaddy

1. Domain Settings → DNS Management
2. Add Record → TXT
3. Name: @, Value: (paste TXT value)

### Cloudflare

1. DNS → Records → Add Record
2. Type: TXT, Name: @, Content: (paste TXT value)

---

**Expected Timeline**: 15 minutes to 12 hours for validation **Status Check**: Azure Portal → Static Web Apps → Custom
Domains
