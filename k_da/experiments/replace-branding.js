#!/usr/bin/env node

/**
 * Automated Branding Replacement Script for k_da
 *
 * Usage:
 *   node replace-branding.js --app-name "MyApp CLI" --site-url "https://myapp.com"
 *   node replace-branding.js --help
 *
 * Options:
 *   --app-name        New application name (default: "Custom CLI")
 *   --company-name    New company/project name (default: "Custom")
 *   --site-url        New website URL (default: "https://custom.example.com")
 *   --api-url         New API base URL (default: "https://api.custom.example.com/v1")
 *   --docs-url        New documentation URL (default: "https://docs.custom.example.com")
 *   --community-url   New community URL (default: "https://t.me/customcommunity")
 *   --env-prefix      New environment variable prefix (default: "CUSTOM_")
 *   --ui-only         Only update UI text, not environment variables
 *   --full-rebrand    Complete rebrand including technical identifiers
 *   --dry-run         Show what would be changed without making changes
 *   --help            Show this help message
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  appName: 'Custom CLI',
  companyName: 'Custom',
  siteUrl: 'https://custom.example.com',
  apiUrl: 'https://api.custom.example.com/v1',
  docsUrl: 'https://docs.custom.example.com',
  communityUrl: 'https://t.me/customcommunity',
  envPrefix: 'CUSTOM_',
  uiOnly: false,
  fullRebrand: false,
  dryRun: false,
};

// Parse arguments
for (let i = 0; i < args.length; i++) {
  switch (args[i]) {
    case '--help':
      console.log(fs.readFileSync(__filename, 'utf8').split('\n').slice(2, 21).join('\n'));
      process.exit(0);
    case '--app-name':
      options.appName = args[++i];
      break;
    case '--company-name':
      options.companyName = args[++i];
      break;
    case '--site-url':
      options.siteUrl = args[++i];
      break;
    case '--api-url':
      options.apiUrl = args[++i];
      break;
    case '--docs-url':
      options.docsUrl = args[++i];
      break;
    case '--community-url':
      options.communityUrl = args[++i];
      break;
    case '--env-prefix':
      options.envPrefix = args[++i];
      break;
    case '--ui-only':
      options.uiOnly = true;
      break;
    case '--full-rebrand':
      options.fullRebrand = true;
      break;
    case '--dry-run':
      options.dryRun = true;
      break;
  }
}

console.log('='.repeat(80));
console.log('Koda Branding Replacement Script');
console.log('='.repeat(80));
console.log();
console.log('Configuration:');
console.log(`  Application Name: ${options.appName}`);
console.log(`  Company Name:     ${options.companyName}`);
console.log(`  Website URL:      ${options.siteUrl}`);
console.log(`  API URL:          ${options.apiUrl}`);
console.log(`  Docs URL:         ${options.docsUrl}`);
console.log(`  Community URL:    ${options.communityUrl}`);
console.log(`  Env Prefix:       ${options.envPrefix}`);
console.log(`  Mode:             ${options.uiOnly ? 'UI Only' : options.fullRebrand ? 'Full Rebrand' : 'Standard'}`);
console.log(`  Dry Run:          ${options.dryRun ? 'Yes (no changes will be made)' : 'No'}`);
console.log();

if (options.dryRun) {
  console.log('⚠️  DRY RUN MODE - No files will be modified\n');
}

// Backup function
function createBackup(filePath) {
  const backupPath = filePath + '.backup-' + Date.now();
  if (!options.dryRun) {
    fs.copyFileSync(filePath, backupPath);
    console.log(`   ✓ Backup created: ${path.basename(backupPath)}`);
  } else {
    console.log(`   [DRY RUN] Would create backup: ${path.basename(backupPath)}`);
  }
  return backupPath;
}

// Replacement patterns
const replacements = {
  ui: [
    { from: /Koda CLI/g, to: options.appName },
    { from: /Koda Code/g, to: options.companyName + ' Code' },
    { from: /Koda/g, to: options.companyName },
    { from: /kodacode\.ru/g, to: options.siteUrl.replace(/^https?:\/\//, '') },
    { from: /https:\/\/kodacode\.ru/g, to: options.siteUrl },
    { from: /https:\/\/api\.kodacode\.ru\/v1/g, to: options.apiUrl },
    { from: /https:\/\/docs\.kodacode\.ru\/koda-cli\//g, to: options.docsUrl },
    { from: /https:\/\/t\.me\/kodacommunity/g, to: options.communityUrl },
    { from: /https:\/\/cli-companion\.kodacode\.ru\//g, to: options.siteUrl + '/companion/' },
  ],
  env: [
    { from: /KODA_SITE_URL/g, to: options.envPrefix + 'SITE_URL' },
    { from: /KODA_API_BASE/g, to: options.envPrefix + 'API_BASE' },
    { from: /KODA_DOCS_URL/g, to: options.envPrefix + 'DOCS_URL' },
    { from: /KODA_COMMUNITY_URL/g, to: options.envPrefix + 'COMMUNITY_URL' },
    { from: /KODA_WEB_SEARCH_BASE_URL/g, to: options.envPrefix + 'WEB_SEARCH_BASE_URL' },
    { from: /KODA_GITHUB_EXCHANGE_URL/g, to: options.envPrefix + 'GITHUB_EXCHANGE_URL' },
    { from: /KODA_API_KEY/g, to: options.envPrefix + 'API_KEY' },
    { from: /KODA_GITHUB_TOKEN/g, to: options.envPrefix + 'GITHUB_TOKEN' },
  ],
  technical: [
    { from: /kodaApiKey/g, to: options.envPrefix.toLowerCase() + 'ApiKey' },
    { from: /respectKodaIgnore/g, to: 'respect' + options.companyName + 'Ignore' },
    { from: /koda_cli_key/g, to: options.envPrefix.toLowerCase() + 'cli_key' },
  ],
};

// Files to process
const filesToProcess = {
  ui: [
    'src/i18n/locales/en-US.js',
    'src/i18n/locales/ru-RU.js',
    'src/04-app-code.js',
  ],
  all: [
    'src/01-webpack-runtime.js',
    'src/02-react-bundle.js',
    'src/03-npm-modules.js',
    'src/04-app-code.js',
    'src/05-main.js',
    '.env.example',
  ],
};

let changesCount = 0;
let filesModified = 0;

// Process a file with replacements
function processFile(filePath, replacementSet) {
  const fullPath = path.join(__dirname, '..', filePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Skipping ${filePath} (not found)`);
    return;
  }

  console.log(`\n📝 Processing: ${filePath}`);

  // Create backup
  createBackup(fullPath);

  let content = fs.readFileSync(fullPath, 'utf8');
  let originalContent = content;
  let fileChanges = 0;

  // Apply replacements
  replacementSet.forEach(({ from, to }) => {
    const matches = content.match(from);
    if (matches) {
      content = content.replace(from, to);
      const count = matches.length;
      fileChanges += count;
      console.log(`   ✓ Replaced "${from.source.substring(0, 30)}..." × ${count}`);
    }
  });

  if (fileChanges > 0) {
    if (!options.dryRun) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`   ✓ Saved with ${fileChanges} changes`);
    } else {
      console.log(`   [DRY RUN] Would save with ${fileChanges} changes`);
    }
    changesCount += fileChanges;
    filesModified++;
  } else {
    console.log('   • No changes needed');
  }
}

// Main execution
console.log('='.repeat(80));
console.log('PHASE 1: UI Text Replacement');
console.log('='.repeat(80));

filesToProcess.ui.forEach(file => {
  processFile(file, replacements.ui);
});

if (!options.uiOnly) {
  console.log('\n' + '='.repeat(80));
  console.log('PHASE 2: Environment Variable Replacement');
  console.log('='.repeat(80));

  filesToProcess.all.forEach(file => {
    processFile(file, replacements.env);
  });
}

if (options.fullRebrand) {
  console.log('\n' + '='.repeat(80));
  console.log('PHASE 3: Technical Identifier Replacement');
  console.log('='.repeat(80));

  filesToProcess.all.forEach(file => {
    processFile(file, replacements.technical);
  });
}

// Create custom .env file
console.log('\n' + '='.repeat(80));
console.log('PHASE 4: Create Custom Configuration');
console.log('='.repeat(80));

const envContent = `# Custom Branding Configuration
# Generated by replace-branding.js on ${new Date().toISOString()}

# Application Information
${options.envPrefix}APP_NAME="${options.appName}"
${options.envPrefix}COMPANY_NAME="${options.companyName}"

# Service URLs
${options.envPrefix}SITE_URL="${options.siteUrl}"
${options.envPrefix}API_BASE="${options.apiUrl}"
${options.envPrefix}DOCS_URL="${options.docsUrl}"
${options.envPrefix}COMMUNITY_URL="${options.communityUrl}"

# API Configuration
${options.envPrefix}API_KEY=""  # Add your API key here
${options.envPrefix}GITHUB_TOKEN=""  # Will be set after GitHub OAuth

# Telemetry (recommended: disabled for custom deployments)
OTEL_SDK_DISABLED="true"
${options.envPrefix}TELEMETRY_ENABLED="false"

# GitHub OAuth (create your own OAuth app at https://github.com/settings/developers)
GITHUB_CLIENT_ID=""  # Add your GitHub OAuth client ID
GITHUB_SCOPES="read:user user:email"

# Note: GitHub OAuth endpoints must remain as:
#   - https://github.com/login/device/code
#   - https://github.com/login/oauth/access_token
# These are standard GitHub endpoints and must NOT be changed.
`;

const envPath = path.join(__dirname, '..', '.env.custom');
console.log(`\n📝 Creating: .env.custom`);

if (!options.dryRun) {
  fs.writeFileSync(envPath, envContent);
  console.log('   ✓ Created .env.custom');
  console.log('   → Copy to .env to use: cp .env.custom .env');
} else {
  console.log('   [DRY RUN] Would create .env.custom');
}

// Rebuild k_da.js
if (!options.dryRun && !options.uiOnly) {
  console.log('\n' + '='.repeat(80));
  console.log('PHASE 5: Rebuild k_da.js');
  console.log('='.repeat(80));
  console.log();

  try {
    const { execSync } = require('child_process');
    execSync('node build.js', {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit',
    });
    console.log('\n   ✓ k_da.js rebuilt successfully');
  } catch (error) {
    console.error('   ✗ Error rebuilding k_da.js:', error.message);
    console.log('   → Run manually: node build.js');
  }
}

// Summary
console.log('\n' + '='.repeat(80));
console.log('SUMMARY');
console.log('='.repeat(80));
console.log();
console.log(`Total changes: ${changesCount} replacements across ${filesModified} files`);
console.log();

if (!options.dryRun) {
  console.log('✅ Branding replacement complete!');
  console.log();
  console.log('Next steps:');
  console.log('  1. Review the changes in modified files');
  console.log('  2. Copy .env.custom to .env and configure');
  console.log('  3. Test the application: node k_da.js --help');
  console.log('  4. Test GitHub authentication: node k_da.js');
  console.log();
  console.log('To restore original files, use the .backup files created.');
} else {
  console.log('ℹ️  This was a DRY RUN. No files were modified.');
  console.log('   Remove --dry-run to apply changes.');
}

console.log();
console.log('='.repeat(80));
