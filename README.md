# ctc

Car Trading Companion App

### Front-end

- React
- TypeScript
- TailwindCSS
- TanStack Router
- TanStack Query

## How to run the app

### Prerequisites
- Node.js (LTS recommended)
- npm
- PostgreSQL database
- Python 3.x (for ML service)

### Install dependencies

For running the application, dependencies must be installed in both the client and the server.

```bash
# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

## Database

A PostgreSQL database is required for the backend.

You may use a local PostgreSQL instance or a hosted provider (e.g. Neon).

Set the connection string in the DATABASE_URL variable.


## Running the application
Start backend
```bash
cd server
npm run dev
```

Start frontend
```bash
cd client
npm run dev
```

## Run ML model

### Setup python environment and run ML model

1. cd .\ml-service\
2. python -m venv venv
3. .\venv\Scripts\Activate
4. pip install -r requirements.txt
5. uvicorn app:app --host 0.0.0.0 --port 8000

### Just to run model
1. .\venv\Scripts\Activate
2. uvicorn app:app --host 0.0.0.0 --port 8000

### Details on how client was initiated

- Initiated react app with typescript using `npm create vite@latest . --template react-ts`
- Added tailwindcss using `npm install -D tailwindcss postcss autoprefixer`
- Added tanstack router using `npm install @tanstack/react-router`
- Added tanstack query using `npm install @tanstack/react-query`
- Created a basic folder structure for the app
- Created a basic home page and a router

#### Specific to my (Adam) setup

- Vite was complaining about the node version. So I installed the latest version from their site

### Scripts

1. /server/ "npm run estimate:cars" : Updates Car records in the databse with Price estimations 

