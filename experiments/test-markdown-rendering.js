#!/usr/bin/env node

/**
 * Test script for markdown rendering
 * Tests the improved markdown renderer with various formatting scenarios
 */

import { renderMarkdown, hasMarkdown } from '../polza-cli/src/lib/markdown-renderer.js';

// Test cases based on the issue comment showing bad parsing
const testCases = [
  {
    name: 'Mixed nested list (from issue comment)',
    markdown: `Я только что показал содержимое текущей папки. Вот список снова:

Файлы:

    *   • \`.env.example\`

    *   • \`.gitignore\`

    *   • \`README.md\`

    *   • \`example.js\`

    *   • \`package.json\`

    *   • \`package-lock.json\`

    *   • \`test.js\`



Папки:




    *   • \`node_modules/\`

    *   • \`simple-server/\`

    *   • \`src/\`



Может, ты хочешь посмотреть содержимое какой-то конкретной папки? Например, \`src/\` или \`simple-server/\`?`
  },
  {
    name: 'Simple ordered list',
    markdown: `Here are the steps:

1. First step
2. Second step
3. Third step`
  },
  {
    name: 'Simple unordered list',
    markdown: `Features:

- Feature one
- Feature two
- Feature three`
  },
  {
    name: 'Nested lists',
    markdown: `Main items:

1. First main item
   - Sub item 1
   - Sub item 2
2. Second main item
   - Another sub item
   - Yet another sub item`
  },
  {
    name: 'Code blocks and inline code',
    markdown: `You can use \`inline code\` like this.

Or code blocks:

\`\`\`javascript
function hello() {
  console.log("Hello, world!");
}
\`\`\`

And more text after.`
  },
  {
    name: 'Headers and bold/italic',
    markdown: `# Main Header

This is **bold** text and *italic* text.

## Subheader

More content here with \`code\`.`
  },
  {
    name: 'Task lists',
    markdown: `Todo:

- [x] Completed task
- [ ] Pending task
- [ ] Another pending task`
  },
  {
    name: 'Links',
    markdown: `Check out [Polza AI](https://polza.ai) for more info.`
  },
  {
    name: 'Complex mixed content',
    markdown: `## Project Setup

Follow these steps:

1. Install dependencies
   \`\`\`bash
   npm install
   \`\`\`

2. Configure environment
   - Copy \`.env.example\` to \`.env\`
   - Set your **API key**

3. Run the project
   \`\`\`bash
   npm start
   \`\`\`

For more information, visit [the docs](https://docs.example.com).`
  }
];

console.log('='.repeat(80));
console.log('Markdown Rendering Tests');
console.log('='.repeat(80));
console.log();

testCases.forEach((testCase, index) => {
  console.log(`\n${'─'.repeat(80)}`);
  console.log(`Test ${index + 1}: ${testCase.name}`);
  console.log('─'.repeat(80));
  console.log('\nOriginal Markdown:');
  console.log('---');
  console.log(testCase.markdown);
  console.log('---');

  const hasMarkdownContent = hasMarkdown(testCase.markdown);
  console.log(`\nHas Markdown: ${hasMarkdownContent}`);

  if (hasMarkdownContent) {
    console.log('\nRendered Output:');
    console.log('┌' + '─'.repeat(78) + '┐');
    const rendered = renderMarkdown(testCase.markdown);
    rendered.split('\n').forEach(line => {
      console.log('│ ' + line.padEnd(77) + '│');
    });
    console.log('└' + '─'.repeat(78) + '┘');
  }
});

console.log('\n' + '='.repeat(80));
console.log('All tests completed');
console.log('='.repeat(80));
