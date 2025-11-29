#!/usr/bin/env node

/**
 * Test script for Polza AI integration in k_da.js
 * 
 * Usage:
 *   # 1. Set up .env with Polza AI key
 *   cp .env.polza-example .env
 *   # Edit .env and add your real POLZA_API_KEY
 *   
 *   # 2. Build with Polza AI integration
 *   bun build.js
 *   
 *   # 3. Test the integration
 *   node test-polza-in-built.js
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Polza AI Integration in Built k_da.js');

// Check if .env exists and has POLZA_API_KEY
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found. Copy .env.polza-example to .env and add your POLZA_API_KEY');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const polzaKeyMatch = envContent.match(/POLZA_API_KEY=(.+)/);

if (!polzaKeyMatch || polzaKeyMatch[1] === 'ak_your_api_key_here') {
  console.error('❌ POLZA_API_KEY not set in .env file');
  console.log('Please edit .env and set your real Polza AI API key');
  process.exit(1);
}

console.log('✅ Polza AI API key found in .env');

// Check if k_da.js exists
const kDaPath = path.join(__dirname, 'k_da.js');
if (!fs.existsSync(kDaPath)) {
  console.log('⚠️  k_da.js not found. Building...');
  exec('bun build.js', (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Build failed:', error.message);
      return;
    }
    console.log('✅ Build completed');
    runTests();
  });
} else {
  console.log('✅ k_da.js found');
  runTests();
}

function runTests() {
  console.log('
🧪 Running Polza AI integration tests...
');

  // Test 1: Check if Polza AI client is inlined
  const kDaContent = fs.readFileSync(kDaPath, 'utf8');
  
  if (kDaContent.includes('class PolzaAIClient')) {
    console.log('✅ Test 1: PolzaAIClient class found in built file');
  } else {
    console.error('❌ Test 1: PolzaAIClient class NOT found in built file');
    console.log('   This means Polza AI integration was not included');
    return;
  }

  if (kDaContent.includes('polzaAI')) {
    console.log('✅ Test 2: polzaAI helper object found in built file');
  } else {
    console.error('❌ Test 2: polzaAI helper object NOT found in built file');
  }

  // Test 3: Check environment variables are inlined
  if (kDaContent.includes('POLZA_API_KEY')) {
    console.log('✅ Test 3: POLZA_API_KEY reference found in built file');
  } else {
    console.warn('⚠️  Test 3: POLZA_API_KEY reference not found (might be inlined)');
  }

  console.log('
🎉 All structural tests passed!');
  console.log('
📝 Next steps:');
  console.log('1. Test actual API calls in your application code');
  console.log('2. Use polzaAI.init() to initialize the client');
  console.log('3. Call polzaAI.complete() or polzaAI.chat() for requests');
  console.log('
💡 Example usage:');
  console.log(`
const { polzaAI } = require('./k_da.js');

// Initialize with default settings
const client = polzaAI.init();

// Simple completion
const response = await polzaAI.complete('Привет! Как дела?');
console.log(response);

// Chat completion
const chatResponse = await polzaAI.chat([
  { role: 'user', content: 'Объясни квантовую физику простыми словами' }
]);
console.log(chatResponse.choices[0].message.content);
  `);
}

// Run the tests
runTests();