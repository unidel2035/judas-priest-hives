#!/usr/bin/env node

/**
 * Binary entry point for polza-tui
 * This wrapper ensures tsx is used to properly handle JSX files
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const tuiFile = join(__dirname, 'tui.js');

// Run with tsx
const child = spawn('npx', ['tsx', tuiFile], {
	stdio: 'inherit',
	shell: true
});

child.on('exit', (code) => {
	process.exit(code || 0);
});
