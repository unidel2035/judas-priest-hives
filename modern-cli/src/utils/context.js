/**
 * Context File System - HIVES.md hierarchical context loading
 * Similar to Gemini CLI's GEMINI.md system
 */

import fs from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';
import os from 'os';
import chalk from 'chalk';

const CONTEXT_FILE_NAME = 'HIVES.md';
const GLOBAL_CONTEXT_DIR = path.join(os.homedir(), '.hives-cli');
const GLOBAL_CONTEXT_FILE = path.join(GLOBAL_CONTEXT_DIR, CONTEXT_FILE_NAME);

/**
 * Context manager class
 */
export class ContextManager {
  constructor() {
    this.contexts = [];
    this.customMemory = [];
  }

  /**
   * Load all context files from current directory up to root and global
   */
  async loadContextFiles(currentDir = process.cwd()) {
    this.contexts = [];
    const loadedFiles = [];

    // 1. Load global context file
    if (existsSync(GLOBAL_CONTEXT_FILE)) {
      try {
        const content = await fs.readFile(GLOBAL_CONTEXT_FILE, 'utf-8');
        this.contexts.push({
          type: 'global',
          path: GLOBAL_CONTEXT_FILE,
          content: await this.processIncludes(content, path.dirname(GLOBAL_CONTEXT_FILE)),
        });
        loadedFiles.push(GLOBAL_CONTEXT_FILE);
      } catch (error) {
        console.error(chalk.yellow(`⚠️  Failed to load global context: ${error.message}`));
      }
    }

    // 2. Load project-level contexts (from current directory up to root)
    const projectContexts = await this.findProjectContexts(currentDir);
    for (const contextPath of projectContexts) {
      try {
        const content = await fs.readFile(contextPath, 'utf-8');
        this.contexts.push({
          type: 'project',
          path: contextPath,
          content: await this.processIncludes(content, path.dirname(contextPath)),
        });
        loadedFiles.push(contextPath);
      } catch (error) {
        console.error(chalk.yellow(`⚠️  Failed to load project context ${contextPath}: ${error.message}`));
      }
    }

    // 3. Load subdirectory contexts (scan subdirectories)
    const subDirContexts = await this.findSubdirectoryContexts(currentDir);
    for (const contextPath of subDirContexts) {
      try {
        const content = await fs.readFile(contextPath, 'utf-8');
        this.contexts.push({
          type: 'subdirectory',
          path: contextPath,
          content: await this.processIncludes(content, path.dirname(contextPath)),
        });
        loadedFiles.push(contextPath);
      } catch (error) {
        console.error(chalk.yellow(`⚠️  Failed to load subdirectory context ${contextPath}: ${error.message}`));
      }
    }

    return loadedFiles;
  }

  /**
   * Find project context files from current directory up to root
   */
  async findProjectContexts(startDir) {
    const contexts = [];
    let currentDir = path.resolve(startDir);
    const root = path.parse(currentDir).root;

    while (currentDir !== root) {
      const contextPath = path.join(currentDir, CONTEXT_FILE_NAME);
      if (existsSync(contextPath)) {
        contexts.unshift(contextPath); // Add to beginning so parent contexts come first
      }

      const parentDir = path.dirname(currentDir);
      if (parentDir === currentDir) break; // Reached root
      currentDir = parentDir;
    }

    return contexts;
  }

  /**
   * Find context files in subdirectories (one level deep)
   */
  async findSubdirectoryContexts(startDir) {
    const contexts = [];
    try {
      const entries = await fs.readdir(startDir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory() && !entry.name.startsWith('.')) {
          const contextPath = path.join(startDir, entry.name, CONTEXT_FILE_NAME);
          if (existsSync(contextPath)) {
            contexts.push(contextPath);
          }
        }
      }
    } catch (error) {
      // Ignore errors (permission denied, etc.)
    }

