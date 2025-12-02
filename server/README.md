# CTC Server

Express TypeScript server with JWT authentication and JSON database.

## Features

- ✅ Express.js with TypeScript
- ✅ JWT Authentication (4-hour expiration)
- ✅ Password hashing with bcrypt
- ✅ JSON-based database (lowdb)
- ✅ CORS and Helmet middleware for security
- ✅ Prettier code formatting
- ✅ Development hot-reload with ts-node-dev
- ✅ **LLM Integration** - Ollama-powered used car trading advisor
- ✅ **Native Web Search** - Ollama web search API (with DuckDuckGo fallback)
- ✅ **Database Search** - CSV-based car listings search
- ✅ **Tool Calling** - AI agent with multiple tools (database, web search, market stats)

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
│   │   └── db.ts              # Database configuration
│   ├── middleware/
│   │   └── auth.middleware.ts # JWT authentication middleware
│   ├── routers/
│   │   ├── auth.router.ts     # Authentication routes
│   │   └── test.router.ts     # Test routes
│   ├── utils/
│   │   └── auth.ts            # Auth utilities (hashing, JWT)
│   └── index.ts               # Main server file
├── data/
│   └── db.json                # JSON database file
├── dist/                      # Compiled JavaScript (after build)
├── .env                       # Environment variables (create from .env.example)
├── .env.example               # Example environment variables
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

## LLM Integration (Used Car Trading Advisor)

### Setup

1. **Install Ollama** from https://ollama.com
2. **Pull the gpt-oss model:**
   ```powershell
   ollama pull gpt-oss
   ```
3. **Get your Ollama API Key** from https://ollama.com/settings/keys
4. **Add to `.env` file:**
   ```env
   OLLAMA_API_KEY=your-ollama-api-key-here
   ```

### Features

- **Native Ollama Web Search** - Uses Ollama's cloud-based web search API (requires API key)
- **DuckDuckGo Fallback** - Automatically falls back if API key not set or native search fails
- **Database Search** - Searches local CSV car listings database
- **Market Statistics** - Provides market overview and pricing trends
- **GPU Optimized** - Configured for AMD/NVIDIA GPUs with 4K+ token generation and 8K context
- **Extended Timeouts** - 20-minute timeout supports complex multi-tool queries

### LLM Endpoints

#### Health Check
```powershell
curl.exe -X GET "http://localhost:3000/api/llm/health"
```

#### Simple Prompt
```powershell
curl.exe -X POST "http://localhost:3000/api/llm/prompt" -H "Content-Type: application/json" -d '{"prompt":"Is a 2018 Subaru with 80k miles at $22k a good deal?"}'
```

#### Chat with History
```powershell
curl.exe -X POST "http://localhost:3000/api/llm/chat" -H "Content-Type: application/json" -d '{"message":"What Toyota vehicles do we have?", "history":[]}'
```

### Available Tools

The AI agent can automatically use these tools:

1. **search_car_database** - Search CSV database by manufacturer, model, price, mileage, etc.
2. **get_market_stats** - Get overall market statistics
3. **web_search** - Search the web for current info (native Ollama or DuckDuckGo)

### Example Queries

```powershell
# Database search
curl.exe -X POST "http://localhost:3000/api/llm/prompt" -H "Content-Type: application/json" -d '{"prompt":"Show me all Toyota vehicles under $25,000"}'

# Web search
curl.exe -X POST "http://localhost:3000/api/llm/prompt" -H "Content-Type: application/json" -d '{"prompt":"What are current used car market trends?"}'

# Combined (database + web)
curl.exe -X POST "http://localhost:3000/api/llm/prompt" -H "Content-Type: application/json" -d '{"prompt":"Compare our Honda Civic listings to market prices"}'
```

### Full Testing Guide

See **[TESTING-COMMANDS.md](./TESTING-COMMANDS.md)** for comprehensive test commands and examples.

### Documentation

- **[LLM-ENDPOINTS.md](./LLM-ENDPOINTS.md)** - Detailed API documentation
- **[LLM-SETUP.md](./LLM-SETUP.md)** - Setup and configuration guide
- **[TESTING-COMMANDS.md](./TESTING-COMMANDS.md)** - PowerShell test commands