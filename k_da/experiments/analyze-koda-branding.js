#!/usr/bin/env node

/**
 * Analyze all occurrences of "Koda" branding in k_da codebase
 * Categorizes references by type and determines which are safe to customize
 */

const fs = require('fs');
const path = require('path');

console.log('='.repeat(80));
console.log('Koda Branding Analysis for k_da');
console.log('='.repeat(80));
console.log();

// Files to analyze
const filesToAnalyze = [
  'src/01-webpack-runtime.js',
  'src/02-react-bundle.js',
  'src/03-npm-modules.js',
  'src/04-app-code.js',
  'src/05-main.js',
  'k_da.js',
  'k_da_deobfuscated.js',
  '.env.example',
  '.env.test.no-telemetry',
];

// Categories for classification
const categories = {
  urls: { name: 'Service URLs (configurable)', items: [], safe: true },
  envVars: { name: 'Environment Variables', items: [], safe: true },
  uiText: { name: 'UI Text/Messages', items: [], safe: true },
  technical: { name: 'Technical Identifiers', items: [], safe: false },
  comments: { name: 'Comments/Documentation', items: [], safe: true },
  unknown: { name: 'Uncategorized', items: [], safe: false },
};

// Patterns to identify category
const patterns = {
  urls: /https?:\/\/[^\s'"]*koda[^\s'"]*/i,
  envVars: /KODA_[A-Z_]+/,
  uiText: /['"`].*Koda.*['"`]/i,
  comments: /\/\/.*Koda|\/\*.*Koda.*\*\//i,
};

function analyzeFile(filePath) {
  const fullPath = path.join(__dirname, '..', filePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Skipping ${filePath} (not found)`);
    return;
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    const lineNum = index + 1;

    // Check if line contains "Koda" (case insensitive)
    if (/koda/i.test(line)) {
      const trimmedLine = line.trim();
      const preview = trimmedLine.length > 100
        ? trimmedLine.substring(0, 100) + '...'
        : trimmedLine;

      const item = {
        file: filePath,
        line: lineNum,
        content: preview,
        fullLine: trimmedLine,
      };

      // Categorize
      if (patterns.urls.test(line)) {
        categories.urls.items.push(item);
      } else if (patterns.envVars.test(line)) {
        categories.envVars.items.push(item);
      } else if (patterns.comments.test(line)) {
        categories.comments.items.push(item);
      } else if (patterns.uiText.test(line)) {
        categories.uiText.items.push(item);
      } else if (/function|var|const|let/.test(line)) {
        categories.technical.items.push(item);
      } else {
        categories.unknown.items.push(item);
      }
    }
  });
}

// Analyze all files
console.log('📊 Analyzing files...\n');
filesToAnalyze.forEach(analyzeFile);

// Generate report
console.log('='.repeat(80));
console.log('ANALYSIS RESULTS');
console.log('='.repeat(80));
console.log();

let totalOccurrences = 0;

Object.entries(categories).forEach(([key, category]) => {
  const count = category.items.length;
  totalOccurrences += count;

  if (count > 0) {
    const safetyLabel = category.safe ? '✅ SAFE TO CUSTOMIZE' : '⚠️  CAUTION REQUIRED';
    console.log(`\n${'='.repeat(80)}`);
    console.log(`${category.name} - ${safetyLabel}`);
    console.log(`Total: ${count} occurrences`);
    console.log(`${'='.repeat(80)}\n`);

    // Show sample occurrences (first 5)
    const samplesToShow = Math.min(5, count);
    category.items.slice(0, samplesToShow).forEach((item, index) => {
      console.log(`${index + 1}. ${item.file}:${item.line}`);
      console.log(`   ${item.content}`);
      console.log();
    });

    if (count > samplesToShow) {
      console.log(`   ... and ${count - samplesToShow} more occurrences\n`);
    }
  }
});

console.log('\n' + '='.repeat(80));
console.log('SUMMARY');
console.log('='.repeat(80));
console.log();
console.log(`Total "Koda" references found: ${totalOccurrences}`);
console.log();

// Extract unique URLs
const uniqueUrls = new Set();
categories.urls.items.forEach(item => {
  const urlMatch = item.fullLine.match(/https?:\/\/[^\s'"]+/);
  if (urlMatch) {
    uniqueUrls.add(urlMatch[0]);
  }
});

console.log('\n📍 Unique URLs found:');
uniqueUrls.forEach(url => {
  console.log(`   • ${url}`);
});

// Extract unique environment variables
const uniqueEnvVars = new Set();
categories.envVars.items.forEach(item => {
  const matches = item.fullLine.match(/KODA_[A-Z_]+/g) || [];
  matches.forEach(match => uniqueEnvVars.add(match));
});

console.log('\n🔧 Unique Environment Variables:');
uniqueEnvVars.forEach(envVar => {
  console.log(`   • ${envVar}`);
});

console.log('\n' + '='.repeat(80));
console.log('RECOMMENDATIONS');
console.log('='.repeat(80));
console.log();

console.log('✅ SAFE TO CUSTOMIZE:');
console.log('   • UI text and messages (update i18n files)');
console.log('   • Service URLs (configure via environment variables)');
console.log('   • Environment variable names (with corresponding code updates)');
console.log('   • Comments and documentation');
console.log();

console.log('⚠️  REQUIRES CAREFUL REVIEW:');
console.log('   • Technical identifiers (variable names, function names)');
console.log('   • These may be referenced in multiple places');
console.log('   • Changing them could break functionality');
console.log();

console.log('🔒 DO NOT CHANGE:');
console.log('   • GitHub OAuth endpoints (github.com/login/...)');
console.log('   • External API endpoints that expect specific authentication');
console.log('   • Hardcoded references tied to external services');
console.log();

console.log('='.repeat(80));
console.log('💡 To customize branding, see: BRANDING_CUSTOMIZATION_GUIDE.md');
console.log('='.repeat(80));
console.log();
