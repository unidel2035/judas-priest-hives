#!/usr/bin/env node

/**
 * Test shell command functionality
 */

import { processPrompt, hasSpecialSyntax } from '../polza-cli/src/lib/prompt-processor.js';

async function testShellCommands() {
  console.log('Testing Shell Command Functionality\n');
  console.log('=====================================\n');

  // Test 1: Direct shell command syntax !ls
  console.log('Test 1: Direct shell command "!ls -la"');
  const test1 = await processPrompt('Show files: !ls -la', true);
  console.log('  Input: "Show files: !ls -la"');
  console.log('  YOLO mode: true');
  console.log('  Commands executed:', test1.metadata.shellCommands.length);
  console.log('  Success:', test1.metadata.shellCommands[0]?.success ? '✓' : '✗');
  console.log('  Result:', test1.metadata.shellCommands.length > 0 ? '✓ PASS' : '✗ FAIL');
  console.log();

  // Test 2: Braced shell command syntax !{...}
  console.log('Test 2: Braced shell command "!{pwd}"');
  const test2 = await processPrompt('Current dir: !{pwd}', true);
  console.log('  Input: "Current dir: !{pwd}"');
  console.log('  YOLO mode: true');
  console.log('  Commands executed:', test2.metadata.shellCommands.length);
  console.log('  Success:', test2.metadata.shellCommands[0]?.success ? '✓' : '✗');
  console.log('  Result:', test2.metadata.shellCommands.length > 0 ? '✓ PASS' : '✗ FAIL');
  console.log();

  // Test 3: Multiple shell commands
  console.log('Test 3: Multiple shell commands "!pwd and !whoami"');
  const test3 = await processPrompt('Show !pwd and !whoami', true);
  console.log('  Input: "Show !pwd and !whoami"');
  console.log('  YOLO mode: true');
  console.log('  Commands executed:', test3.metadata.shellCommands.length);
  console.log('  Expected: 2 commands');
  console.log('  Result:', test3.metadata.shellCommands.length === 2 ? '✓ PASS' : '✗ FAIL');
  console.log();

  // Test 4: Shell command with YOLO mode off
  console.log('Test 4: Shell command with YOLO mode off');
  const test4 = await processPrompt('Show files: !ls', false);
  console.log('  Input: "Show files: !ls"');
  console.log('  YOLO mode: false');
  console.log('  Commands executed:', test4.metadata.shellCommands.length);
  console.log('  Errors:', test4.metadata.errors.length);
  console.log('  Expected: Error about YOLO mode not enabled');
  console.log('  Result:', test4.metadata.errors.some(e => e.type === 'shell_disabled') ? '✓ PASS' : '✗ FAIL');
  console.log();

  // Test 5: Check special syntax detection
  console.log('Test 5: Special syntax detection');
  const has1 = hasSpecialSyntax('!ls -la');
  const has2 = hasSpecialSyntax('@file.js');
  const has3 = hasSpecialSyntax('normal text');
  console.log('  hasSpecialSyntax("!ls -la"):', has1);
  console.log('  hasSpecialSyntax("@file.js"):', has2);
  console.log('  hasSpecialSyntax("normal text"):', has3);
  console.log('  Result:', (has1 && has2 && !has3) ? '✓ PASS' : '✗ FAIL');
  console.log();

  // Test 6: Shell command with arguments
  console.log('Test 6: Shell command with arguments "!echo Hello World"');
  const test6 = await processPrompt('Test: !echo "Hello World"', true);
  console.log('  Input: "Test: !echo "Hello World""');
  console.log('  YOLO mode: true');
  console.log('  Commands executed:', test6.metadata.shellCommands.length);
  console.log('  Output includes "Hello":', test6.prompt.includes('Hello'));
  console.log('  Result:', test6.metadata.shellCommands.length > 0 && test6.prompt.includes('Hello') ? '✓ PASS' : '✗ FAIL');
  console.log();

  console.log('=====================================');
  console.log('Shell command tests completed!');
}

testShellCommands().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});
