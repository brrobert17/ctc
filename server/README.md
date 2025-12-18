# CTC Server

Express TypeScript server for Danish used car marketplace with AI-powered assistant.

## Features

- ✅ Express.js with TypeScript
- ✅ JWT Authentication (4-hour expiration)
- ✅ Password hashing with bcrypt
- ✅ PostgreSQL database with Prisma ORM
- ✅ CORS and Helmet middleware for security
- ✅ Prettier code formatting
- ✅ Development hot-reload with ts-node-dev
- ✅ **LLM Integration** - Mistral 7B AI advisor for Danish car market
- ✅ **Context Gathering** - Pre-fetches web and database context for enriched responses
- ✅ **Database Search** - PostgreSQL car listings with comprehensive filters
- ✅ **Tool Calling** - AI agent with database, web search, and market stats tools
- ✅ **SSE Streaming** - Real-time streaming responses to client

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create your `.env` file (copy from `.env.example`):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

4. Update the `.env` file with your configuration:
```env
PORT=3000
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
```

## Running the Server

### Development Mode (with hot-reload)
```bash
npm run dev
```

### Production Mode
```bash
# Build the TypeScript code
npm run build

# Start the server
npm start
```

## API Endpoints

### Health Check
- **GET** `/health`
  - Returns server status

### Test Endpoint
- **GET** `/api/test/hello`
  - Returns a "Hello World" message
  - No authentication required

### Authentication

#### Register
- **POST** `/api/auth/register`
- Body:
```json
{
  "username": "your-username",
  "password": "your-password"
}
```
- Response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "user-id",
    "username": "your-username"
  }
}
```

#### Login
- **POST** `/api/auth/login`
- Body:
```json
{
  "username": "your-username",
  "password": "your-password"
}
```
- Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt-token",
    "userId": "user-id",
    "username": "your-username"
  }
}
```

### Protected Endpoint
- **GET** `/api/test/protected`
- Headers:
```
Authorization: Bearer <your-jwt-token>
```
- Response:
```json
{
  "success": true,
  "message": "You have accessed a protected endpoint",
  "userId": "user-id"
}
```

## Project Structure

```
server/
├── src/
│   ├── database/
│   │   └── cars.db.ts         # PostgreSQL car database queries (Prisma)
│   ├── middleware/
│   │   └── auth.middleware.ts # JWT authentication middleware
│   ├── routers/
│   │   ├── auth.router.ts     # Authentication routes
│   │   ├── llm.router.ts      # AI assistant chat routes (SSE)
│   │   └── test.router.ts     # Test routes
│   ├── services/
│   │   ├── llm.service.ts     # Mistral AI service with tool calling
│   │   └── web-search.service.ts # Web search integration
│   ├── utils/
│   │   └── auth.ts            # Auth utilities (hashing, JWT)
│   └── index.ts               # Main Express server
├── prisma/
│   ├── schema.prisma          # Prisma database schema
│   └── migrations/            # Database migrations
├── dist/                      # Compiled JavaScript (after build)
├── .env                       # Environment variables (create from .env.example)
├── .prettierrc                # Prettier configuration
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
└── README.md                  # This file
```

## Code Formatting

Format your code with Prettier:
```bash
npm run format
```

Check formatting without making changes:
```bash
npm run format:check
```

## Testing the API

**Register:**
```powershell
curl.exe -X POST "http://localhost:3000/api/auth/register" `
  -H "Content-Type: application/json" `
  -d '{"username":"testuser","password":"testpass123"}'
```

**Login:**
```powershell
curl.exe -X POST "http://localhost:3000/api/auth/login" `
  -H "Content-Type: application/json" `
  -d '{"username":"testuser","password":"testpass123"}'
```

**Access Protected Route:**
```powershell
curl.exe -X GET "http://localhost:3000/api/test/protected" `
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## AI Assistant (Danish Car Market Advisor)

### Setup

