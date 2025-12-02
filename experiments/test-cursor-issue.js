#!/usr/bin/env node

/**
 * Test to demonstrate the "erasing every line" issue
 *
 * The problem: Current implementation moves cursor up, then clears from cursor to end.
 * This erases the input line!
 *
 * Demonstration of BROKEN approach (PR #81):
 * 1. User types "/h"
 * 2. Code moves cursor UP by previewHeight lines
 * 3. Code executes \x1b[J (clear from cursor to end)
 *    ^ THIS CLEARS THE INPUT LINE TOO!
 * 4. Preview is printed
 * 5. Result: Input line disappears
 */

const readline = require('readline');

console.log('=== Demonstrating the BROKEN approach ===\n');
console.log('Input line: You > /h');

let previewHeight = 0;

function brokenPreview(text) {
  console.log('\n[Simulating keypress for "' + text + '"]');

  // BROKEN: This is what PR #81 does
  if (previewHeight > 0) {
    process.stdout.write(`\x1b[${previewHeight}A`); // Move UP
  }

  process.stdout.write('\x1b[J'); // Clear from cursor to END
  // ^ THIS IS THE BUG! It clears the input line!

  const preview = [
    '────────────────────────────────',
    `Commands matching "${text}":`,
    '➤ /help',
    '────────────────────────────────'
  ].join('\n');

  process.stdout.write('\n' + preview);
  previewHeight = preview.split('\n').length + 1;
  process.stdout.write(`\x1b[${previewHeight}A`);
}

console.log('\nWatching what happens...\n');

setTimeout(() => {
  brokenPreview('/h');
  console.log('\n\n❌ NOTICE: The input line "You > /h" above was erased!');
  console.log('   This is because \\x1b[J cleared from cursor position to end.');
  console.log('   The cursor was moved UP, so it cleared the input line too!');

  setTimeout(() => {
    console.log('\n\n=== How to FIX this ===\n');
    console.log('Option 1: Clear line-by-line instead of "clear to end"');
    console.log('Option 2: Use separate tracking for input cursor vs preview cursor');
    console.log('Option 3: Only clear the preview area, not beyond it');
    console.log('\nLet\'s implement Option 3 (most reliable)...\n');

    process.exit(0);
  }, 2000);
}, 1000);
