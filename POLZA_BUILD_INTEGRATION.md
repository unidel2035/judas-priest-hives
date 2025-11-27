# Polza AI Build Integration Guide

## Overview

This repository includes **automatic Polza AI integration** during the build process. When you set a `POLZA_API_KEY` environment variable in your `.env` file, the build system automatically includes a ready-to-use Polza AI client in the compiled output.

Polza AI (https://polza.ai) is an API aggregator that provides unified access to multiple LLM providers (OpenAI, Anthropic, Google, DeepSeek, etc.) through a single OpenAI-compatible interface, with billing in Russian Rubles.

## Quick Start

### 1. Set Up Your API Key

```bash
# Get your API key from https://polza.ai
# Add it to k_da/.env file
echo 'POLZA_API_KEY=ak_your_api_key_here' >> k_da/.env
```

### 2. Build the Project

```bash
cd k_da
bun build.js
# or
node build.js
```

**That's it!** The build script will automatically:
- ✅ Detect your Polza API key
- ✅ Include Polza AI client code in the build
- ✅ Configure it with your API key as default
- ✅ Make it available for immediate use

### 3. Verify Integration

Check the build output for confirmation:

```
Building k_da.js from split sources...

Loading .env file...
   → Loaded 21 environment variables from .env
Loading i18n locale data...
   → Polza AI integration detected - including client
   ...
✓ Polza AI integration included in build
```

## Configuration Options

### Environment Variables

Add these to your `k_da/.env` file to customize Polza AI behavior:

```bash
# Required: Your Polza AI API key
POLZA_API_KEY=ak_your_api_key_here

# Optional: Custom API base URL (default: https://api.polza.ai/api/v1)
POLZA_API_BASE=https://api.polza.ai/api/v1

# Optional: Default model to use
POLZA_DEFAULT_MODEL=anthropic/claude-sonnet-4.5

# Optional: Temperature for generation (0.0-2.0, default: 0.7)
POLZA_TEMPERATURE=0.7

# Optional: Maximum tokens for completions (default: 4096)
POLZA_MAX_TOKENS=4096

# Optional: Enable reasoning tokens for supported models (default: false)
POLZA_ENABLE_REASONING=false

# Optional: Reasoning effort level (low, medium, high)
POLZA_REASONING_EFFORT=high
```

### Available Models

| Provider | Model ID | Description |
|----------|----------|-------------|
| Anthropic | `anthropic/claude-sonnet-4.5` | Latest Claude Sonnet (recommended) |
| Anthropic | `anthropic/claude-3-5-sonnet` | Claude 3.5 Sonnet |
| OpenAI | `openai/gpt-4o` | GPT-4 Optimized |
| OpenAI | `openai/o1-preview` | O1 with reasoning |
| OpenAI | `openai/gpt-4o-mini` | GPT-4 Mini (cost-effective) |
| DeepSeek | `deepseek/deepseek-r1` | DeepSeek R1 with reasoning |
| Google | `google/gemini-pro` | Google Gemini Pro |

For a complete list, visit: https://api.polza.ai/api/v1/models

## Usage Examples

Once built with Polza AI integration, you can use it in your JavaScript code:

### Example 1: Simple Completion

```javascript
const { polzaAI } = require('./k_da.js');

// Initialize the client (automatically uses .env configuration)
const client = polzaAI.init();

if (client) {
  // Simple text completion
  const response = await polzaAI.complete('Explain quantum computing in simple terms');
  console.log(response);
}
```

### Example 2: Chat Completion

```javascript
const { polzaAI } = require('./k_da.js');

const client = polzaAI.init();

// Chat with message history
const chatResponse = await polzaAI.chat([
  { role: 'system', content: 'You are a helpful coding assistant.' },
  { role: 'user', content: 'How do I reverse a string in Python?' }
]);

console.log(chatResponse.choices[0].message.content);
```

### Example 3: Using Different Models

```javascript
const { polzaAI } = require('./k_da.js');

const client = polzaAI.init();

// Use GPT-4
const gpt4Response = await polzaAI.complete('Write a haiku about AI', {
  model: 'openai/gpt-4o',
  temperature: 0.9
});

// Use DeepSeek with reasoning
const deepseekResponse = await polzaAI.chat([
  { role: 'user', content: 'Solve this math problem: x^2 - 5x + 6 = 0' }
], {
  model: 'deepseek/deepseek-r1'
});
```

### Example 4: Streaming Responses

```javascript
const { PolzaAIClient } = require('./k_da.js');

const client = new PolzaAIClient({
  apiKey: process.env.POLZA_API_KEY
});

// Stream completion
for await (const chunk of client.streamComplete('Write a story about AI')) {
  process.stdout.write(chunk);
}
```

## Testing the Integration

### Run the Test Suite

A comprehensive test suite is included to verify Polza AI integration:

```bash
cd k_da/experiments
chmod +x test-polza-integration.mjs
node test-polza-integration.mjs
```

This will run 10 tests covering:
- ✅ Client initialization
- ✅ Model listing
- ✅ Simple completions
- ✅ Streaming
- ✅ Chat with history
- ✅ Cost tracking
- ✅ Different models
- ✅ Temperature control
- ✅ Error handling

### Run Example Usage

See working examples of Polza AI integration:

```bash
cd k_da
node example-polza-usage.js
```

## Build Modes

### Standard Build (Default)

```bash
bun build.js
```

Environment variables are set as **runtime fallbacks** using `process.env.VAR || "default"`. This allows you to override values at runtime.

### Inline Build

```bash
bun build.js --inline-env
```

Environment variables are **fully inlined** as string literals. Faster execution but no runtime environment access.

### Build Without Environment

```bash
bun build.js --no-env
```

Build without loading `.env` file. Polza AI integration will **not** be included unless `POLZA_API_KEY` is set in system environment.

## How It Works

The build process (`build.js`) automatically:

1. **Detects API Key**: Checks for `POLZA_API_KEY` in `.env` file
2. **Includes Client**: If found, injects full Polza AI client code
3. **Configures Defaults**: Sets environment variables as defaults
4. **Exports Interface**: Makes `polzaAI` helper available globally

### Client Code Structure

When built with Polza AI:

```javascript
// Included automatically in k_da.js:

class PolzaAIClient {
  constructor(config = {}) {
    // Loads from environment or runtime
    this.apiKey = config.apiKey || process.env.POLZA_API_KEY;
    // ...
  }

  async createChatCompletion(messages, options = {}) { /* ... */ }
  async listModels() { /* ... */ }
  async complete(prompt, options = {}) { /* ... */ }
}

const polzaAI = {
  client: null,
  init(config = {}) { /* Initialize client */ },
  complete(prompt, options = {}) { /* Simple completion */ },
  chat(messages, options = {}) { /* Chat completion */ }
};
```

## Benefits

### 🎯 Zero Configuration After Build
Once built with your API key, the client is ready to use immediately - no additional setup required.

### 💰 Cost Efficiency
- Billing in Russian Rubles (often cheaper)
- Detailed cost tracking in API responses
- Access to multiple providers at competitive rates

### 🔧 Provider Flexibility
- Easy switching between OpenAI, Anthropic, Google, etc.
- Fallback options if one provider is down
- Single API for all LLM needs

### 🚀 Advanced Features
- Reasoning tokens (O1, DeepSeek R1 models)
- Streaming responses via Server-Sent Events
- Function/tool calling support
- Multimodal (vision) capabilities
- Prompt caching for cost savings

### 🔒 OpenAI Compatible
- Drop-in replacement for OpenAI SDK
- Standard API format
- Easy migration from existing OpenAI code

## Security Best Practices

### 1. Never Commit API Keys

```bash
# Ensure .env is in .gitignore
echo '.env' >> .gitignore
```

### 2. Use Environment Variables in Production

```bash
# Set in production environment
export POLZA_API_KEY="ak_your_production_key"
```

### 3. Rotate Keys Regularly

Visit https://polza.ai/dashboard to manage and rotate your API keys.

### 4. Monitor Usage

Check your usage and costs at: https://polza.ai/dashboard

### 5. Set Rate Limits

Configure rate limits in your Polza AI dashboard to prevent unexpected costs.

## Troubleshooting

### Build doesn't include Polza AI

**Problem**: Build output shows `ℹ️  Polza AI integration not included`

**Solution**:
```bash
# Check if POLZA_API_KEY is set in .env
cat k_da/.env | grep POLZA_API_KEY

# If missing, add it:
echo 'POLZA_API_KEY=ak_your_key_here' >> k_da/.env

# Rebuild:
bun build.js
```

### "Polza AI client not initialized" Error

**Problem**: Runtime error when trying to use Polza AI

**Solution**:
```javascript
// Check if client is available before use
const client = polzaAI.init();
if (!client) {
  console.error('Polza AI not available. Set POLZA_API_KEY in .env and rebuild.');
  process.exit(1);
}
```

### 401 Unauthorized Error

**Problem**: API requests fail with 401 error

**Solution**:
1. Verify your API key is correct: https://polza.ai/dashboard
2. Check if key has been rotated or expired
3. Ensure no extra spaces in `.env` file

### 402 Payment Required Error

**Problem**: API requests fail with 402 error

**Solution**: Add funds to your Polza AI account at https://polza.ai/billing

### Rate Limit (429) Error

**Problem**: Too many requests in short time

**Solution**: Implement retry logic with exponential backoff:

```javascript
async function robustRequest(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.message.includes('429')) {
        const delay = Math.pow(2, i) * 1000;
        console.log(`Rate limited, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}

