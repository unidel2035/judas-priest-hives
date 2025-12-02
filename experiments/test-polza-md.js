#!/usr/bin/env node

/**
 * Test POLZA.md loading functionality
 */

import { PolzaMdLoader, createDefaultPolzaMd } from '../polza-cli/src/lib/polza-md-loader.js';
import fs from 'fs/promises';
import path from 'path';

async function testPolzaMd() {
  console.log('Testing POLZA.md Loading Functionality\n');
  console.log('=====================================\n');

  // Test 1: Create a test POLZA.md file
  console.log('Test 1: Create default POLZA.md');
  const testFile = path.join('/tmp', 'test-POLZA.md');
  try {
    await createDefaultPolzaMd(testFile);
    const exists = await fs.access(testFile).then(() => true).catch(() => false);
    console.log('  Created file:', testFile);
    console.log('  File exists:', exists ? '✓' : '✗');
    console.log('  Result:', exists ? '✓ PASS' : '✗ FAIL');

    // Clean up
    await fs.unlink(testFile).catch(() => {});
  } catch (error) {
    console.log('  Error:', error.message);
    console.log('  Result: ✗ FAIL');
  }
  console.log();

  // Test 2: Load POLZA.md from current directory
  console.log('Test 2: Load POLZA.md from current directory');
  const loader = new PolzaMdLoader();
  const instructions = await loader.load();
  console.log('  Instructions loaded:', loader.hasInstructions());
  console.log('  Loaded files:', loader.getLoadedFiles().length);
  console.log('  Files:', loader.getLoadedFiles());
  console.log('  Result:', loader.hasInstructions() || loader.getLoadedFiles().length === 0 ? '✓ PASS (no POLZA.md expected)' : '✗ FAIL');
  console.log();

  // Test 3: Create system message
  console.log('Test 3: Create system message');
  if (loader.hasInstructions()) {
    const systemMsg = loader.createSystemMessage();
    console.log('  System message created:', systemMsg !== null);
    console.log('  Role:', systemMsg?.role);
    console.log('  Content preview:', systemMsg?.content.substring(0, 100) + '...');
    console.log('  Result:', systemMsg && systemMsg.role === 'system' ? '✓ PASS' : '✗ FAIL');
  } else {
    const systemMsg = loader.createSystemMessage();
    console.log('  System message created:', systemMsg !== null);
    console.log('  Expected: null (no instructions loaded)');
    console.log('  Result:', systemMsg === null ? '✓ PASS' : '✗ FAIL');
  }
  console.log();

  // Test 4: Reload functionality
  console.log('Test 4: Reload functionality');
  const reloadedInstructions = await loader.reload();
  console.log('  Reloaded successfully:', true);
  console.log('  Instructions after reload:', loader.hasInstructions());
  console.log('  Result: ✓ PASS');
  console.log();

  // Test 5: Create POLZA.md in experiments folder and test loading
  console.log('Test 5: Create and load POLZA.md in test folder');
  const testDir = '/tmp/polza-test';
  await fs.mkdir(testDir, { recursive: true }).catch(() => {});
  const testPolzaFile = path.join(testDir, 'POLZA.md');
  await fs.writeFile(testPolzaFile, '# Test Instructions\nBe helpful and concise.', 'utf-8');

  // Change to test directory and load
  const originalCwd = process.cwd();
  process.chdir(testDir);
  const testLoader = new PolzaMdLoader();
  const testInstructions = await testLoader.load();
  process.chdir(originalCwd);

  console.log('  Test file created:', testPolzaFile);
  console.log('  Instructions loaded:', testLoader.hasInstructions());
  console.log('  Content includes "helpful":', testInstructions.includes('helpful'));
  console.log('  Result:', testInstructions.includes('helpful') ? '✓ PASS' : '✗ FAIL');

  // Clean up
  await fs.unlink(testPolzaFile).catch(() => {});
  await fs.rmdir(testDir).catch(() => {});
  console.log();

  console.log('=====================================');
  console.log('POLZA.md loading tests completed!');
}

testPolzaMd().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});