1. **Install Ollama** from https://ollama.com
2. **Pull the Mistral model:**
   
   **For ALL hardware (automatically optimizes):**
   ```bash
   ollama pull mistral
   ```
   
   Ollama will automatically use the best quantization for your GPU.

3. **Configure for 4GB VRAM** in `server/src/services/llm.service.ts` (already set):
   ```typescript
   const MODEL_NAME = 'mistral';  // Uses automatic quantization
   const USE_GPU = true;          // Set to false for CPU-only
   ```
   
   Context is already reduced to 16K tokens for 4GB VRAM compatibility.

4. **Optional - Get Ollama API Key** for enhanced web search from https://ollama.com/settings/keys
5. **Add to `.env` file (optional):**
   ```env
   OLLAMA_API_KEY=your-ollama-api-key-here
   ```

### Model Recommendations

**⚠️ CRITICAL:** Only certain base model tags support Ollama tool calling!

**MODELS WITH TOOL SUPPORT:**
- ✅ `mistral` - 7B params, good quality, **works on 4GB VRAM**
- ✅ `phi4-mini` - 14B params, excellent quality, **requires 8GB+ VRAM**

**DO NOT USE:**
- ❌ Specific quantization tags (`q3_K_S`, `q2_K`, etc.) - No tool support
- ❌ `phi3` (older version) - No tool support
- ❌ Other models (`gemma`, `llama`) - No tool support

| Hardware | Recommended Model | VRAM Usage | Speed | Quality | Tool Support |
|----------|------------------|------------|-------|---------|--------------|
| **RTX 3070 (4GB)** | `mistral` | ~4-5GB | ⚡⚡ Medium | ⭐⭐⭐⭐ Great | ✅ Yes |
| **RTX 4070+ (8GB)** | `phi4-mini` | ~8GB | ⚡⚡ Medium | ⭐⭐⭐⭐⭐ Excellent | ✅ Yes |
| **CPU (any)** | `mistral` + `USE_GPU=false` | 0GB | ⚡ Slow (10-15s) | ⭐⭐⭐⭐ Great | ✅ Yes |

**For 4GB VRAM:** Stay with `mistral` (default). Context is reduced to 16K tokens to prevent OOM.

**For 8GB+ VRAM:** Try `phi4-mini` for better quality:
```bash
ollama pull phi4-mini
```
Then change in code: `const MODEL_NAME = 'phi4-mini';`

### Features

- **Danish Market Specialist** - Trained prompts for Danish automotive market, regulations, and pricing
- **Context Gathering** - Pre-fetches relevant web and database information before responding
- **Flexible Model Support** - Optimized configurations for different hardware constraints
- **Web Search Integration** - Ollama native search (with API key) or DuckDuckGo fallback
- **PostgreSQL Database** - Real-time queries against Danish car listings
- **Market Analytics** - Automated statistics and pricing trends
- **GPU/CPU Adaptive** - Automatically configures for available hardware
- **SSE Streaming** - Real-time response streaming to client

### Available Tools

The AI agent automatically uses these tools when appropriate:

1. **search_car_database** - Search PostgreSQL database by manufacturer, model, price, year, mileage, fuel type, body type, etc.
2. **get_market_stats** - Get Danish market statistics and pricing trends
3. **web_search** - Search the web for reviews, specs, and current information

### Usage

The AI assistant is integrated into the client UI. Simply ask questions like:
- "Show me VW Golf GTI models"
- "What BMW 3 Series are available under 300,000 kr?"
- "Tell me about Toyota Hybrid reliability"

The assistant will automatically:
1. Gather relevant context from web and database
2. Call appropriate tools to get current data
3. Stream a comprehensive response in real-time

### Testing via API

```bash
# Health check
curl http://localhost:3000/api/llm/health

# Chat endpoint (SSE stream)
curl -X POST http://localhost:3000/api/llm/chat/stream \
  -H "Content-Type: application/json" \
  -d '{"message":"Show me all Volkswagen models","history":[]}'
```