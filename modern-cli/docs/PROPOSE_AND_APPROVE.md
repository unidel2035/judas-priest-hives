# Propose-and-Approve Workflow

## Overview

Modern CLI now implements a **propose-and-approve workflow** similar to Gemini CLI's approach, where the AI proposes a detailed plan and waits for user approval before implementing new applications or complex features.

This feature addresses Issue #147 and brings parity with Gemini CLI's intelligent planning behavior described in `gemini-cli/packages/core/src/core/prompts.ts` (lines 210-213).

## How It Works

### For New Application Requests

When you ask the AI to create a new application, it follows this structured workflow:

1. **Understand Requirements**
   - Analyzes your request to identify core features
   - Identifies the application type (web, mobile, desktop, CLI, etc.)
   - Determines the desired user experience and visual aesthetic
   - Asks clarification questions if critical information is missing

2. **Propose Plan**
   - Formulates an internal development plan
   - Presents a clear, high-level summary including:
     - Application type and core purpose
     - Key technologies to be used
     - Main features and user interactions
     - Visual design approach
     - Strategy for visual assets/placeholders

3. **User Approval** ⭐ *This is the key feature*
   - **Waits for your approval** before proceeding
   - You can:
     - ✅ Approve the plan
     - ❌ Reject and suggest changes
     - 💬 Ask questions or request modifications
   - Only proceeds after you give explicit approval

4. **Implementation**
   - Autonomously implements each feature per the approved plan
   - Scaffolds the application (npm init, create-react-app, etc.)
   - Creates necessary files and implements features
   - Aims for full scope completion

5. **Verify**
   - Reviews work against the approved plan
   - Fixes bugs and ensures quality
   - Builds the application and checks for errors
   - Ensures styling and interactions are polished

6. **Solicit Feedback**
   - Provides instructions on how to start the application
   - Requests your feedback on the prototype

### For Software Engineering Tasks

For bug fixes and feature additions, the workflow is similar but more streamlined:

1. **Understand** - Analyzes the codebase and request
2. **Plan** - Shares a concise plan if helpful
3. **Implement** - Makes the changes
4. **Verify (Tests)** - Runs tests
5. **Verify (Standards)** - Runs linters and type-checkers
6. **Finalize** - Awaits next instruction

## Interactive vs Non-Interactive Mode

### Interactive Mode (Default)

In interactive mode:
- AI **proposes plans** and **waits for approval**
- Can ask **clarification questions** when needed
- Respects user control and confirmation
- Suitable for exploratory work and complex projects

### Non-Interactive Mode

In non-interactive mode:
- AI **proceeds autonomously** without waiting for approval
- Does **not ask questions** - uses best judgment
- Suitable for batch processing or automated workflows
- Activated with specific flags (check CLI docs)

## Example Session

```bash
$ hcli
You > Create a todo app with React and local storage

Assistant > I'll create a React-based todo application. Here's my proposed plan:

**Application Type:** Web application (React SPA)

**Key Technologies:**
- React 18 with functional components and hooks
- Tailwind CSS for styling
- Local Storage API for data persistence
- Vite for build tooling

**Main Features:**
1. Add new todos with text input
2. Mark todos as complete/incomplete
3. Delete todos
4. Filter todos (All, Active, Completed)
5. Persist todos in browser local storage
6. Clean, modern UI with responsive design

**Visual Design:**
- Clean, minimal interface inspired by Material Design
- Card-based layout for todo items
- Color-coded status (gray for pending, green for complete)
- Smooth transitions and hover effects

**Implementation Approach:**
1. Initialize Vite + React project
2. Create TodoList, TodoItem, and TodoInput components
3. Implement state management with useState and useEffect
4. Add local storage hooks for persistence
5. Style with Tailwind CSS
6. Test in browser and fix any issues

Does this plan look good to you? Would you like any changes before I proceed?

You > Looks great, go ahead!

Assistant > [Proceeds with implementation...]
```

## Why This Matters

### User Control
✅ You maintain oversight on the AI's approach
✅ Can course-correct before implementation begins
✅ Avoid wasted effort on wrong approaches

### Technology Choices
✅ Review framework/library selections upfront
✅ Suggest alternatives before code is written
✅ Ensure alignment with project requirements

### Architectural Decisions
✅ Discuss architecture before committing
✅ Validate design patterns early
✅ Make informed decisions collaboratively

