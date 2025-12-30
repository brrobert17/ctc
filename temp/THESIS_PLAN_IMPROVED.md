# Improved Bachelor Thesis Documentation Plan
## LLM Integration in Web Applications: A Car Trading Companion Case Study

**Target:** 15+ pages (36,000+ characters)
**Current Draft Analysis:** Your plan covers the journey well but needs more depth, theory, and academic grounding.

---

## SECTION 1: Inspiration and Context (2-3 pages)

### 1.1 Introduction to AI Assistants in Modern Applications
**Expand to include:**
- Evolution of conversational AI (2010-2024)
- Industry adoption statistics (Gartner, McKinsey reports)
- User expectations shaped by ChatGPT, Claude, Gemini

**Academic Sources:**
- Brown et al. (2020). "Language Models are Few-Shot Learners" - GPT-3 paper establishing modern LLM capabilities
- Vaswani et al. (2017). "Attention is All You Need" - Transformer architecture foundation
- Wei et al. (2022). "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models"

### 1.2 Problem Definition
**Add detail on:**
- Why traditional search is insufficient for car trading
- Information asymmetry in used car markets (Akerlof's "Market for Lemons" - 1970)
- Role of AI in reducing buyer uncertainty
- Danish market specifics (regulations, taxes, registration requirements)

**Research needed:**
- Used car market size in Denmark (Statistics Denmark - Danmarks Statistik)
- Consumer pain points in car purchasing (survey data if available)

### 1.3 Use Case Justification
**Strengthen with:**
- Comparison: Rule-based systems vs LLM-based solutions
- Technical feasibility analysis (hardware constraints, model selection)
- Business value proposition (user engagement, conversion rates)

---

## SECTION 2: Research & Theoretical Foundation (4-5 pages)

### 2.1 Large Language Model Architecture
**Deep dive into:**
- Transformer architecture fundamentals (attention mechanism, encoder-decoder)
- Pre-training vs fine-tuning paradigms
- Parameter scaling and emergent abilities (Kaplan et al., 2020 - Scaling Laws)

**Academic Sources:**
- Bommasani et al. (2021). "On the Opportunities and Risks of Foundation Models" - Stanford HAI report
- Zhao et al. (2023). "A Survey of Large Language Models" - Comprehensive LLM overview

### 2.2 Local LLM Deployment
**Compare approaches:**
- Cloud APIs (OpenAI, Anthropic, Google) - costs, latency, privacy
- Local inference (Ollama, llama.cpp, vLLM) - benefits and constraints
- Hybrid architectures

**Technical considerations:**
- GPU vs CPU inference performance
- Memory requirements (4-bit, 8-bit quantization)
- VRAM optimization for consumer hardware

**Sources:**
- Frantar et al. (2023). "GPTQ: Accurate Post-Training Quantization for Generative Pre-trained Transformers"
- Dettmers et al. (2023). "QLoRA: Efficient Finetuning of Quantized LLMs"

### 2.3 Model Selection Criteria
**Document your decision process:**

| Model | Parameters | VRAM | Tool Support | Danish Language | Your Choice |
|-------|-----------|------|--------------|-----------------|-------------|
| Mistral 7B | 7B | 4-5GB | ✅ Yes | Good | ✅ SELECTED |
| Phi-4-mini | 14B | 8GB | ✅ Yes | Good | Rejected (VRAM) |
| Llama 3.1 8B | 8B | 5-6GB | ❌ No | Excellent | Rejected (no tools) |

**Your findings:** Only base model tags support Ollama tool calling - critical discovery!

### 2.4 Tool Use / Function Calling
**Theoretical foundation:**
- ReAct paradigm (Yao et al., 2022) - Reasoning and Acting framework
- Toolformer paper (Schick et al., 2023) - Self-taught tool use
- Your implementation: Ollama tool specification format

**Research:**
- Effectiveness of tool-augmented LLMs (Qin et al., 2023 - "Tool Learning with Foundation Models")
- Hallucination reduction through grounding (Ji et al., 2023 - Survey on Hallucination)

### 2.5 Prompt Engineering (4Ts Framework)
**Expand your 4Ts:**
- **Trait:** Expert car trading advisor personality
- **Target:** Danish used car buyers/sellers
- **Tone:** Professional, honest, data-driven
- **Task:** Research, advise, identify deals/red flags

**Academic backing:**
- Liu et al. (2023). "Pre-train, Prompt, and Predict: A Systematic Survey of Prompting Methods"
- Reynolds & McDonell (2021). "Prompt Programming for Large Language Models"

### 2.6 Context Management
**Detail your system prompt design:**
```
Your 83-line system prompt includes:
- Role definition
- Danish market expertise
- Tool availability awareness
- Critical instruction: LLM MUST call tools (not explain them to users)
```

**Why this matters:** Prevents tool syntax leakage to end users

---

## SECTION 3: Architecture & Implementation (4-5 pages)

### 3.1 System Architecture Overview
**Document your full stack:**

```
Frontend (React + TypeScript)
    ↓ HTTP/SSE
Backend (Express + TypeScript)
    ↓ HTTP API
Ollama (Local LLM Server)
    ↓ Model: Mistral 7B
PostgreSQL Database (Cars)
```

**Design decisions:**
- Why Express over FastAPI, Flask, etc.
- TypeScript benefits for LLM integration
- Separation of concerns (router → service → external APIs)

### 3.2 Server-Sent Events (SSE) for Streaming
**Technical deep dive:**

**Why SSE over WebSockets?**
- Unidirectional (server→client) - perfect for LLM token streaming
- Native browser support (EventSource API / Fetch)
- Automatic reconnection
- Lower overhead than WebSocket

**Implementation details:**
- Headers: `Content-Type: text/event-stream`, `Cache-Control: no-cache`
- Event format: `data: {JSON}\n\n`
- 9 event types: `thinking`, `connected`, `content`, `tool_call`, `tool_executing`, `tool_result`, `generating`, `done`, `error`

**Academic source:**
- Fielding's dissertation on REST (2000) - includes discussion of streaming
- HTTP/1.1 specification (RFC 2616) - persistent connections

### 3.3 Tool Integration Architecture
**Your 3 tools documented:**

#### 3.3.1 search_car_database
- **Purpose:** Query PostgreSQL with structured filters
- **Parameters:** manufacturer, model, yearMin/Max, priceMin/Max, mileage, fuelType, limit
- **Why PostgreSQL over CSV:** Performance at scale, complex queries, transaction support
- **Response time:** <100ms

#### 3.3.2 get_market_stats
- **Purpose:** Aggregation queries for market overview
- **Returns:** Total listings, manufacturers, price ranges, averages
- **Use case:** Context for pricing discussions

#### 3.3.3 web_search
- **Primary:** Native Ollama web search (requires API key)
- **Fallback:** DuckDuckGo Instant Answer API
- **Purpose:** Real-time reviews, reliability reports, current market trends

**Hybrid strategy justified:** Graceful degradation without hard dependency on paid APIs

### 3.4 Response Streaming Implementation
**Frontend state management:**
- Conversation history array: `Array<{role: 'user' | 'assistant', content: string}>`
- Real-time message building (character-by-character append)
- Thinking indicators with animated dots
- Auto-scroll to latest message

**Backend generator function:**
```typescript
async function* chatStream(message, history): AsyncGenerator<Event>
```
- Yields events as Ollama streams tokens
- Detects tool calls in stream chunks
- Executes tools synchronously
- Continues generation with tool results injected

### 3.5 User Experience Design
**Critical UX decisions:**
- **Immediate feedback:** "Connecting to AI..." shown instantly (0ms perceived latency)
- **User-friendly status:** "Searching local database..." not "Using search_car_database tool"
- **Status progression:** Thinking → Searching → Processing → Analyzing → Streaming text
- **Input disabled during generation:** Prevents mid-stream conflicts

---

## SECTION 4: Configuration, Testing & Optimization (3-4 pages)

### 4.1 Model Configuration Journey
**Document your trials:**

❌ **Failed attempts:**
- `phi3:mini` - "does not support tools" error
- `llama3.1:8b` - no tool support in Ollama
- `mistral:7b-instruct-q3_K_S` - quantization tags break tool calling

✅ **Success:** `mistral` (base tag)
- Ollama auto-selects best quantization for hardware
- Full tool support maintained
- 7B parameters sufficient for domain expertise

**Key learning:** Quantization must be handled by Ollama, not manual model selection

### 4.2 Hardware Optimization
**Your environments tested:**

| Hardware | Config | Performance |
|----------|--------|-------------|
| RTX 3070 (4GB VRAM) | num_ctx: 16384, num_predict: 2048 | Demo-ready |
| AMD RX 6700 XT (12GB) | num_ctx: 8192, num_predict: 4096 | Production-quality |
| CPU-only (fallback) | Reduced context | 5-10x slower |

**GPU Driver optimization:** ROCm for AMD, CUDA for NVIDIA

**Research context:**
- Inference optimization literature (Pope et al., 2022 - "Efficiently Scaling Transformer Inference")
- Quantization trade-offs (Dettmers et al., 2022 - "LLM.int8()")

### 4.3 Response Quality vs Speed Trade-offs
**Parameters tuned:**
```typescript
temperature: 0.7        // Balanced creativity
top_k: 40               // Token selection pool
top_p: 0.9              // Nucleus sampling
repeat_penalty: 1.1     // Reduce repetition
num_predict: 2048-4096  // Response length
```

**Testing methodology:**
- Sample queries across complexity levels
- Measure: response time, word count, tool usage accuracy
- User evaluation: coherence, usefulness, factuality

### 4.4 Tool Usage Testing
**Validation that tools prevent hallucination:**
- Query: "Show me BMW 3 Series under 200,000 kr"
- Without tools: Model invents fake listings
- With tools: Model calls `search_car_database({manufacturer: "BMW", model: "3 Series", priceMax: 200000})`
- Result: Real data from PostgreSQL

**Log verification:**
```
[LLM STREAM] tool calls detected
[DATABASE] Query: { manufacturer: "BMW", model: "3 Series" }
[LLM STREAM] tool result length: 1234
```

### 4.5 Timeout Configuration
**Evolution:**
- Initial: 10 minutes (600,000ms)
- Final: 20 minutes (1,200,000ms)
- Reason: GPU-optimized settings trade slightly longer processing for 3-5x better quality

**Ollama parameter:** `num_predict: -1` (unlimited tokens, respects timeout instead)

---

## SECTION 5: Deployment Environments (2 pages)

### 5.1 Development Environment
- Windows 11 with WSL2 (or native Windows)
- Ollama running on localhost:11434
- PostgreSQL local instance
- Frontend: Vite dev server (port 5173)
- Backend: Express dev server (port 3000)

### 5.2 Demo Environment (Laptop GPU)
**Constraints:**
- Gaming laptop: RTX 3070 (4GB VRAM) or RX 6700 XT (12GB VRAM)
- Battery vs plugged performance
- Thermal throttling considerations
- VPN tunnel to home server (optional for offloading)

**Configuration:**
- Reduced context window: 16384 → 8192 tokens
- Aggressive quantization acceptable
- Trade-off: Demo responsiveness vs quality

### 5.3 VPN Home Server Setup
**Architecture for demo:**
```
Laptop (Frontend + Thin Backend Proxy)
    ↓ VPN
Home Server (Ollama + GPU + PostgreSQL)
```

**Benefits:**
- Offload compute to better hardware
- Consistent performance during demo
- Backup if laptop GPU fails

**Challenges:**
- Latency over VPN (~20-50ms added)
- Network reliability dependency
- Setup complexity

---

## SECTION 6: Production Considerations & Future Work (2 pages)

### 6.1 Cloud APIs with Custom Agents
**Research modern solutions:**

**OpenAI Assistants API:**
- Built-in tool/function calling
- Persistent threads (conversation memory)
- Code interpreter, knowledge retrieval
- Cost: ~$0.01-0.06 per 1K tokens (GPT-4)

**Anthropic Claude:**
- Extended context (200K tokens)
- Tool use with "thinking" steps
- Cost: ~$0.015 per 1K tokens

**Google Gemini:**
- Multimodal capabilities
- Free tier available
- Native function calling

**Trade-offs vs local:**
- Cost predictability (local = electricity only)
- Privacy (Danish user data stays local)
- Latency (local < 50ms, API ~200-500ms)
- Quality (GPT-4 > Mistral 7B, but at 100x cost)

### 6.2 GPU Function Compute
**Serverless GPU platforms:**
- RunPod, Modal, Banana.dev
- Pay-per-second GPU rental
- Auto-scaling based on demand

**Architecture:**
```
User Request → AWS Lambda (router)
    ↓
Modal GPU Worker (Mistral inference)
    ↓
PostgreSQL (RDS)
```

**Cost modeling needed:**
- Average request duration × GPU hourly rate
- Break-even analysis vs dedicated server

### 6.3 Advanced Features (Future Research)
- **Retrieval-Augmented Generation (RAG):** Vector database (Pinecone, Weaviate) for car knowledge base
- **Multi-agent systems:** Specialized agents (pricing, technical, legal)
- **Memory/Personalization:** User preference learning, past conversation context
- **Multimodal:** Image analysis for car condition assessment (LLaVA, GPT-4V)

**Academic sources:**
- Lewis et al. (2020). "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks"
- Park et al. (2023). "Generative Agents: Interactive Simulacra of Human Behavior"

---

## SECTION 7: Evaluation & Results (1-2 pages)

### 7.1 Performance Metrics
**Quantitative:**
- Response time: 15-35 seconds (complex queries)
- Token generation speed: 25-35 tok/s (GPU)
- Tool usage accuracy: Manual verification on test queries
- Uptime/reliability: Error rate < 1%

**Qualitative:**
- Response coherence (1-5 scale evaluation)
- Factual accuracy (verified against database)
- Usefulness (user feedback if available)

### 7.2 Comparison to Baseline
**Create comparison table:**
| Metric | Traditional Search | LLM Assistant | Improvement |
|--------|-------------------|---------------|-------------|
| Time to answer | 5-10 min (manual) | 20-35 sec | 10-30x faster |
| Information synthesis | User's responsibility | Automatic | High value |
| Personalization | None | Context-aware | Engaging |

### 7.3 Limitations Identified
- **Hallucination risk:** Mitigated but not eliminated (tool grounding helps)
- **Hardware dependency:** Requires GPU for acceptable performance
- **Danish language nuances:** Model trained primarily on English (some language mixing)
- **Tool reliability:** Web search API failures need graceful fallback
- **No visual understanding:** Cannot analyze car condition from photos (yet)

---

## SECTION 8: Conclusion & Reflection (1 page)

### 8.1 Achievements
- Successfully integrated local LLM with real-time streaming
- Tool calling prevents hallucinated car data
- Optimized for consumer hardware (demo-ready)
- User experience matches commercial AI assistants

### 8.2 Lessons Learned
- Model selection critical: Not all models support tools
- Quantization must preserve tool calling capability
- Immediate user feedback essential (perceived performance)
- System prompts powerful for behavior control
- Local deployment viable for prototypes, cloud better for scale

### 8.3 Academic Contribution
- Practical case study of LLM integration in domain-specific application
- Performance documentation across hardware configurations
- Tool usage patterns for grounding LLM responses
- Cost-benefit analysis: local vs cloud deployment

---

## APPENDICES

### Appendix A: Full System Prompt
(Include your 83-line SYSTEM_PROMPT from llm.service.ts)

### Appendix B: Tool Definitions (JSON Schema)
(Document search_car_database, get_market_stats, web_search parameter schemas)

### Appendix C: Test Queries & Responses
(5-10 example interactions with timestamps, tool calls logged)

### Appendix D: Configuration Files
- Ollama model configuration
- GPU optimization parameters
- Environment variables

---

## BIBLIOGRAPHY (Academic Sources to Include)

### Foundational AI/LLM Papers:
1. Vaswani et al. (2017). Attention is All You Need. NeurIPS.
2. Brown et al. (2020). Language Models are Few-Shot Learners. NeurIPS.
3. Bommasani et al. (2021). On the Opportunities and Risks of Foundation Models. Stanford HAI.
4. Zhao et al. (2023). A Survey of Large Language Models. arXiv.

### Tool Use / Agents:
5. Yao et al. (2022). ReAct: Synergizing Reasoning and Acting in Language Models. ICLR.
6. Schick et al. (2023). Toolformer: Language Models Can Teach Themselves to Use Tools. NeurIPS.
7. Qin et al. (2023). Tool Learning with Foundation Models. arXiv.

### Prompt Engineering:
8. Liu et al. (2023). Pre-train, Prompt, and Predict: A Systematic Survey of Prompting Methods. ACM Computing Surveys.
9. Wei et al. (2022). Chain-of-Thought Prompting Elicits Reasoning in Large Language Models. NeurIPS.

### Optimization & Efficiency:
10. Dettmers et al. (2022). LLM.int8(): 8-bit Matrix Multiplication for Transformers at Scale. NeurIPS.
11. Frantar et al. (2023). GPTQ: Accurate Post-Training Quantization for GPT. ICLR.
12. Pope et al. (2022). Efficiently Scaling Transformer Inference. MLSys.

### RAG & Knowledge Grounding:
13. Lewis et al. (2020). Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks. NeurIPS.
14. Ji et al. (2023). Survey of Hallucination in Natural Language Generation. ACM Computing Surveys.

### Market/Domain:
15. Akerlof, G. (1970). The Market for Lemons: Quality Uncertainty and the Market Mechanism. Quarterly Journal of Economics.
16. Statistics Denmark (Danmarks Statistik) - Vehicle registration data (2023-2024)

### Technical Documentation:
17. Ollama Documentation (2024). Tool Calling API Reference. https://github.com/ollama/ollama/blob/main/docs/api.md
18. Fielding, R. (2000). Architectural Styles and the Design of Network-based Software Architectures. PhD Dissertation, UC Irvine.

---

## ESTIMATED PAGE BREAKDOWN

| Section | Pages | Characters (est) |
|---------|-------|------------------|
| 1. Inspiration | 2.5 | 6,000 |
| 2. Research | 4.5 | 10,800 |
| 3. Architecture | 4.5 | 10,800 |
| 4. Testing | 3.5 | 8,400 |
| 5. Deployment | 2 | 4,800 |
| 6. Future Work | 2 | 4,800 |
| 7. Evaluation | 1.5 | 3,600 |
| 8. Conclusion | 1 | 2,400 |
| Appendices | 2 | 4,800 |
| **TOTAL** | **23.5** | **56,400** |

You'll exceed 15 pages (36,000 chars) comfortably with this structure.

---

## WRITING RECOMMENDATIONS

### Academic Tone:
- Use third person ("The system implements..." not "We implemented...")
- Cite sources for all claims
- Define technical terms on first use
- Balance technical depth with readability

### Structure Each Section:
1. **Introduction paragraph** - what this section covers
2. **Background/context** - relevant theory/prior work
3. **Your implementation** - technical details with code/diagrams
4. **Analysis** - why you made these choices
5. **Results/findings** - what worked, what didn't
6. **Summary** - tie back to thesis goals

### Figures to Include:
- System architecture diagram (full stack)
- Sequence diagram (user query → tool call → response)
- Performance graphs (response time vs query complexity)
- GPU utilization during inference
- Comparison table (local vs cloud deployment)
- Screenshot of UI with streaming response

### Code Snippets:
- System prompt (formatted nicely)
- Tool definition JSON schema
- SSE event format
- Frontend EventSource connection code
- Keep snippets short (5-15 lines), explain thoroughly

---

## Next Steps for You:

1. **Fill in your narrative:** Use your temp/*.md docs as source material
2. **Add measurements:** Run timed tests, record metrics
3. **Gather citations:** Download key papers from arXiv/ACM/IEEE
4. **Create figures:** Use draw.io, Mermaid, or similar for diagrams
5. **Write iteratively:** Complete one section, get feedback, iterate
6. **Self-review checklist:** Every claim cited? Technical terms defined? Flows logically?

This plan gives you **~24 pages** of academically rigorous content grounded in your actual implementation. Your journey is valuable - you discovered critical insights (base model tags for tools, quantization issues, optimization strategies) that others can learn from.
