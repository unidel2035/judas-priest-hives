#!/usr/bin/env node

/**
 * Simple example of using Polza AI integration in k_da.js
 * 
 * This demonstrates how to use the inlined Polza AI client
 * after building with POLZA_API_KEY set in .env
 */

console.log('🚀 Polza AI Integration Example\n');

// Import the built k_da.js (which now includes Polza AI)
const { polzaAI } = require('./k_da.js');

// Example usage functions
async function example1_simpleCompletion() {
  console.log('📝 Example 1: Simple completion');
  
  try {
    // Initialize Polza AI client (uses environment variables from build)
    const client = polzaAI.init();
    
    if (!client) {
      console.log('⚠️  Polza AI client not initialized (check POLZA_API_KEY)');
      return;
    }
    
    console.log('✅ Polza AI client initialized');
    
    // Simple completion
    const response = await polzaAI.complete('Привет! Как дела?', {
      model: 'anthropic/claude-sonnet-4.5'
    });
    
    console.log('🤖 Response:', response);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function example2_chatCompletion() {
  console.log('\n💬 Example 2: Chat completion');
  
  try {
    const client = polzaAI.init();
    
    if (!client) {
      console.log('⚠️  Polza AI client not initialized');
      return;
    }
    
    // Chat completion with multiple messages
    const chatResponse = await polzaAI.chat([
      { role: 'user', content: 'Объясни квантовую физику простыми словами' },
      { role: 'user', content: 'А теперь расскажи о квантовой запутанности' }
    ], {
      model: 'anthropic/claude-sonnet-4.5',
      temperature: 0.7
    });
    
    console.log('🤖 Chat Response:', chatResponse.choices[0].message.content);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function example3_listModels() {
  console.log('\n📋 Example 3: List available models');
  
  try {
    const client = polzaAI.init();
    
    if (!client) {
      console.log('⚠️  Polza AI client not initialized');
      return;
    }
    
    const models = await client.listModels();
    console.log('📊 Available models:', models.data?.slice(0, 5).map(m => m.id).join(', ') + '...');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Usage instructions
function showUsageInstructions() {
  console.log('\n📚 Usage Instructions:');
  console.log('====================');
  console.log('1. Set POLZA_API_KEY in your .env file');
  console.log('2. Run: bun build.js (will auto-include Polza AI)');
  console.log('3. Use this script or integrate into your app');
  console.log('\n💡 In your own code:');
  console.log(`
const { polzaAI } = require('./k_da.js');

// Initialize client
const client = polzaAI.init({
  model: 'openai/gpt-4o',  // or any other supported model
  temperature: 0.7
});

// Simple completion
const response = await polzaAI.complete('Your prompt here');

// Chat completion  
const chatResponse = await polzaAI.chat([
  { role: 'user', content: 'Your message' }
]);
  `);
  
  console.log('\n🔧 Available Models:');
  console.log('- anthropic/claude-sonnet-4.5 (Claude Sonnet 4.5)');
  console.log('- anthropic/claude-3-5-sonnet (Claude 3.5 Sonnet)');
  console.log('- openai/gpt-4o (GPT-4 Optimized)');
  console.log('- openai/o1-preview (O1 with reasoning)');
  console.log('- deepseek/deepseek-r1 (DeepSeek R1)');
  console.log('- google/gemini-pro (Gemini Pro)');
}

// Main execution
async function main() {
  showUsageInstructions();
  
  console.log('\n🧪 Running examples...\n');
  
  await example1_simpleCompletion();
  await example2_chatCompletion();  
  await example3_listModels();
  
  console.log('\n✨ Integration test completed!');
  console.log('\n💰 For billing and model management, visit: https://polza.ai/dashboard');
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { example1_simpleCompletion, example2_chatCompletion, example3_listModels };