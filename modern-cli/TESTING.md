# Modern CLI Testing Guide

This document describes how to test the Modern CLI and verify all features are working correctly.

## Quick Start

```bash
cd modern-cli
npm install
export POLZA_API_KEY=your_api_key_here
node src/index.js
```

## Feature Testing Checklist

### ✅ Tab Autocomplete

1. **Test slash commands:**
   ```
   Type: /
   Press: Tab
   Expected: Shows all commands (/help, /exit, /quit, etc.)
   ```

2. **Test fuzzy filtering:**
   ```
   Type: /h
   Press: Tab
   Expected: Shows only /help and /history with 'h' highlighted
   ```

3. **Test @ file completion (the bug that was fixed):**
   ```
   Type: @
   Press: Tab
   Expected: Shows available files (should NOT crash!)
   ```

4. **Test @ file with pattern:**
   ```
   Type: @src
   Press: Tab
   Expected: Shows files in src/ directory
   ```

### ✅ Streaming

1. **Default streaming mode:**
   ```
   You > Hello, how are you?
   Expected: Response appears character-by-character
   ```

2. **Toggle streaming:**
   ```
   You > /stream
   Expected: "✓ Streaming: DISABLED"

   You > /stream
   Expected: "✓ Streaming: ENABLED"
   ```

### ✅ Fuzzy Search

1. **Command fuzzy matching:**
   ```
   Type: /hlp
   Press: Tab
   Expected: Matches and shows /help with highlighting
   ```

2. **Visual highlighting:**
   - When Tab shows completions, matching characters should be highlighted
   - Highlighting color: Yellow/bright for matches, dim for non-matches

### ✅ File Inclusion

1. **Include text file:**
   ```
   You > @README.md What is this project about?
   Expected: AI reads and responds about README content
   ```

2. **Include multiple files:**
   ```
   You > Compare @file1.js and @file2.js
   Expected: AI reads both files and compares them
   ```

### ✅ Image Analysis (Multimodal)

```
You > @screenshot.png What do you see in this image?
Expected: AI analyzes the image and describes it
```

Supported formats: PNG, JPG, JPEG, GIF, BMP, WEBP, SVG

### ✅ Commands

| Command | Description | Test |
|---------|-------------|------|
| `/help` | Show help | Should display all commands |
| `/exit` | Exit CLI | Should exit cleanly |
| `/clear` | Clear screen | Should clear terminal |
| `/history` | Show history | Should show command history |
| `/reset` | Clear conversation | Should reset conversation |
| `/version` | Show version | Should display version info |
| `/model` | Change model | Should list/change models |
| `/yolo` | Toggle YOLO mode | Should enable/disable shell commands |
| `/stream` | Toggle streaming | Should enable/disable streaming |
| `/tools` | Show tools | Should list available tools |
| `/save` | Save session | Should save to file |
| `/load` | Load session | Should load from file |
| `/sessions` | List sessions | Should show saved sessions |

### ✅ Ctrl+C Handling

1. **Single Ctrl+C:**
   ```
   Press: Ctrl+C once
   Expected: Shows "(To exit, press Ctrl+C again or type /exit)"
   Expected: CLI continues running
   ```

2. **Double Ctrl+C:**
   ```
   Press: Ctrl+C twice within 2 seconds
   Expected: "👋 Goodbye!"
   Expected: CLI exits cleanly
   ```

### ✅ Error Handling

1. **Invalid command:**
   ```
   You > /invalid
   Expected: Shows error message, does not crash
   ```

2. **Invalid file:**
   ```
   You > @nonexistent.txt What's in this file?
   Expected: Shows error about file not found, does not crash
   ```

3. **Tab on invalid path:**
   ```
   Type: @invalid/path/
   Press: Tab
   Expected: Falls back gracefully, does not crash
   ```

## Automated Tests

Run the included test suites:

### 1. Tab Completion Tests
```bash
node test-tab-completion.js
```

Expected output:
- ✓ All fuzzy matching tests pass
- ✓ Completer tests pass
- ✓ No crashes on @ completion

### 2. Comprehensive Feature Tests
```bash
node verify-all-features.js
```

Expected output:
- ✓ 20 tests pass
- ✓ All file structures correct
- ✓ All dependencies installed
- ✓ All core functionality verified

## Common Issues

### Issue: "Cannot find module 'chalk'"
**Solution:** Run `npm install` in the modern-cli directory

### Issue: "Polza API error: 401"
**Solution:** Set your API key: `export POLZA_API_KEY=your_key_here`

### Issue: Tab completion shows nothing
**Solution:** Make sure you're in a directory with files. Type `@README.md` and press Tab.

### Issue: Streaming not working
**Solution:**
1. Check that streaming is enabled: Type `/stream` to toggle
2. Verify API key has streaming permissions
3. Check network connection

## Performance Notes

- **Streaming delay:** 1ms per character for smooth visual effect
- **Autocomplete max:** Shows up to 20 completions
- **History size:** Keeps last 100 commands
- **File search depth:** 2 levels deep for @ completion

## Success Criteria

All features should work without:
- ❌ Application crashes
- ❌ Unhandled exceptions
- ❌ Readline errors
- ❌ API errors (except when API is actually down)
- ❌ Tab completion freezes

All features should work with:
- ✅ Smooth streaming
- ✅ Fast Tab completion
- ✅ Clear error messages
- ✅ Graceful degradation
- ✅ Clean exit on Ctrl+C

## Reporting Issues

If you find any bugs:
1. Note the exact steps to reproduce
2. Copy any error messages
3. Check if the test suites pass
4. Report in the GitHub issue

---

**Last Updated:** 2025-12-04
**Version:** 1.0.0