    return contexts;
  }

  /**
   * Process @file.md includes in context files
   */
  async processIncludes(content, baseDir) {
    const includeRegex = /@([^\s]+\.(md|txt|json))/g;
    let processedContent = content;
    const matches = [...content.matchAll(includeRegex)];

    for (const match of matches) {
      const fileName = match[1];
      const filePath = path.resolve(baseDir, fileName);

      if (existsSync(filePath)) {
        try {
          const includeContent = await fs.readFile(filePath, 'utf-8');
          processedContent = processedContent.replace(match[0], includeContent);
        } catch (error) {
          console.error(chalk.yellow(`⚠️  Failed to include ${fileName}: ${error.message}`));
        }
      }
    }

    return processedContent;
  }

  /**
   * Get combined context as a single string
   */
  getCombinedContext() {
    let combined = '';

    // Add all file contexts
    for (const context of this.contexts) {
      combined += `\n<!-- Context from ${context.type}: ${context.path} -->\n`;
      combined += context.content;
      combined += '\n';
    }

    // Add custom memory items
    if (this.customMemory.length > 0) {
      combined += '\n<!-- Custom Memory -->\n';
      for (const memory of this.customMemory) {
        combined += `- ${memory}\n`;
      }
    }

    return combined.trim();
  }

  /**
   * Add custom memory item
   */
  addMemory(text) {
    this.customMemory.push({
      text,
      timestamp: new Date().toISOString(),
    });
    this.saveCustomMemory();
  }

  /**
   * Save custom memory to global config
   */
  async saveCustomMemory() {
    const memoryFile = path.join(GLOBAL_CONTEXT_DIR, 'memory.json');
    try {
      await fs.mkdir(GLOBAL_CONTEXT_DIR, { recursive: true });
      await fs.writeFile(memoryFile, JSON.stringify(this.customMemory, null, 2));
    } catch (error) {
      console.error(chalk.yellow(`⚠️  Failed to save memory: ${error.message}`));
    }
  }

  /**
   * Load custom memory from global config
   */
  async loadCustomMemory() {
    const memoryFile = path.join(GLOBAL_CONTEXT_DIR, 'memory.json');
    if (existsSync(memoryFile)) {
      try {
        const data = await fs.readFile(memoryFile, 'utf-8');
        this.customMemory = JSON.parse(data);
      } catch (error) {
        console.error(chalk.yellow(`⚠️  Failed to load memory: ${error.message}`));
      }
    }
  }

  /**
   * Show loaded context summary
   */
  showContextSummary() {
    if (this.contexts.length === 0 && this.customMemory.length === 0) {
      console.log(chalk.gray('\n  No context files loaded.\n'));
      return;
    }

    console.log(chalk.cyan.bold('\n📝 Loaded Context:\n'));

    for (const context of this.contexts) {
      const typeLabel = context.type.charAt(0).toUpperCase() + context.type.slice(1);
      console.log(`  ${chalk.green(`[${typeLabel}]`.padEnd(18))} ${chalk.gray(context.path)}`);
      const lines = context.content.split('\n').length;
      console.log(`    ${chalk.dim(`${lines} lines`)}`);
    }

    if (this.customMemory.length > 0) {
      console.log(`\n  ${chalk.green('[Memory]'.padEnd(18))} ${chalk.gray(`${this.customMemory.length} custom items`)}`);
    }

    console.log();
  }

  /**
   * List all context file paths
   */
  listContextPaths() {
    console.log(chalk.cyan.bold('\n📂 Context File Locations:\n'));

    console.log(chalk.green('  Global:'));
    console.log(`    ${chalk.gray(GLOBAL_CONTEXT_FILE)}`);
    console.log(`    ${chalk.dim(existsSync(GLOBAL_CONTEXT_FILE) ? '✓ Exists' : '✗ Not found')}`);

    console.log(chalk.green('\n  Project (hierarchy):'));
    if (this.contexts.filter(c => c.type === 'project').length > 0) {
      for (const context of this.contexts.filter(c => c.type === 'project')) {
        console.log(`    ${chalk.gray(context.path)} ${chalk.dim('✓')}`);
      }
    } else {
      console.log(`    ${chalk.dim('No project context files found')}`);
    }

    console.log(chalk.green('\n  Subdirectories:'));
    if (this.contexts.filter(c => c.type === 'subdirectory').length > 0) {
      for (const context of this.contexts.filter(c => c.type === 'subdirectory')) {
        console.log(`    ${chalk.gray(context.path)} ${chalk.dim('✓')}`);
      }
    } else {
      console.log(`    ${chalk.dim('No subdirectory context files found')}`);
    }

    console.log();
  }
}

/**
 * Create a default HIVES.md file
 */
export async function createDefaultHivesFile(targetDir = process.cwd()) {
  const hivesPath = path.join(targetDir, CONTEXT_FILE_NAME);

  if (existsSync(hivesPath)) {
    console.log(chalk.yellow(`\n⚠️  ${CONTEXT_FILE_NAME} already exists at:`));
    console.log(chalk.gray(`   ${hivesPath}\n`));
    return false;
  }

  const template = `# Project Context for Hives Modern CLI

## Project Overview
<!-- Describe your project here -->

## Coding Guidelines
<!-- Add your coding standards, conventions, and best practices -->

## Architecture
<!-- Document your project's architecture and key components -->

## Important Notes
<!-- Add any important reminders or context for the AI -->

## Custom Instructions
<!-- Add specific instructions for AI assistance -->

---
This file provides persistent context to the Hives Modern CLI.
The AI will read this file automatically when working in this directory.
`;

  try {
    await fs.writeFile(hivesPath, template);
    console.log(chalk.green(`\n✓ Created ${CONTEXT_FILE_NAME} at:`));
    console.log(chalk.gray(`  ${hivesPath}\n`));
    console.log(chalk.cyan('💡 Tips:'));
    console.log(chalk.gray('  - Edit this file to add project-specific context'));
    console.log(chalk.gray('  - Use @filename.md to include other markdown files'));
    console.log(chalk.gray('  - Use /memory show to see loaded context'));
    console.log(chalk.gray('  - The AI automatically reads this file in this directory\n'));
    return true;
  } catch (error) {
    console.log(chalk.red(`\n✗ Failed to create ${CONTEXT_FILE_NAME}:`));
    console.log(chalk.gray(`  ${error.message}\n`));
    return false;
  }
}
