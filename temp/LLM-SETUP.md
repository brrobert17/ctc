# Testing Commands for LLM Car Trading Advisor

All commands are PowerShell-friendly and can be run directly from your terminal.

## Prerequisites

1. **Start the server:**
   ```powershell
   cd c:\Users\Robbo\IdeaProjects\ctc\server
   npm run dev
   ```

2. **Ensure Ollama is running with gpt-oss model:**
   ```powershell
   ollama run gpt-oss
   ```

3. **Set your Ollama API key in `.env`:**
   ```
   OLLAMA_API_KEY=your-actual-key-here
   ```

---

## Health Checks

### 1. Server Health Check
```powershell
curl.exe -X GET "http://localhost:3000/health"
```

### 2. LLM Service Health Check
```powershell
curl.exe -X GET "http://localhost:3000/api/llm/health"
```

### 3. Test Ollama Connection
```powershell
curl.exe -X GET "http://localhost:3000/api/llm/test"
```

---

## Database Search Tests

### 4. Search for Toyota Vehicles
```powershell
curl.exe -X POST "http://localhost:3000/api/llm/prompt" -H "Content-Type: application/json" -d '{"prompt":"Show me all Toyota vehicles in the database under $25,000"}'
```

### 5. Search for Specific Model with Mileage Constraint
```powershell
curl.exe -X POST "http://localhost:3000/api/llm/prompt" -H "Content-Type: application/json" -d '{"prompt":"Find Honda Civic models with less than 50,000 miles"}'
```

### 6. Search by Year Range
```powershell
curl.exe -X POST "http://localhost:3000/api/llm/prompt" -H "Content-Type: application/json" -d '{"prompt":"What Subaru cars from 2018-2020 are available?"}'
```

### 7. Get Market Statistics
```powershell
curl.exe -X POST "http://localhost:3000/api/llm/prompt" -H "Content-Type: application/json" -d '{"prompt":"What are the overall market statistics for used cars in the database?"}'
```

### 8. Search for Electric/Hybrid Vehicles
```powershell
curl.exe -X POST "http://localhost:3000/api/llm/prompt" -H "Content-Type: application/json" -d '{"prompt":"Show me all hybrid or electric vehicles available"}'
```

---

## Web Search Tests

### 9. General Web Search (Native Ollama or DuckDuckGo Fallback)
```powershell
curl.exe -X POST "http://localhost:3000/api/llm/prompt" -H "Content-Type: application/json" -d '{"prompt":"What are the current market prices for used 2020 Honda Accord?"}'
```

### 10. Search for Car Reviews
```powershell
curl.exe -X POST "http://localhost:3000/api/llm/prompt" -H "Content-Type: application/json" -d '{"prompt":"What do reviews say about the 2019 Toyota Camry reliability?"}'
```

### 11. Compare Market Trends
```powershell
curl.exe -X POST "http://localhost:3000/api/llm/prompt" -H "Content-Type: application/json" -d '{"prompt":"What are the latest trends in electric vehicle resale values?"}'
```

---

## Combined Tests (Database + Web Search)

### 12. Deal Evaluation
```powershell
curl.exe -X POST "http://localhost:3000/api/llm/prompt" -H "Content-Type: application/json" -d '{"prompt":"Is a 2018 Subaru Outback with 80,000 miles at $22,000 a good deal? Check our database and current market prices."}'
```

### 13. Compare Inventory to Market
```powershell
curl.exe -X POST "http://localhost:3000/api/llm/prompt" -H "Content-Type: application/json" -d '{"prompt":"Compare the Toyota RAV4 listings in our database to current market prices online"}'
```

### 14. Research and Recommend
```powershell
curl.exe -X POST "http://localhost:3000/api/llm/prompt" -H "Content-Type: application/json" -d '{"prompt":"I need a reliable SUV under $30,000. What do you recommend from our inventory and why?"}'
```

### 15. Vehicle History and Reviews
```powershell
curl.exe -X POST "http://localhost:3000/api/llm/prompt" -H "Content-Type: application/json" -d '{"prompt":"Find me a 2017 Honda CR-V in the database and tell me about its reliability based on online reviews"}'
```

---

## Advanced Tests

