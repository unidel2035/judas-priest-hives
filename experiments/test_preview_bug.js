#!/usr/bin/env node

/**
 * Test to demonstrate the preview cursor bug
 */

console.log("Testing preview cursor positioning bug...\n");

// Simulate the current implementation
function demonstrateBug() {
  console.log("=== Current Implementation (BUGGY) ===\n");

  console.log("Initial state:");
  console.log("Line 1: Input line");
  console.log("Line 2: (empty)");
  console.log("Line 3: (empty)");
  console.log("Line 4: (empty)");
  console.log("Line 5: (empty)");
  console.log("\n");

  const previewHeight = 5;

  console.log(`Clearing with previewHeight = ${previewHeight}:`);
  console.log("1. Write \\n → cursor moves from line 1 to line 2");
  console.log(`2. Loop ${previewHeight - 1} times (i=0 to ${previewHeight - 2}):`);

  let cursorLine = 2;
  for (let i = 0; i < previewHeight - 1; i++) {
    console.log(`   i=${i}: Clear line ${cursorLine}`);
    if (i < previewHeight - 2) {
      cursorLine++;
      console.log(`        Write \\n → cursor at line ${cursorLine}`);
    }
  }

  console.log(`3. Cursor is now at line ${cursorLine}`);
  console.log(`4. Move up ${previewHeight} lines: ${cursorLine} - ${previewHeight} = ${cursorLine - previewHeight}`);
  console.log(`   ⚠️ PROBLEM: Cursor is at line ${cursorLine - previewHeight}, which is ABOVE the input line!`);
  console.log("\n");
}

// Show the correct approach
function demonstrateCorrect() {
  console.log("=== Correct Implementation ===\n");

  const previewHeight = 5;

  console.log("Approach: Track actual cursor position");
  console.log("1. Start at input line (line 1)");
  console.log("2. Move down 1 line and clear (line 2)");
  console.log("3. For each additional preview line:");
  console.log("   - Move down 1 line");
  console.log("   - Clear that line");
  console.log(`4. After clearing ${previewHeight - 1} preview lines, cursor is at line ${previewHeight}`);
  console.log(`5. Move back up to input line: up ${previewHeight - 1} lines`);
  console.log("   ✅ CORRECT: Cursor is back at input line!");
  console.log("\n");

  console.log("Or simpler approach:");
  console.log("1. Save cursor position (at input line)");
  console.log("2. Move down and clear preview lines");
  console.log("3. Restore cursor to saved position");
  console.log("   ✅ CORRECT: Cursor is always at input line!");
}

demonstrateBug();
demonstrateCorrect();

console.log("\n=== The Real Problem ===");
console.log("The current code moves the cursor UP by MORE lines than it moved DOWN,");
console.log("causing the cursor to end up ABOVE the input line, which then causes");
console.log("the next write operations to affect the wrong lines!");
