/**
 * Custom Commands System - TOML-based workflow automation
 * Similar to Gemini CLI's custom command system
 */

import fs from 'fs/promises';
import path from 'path';
import { existsSync, readdirSync } from 'fs';
import os from 'os';
import chalk from 'chalk';
import TOML from 'toml';
import { execSync } from 'child_process';

const GLOBAL_COMMANDS_DIR = path.join(os.homedir(), '.hives-cli', 'commands');
const PROJECT_COMMANDS_DIR = path.join(process.cwd(), '.hives', 'commands');

/**
 * Custom Commands Manager
 */
export class CustomCommandsManager {
  constructor() {
    this.commands = new Map();
    this.loadedPaths = [];
  }

  /**
   * Load all custom commands (global + project)
   */
  async loadCommands() {
    this.commands.clear();
    this.loadedPaths = [];

    // Load global commands first
    await this.loadCommandsFromDirectory(GLOBAL_COMMANDS_DIR, 'global');

    // Load project commands (override global if same name)
    await this.loadCommandsFromDirectory(PROJECT_COMMANDS_DIR, 'project');

    return this.commands.size;
  }

  /**
   * Load commands from a directory
   */
  async loadCommandsFromDirectory(dir, scope) {
    if (!existsSync(dir)) {
      return;
    }

    try {
      await this.scanDirectory(dir, dir, scope);
    } catch (error) {
      console.error(chalk.yellow(`⚠️  Failed to load ${scope} commands: ${error.message}`));
    }
  }

  /**
   * Recursively scan directory for TOML files
   */
  async scanDirectory(baseDir, currentDir, scope, namespace = '') {
    try {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);

        if (entry.isDirectory()) {
          // Create namespace from directory structure
          const newNamespace = namespace ? `${namespace}:${entry.name}` : entry.name;
          await this.scanDirectory(baseDir, fullPath, scope, newNamespace);
        } else if (entry.isFile() && entry.name.endsWith('.toml')) {
          // Load TOML command file
          await this.loadCommandFile(fullPath, scope, namespace);
        }
      }
    } catch (error) {
      // Ignore directory access errors
    }
  }

  /**
   * Load a single TOML command file
   */
  async loadCommandFile(filePath, scope, namespace) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const config = TOML.parse(content);

      // Command name from filename (without .toml extension)
      const baseName = path.basename(filePath, '.toml');
      const commandName = namespace ? `${namespace}:${baseName}` : baseName;

      // Validate required fields
      if (!config.prompt) {
        console.error(chalk.yellow(`⚠️  Command ${commandName} missing 'prompt' field`));
        return;
      }

      this.commands.set(commandName, {
        name: commandName,
        prompt: config.prompt,
        description: config.description || 'No description provided',
        scope,
        filePath,
        namespace,
      });

      this.loadedPaths.push(filePath);
    } catch (error) {
      console.error(chalk.yellow(`⚠️  Failed to load command ${filePath}: ${error.message}`));
    }
  }

  /**
   * Execute a custom command
   */
  async executeCommand(commandName, args = '') {
    const command = this.commands.get(commandName);

    if (!command) {
      return null;
    }

    let prompt = command.prompt;

    // Replace {{args}} placeholder
    prompt = prompt.replace(/\{\{args\}\}/g, args);

    // Process shell command injection !{...}
    const shellRegex = /!\{([^}]+)\}/g;
    const shellMatches = [...prompt.matchAll(shellRegex)];

    for (const match of shellMatches) {
      const shellCmd = match[1];
      try {
        const output = execSync(shellCmd, {
          encoding: 'utf-8',
          cwd: process.cwd(),
          timeout: 10000, // 10 second timeout
        }).trim();
        prompt = prompt.replace(match[0], output);
      } catch (error) {
        console.error(chalk.yellow(`⚠️  Shell command failed: ${shellCmd}`));
        console.error(chalk.gray(`   ${error.message}`));
        prompt = prompt.replace(match[0], `[Error executing: ${shellCmd}]`);
      }
    }

    return prompt;
  }

  /**
   * Get command by name
   */
  getCommand(name) {
    return this.commands.get(name);
  }

  /**
   * List all available commands
   */
  listCommands() {
    if (this.commands.size === 0) {
      console.log(chalk.gray('\n  No custom commands available.\n'));
      console.log(chalk.cyan('💡 Tips:'));
      console.log(chalk.gray('  - Create commands in ~/.hives-cli/commands/ (global)'));
      console.log(chalk.gray('  - Or in .hives/commands/ (project-specific)'));
      console.log(chalk.gray('  - Use TOML format with "prompt" and "description" fields\n'));
      return;
    }

    console.log(chalk.cyan.bold('\n🔧 Custom Commands:\n'));

    // Group by scope
    const globalCommands = [];
    const projectCommands = [];

    for (const [name, cmd] of this.commands) {
      if (cmd.scope === 'global') {
        globalCommands.push({ name, ...cmd });
      } else {
        projectCommands.push({ name, ...cmd });
      }
    }

    if (globalCommands.length > 0) {
      console.log(chalk.green('  Global Commands:'));
      for (const cmd of globalCommands.sort((a, b) => a.name.localeCompare(b.name))) {
        console.log(`    ${chalk.cyan(`/${cmd.name}`.padEnd(25))} ${chalk.gray(cmd.description)}`);
      }
      console.log();
    }

    if (projectCommands.length > 0) {
      console.log(chalk.green('  Project Commands:'));
      for (const cmd of projectCommands.sort((a, b) => a.name.localeCompare(b.name))) {
        console.log(`    ${chalk.cyan(`/${cmd.name}`.padEnd(25))} ${chalk.gray(cmd.description)}`);
      }
      console.log();
    }

    console.log(chalk.dim(`  Total: ${this.commands.size} commands\n`));
  }

  /**
   * Show detailed information about a command
   */
  showCommandInfo(commandName) {
    const command = this.commands.get(commandName);

    if (!command) {
      console.log(chalk.red(`\n✗ Command not found: ${commandName}\n`));
      return;
    }

    console.log(chalk.cyan.bold(`\n📝 Command: ${commandName}\n`));
    console.log(chalk.green('  Description:'));
    console.log(`    ${chalk.gray(command.description)}\n`);
    console.log(chalk.green('  Scope:'));
    console.log(`    ${chalk.gray(command.scope)}\n`);
    console.log(chalk.green('  File:'));
    console.log(`    ${chalk.gray(command.filePath)}\n`);
    console.log(chalk.green('  Prompt Template:'));
    console.log(chalk.gray('    ' + command.prompt.split('\n').join('\n    ')));
    console.log();
  }

  /**
   * Check if a command exists
   */
  hasCommand(name) {
    return this.commands.has(name);
  }

  /**
   * Get all command names (for autocomplete)
   */
  getCommandNames() {
    return Array.from(this.commands.keys());
  }
}

