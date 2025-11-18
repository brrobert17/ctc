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