/**
 * Clipboard utilities
 */

import { execSync } from 'child_process';
import { platform } from 'os';
import chalk from 'chalk';

/**
 * Copy text to clipboard
 */
export function copyToClipboard(text) {
  try {
    const os = platform();

    if (os === 'darwin') {
      // macOS
      execSync('pbcopy', { input: text });
    } else if (os === 'linux') {
      // Linux - try xclip first, then xsel
      try {
        execSync('xclip -selection clipboard', { input: text });
      } catch {
        execSync('xsel --clipboard --input', { input: text });
      }
    } else if (os === 'win32') {
      // Windows
      execSync('clip', { input: text });
    } else {
      throw new Error(`Unsupported platform: ${os}`);
    }

    return true;
  } catch (error) {
    console.error(chalk.red(`\n✗ Failed to copy to clipboard: ${error.message}`));
    console.error(chalk.gray('  Make sure clipboard utilities are installed:'));
    console.error(chalk.gray('  - Linux: xclip or xsel'));
    console.error(chalk.gray('  - macOS: pbcopy (built-in)'));
    console.error(chalk.gray('  - Windows: clip (built-in)\n'));
    return false;
  }
}

/**
 * Get text from clipboard
 */
export function getFromClipboard() {
  try {
    const os = platform();
    let text;

    if (os === 'darwin') {
      // macOS
      text = execSync('pbpaste', { encoding: 'utf-8' });
    } else if (os === 'linux') {
      // Linux - try xclip first, then xsel
      try {
        text = execSync('xclip -selection clipboard -o', { encoding: 'utf-8' });
      } catch {
        text = execSync('xsel --clipboard --output', { encoding: 'utf-8' });
      }
    } else if (os === 'win32') {
      // Windows - requires PowerShell
      text = execSync('powershell -command "Get-Clipboard"', { encoding: 'utf-8' });
    } else {
      throw new Error(`Unsupported platform: ${os}`);
    }

    return text;
  } catch (error) {
    console.error(chalk.red(`\n✗ Failed to read from clipboard: ${error.message}\n`));
    return null;
  }
}
