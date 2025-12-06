/**
 * Tests for system prompts functionality
 * Run with: node tests/prompts.test.js
 */

import {
  getCoreSystemPrompt,
  getInteractivePrompt,
  getNonInteractivePrompt,
} from '../src/utils/prompts.js';

// Simple test framework
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  if (condition) {
    passedTests++;
    console.log(`  ✓ ${message}`);
  } else {
    failedTests++;
    console.log(`  ✗ ${message}`);
  }
}

function assertContains(text, substring, message) {
  assert(text.includes(substring), message);
}

function assertNotContains(text, substring, message) {
  assert(!text.includes(substring), message);
}

console.log('='.repeat(80));
console.log('SYSTEM PROMPTS TESTS');
console.log('='.repeat(80));

// Test 1: Interactive mode prompt
console.log('\nTest 1: Interactive Mode Prompt');
console.log('-'.repeat(40));
const interactivePrompt = getCoreSystemPrompt({ interactiveMode: true });
assertContains(interactivePrompt, 'interactive', 'Contains "interactive"');
assertContains(interactivePrompt, 'CLI agent', 'Contains "CLI agent"');
assertContains(interactivePrompt, 'User Approval', 'Contains "User Approval"');

// Test 2: Non-interactive mode prompt
console.log('\nTest 2: Non-Interactive Mode Prompt');
console.log('-'.repeat(40));
const nonInteractivePrompt = getCoreSystemPrompt({ interactiveMode: false });
assertContains(nonInteractivePrompt, 'non-interactive', 'Contains "non-interactive"');
assertContains(nonInteractivePrompt, 'CLI agent', 'Contains "CLI agent"');
assertNotContains(nonInteractivePrompt, 'User Approval', 'Does not contain "User Approval"');

// Test 3: YOLO mode warning
console.log('\nTest 3: YOLO Mode');
console.log('-'.repeat(40));
const yoloPrompt = getCoreSystemPrompt({ interactiveMode: true, yoloMode: true });
assertContains(yoloPrompt, 'YOLO mode', 'Contains "YOLO mode" warning');
assertContains(yoloPrompt, 'auto-approved', 'Mentions auto-approval');

const noYoloPrompt = getCoreSystemPrompt({ interactiveMode: true, yoloMode: false });
assertNotContains(noYoloPrompt, 'YOLO mode', 'Does not contain YOLO warning when disabled');

// Test 4: User memory
console.log('\nTest 4: User Memory');
console.log('-'.repeat(40));
const userMemory = 'User prefers TypeScript and TDD';
const promptWithMemory = getCoreSystemPrompt({ interactiveMode: true, userMemory });
assertContains(promptWithMemory, userMemory, 'Contains user memory');
assertContains(promptWithMemory, 'User-Specific Context', 'Has user context section');

const promptWithoutMemory = getCoreSystemPrompt({ interactiveMode: true, userMemory: '' });
assertNotContains(promptWithoutMemory, 'User-Specific Context', 'No user context section when empty');

// Test 5: Core sections
console.log('\nTest 5: Core Sections');
console.log('-'.repeat(40));
assertContains(interactivePrompt, 'Core Mandates', 'Has Core Mandates section');
assertContains(interactivePrompt, 'Primary Workflows', 'Has Primary Workflows section');
assertContains(interactivePrompt, 'Operational Guidelines', 'Has Operational Guidelines section');
assertContains(interactivePrompt, 'Final Reminder', 'Has Final Reminder section');

// Test 6: Workflow steps
console.log('\nTest 6: Workflow Steps');
console.log('-'.repeat(40));
assertContains(interactivePrompt, 'Understand Requirements', 'Has understand step');
assertContains(interactivePrompt, 'Propose Plan', 'Has propose plan step');
assertContains(interactivePrompt, '3. **User Approval', 'Has user approval as step 3');
assertContains(interactivePrompt, '4. **Implementation', 'Has implementation as step 4');
assertContains(interactivePrompt, 'Solicit Feedback', 'Has feedback step');

// Test 7: Technology preferences
console.log('\nTest 7: Technology Preferences');
console.log('-'.repeat(40));
assertContains(interactivePrompt, 'React', 'Mentions React');
assertContains(interactivePrompt, 'Next.js', 'Mentions Next.js');
assertContains(interactivePrompt, 'Node.js', 'Mentions Node.js');
assertContains(interactivePrompt, 'Python', 'Mentions Python');

// Test 8: Helper functions
console.log('\nTest 8: Helper Functions');
console.log('-'.repeat(40));
const helpInteractive = getInteractivePrompt(false);
assertContains(helpInteractive, 'interactive', 'getInteractivePrompt returns interactive mode');
assertContains(helpInteractive, 'User Approval', 'getInteractivePrompt includes user approval');

const helpNonInteractive = getNonInteractivePrompt();
assertContains(helpNonInteractive, 'non-interactive', 'getNonInteractivePrompt returns non-interactive mode');
assertNotContains(helpNonInteractive, 'User Approval', 'getNonInteractivePrompt excludes user approval');

// Test 9: Interaction differences
console.log('\nTest 9: Mode Differences');
console.log('-'.repeat(40));
assertContains(interactivePrompt, 'ask concise, targeted clarification questions', 'Interactive can ask questions');
assertContains(nonInteractivePrompt, 'Continue the work', 'Non-interactive continues autonomously');
assertContains(nonInteractivePrompt, 'avoid asking user for any additional information', 'Non-interactive avoids questions');

// Summary
console.log('\n' + '='.repeat(80));
console.log('TEST SUMMARY');
console.log('='.repeat(80));
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${failedTests}`);
console.log(`Total: ${passedTests + failedTests}`);

if (failedTests === 0) {
  console.log('\n✓ All tests passed!');
  process.exit(0);
} else {
  console.log(`\n✗ ${failedTests} test(s) failed`);
  process.exit(1);
}
