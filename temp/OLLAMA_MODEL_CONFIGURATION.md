# Ollama Model Configuration Journey

## The Problem

We needed to configure an LLM for the Danish car marketplace assistant that:
1. **Supports Ollama tool calling** (database search, web search, market stats)
2. **Runs on 4GB VRAM** (RTX 3070 gaming laptop for demos)
3. **Doesn't hallucinate** car listing data
4. **Provides reliable, accurate responses**

## What We Learned (The Hard Way)

### ❌ Models That DON'T Support Tools in Ollama

Despite what you might expect, these models **cannot use Ollama tools**:

- `phi3:mini` - Error: "does not support tools"
- `gemma:2b` - No tool support
- `llama3.1:8b` - No tool support
- **Any quantization-specific tags** like:
  - `mistral:7b-instruct-q3_K_S` ❌
  - `mistral:7b-instruct-q2_K` ❌
  - `mistral:7b-instruct-q4_K_M` ❌

### ✅ Models That DO Support Tools

Only **base model tags** support tool calling:

- `mistral` ✅ (7B params, ~4-5GB VRAM)
- `phi4-mini` ✅ (14B params, ~8GB VRAM)

## The Solution

### Final Configuration

```typescript
// Optimized for RTX 3070 (4GB VRAM) with tool support
const MODEL_NAME = 'mistral';
const USE_GPU = true;
const NUM_CTX = 16384;      // Reduced from 32K to fit in 4GB VRAM
const NUM_PREDICT = 2048;   // Reasonable response length
const NUM_GPU_LAYERS = 999; // Use all available GPU layers
```

### Why This Works

1. **Base `mistral` tag** - Ollama automatically uses the best quantization for your GPU
2. **Reduced context window** - 16K instead of 32K prevents OOM errors on 4GB VRAM
3. **Tool support** - Full access to database, web search, and market stats
4. **Good quality** - 7B params is enough for Danish car market expertise

## Setup Instructions

### 1. Install Ollama
```bash
# Download from https://ollama.com
```

### 2. Pull the Model
```bash
ollama pull mistral
```

### 3. Verify It Works
```bash
ollama list
# Should show: mistral:latest
```

### 4. Start Your Server
```bash
cd server
npm run dev
```

## Troubleshooting

### "Model does not support tools" Error

**Cause:** Using a quantization-specific tag or unsupported model.

**Fix:** Use base `mistral` tag only:
```bash
ollama rm mistral:7b-instruct-q3_K_S  # Remove wrong version
ollama pull mistral                    # Pull correct version
```

### Out of Memory (OOM) Errors

**Cause:** 4GB VRAM is tight for 7B models.

**Option 1 - Reduce context further:**
```typescript
const NUM_CTX = 8192;   // Half the context
const NUM_PREDICT = 1024;
```

**Option 2 - Use CPU (slower but reliable):**
```typescript
const USE_GPU = false;
```

### Model Hallucinating Data

**Cause:** Not using tools, generating fake listings.

**Fix:** Ensure you're using `mistral` (base tag) with tool support. Check logs for:
```
[LLM STREAM] tool calls detected
```

## Alternative Models (If You Have More VRAM)

### For 8GB+ VRAM

```bash
ollama pull phi4-mini
```

```typescript
const MODEL_NAME = 'phi4-mini';
const NUM_CTX = 16384;
const NUM_PREDICT = 4096;  // Can generate longer responses
```

**Benefits:**
- Better quality (14B params vs 7B)
- Still has full tool support
- More context-aware responses

**Drawbacks:**
- Requires 8GB+ VRAM
- Slower inference

## Key Takeaways

1. **Only use base model tags** for Ollama tool calling
2. **Quantization tags break tools** - Ollama handles quantization automatically
3. **4GB VRAM is tight** - Reduce context window to 16K or use CPU
4. **Mistral is the sweet spot** for 4GB VRAM demos with tools
5. **Always verify tool calls** in server logs to ensure no hallucination

## Testing Tool Usage

Send a query and check server logs:

```bash
# Should see these logs:
[LLM STREAM] tool calls detected
[LLM STREAM] executing tools...
[DATABASE] Query: { manufacturer: "BMW", model: "3 Series" }
[LLM STREAM] tool result length: 1234
```

If you don't see tool calls, the model is hallucinating!

## Resources

- Ollama Library: https://ollama.com/library
- Mistral Model: https://ollama.com/library/mistral
- Phi4-Mini Model: https://ollama.com/library/phi4-mini
- Tool Calling Docs: https://github.com/ollama/ollama/blob/main/docs/api.md#tools

---

**Last Updated:** December 2024  
**Configuration:** RTX 3070 (4GB VRAM), Mistral 7B, Tool Calling Enabled