### Iterative Refinement
✅ Refine the plan through discussion
✅ Add or remove features before implementation
✅ Clarify requirements and expectations

## Configuration

The propose-and-approve workflow is **enabled by default** in interactive mode.

### System Prompts

The behavior is defined by system prompts in `src/utils/prompts.js`:

- `getInteractivePrompt()` - Includes user approval step
- `getNonInteractivePrompt()` - Skips user approval step
- `getCoreSystemPrompt()` - Core prompt generator with customization

### User Memory

You can provide user-specific preferences that will be included in the system prompt:

```javascript
import { getInteractivePrompt } from './utils/prompts.js';

const userMemory = `
- Prefers TypeScript over JavaScript
- Uses TDD (Test-Driven Development)
- Follows Airbnb style guide
`;

const prompt = getInteractivePrompt(false, userMemory);
client.setSystemPrompt(prompt);
```

## Testing

Run the test suite to verify the propose-and-approve workflow:

```bash
# Run comprehensive tests
node tests/prompts.test.js

# Run demo/experiment
node experiments/test-propose-and-approve.js
```

## Implementation Details

### Files Modified

1. **`src/utils/prompts.js`** (NEW)
   - Core system prompt generation
   - Interactive vs non-interactive modes
   - User memory integration

2. **`src/lib/polza-client.js`**
   - Added `setSystemPrompt()` method
   - Added `getSystemPrompt()` method
   - Added `_buildMessagesWithSystem()` helper
   - System prompts prepended to all requests

3. **`src/lib/kodacode-client.js`**
   - Same changes as polza-client for consistency
   - Both clients now support system prompts

4. **`src/interactive.js`**
   - Imports and sets system prompt on startup
   - Includes user memory from context manager

5. **`src/non-interactive.js`**
   - Sets non-interactive system prompt
   - No user approval required

### Tests

- **`tests/prompts.test.js`** - 32 comprehensive tests
- **`experiments/test-propose-and-approve.js`** - Interactive demo

## Comparison with Gemini CLI

The implementation is **directly inspired** by Gemini CLI's approach:

| Feature | Gemini CLI | Modern CLI |
|---------|-----------|------------|
| Propose Plan | ✅ | ✅ |
| User Approval | ✅ | ✅ |
| Technology Preferences | ✅ | ✅ |
| Clarification Questions | ✅ | ✅ |
| System Prompts | ✅ TypeScript | ✅ JavaScript |
| Interactive vs Non-Interactive | ✅ | ✅ |
| User Memory | ✅ | ✅ |

**Reference:** `gemini-cli/packages/core/src/core/prompts.ts`, lines 210-213:

```typescript
3. **User Approval:** Obtain user approval for the proposed plan.
4. **Implementation:** Autonomously implement each feature and design
   element per the approved plan...
```

Modern CLI now implements this exact workflow!

## Future Enhancements

Potential improvements for future versions:

1. **Plan Templates** - Pre-defined plans for common application types
2. **Plan Saving** - Save approved plans for reuse
3. **Plan Diff** - Show changes when modifying a plan
4. **Voice Approval** - Voice commands for plan approval
5. **Visual Plan Preview** - Rich formatting for plan presentation

## Troubleshooting

### AI Not Waiting for Approval

- Check that you're in interactive mode (not non-interactive)
- Verify system prompts are loaded correctly
- Check client implementation has `setSystemPrompt()` method

### Prompts Not Working

- Ensure you've imported from `src/utils/prompts.js`
- Verify the client is setting the prompt: `client.setSystemPrompt(prompt)`
- Check console logs for any errors during initialization

### Tests Failing

```bash
# Run tests with verbose output
node tests/prompts.test.js

# Check specific failing test
# Tests will show ✓ or ✗ for each assertion
```

## Contributing

To modify the propose-and-approve workflow:

1. Edit `src/utils/prompts.js`
2. Update tests in `tests/prompts.test.js`
3. Run tests: `node tests/prompts.test.js`
4. Update this documentation
5. Submit PR with clear description

## References

- **Issue:** https://github.com/judas-priest/hives/issues/147
- **Gemini CLI Source:** `gemini-cli/packages/core/src/core/prompts.ts`
- **Modern CLI Prompts:** `src/utils/prompts.js`
- **Tests:** `tests/prompts.test.js`
- **Demo:** `experiments/test-propose-and-approve.js`

---

**Last Updated:** 2025-12-06

**Status:** ✅ Implemented and Tested
