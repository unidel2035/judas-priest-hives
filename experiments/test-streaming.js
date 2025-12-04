#!/usr/bin/env node

/**
 * Test script for streaming functionality
 */

import { PolzaClient } from '../modern-cli/src/lib/polza-client.js';

async function testStreaming() {
  console.log('=== Testing Streaming Functionality ===\n');

  const apiKey = process.env.POLZA_API_KEY;
  if (!apiKey) {
    console.error('✗ POLZA_API_KEY environment variable is required');
    process.exit(1);
  }

  const client = new PolzaClient(apiKey);

  console.log('1. Testing non-streaming mode...');
  try {
    const response = await client.chat('Say hello in 5 words', {
      model: 'anthropic/claude-sonnet-4.5',
      stream: false,
    });
    console.log('✓ Non-streaming response:', response.choices[0].message.content);
    console.log();
  } catch (error) {
    console.error('✗ Non-streaming test failed:', error.message);
  }

  console.log('2. Testing streaming mode...');
  try {
    const response = await client.chat('Count from 1 to 5', {
      model: 'anthropic/claude-sonnet-4.5',
      stream: true,
    });

    process.stdout.write('✓ Streaming response: ');
    let fullText = '';

    for await (const chunk of response) {
      if (chunk.choices?.[0]?.delta?.content) {
        const text = chunk.choices[0].delta.content;
        process.stdout.write(text);
        fullText += text;
      }
    }

    console.log('\n');
    console.log('✓ Full streamed text:', fullText);
    console.log();
  } catch (error) {
    console.error('✗ Streaming test failed:', error.message);
  }

  console.log('=== All Tests Complete ===');
}

testStreaming().catch(console.error);
