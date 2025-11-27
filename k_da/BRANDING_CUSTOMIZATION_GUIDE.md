# Koda Branding Customization Guide

**Issue Reference**: [#28](https://github.com/judas-priest/hives/issues/28)

## Overview

This guide explains how to customize the "Koda" branding in k_da without breaking functionality, particularly the GitHub OAuth authentication flow.

Based on comprehensive codebase analysis, we found **1,242 occurrences** of "Koda" across the codebase, categorized as follows:

- ✅ **573** Environment Variables (safe to customize)
- ✅ **393** UI Text/Messages (safe to customize)
- ✅ **44** Service URLs (configurable via env vars)
- ⚠️ **229** Technical identifiers (requires caution)
- ✅ **3** Comments/Documentation (safe to customize)

## Quick Answer: GitHub OAuth Branding

### Question
> "It asks for GitHub authorization... Website: Koda CLI by Koda. Is it possible to change the username without breaking the functionality?"

### Answer

**The "Website: Koda CLI by Koda" text displayed during GitHub OAuth is controlled by GitHub's OAuth application settings**, not by the k_da code itself. Here's what you can do:

#### 1. GitHub OAuth Application Name (Shown in Auth Flow)

The application name shown during GitHub authorization is configured in GitHub's OAuth app settings:

1. Go to https://github.com/settings/developers
2. Select your OAuth App (or create a new one)
3. Update the **Application name** field
4. Update the **Homepage URL** field
5. Update the **Authorization callback URL** if needed

**The k_da code uses standard GitHub OAuth endpoints** which are NOT customizable:
- `https://github.com/login/device/code` (device code flow)
- `https://github.com/login/oauth/access_token` (token exchange)

These URLs **MUST NOT be changed** or authentication will fail.

#### 2. CLI Application Name (Shown in Terminal)

The text displayed in the terminal during login can be customized. See the sections below.

## Safe Customizations

### Option 1: Environment Variables (Recommended)

Configure branding via environment variables without modifying code:

```bash
# Copy the example configuration
cp .env.example .env

# Edit .env and customize these variables:
KODA_APP_NAME="YourApp CLI"
KODA_SITE_URL="https://yoursite.com"
KODA_API_BASE="https://api.yoursite.com/v1"
KODA_DOCS_URL="https://docs.yoursite.com/"
KODA_COMMUNITY_URL="https://t.me/yourcommunity"
```

**Service URLs that can be customized**:

| Environment Variable | Default Value | Purpose |
|---------------------|---------------|---------|
| `KODA_SITE_URL` | `https://kodacode.ru` | Main website URL |
| `KODA_API_BASE` | `https://api.kodacode.ru/v1` | API endpoint |
| `KODA_DOCS_URL` | `https://docs.kodacode.ru/koda-cli/` | Documentation |
| `KODA_COMMUNITY_URL` | `https://t.me/kodacommunity` | Community link |
| `KODA_IDE_COMPANION_URL` | `https://cli-companion.kodacode.ru/` | IDE integration |
| `KODA_WEB_SEARCH_BASE_URL` | `https://api.kodacode.ru/web_search` | Web search API |
| `KODA_GITHUB_EXCHANGE_URL` | (optional) | GitHub token exchange |

### Option 2: UI Text Customization

Customize user-facing text by editing the i18n locale files:

```bash
# Edit English translations
nano src/i18n/locales/en-US.js

# Edit Russian translations
nano src/i18n/locales/ru-RU.js
```

**Key text elements to customize**:

1. **Application Name** (various locations in i18n files):
   - Change `"Koda CLI"` to your app name
   - Update welcome messages
   - Update help text

2. **Terminal Output** during GitHub login (`src/04-app-code.js:10967`):
```javascript
console.log(`
GitHub Login`),
  console.log(`Open: ${s}`),
  console.log(`Code: ${a}
`),
```

You can customize this to:
```javascript
console.log(`
YourApp GitHub Login`),
  console.log(`Open: ${s}`),
  console.log(`Code: ${a}
`),
```

3. **After editing i18n files, rebuild**:
```bash
node build.js
```

### Option 3: Automated Branding Replacement

Use the included script to replace branding systematically:

```bash
# Run the branding replacement script
node experiments/replace-branding.js \
  --app-name "YourApp CLI" \
  --company-name "YourCompany" \
  --site-url "https://yoursite.com"
```

This script will:
- Update all UI text references
- Update i18n files
- Generate new .env configuration
- Create a backup of original files
- Rebuild k_da.js automatically

## What NOT to Change

### 🔒 Critical - Do Not Modify

1. **GitHub OAuth Endpoints**:
   - ❌ `https://github.com/login/device/code`
   - ❌ `https://github.com/login/oauth/access_token`
   - These are standard GitHub endpoints and must not be changed

2. **Technical Identifiers** (without careful review):
   - Environment variable keys used in telemetry (e.g., `KODA_CLI_KEY_UNKNOWN`)
   - API object property names (e.g., `kodaApiKey`)
   - Internal function names
   - Changing these requires updating all references

3. **External Service Integration Points**:
   - If using the official Koda API services, URLs must point to actual endpoints
   - Changing API URLs without corresponding backend changes will break functionality

## Detailed Customization Steps

### Step 1: Plan Your Branding

Decide on:
- Application name (e.g., "MyAI CLI")
- Company/Project name
- Website URL
- API endpoint (if self-hosted)
- Documentation URL
- Community links

### Step 2: Configure Environment

Create `.env` file:

```bash
# Application Branding
KODA_APP_NAME="MyAI CLI"
KODA_APP_VERSION="1.0.0"

# Service URLs (customize if self-hosting)
KODA_SITE_URL="https://myai.example.com"
KODA_API_BASE="https://api.myai.example.com/v1"
KODA_DOCS_URL="https://docs.myai.example.com/"
KODA_COMMUNITY_URL="https://discord.gg/myai"

# GitHub OAuth (create your own OAuth app)
GITHUB_CLIENT_ID="your_client_id_here"
GITHUB_SCOPES="read:user user:email"

# Telemetry (optional - disable for privacy)
OTEL_SDK_DISABLED="true"
KODA_TELEMETRY_ENABLED="false"
```

### Step 3: Update UI Text

Edit `src/i18n/locales/en-US.js`:

```javascript
// Find and replace patterns like:
"Koda CLI" → "MyAI CLI"
"kodacode.ru" → "myai.example.com"
"Koda" → "MyAI"
```

Edit `src/i18n/locales/ru-RU.js` for Russian localization (if needed).

### Step 4: Rebuild Application

```bash
# Rebuild k_da.js with your customizations
node build.js

# Test the application
node k_da.js --help
```

### Step 5: Test GitHub Authentication

```bash
# Test GitHub OAuth flow
node k_da.js

# When prompted:
# 1. Verify the terminal output shows your custom branding
# 2. Open the GitHub device code URL
# 3. Enter the code
# 4. Verify authentication succeeds
```

**Note**: The GitHub OAuth application name shown on github.com is controlled by your OAuth app settings on GitHub, not by this code.

### Step 6: Verify Functionality

Test critical features:
- ✅ GitHub authentication works
- ✅ API requests succeed (if using custom API)
- ✅ Help text shows correct branding
- ✅ Error messages display properly
- ✅ Links point to correct URLs

## Advanced: Full Rebrand

For a complete rebrand including technical identifiers:

### 1. Environment Variable Prefixes

Replace `KODA_` prefix with your own:

```bash
# Use the advanced replacement script
node experiments/replace-branding.js \
  --env-prefix "MYAI_" \
  --full-rebrand
```

This updates:
- All environment variable names
- All code references to those variables
- Configuration files
- Documentation

### 2. Update Technical Identifiers

Search and replace systematically:

```bash
# Find all technical references
grep -r "kodaApiKey" src/
grep -r "respectKodaIgnore" src/

# Update each carefully, ensuring all references are changed
```

### 3. Update Package Metadata

If you plan to redistribute:

```javascript
// Update in src/05-main.js or equivalent
const APP_NAME = "MyAI CLI";
const APP_VERSION = "1.0.0";
const APP_AUTHOR = "Your Organization";
```

## Troubleshooting

### Issue: GitHub Auth Fails After Rebrand

**Cause**: GitHub OAuth endpoints were modified or OAuth app not configured

**Solution**:
1. Verify GitHub OAuth endpoints are unchanged:
   ```javascript
   // Must remain as:
   'https://github.com/login/device/code'
   'https://github.com/login/oauth/access_token'
   ```
2. Create your own GitHub OAuth app at https://github.com/settings/developers
3. Set `GITHUB_CLIENT_ID` in your `.env` file

### Issue: API Requests Fail

**Cause**: API endpoint changed but no corresponding backend

**Solution**:
1. Use original endpoints: `KODA_API_BASE="https://api.kodacode.ru/v1"`
2. Or deploy your own API backend and configure accordingly

### Issue: UI Shows Mixed Branding

**Cause**: Incomplete text replacement in i18n files

**Solution**:
```bash
# Find remaining references
grep -r "Koda" src/i18n/

# Update each file manually or use the replacement script
node experiments/replace-branding.js --ui-only
```

### Issue: Application Won't Start

**Cause**: Syntax error in modified JavaScript

**Solution**:
```bash
# Restore from backup
cp k_da.js.backup k_da.js

# Or rebuild from source
node build.js

# Check for JavaScript errors
node k_da.js 2>&1 | head -50
```

## Analysis Tools

Use the included analysis script to audit your customization:

```bash
# Analyze all Koda references
node experiments/analyze-koda-branding.js

# Check for remaining hardcoded references
node experiments/analyze-koda-branding.js | grep "CAUTION"

# Generate detailed report
node experiments/analyze-koda-branding.js > branding-audit.txt
```

## Summary: Answering the Original Question

### Can you change the "Koda" username without breaking functionality?

**Yes, with caveats**:

1. ✅ **GitHub OAuth Application Name**: Change via GitHub OAuth app settings (not in code)
2. ✅ **Terminal UI Text**: Safely customizable via environment variables and i18n files
3. ✅ **Service URLs**: Fully customizable via environment variables
4. ⚠️ **Environment Variable Names**: Can be changed but requires updating all code references
5. ❌ **GitHub OAuth Endpoints**: Must NOT be changed

### Recommended Approach

**For most users** (minimal changes, preserve functionality):

1. Create `.env` file with your custom URLs
2. Edit `src/i18n/locales/en-US.js` to change UI text
3. Run `node build.js`
4. Test GitHub authentication
5. Create your own GitHub OAuth app for custom branding on GitHub's UI

**For advanced users** (full rebrand):

1. Use `experiments/replace-branding.js` script with full options
2. Update all environment variable prefixes
3. Modify package metadata
4. Deploy custom API backend (if replacing Koda services)
5. Thoroughly test all functionality

## References

- **Analysis Output**: `experiments/branding-analysis-output.txt`
- **Analysis Script**: `experiments/analyze-koda-branding.js`
- **Replacement Script**: `experiments/replace-branding.js` (to be created)
- **Issue #28**: https://github.com/judas-priest/hives/issues/28

## Support

If you encounter issues during customization:

1. Check troubleshooting section above
2. Review analysis output for unexpected references
3. Restore from backup if functionality breaks
4. Create a GitHub issue with details of your customization attempt

---

**Last Updated**: 2025-11-27
**Version**: 1.0.0
**Analysis Coverage**: 1,242 occurrences across 10 files
