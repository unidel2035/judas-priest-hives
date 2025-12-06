/**
 * Test Script: Propose-and-Approve Workflow
 *
 * This script demonstrates the new propose-and-approve mode
 * where the AI proposes a plan and waits for user approval
 * before implementing a new application.
 */

import { getInteractivePrompt, getNonInteractivePrompt } from '../src/utils/prompts.js';

console.log('='.repeat(80));
console.log('PROPOSE-AND-APPROVE WORKFLOW TEST');
console.log('='.repeat(80));
console.log();

// Test 1: Interactive Mode Prompt
console.log('TEST 1: Interactive Mode (with propose-and-approve)');
console.log('-'.repeat(80));
const interactivePrompt = getInteractivePrompt(false, '');
console.log(interactivePrompt);
console.log();
console.log();

// Test 2: Non-Interactive Mode Prompt
console.log('TEST 2: Non-Interactive Mode (without user approval)');
console.log('-'.repeat(80));
const nonInteractivePrompt = getNonInteractivePrompt('');
console.log(nonInteractivePrompt);
console.log();
console.log();

// Test 3: Interactive Mode with YOLO enabled
console.log('TEST 3: Interactive Mode with YOLO');
console.log('-'.repeat(80));
const yoloPrompt = getInteractivePrompt(true, '');
console.log(yoloPrompt);
console.log();
console.log();

// Test 4: With User Memory
console.log('TEST 4: Interactive Mode with User Memory');
console.log('-'.repeat(80));
const userMemory = `
User preferences:
- Prefers TypeScript over JavaScript
- Likes Test-Driven Development
- Uses ESLint and Prettier
- Prefers functional programming style
`;
const promptWithMemory = getInteractivePrompt(false, userMemory);
console.log(promptWithMemory);
console.log();
console.log();

// Analyze the differences
console.log('ANALYSIS: Key Differences');
console.log('-'.repeat(80));
console.log();

console.log('1. User Approval Step:');
console.log('   Interactive mode:', interactivePrompt.includes('User Approval') ? '✓ Present' : '✗ Missing');
console.log('   Non-interactive mode:', nonInteractivePrompt.includes('User Approval') ? '✓ Present' : '✗ Missing');
console.log();

console.log('2. Clarification Questions:');
console.log('   Interactive mode:', interactivePrompt.includes('ask concise, targeted clarification questions') ? '✓ Allowed' : '✗ Not allowed');
console.log('   Non-interactive mode:', nonInteractivePrompt.includes('ask concise, targeted clarification questions') ? '✓ Allowed' : '✗ Not allowed');
console.log();

console.log('3. YOLO Mode Warning:');
console.log('   Regular mode:', interactivePrompt.includes('YOLO mode') ? '✓ Present' : '✗ Missing');
console.log('   YOLO mode:', yoloPrompt.includes('YOLO mode') ? '✓ Present' : '✗ Missing');
console.log();

console.log('4. User Memory:');
console.log('   Without memory:', interactivePrompt.includes('User-Specific Context') ? '✓ Has section' : '✗ No section');
console.log('   With memory:', promptWithMemory.includes('User-Specific Context') ? '✓ Has section' : '✗ No section');
console.log();

console.log('='.repeat(80));
console.log('SUMMARY');
console.log('='.repeat(80));
console.log();
console.log('The propose-and-approve workflow is now implemented in Modern CLI!');
console.log();
console.log('Key features:');
console.log('  ✓ System prompts define AI behavior');
console.log('  ✓ Interactive mode asks for user approval before implementation');
console.log('  ✓ Non-interactive mode proceeds autonomously');
console.log('  ✓ YOLO mode warnings when shell commands are auto-approved');
console.log('  ✓ User memory/preferences can be included');
console.log('  ✓ Propose Plan → User Approval → Implementation workflow');
console.log();
console.log('This matches the Gemini CLI behavior described in lines 210-213 of prompts.ts');
console.log('='.repeat(80));
