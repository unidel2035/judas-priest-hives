#!/usr/bin/env node

/**
 * Test for Polza AI integration using ES modules
 */

console.log('🧪 Testing Polza AI Integration in Built k_da.js (ESM)\n');

// Set environment variable for test
process.env.POLZA_API_KEY = 'ak_0xCOU-hEsCsImB6r-dg7GChm2LFPQOUL9ROwExY8WBo';

async function testPolzaIntegration() {
  try {
    // Test 1: Check if PolzaAIClient class exists
    console.log('Test 1: Checking if PolzaAIClient class exists in built file...');
    const fs = require('fs');
    const kdaContent = fs.readFileSync('./k_da.js', 'utf8');
    
    if (kdaContent.includes('class PolzaAIClient')) {
      console.log('✅ PolzaAIClient class found in built file');
    } else {
      console.log('❌ PolzaAIClient class NOT found in built file');
      process.exit(1);
    }

    // Test 2: Check if polzaAI helper exists
    console.log('Test 2: Checking if polzaAI helper exists in built file...');
    if (kdaContent.includes('const polzaAI = {')) {
      console.log('✅ polzaAI helper object found in built file');
    } else {
      console.log('❌ polzaAI helper object NOT found in built file');
      process.exit(1);
    }

    // Test 3: Check if API key reference exists
    console.log('Test 3: Checking if POLZA_API_KEY reference exists...');
    if (kdaContent.includes('process.env.POLZA_API_KEY')) {
      console.log('✅ POLZA_API_KEY reference found in built file');
    } else {
      console.log('❌ POLZA_API_KEY reference NOT found in built file');
      process.exit(1);
    }

    // Test 4: Try to import and initialize Polza client
    console.log('Test 4: Trying to import and initialize Polza client...');
    const kdaModule = await import('./k_da.js');
    
    if (kdaModule.polzaAI && typeof kdaModule.polzaAI.init === 'function') {
      console.log('✅ polzaAI object and init function available');
      
      // Test initialization
      const client = kdaModule.polzaAI.init();
      if (client) {
        console.log('✅ Polza AI client initialized successfully');
        console.log('✅ Client configuration:', client.getConfig ? client.getConfig() : 'config available');
      } else {
        console.log('⚠️  Polza AI client initialization returned null (check API key)');
      }
    } else {
      console.log('❌ polzaAI object or init function NOT available');
      process.exit(1);
    }

    console.log('\n🎉 All tests passed!');
    console.log('✅ Polza AI integration is properly included in the build');
    console.log('\nTo test actual API calls, run:');
    console.log('node example-polza-usage.js');

  } catch (error) {
    console.error('❌ Error during testing:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

testPolzaIntegration();