// Usage
const response = await robustRequest(() =>
  polzaAI.complete('Your prompt')
);
```

## Advanced Usage

### Custom Configuration

```javascript
const { PolzaAIClient } = require('./k_da.js');

// Create client with custom config
const customClient = new PolzaAIClient({
  apiKey: 'ak_custom_key',
  baseUrl: 'https://custom.api.url',
  model: 'anthropic/claude-sonnet-4.5',
  temperature: 0.8,
  maxTokens: 8192,
  enableReasoning: true,
  reasoningEffort: 'high'
});

const response = await customClient.complete('Your prompt');
```

### List All Available Models

```javascript
const { polzaAI } = require('./k_da.js');

const client = polzaAI.init();
const modelsResponse = await client.listModels();

modelsResponse.data.forEach(model => {
  console.log(`- ${model.id}: ${model.name || 'No description'}`);
});
```

### Cost Tracking

```javascript
const { polzaAI } = require('./k_da.js');

const client = polzaAI.init();

const response = await polzaAI.chat([
  { role: 'user', content: 'Write a short poem' }
]);

// Access usage statistics
console.log('Tokens used:', response.usage.total_tokens);
console.log('Prompt tokens:', response.usage.prompt_tokens);
console.log('Completion tokens:', response.usage.completion_tokens);
console.log('Cost (RUB):', response.usage.cost);

