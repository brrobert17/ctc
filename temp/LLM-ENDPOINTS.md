# LLM Integration - Used Car Trading Advisor

This document describes the LLM endpoints for the car trading advisor agent.

## Overview

The server integrates with Ollama (running locally with the gpt-oss model) to provide an AI-powered used car trading advisor. The agent has access to:

- **Cars Database**: Local CSV dataset with used car listings
- **Web Search**: Real-time web search for car reviews, reliability info, and owner feedback
- **Market Statistics**: Analysis of pricing trends and available inventory

## Agent Configuration

The agent is configured with:
- **Role**: Expert used car trading advisor
- **Tone**: Professional, approachable, honest, and data-driven
- **Focus**: Helping users make informed buying/selling decisions
- **Capabilities**: 
  - Vehicle reliability and common issues
  - Fair market pricing and valuation
  - Identifying good deals and red flags
  - Total cost of ownership analysis
  - Market trends

## Prerequisites

1. **Ollama must be running locally**:
   ```powershell
   ollama serve
   ```

2. **GPT-OSS model must be available**:
   ```powershell
   ollama pull gpt-oss
   ```

3. **Cars dataset** must be present at `temp/cars.csv`

4. **Install dependencies**:
   ```powershell
   cd server
   npm install
   ```

## API Endpoints

### 1. Test Connection

**GET** `/api/llm/test`

Tests the connection to Ollama and verifies the gpt-oss model is available.

**Response:**
```json
{
  "success": true,
  "message": "Successfully connected to Ollama",
  "model": "gpt-oss"
}
```

**PowerShell Example:**
```powershell
curl.exe -X GET "http://localhost:3000/api/llm/test"
```

---

### 2. Health Check

**GET** `/api/llm/health`

Checks the status of all LLM services (Ollama + Cars Database).

**Response:**
```json
{
  "success": true,
  "services": {
    "ollama": {
      "success": true,
      "message": "Successfully connected to Ollama",
      "model": "gpt-oss"
    },
    "carsDatabase": {
      "loaded": true,
      "totalListings": 1500
    }
  }
}
```

**PowerShell Example:**
```powershell
curl.exe -X GET "http://localhost:3000/api/llm/health"
```

---

### 3. Simple Prompt

**POST** `/api/llm/prompt`

Send a single prompt to the LLM without conversation history. Best for one-off questions.

**Request Body:**
```json
{
  "prompt": "What are the most reliable used cars under $20,000?"
}
```

**Response:**
```json
{
  "success": true,
  "response": "Based on the current market data and reliability information...",
  "timestamp": "2025-11-23T13:00:00.000Z"
}
```

**PowerShell Example:**
```powershell
curl.exe -X POST "http://localhost:3000/api/llm/prompt" `
  -H "Content-Type: application/json" `
  -d '{"prompt":"What are the most reliable used cars under $20000?"}'
```

---

### 4. Chat with History

**POST** `/api/llm/chat`

Send a message with conversation history for multi-turn conversations.

**Request Body:**
```json
{
  "message": "What about the Toyota Camry?",
  "history": [
    {
      "role": "user",
      "content": "I'm looking for a reliable sedan"
    },
    {
      "role": "assistant",
      "content": "I'd recommend considering the Honda Accord or Toyota Camry..."
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "The Toyota Camry is an excellent choice...",
  "timestamp": "2025-11-23T13:00:00.000Z"
}
```

**PowerShell Example:**
```powershell
$body = @{
  message = "Tell me about Honda Civic reliability"
  history = @()
} | ConvertTo-Json

curl.exe -X POST "http://localhost:3000/api/llm/chat" `
  -H "Content-Type: application/json" `
  -d $body
```

---

## Available Tools (Automatic)

The agent automatically uses these tools when needed:

### 1. search_car_database
Searches the local CSV database for car listings.

**Parameters:**
- `manufacturer`: Brand name (e.g., "Toyota", "Honda")
- `model`: Model name
- `yearMin` / `yearMax`: Year range
- `priceMin` / `priceMax`: Price range in dollars
- `mileageMax`: Maximum mileage
- `fuelType`: Gasoline, Hybrid, Electric, Diesel
- `limit`: Max results (default: 10)

### 2. get_market_stats
Retrieves overall market statistics.

**Returns:**
- Total listings count
- Available manufacturers
- Average price
- Price range (min/max)

### 3. search_car_reviews
Searches the web for owner reviews and reliability information.

**Parameters:**
- `manufacturer`: Required
- `model`: Required
- `year`: Optional

---

## Example Queries

### Basic Questions
```
"What cars do you have under $15,000?"
"Show me reliable SUVs"
"What's the average price for used Hondas?"
```

### Specific Research
```
"What are common problems with 2015 Toyota Camry?"
"Compare Honda Civic vs Toyota Corolla reliability"
"Is a 2018 Subaru Outback with 80,000 miles a good deal at $22,000?"
```

### Market Analysis
```
"What are the best deals in the current market?"
"Show me the cheapest hybrids available"
"What manufacturers have the most listings?"
```

---

## Error Handling

**Common Errors:**

1. **Ollama not running:**
```json
{
  "success": false,
  "message": "Failed to connect to Ollama: connect ECONNREFUSED. Make sure Ollama is running on localhost:11434"
}
```

2. **Model not found:**
```json
{
  "success": false,
  "message": "Connected to Ollama, but gpt-oss model not found..."
}
```

3. **Invalid request:**
```json
{
  "success": false,
  "message": "Prompt is required and must be a string"
}
```

---

## Troubleshooting

### Ollama Connection Issues
```powershell
# Check if Ollama is running
curl.exe http://localhost:11434/api/tags

# Start Ollama if not running
ollama serve

# Verify gpt-oss model
ollama list
```

### CSV Database Issues
- Ensure `temp/cars.csv` exists in the project root
- Check file permissions
- Verify CSV format matches expected columns

### Performance Tips
- First request loads the CSV into memory (may take a few seconds)
- Subsequent requests use cached data
- Limit database queries to reasonable result counts (default: 10)

---

## Notes

- All endpoints are **unprotected** (no authentication required)
- The agent uses a system prompt to maintain personality and focus
- Tools are called automatically based on the user's query
- Web search uses DuckDuckGo's Instant Answer API (no API key needed)
- Conversation history is managed client-side