/**
 * Create example command files
 */
export async function createExampleCommands(scope = 'global') {
  const baseDir = scope === 'global' ? GLOBAL_COMMANDS_DIR : PROJECT_COMMANDS_DIR;

  try {
    await fs.mkdir(baseDir, { recursive: true });

    // Example 1: Simple commit message generator
    const commitExample = `# Git Commit Message Generator
description = "Generate a git commit message based on changes"
prompt = """
Generate a concise git commit message for the following changes:

{{args}}

Follow conventional commits format (feat:, fix:, docs:, etc.)
"""
`;

    // Example 2: Code review command
    const reviewExample = `# Code Review Assistant
description = "Review code changes and provide feedback"
prompt = """
Review the following code changes and provide feedback:

Changes: {{args}}

Please check for:
- Code quality and best practices
- Potential bugs or issues
- Performance considerations
- Security concerns
"""
`;

    // Example 3: Documentation generator
    const docsExample = `# Documentation Generator
description = "Generate documentation for code"
prompt = """
Generate comprehensive documentation for the following code:

{{args}}

Include:
- Overview and purpose
- Parameters and return values
- Usage examples
- Edge cases and considerations
"""
`;

    // Example 4: Shell command with injection
    const gitStatusExample = `# Git Status Summary
description = "Summarize current git status"
prompt = """
Current git status:

!{git status --short}

Please summarize the changes and suggest next steps.
"""
`;

    await fs.writeFile(path.join(baseDir, 'commit.toml'), commitExample);
    await fs.writeFile(path.join(baseDir, 'review.toml'), reviewExample);
    await fs.writeFile(path.join(baseDir, 'docs.toml'), docsExample);
    await fs.writeFile(path.join(baseDir, 'gitstatus.toml'), gitStatusExample);

    // Create namespaced example in subdirectory
    const gitDir = path.join(baseDir, 'git');
    await fs.mkdir(gitDir, { recursive: true });

    const gitCommitExample = `# Git Commit Helper
description = "Help write better commit messages"
prompt = """
Help me write a commit message. Current changes:

!{git diff --cached}

Suggest a commit message following best practices.
"""
`;

    await fs.writeFile(path.join(gitDir, 'commit.toml'), gitCommitExample);

    console.log(chalk.green(`\n✓ Created example commands in:`));
    console.log(chalk.gray(`  ${baseDir}\n`));
    console.log(chalk.cyan('Example commands:'));
    console.log(chalk.gray('  /commit - Generate commit message'));
    console.log(chalk.gray('  /review - Code review assistant'));
    console.log(chalk.gray('  /docs - Generate documentation'));
    console.log(chalk.gray('  /gitstatus - Git status summary'));
    console.log(chalk.gray('  /git:commit - Git commit helper (namespaced)\n'));

    return true;
  } catch (error) {
    console.log(chalk.red(`\n✗ Failed to create example commands:`));
    console.log(chalk.gray(`  ${error.message}\n`));
    return false;
  }
}