// Cached tokens (if using prompt caching)
if (response.usage.prompt_tokens_details?.cached_tokens) {
  console.log('Cached tokens:', response.usage.prompt_tokens_details.cached_tokens);
}

// Reasoning tokens (for O1/R1 models)
if (response.usage.completion_tokens_details?.reasoning_tokens) {
  console.log('Reasoning tokens:', response.usage.completion_tokens_details.reasoning_tokens);
}
```

## Resources

### Documentation
- **Polza AI Official Docs**: https://docs.polza.ai
- **API Reference**: https://docs.polza.ai/api-reference
- **Model Pricing**: https://polza.ai/pricing
- **Dashboard**: https://polza.ai/dashboard

### Examples in Repository
- `k_da/build.js` - Build script with Polza integration (lines 88-231)
- `k_da/POLZA_AI_INTEGRATION_GUIDE.md` - Detailed technical guide
- `k_da/experiments/test-polza-integration.mjs` - Comprehensive test suite
- `k_da/example-polza-usage.js` - Working usage examples
- `polza.txt` - Full API documentation

### Support
- **Polza AI Support**: support@polza.ai
- **Repository Issues**: https://github.com/judas-priest/hives/issues

## Contributing

To improve Polza AI integration:

1. Fork the repository
2. Create feature branch: `git checkout -b feature/polza-enhancement`
3. Make changes and test with `node experiments/test-polza-integration.mjs`
4. Submit pull request with clear description

## License

This integration follows the same license as the main project (Unlicense - public domain).

---

**Last Updated**: November 27, 2025
**Version**: 1.0.0
**Minimum Build Script Version**: build.js (lines 88-231 required)
