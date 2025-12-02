#!/usr/bin/env node

/**
 * Test autocomplete functionality
 */

import { createCompleter } from '../polza-cli/src/lib/autocomplete.js';

async function testAutocomplete() {
  console.log('Testing Autocomplete Functionality\n');
  console.log('=====================================\n');

  // Create completer with custom commands
  const customCommands = ['test', 'generate'];
  const completer = createCompleter(customCommands);

  // Test 1: Command completion
  console.log('Test 1: Command completion for "/he"');
  const [hits1, partial1] = await completer('/he');
  console.log('  Input: "/he"');
  console.log('  Completions:', hits1);
  console.log('  Partial:', partial1);
  console.log('  Expected: ["/help"]');
  console.log('  Result:', hits1.includes('/help') ? '✓ PASS' : '✗ FAIL');
  console.log();

  // Test 2: Command completion with multiple matches
  console.log('Test 2: Command completion for "/s"');
  const [hits2, partial2] = await completer('/s');
  console.log('  Input: "/s"');
  console.log('  Completions:', hits2);
  console.log('  Expected: ["/settings", "/sessions", "/save"]');
  console.log('  Result:', hits2.includes('/settings') && hits2.includes('/sessions') && hits2.includes('/save') ? '✓ PASS' : '✗ FAIL');
  console.log();

  // Test 3: Memory subcommand completion
  console.log('Test 3: Subcommand completion for "/memory l"');
  const [hits3, partial3] = await completer('/memory l');
  console.log('  Input: "/memory l"');
  console.log('  Completions:', hits3);
  console.log('  Expected: ["list"]');
  console.log('  Result:', hits3.includes('list') ? '✓ PASS' : '✗ FAIL');
  console.log();

  // Test 4: File completion for @
  console.log('Test 4: File completion for "@pac"');
  const [hits4, partial4] = await completer('@pac');
  console.log('  Input: "@pac"');
  console.log('  Completions:', hits4);
  console.log('  Partial:', partial4);
  console.log('  Expected: Should find pac/ directory and pac_*.txt files');
  console.log('  Result:', hits4.length > 0 ? '✓ PASS' : '✗ FAIL');
  console.log();

  // Test 5: File completion for directory
  console.log('Test 5: File completion for "@polza"');
  const [hits5, partial5] = await completer('@polza');
  console.log('  Input: "@polza"');
  console.log('  Completions:', hits5);
  console.log('  Expected: Should find polza-cli/ directory');
  console.log('  Result:', hits5.some(h => h.includes('polza-cli')) ? '✓ PASS' : '✗ FAIL');
  console.log();

  // Test 6: Custom command completion
  console.log('Test 6: Custom command completion for "/te"');
  const [hits6, partial6] = await completer('/te');
  console.log('  Input: "/te"');
  console.log('  Completions:', hits6);
  console.log('  Expected: ["/test"]');
  console.log('  Result:', hits6.includes('/test') ? '✓ PASS' : '✗ FAIL');
  console.log();

  console.log('=====================================');
  console.log('Autocomplete tests completed!');
}

testAutocomplete().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});