### 16. Complex Multi-Tool Query
```powershell
curl.exe -X POST "http://localhost:3000/api/llm/prompt" -H "Content-Type: application/json" -d '{"prompt":"I have a budget of $25,000 and need a car with good gas mileage for commuting. Show me options from the database, check online reviews, and give me your top 3 recommendations with reasons."}'
```

### 17. Price Negotiation Advice
```powershell
curl.exe -X POST "http://localhost:3000/api/llm/prompt" -H "Content-Type: application/json" -d '{"prompt":"There is a 2019 Ford F-150 listed at $28,500 with 65,000 miles in our database. What is a fair price based on current market conditions?"}'
```

### 18. Long-term Ownership Cost
```powershell
curl.exe -X POST "http://localhost:3000/api/llm/prompt" -H "Content-Type: application/json" -d '{"prompt":"What are the total cost of ownership considerations for a used Tesla Model 3? Include maintenance, depreciation, and insurance based on online research."}'
```

---

## Chat Endpoint Tests (Conversation History)

### 19. Multi-turn Conversation
```powershell
# First message
curl.exe -X POST "http://localhost:3000/api/llm/chat" -H "Content-Type: application/json" -d '{"message":"What Toyota vehicles do we have under $20,000?"}'

# Second message with history (copy the response from above and include it)
curl.exe -X POST "http://localhost:3000/api/llm/chat" -H "Content-Type: application/json" -d '{"message":"Which of those has the lowest mileage?", "history":[{"role":"user","content":"What Toyota vehicles do we have under $20,000?"},{"role":"assistant","content":"[PASTE PREVIOUS RESPONSE HERE]"}]}'
```

---

## Expected Behavior

### With OLLAMA_API_KEY set:
- **Web searches** will use native Ollama web search API
- Better quality search results
- Console will show: `[LLM] Ollama client initialized with API key for native web search`
- Console will show: `[LLM] using native Ollama web_search for: [query]`

### Without OLLAMA_API_KEY:
- **Web searches** will fall back to DuckDuckGo API
- Console will show: `[LLM] Ollama client initialized without API key (fallback to DuckDuckGo)`
- Console will show: `[LLM] using DuckDuckGo fallback for: [query]`

### Database Searches:
- Direct CSV file access
- Fast and local
- No API key needed

### Timeouts:
- Server timeout: **10 minutes** (600 seconds)
- LLM `num_predict`: **-1** (unlimited)
- Model can think as long as needed without timeout

---

## Debug Output

Watch the server console for detailed logs:
- `[LLM] chat called` - Request received
- `[LLM] executeTool called` - Tool execution started
- `[LLM] using native Ollama web_search` - Native search used
- `[LLM] using DuckDuckGo fallback` - Fallback search used
- `[LLM] native web search returned X results` - Search completed
- `[LLM ROUTER] /prompt response length` - Response sent

---

## Troubleshooting

### Model doesn't use tools:
- Make sure you're using a model that supports tool calling (gpt-oss should work)
- Check that tools are being passed in the chat request (console will show this)

### Web search not working:
- Verify `OLLAMA_API_KEY` in `.env` file
- Check console for fallback messages
- DuckDuckGo API may have rate limits

### Database search returns no results:
- Verify `temp/cars.csv` file exists
- Check the CSV format matches expected schema
- Console will show `No vehicles found matching those criteria`

### Timeout errors:
- Should not occur with current configuration (10 minute timeout)
- If it does, check Ollama service is responsive
- Model may be too slow for your hardware

---

## Quick Test Sequence

Run these in order to verify everything works:

```powershell
# 1. Health check
curl.exe -X GET "http://localhost:3000/api/llm/health"

# 2. Database search
curl.exe -X POST "http://localhost:3000/api/llm/prompt" -H "Content-Type: application/json" -d '{"prompt":"How many cars are in the database?"}'

# 3. Web search
curl.exe -X POST "http://localhost:3000/api/llm/prompt" -H "Content-Type: application/json" -d '{"prompt":"What are current used car market trends?"}'

# 4. Combined query
curl.exe -X POST "http://localhost:3000/api/llm/prompt" -H "Content-Type: application/json" -d '{"prompt":"Is a 2018 Honda Civic with 50k miles at $18k a good deal?"}'
```

All tests should complete successfully. Watch console output for detailed execution logs.
