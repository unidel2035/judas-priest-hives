#!/usr/bin/env node

/**
 * Test session saving functionality
 */

import { HistoryManager } from '../polza-cli/src/lib/history-manager.js';
import fs from 'fs/promises';
import path from 'path';

async function testSessionSaving() {
  console.log('Testing Session Saving Functionality\n');
  console.log('=====================================\n');

  const manager = new HistoryManager();

  // Test 1: Check directory initialization
  console.log('Test 1: Directory initialization');
  const configDir = manager.getConfigDir();
  console.log('  Config directory:', configDir);
  console.log('  Expected pattern: /.config/polza-cli');
  console.log('  Result:', configDir.includes('.config/polza-cli') ? '✓ PASS' : '✗ FAIL');
  console.log();

  // Test 2: Get session ID
  console.log('Test 2: Session ID generation');
  const sessionId = manager.getSessionId();
  console.log('  Session ID:', sessionId);
  console.log('  Starts with "session-":', sessionId.startsWith('session-'));
  console.log('  Result:', sessionId.startsWith('session-') ? '✓ PASS' : '✗ FAIL');
  console.log();

  // Test 3: Save session
  console.log('Test 3: Save session');
  const testHistory = [
    { role: 'user', content: 'Hello' },
    { role: 'assistant', content: 'Hi there!' }
  ];
  const sessionFile = await manager.saveSession(testHistory, { test: true });
  console.log('  Session file:', sessionFile);
  console.log('  File saved:', sessionFile !== null);
  console.log('  Result:', sessionFile !== null ? '✓ PASS' : '✗ FAIL');
  console.log();

  // Test 4: List sessions
  console.log('Test 4: List sessions');
  const sessions = await manager.listSessions();
  console.log('  Sessions found:', sessions.length);
  console.log('  Current session in list:', sessions.some(s => s.id === sessionId));
  console.log('  Result:', sessions.some(s => s.id === sessionId) ? '✓ PASS' : '✗ FAIL');
  console.log();

  // Test 5: Load session
  console.log('Test 5: Load session');
  const loadedSession = await manager.loadSession(sessionId);
  console.log('  Session loaded:', loadedSession !== null);
  console.log('  History length:', loadedSession?.history?.length);
  console.log('  First message:', loadedSession?.history?.[0]?.content);
  console.log('  Result:', loadedSession?.history?.length === 2 ? '✓ PASS' : '✗ FAIL');
  console.log();

  // Test 6: Save history
  console.log('Test 6: Save history');
  const historyFile = await manager.saveHistory(testHistory);
  console.log('  History file:', historyFile);
  console.log('  File saved:', historyFile !== null);
  console.log('  Result:', historyFile !== null ? '✓ PASS' : '✗ FAIL');
  console.log();

  // Test 7: Log chat interaction
  console.log('Test 7: Log chat interaction');
  await manager.logChat('user', 'Test message', { tokens: 10 });
  await manager.log('Test log entry');
  console.log('  Logging completed successfully');
  console.log('  Result: ✓ PASS');
  console.log();

  console.log('=====================================');
  console.log('Session saving tests completed!');
  console.log();
  console.log('Summary:');
  console.log('  Config Dir:', configDir);
  console.log('  Sessions Dir:', path.join(configDir, 'sessions'));
  console.log('  History Dir:', path.join(configDir, 'history'));
  console.log('  Logs Dir:', path.join(configDir, 'logs'));
}

testSessionSaving().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});
