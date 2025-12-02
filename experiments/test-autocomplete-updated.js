#!/usr/bin/env node

/**
 * Test updated autocomplete functionality
 */

import { createCompleter } from '../polza-cli/src/lib/autocomplete.js';

async function testAutocompleteUpdated() {
  console.log('Testing Updated Autocomplete Functionality\n');
  console.log('=====================================\n');

  const completer = createCompleter([]);

  // Test 1: /init command completion
  console.log('Test 1: /init command completion');
  const [hits1, partial1] = await completer('/in');
  console.log('  Input: "/in"');
  console.log('  Completions:', hits1);
  console.log('  Expected: ["/init"]');
  console.log('  Result:', hits1.includes('/init') ? '✓ PASS' : '✗ FAIL');
  console.log();

  // Test 2: /memory show subcommand
  console.log('Test 2: /memory show subcommand completion');
  const [hits2, partial2] = await completer('/memory sh');
  console.log('  Input: "/memory sh"');
  console.log('  Completions:', hits2);
  console.log('  Expected: ["show"]');
  console.log('  Result:', hits2.includes('show') ? '✓ PASS' : '✗ FAIL');
  console.log();

  // Test 3: /memory refresh subcommand
  console.log('Test 3: /memory refresh subcommand completion');
  const [hits3, partial3] = await completer('/memory re');
  console.log('  Input: "/memory re"');
  console.log('  Completions:', hits3);
  console.log('  Expected: ["refresh", "reload", "remove"]');
  console.log('  Result:', (hits3.includes('refresh') && hits3.includes('reload')) ? '✓ PASS' : '✗ FAIL');
  console.log();

  // Test 4: Full /init completion
  console.log('Test 4: Full /init command');
  const [hits4, partial4] = await completer('/init');
  console.log('  Input: "/init"');
  console.log('  Completions:', hits4);
  console.log('  Expected: ["/init"]');
  console.log('  Result:', hits4.includes('/init') ? '✓ PASS' : '✗ FAIL');
  console.log();

  console.log('=====================================');
  console.log('Updated autocomplete tests completed!');
}

testAutocompleteUpdated().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});
