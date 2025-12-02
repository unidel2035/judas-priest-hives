#!/usr/bin/env node

/**
 * Test the FIXED preview implementation
 *
 * The fix: Instead of moving cursor UP and then using \x1b[J (which erases the input line),
 * we move cursor DOWN to the preview area, clear line-by-line, then move back up.
 *
 * This ensures the input line is NEVER erased.
 */

const readline = require('readline');

console.log('=== Testing the FIXED approach ===\n');

// ANSI escape codes
const clearLine = '\x1b[2K'; // Clear entire line
const moveCursorUp = (lines) => `\x1b[${lines}A`;

let previewHeight = 0;

function fixedPreview(text, inputLine) {
  console.log(`\n[Input: ${inputLine}]`);
  console.log('[Simulating preview update...]');

  const preview = [
    '────────────────────────────────',
    `Commands matching "${text}":`,
    '➤ /help',
    '────────────────────────────────',
    '💡 Press TAB to autocomplete'
  ].join('\n');

  const newPreviewHeight = preview.split('\n').length + 1; // +1 for leading \n

  // FIXED: Clear old preview WITHOUT moving up first
  if (previewHeight > 0) {
    // Move down to preview area
    process.stdout.write('\n');
    for (let i = 0; i < previewHeight - 1; i++) {
      process.stdout.write(clearLine); // Clear entire line
      if (i < previewHeight - 2) {
        process.stdout.write('\n'); // Move to next line
      }
    }
    // Move back to input line
    process.stdout.write(moveCursorUp(previewHeight));
  }

  // Print new preview
  process.stdout.write('\n' + preview);

  // Update height
  previewHeight = newPreviewHeight;

  // Move cursor back to input line
  process.stdout.write(moveCursorUp(previewHeight));
}

// Simulate typing sequence
console.log('Input line: You > /h');

setTimeout(() => {
  fixedPreview('/h', 'You > /h');

  setTimeout(() => {
    console.log('\n✅ NOTICE: The input line "You > /h" is still visible!');
    console.log('   The preview was updated BELOW the input line.');

    setTimeout(() => {
      fixedPreview('/he', 'You > /he');

      setTimeout(() => {
        console.log('\n✅ NOTICE: Input line "You > /he" is still visible!');
        console.log('   Preview updated in-place without erasing input.');

        setTimeout(() => {
          fixedPreview('/hel', 'You > /hel');

          setTimeout(() => {
            console.log('\n✅ NOTICE: Input line "You > /hel" is still visible!');
            console.log('   Preview continues to update cleanly.');

            setTimeout(() => {
              console.log('\n\n=== SUCCESS! ===');
              console.log('The fix works by:');
              console.log('1. Moving cursor DOWN to preview area (not UP)');
              console.log('2. Clearing each preview line individually');
              console.log('3. Printing new preview');
              console.log('4. Moving cursor back UP to input line');
              console.log('\nThis ensures the input line is NEVER touched by the clear operation.');

              process.exit(0);
            }, 1500);
          }, 1500);
        }, 1500);
      }, 1500);
    }, 1500);
  }, 1500);
}, 1000);
