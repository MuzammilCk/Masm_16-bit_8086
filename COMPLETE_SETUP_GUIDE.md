# 🚀 ASM-Studio Pro - Complete Setup Guide

**Everything you need to run this project from start to finish**

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start (Recommended)](#quick-start-recommended)
3. [Detailed Setup Steps](#detailed-setup-steps)
4. [MongoDB Compass Setup](#mongodb-compass-setup)
5. [Running the Application](#running-the-application)
6. [Docker Setup (Alternative)](#docker-setup-alternative)
7. [Testing Your Setup](#testing-your-setup)
8. [Troubleshooting](#troubleshooting)
9. [Project Structure](#project-structure)
10. [Development Workflow](#development-workflow)

---

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

- ✅ **Node.js 18+** and npm 9+
  - Download: https://nodejs.org/
  - Verify: `node --version` and `npm --version`

- ✅ **Docker Desktop**
  - Download: https://www.docker.com/products/docker-desktop
  - Required for MongoDB and Redis containers

- ✅ **Gemini API Key** (Free)
  - Get it here: https://makersuite.google.com/app/apikey
  - Sign in with Google account
  - Click "Create API Key"

### Optional Software

- 🔧 **MongoDB Compass** (GUI for MongoDB)
  - Download: https://www.mongodb.com/products/compass
  - Makes database management easier

- 🔧 **Git** (for version control)
  - Download: https://git-scm.com/

---

## Quick Start (Recommended)

### Step 1: Get Your Gemini API Key

1. Visit https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key (you'll need it in Step 3)

### Step 2: Start Docker Desktop

1. Open Docker Desktop
2. Wait until it shows "Docker Desktop is running"

### Step 3: Run the Setup Script

Open PowerShell in the project directory and run:

```powershell
cd d:\projects\MasM8086

# Run the automated setup script
.\setup-and-run.ps1 -Dev
```

This script will:
- ✅ Check if Docker is running
- ✅ Create `.env` files from examples
- ✅ Prompt you to add your Gemini API key
- ✅ Install all dependencies
- ✅ Start MongoDB and Redis in Docker

### Step 4: Add Your API Key

When prompted, the script will open the `.env` file. Add your Gemini API key:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

Save and close the file.

### Step 5: Start Backend and Frontend

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

### Step 6: Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Health Check:** http://localhost:3001/health

🎉 **You're done! The application is now running.**

---

## Detailed Setup Steps

If you prefer manual setup or the script doesn't work, follow these steps:

### 1. Install Dependencies

```powershell
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..

# Install backend dependencies
cd backend
npm install
cd ..

# Install AI engine dependencies
cd ai-engine
npm install
cd ..
```

### 2. Create Environment Files

#### Root `.env` File

```powershell
# Copy the example file
Copy-Item .env.example .env
```

Edit `d:\projects\MasM8086\.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

#### Backend `.env` File

```powershell
cd backend
Copy-Item .env.example .env
cd ..
```

Edit `d:\projects\MasM8086\backend\.env`:
```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://admin:changeme@localhost:27017/asmstudio?authSource=admin
FRONTEND_URL=http://localhost:3000
```

#### AI Engine `.env` File

```powershell
cd ai-engine
Copy-Item .env.example .env
cd ..
```

Edit `d:\projects\MasM8086\ai-engine\.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash-exp
```

### 3. Start MongoDB and Redis

```powershell
# Start MongoDB and Redis containers
docker-compose up mongodb redis -d

# Verify they're running
docker ps
```

You should see:
- `asmstudio-mongodb` running on port 27017
- `asmstudio-redis` running on port 6379

### 4. Start Backend

```powershell
cd backend
npm run dev
```

Expected output:
```
Server running on http://localhost:3001
Connected to MongoDB
```

### 5. Start Frontend

Open a new terminal:

```powershell
cd frontend
npm run dev
```

Expected output:
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

---

## MongoDB Compass Setup

MongoDB Compass is a GUI tool that makes it easy to view and manage your database.

### Installation

1. Download from: https://www.mongodb.com/products/compass
2. Install the application
3. Open MongoDB Compass

### Connecting to Your Database

1. **Open MongoDB Compass**

2. **Use this connection string:**
   ```
   mongodb://admin:changeme@localhost:27017/asmstudio?authSource=admin
   ```

3. **Click "Connect"**

### What You'll See

- **Databases:** You'll see the `asmstudio` database
- **Collections:** Inside, you'll find collections like:
  - `projects` - Saved assembly code projects
  - `users` - User accounts (if authentication is enabled)
  - `sessions` - User sessions

### Using MongoDB Compass

**View Data:**
- Click on a collection to see documents
- Use filters to search: `{ name: "Test Project" }`

**Add Data:**
- Click "Insert Document"
- Add JSON data manually

**Edit Data:**
- Click on any document
- Modify fields
- Click "Update"

**Delete Data:**
- Select documents
- Click "Delete"

**Export Data:**
- Click "Export Collection"
- Choose format (JSON, CSV)

### Alternative: Command Line Access

```powershell
# Connect to MongoDB shell
docker exec -it asmstudio-mongodb mongosh -u admin -p changeme --authenticationDatabase admin

# Inside mongosh:
show dbs                    # List all databases
use asmstudio              # Switch to asmstudio database
show collections           # List all collections
db.projects.find()         # View all projects
db.projects.find().pretty() # View with formatting
exit                       # Exit mongosh
```

---

## Running the Application

### Development Mode (Recommended)

This mode provides hot-reload for faster development.

**Start Infrastructure:**
```powershell
.\start-dev.ps1
```

**Start Backend (Terminal 1):**
```powershell
cd backend
npm run dev
```

**Start Frontend (Terminal 2):**
```powershell
cd frontend
npm run dev
```

**Access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- Health Check: http://localhost:3001/health

### Production Mode (Docker)

Run everything in Docker containers:

```powershell
# Build and start all services
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

**Access:**
- Frontend: http://localhost (port 80)
- Backend: http://localhost:3001
- Health Check: http://localhost:3001/health

---

## Docker Setup (Alternative)

### Full Docker Deployment

If you want to run everything in Docker:

#### 1. Create Root `.env` File

```powershell
Copy-Item .env.example .env
```

Edit `.env` and add your Gemini API key:
```env
GEMINI_API_KEY=your_api_key_here
```

#### 2. Build Docker Images

```powershell
docker-compose build
```

This will build:
- Frontend container (Next.js)
- Backend container (Express)
- AI Engine container
- MongoDB container
- Redis container

#### 3. Start All Services

```powershell
docker-compose up -d
```

#### 4. Check Status

```powershell
# View running containers
docker-compose ps

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
```

#### 5. Stop Services

```powershell
# Stop all containers
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v
```

### Docker Commands Reference

```powershell
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart a service
docker-compose restart backend

# View logs
docker-compose logs -f

# Rebuild a service
docker-compose up --build backend -d

# Enter a container
docker exec -it asmstudio-backend sh

# Check resource usage
docker stats
```

---

## Testing Your Setup

### 1. Test Backend Health

```powershell
curl http://localhost:3001/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-20T...",
  "uptime": 123.456
}
```

### 2. Test Frontend

1. Open http://localhost:3000 in your browser
2. You should see the ASM-Studio Pro IDE
3. Try the theme toggle (sun/moon icon)

### 3. Test MongoDB Connection

**Using Docker:**
```powershell
docker exec -it asmstudio-mongodb mongosh -u admin -p changeme --authenticationDatabase admin
```

**Inside mongosh:**
```javascript
show dbs              // List databases
use asmstudio        // Switch to asmstudio database
show collections     // List collections
exit                 // Exit
```

**Using MongoDB Compass:**
1. Open Compass
2. Connect with: `mongodb://admin:changeme@localhost:27017/asmstudio?authSource=admin`
3. Browse the `asmstudio` database

### 4. Test Creating a Project

```powershell
curl -X POST http://localhost:3001/api/projects `
  -H "Content-Type: application/json" `
  -d '{
    "name": "Test Project",
    "code": "; Hello World\nMOV AX, 1\nMOV BX, 2\nADD AX, BX"
  }'
```

### 5. Test Retrieving Projects

```powershell
curl http://localhost:3001/api/projects
```

---

## Troubleshooting

### Docker Not Running

**Problem:** "Docker is not running" error

**Solution:**
1. Open Docker Desktop
2. Wait for it to fully start
3. Check the Docker icon in system tray shows "Docker Desktop is running"
4. Run the setup script again

### Port Already in Use

**Problem:** "Port 3000/3001/27017 already in use"

**Solution:**
```powershell
# Find what's using the port
netstat -ano | findstr :3000

# Kill the process (replace <PID> with actual process ID)
taskkill /PID <PID> /F

# Or change the port in .env files
```

### MongoDB Connection Failed

**Problem:** Backend can't connect to MongoDB

**Solutions:**

1. **Check MongoDB is running:**
   ```powershell
   docker ps | Select-String "mongo"
   ```

2. **Restart MongoDB:**
   ```powershell
   docker-compose restart mongodb
   ```

3. **Check connection string in `backend\.env`:**
   ```env
   MONGODB_URI=mongodb://admin:changeme@localhost:27017/asmstudio?authSource=admin
   ```

4. **Verify credentials:**
   - Username: `admin`
   - Password: `changeme`

### Frontend Build Errors

**Problem:** Next.js won't start or build fails

**Solutions:**
```powershell
cd frontend

# Clear cache
Remove-Item -Recurse -Force .next

# Reinstall dependencies
Remove-Item -Recurse -Force node_modules
npm install

# Restart dev server
npm run dev
```

### Gemini API Errors

**Problem:** AI features not working

**Solutions:**

1. **Verify API key in `.env` files:**
   ```powershell
   # Check root .env
   Get-Content .env
   
   # Check ai-engine .env
   Get-Content ai-engine\.env
   ```

2. **Ensure no extra spaces:**
   ```env
   GEMINI_API_KEY=your_key_here
   # NOT: GEMINI_API_KEY= your_key_here
   ```

3. **Get a new API key:**
   - Visit https://makersuite.google.com/app/apikey
   - Create a new key
   - Replace in `.env` files

4. **Restart services after changing `.env`:**
   ```powershell
   # Stop backend (Ctrl+C)
   # Start again
   cd backend
   npm run dev
   ```

### Docker Container Issues

**Problem:** Containers won't start or crash

**Solutions:**
```powershell
# Stop all containers
docker-compose down

# Remove all containers and volumes
docker-compose down -v

# Rebuild from scratch
docker-compose build --no-cache

# Start fresh
docker-compose up -d

# Check logs for errors
docker-compose logs -f
```

### MongoDB Compass Can't Connect

**Problem:** Compass shows connection error

**Solutions:**

1. **Verify MongoDB is running:**
   ```powershell
   docker ps | Select-String "mongo"
   ```

2. **Use correct connection string:**
   ```
   mongodb://admin:changeme@localhost:27017/asmstudio?authSource=admin
   ```

3. **Check firewall:**
   - Ensure port 27017 is not blocked
   - Add Docker to firewall exceptions

### Dependencies Installation Fails

**Problem:** `npm install` fails

**Solutions:**
```powershell
# Clear npm cache
npm cache clean --force

# Delete package-lock.json
Remove-Item package-lock.json

# Reinstall
npm install

# If still fails, try with legacy peer deps
npm install --legacy-peer-deps
```

---

## Project Structure

```
MasM8086/
├── frontend/                   # Next.js web application
│   ├── app/                   # Next.js App Router pages
│   ├── components/            # React components
│   ├── lib/                   # Utilities and helpers
│   ├── public/                # Static assets
│   └── package.json           # Frontend dependencies
│
├── backend/                    # Express API server
│   ├── src/
│   │   ├── routes/           # API routes
│   │   ├── controllers/      # Business logic
│   │   ├── models/           # Database models
│   │   └── middleware/       # Express middleware
│   └── package.json          # Backend dependencies
│
├── ai-engine/                  # Gemini AI integration
│   ├── src/
│   │   ├── compiler/         # MASM compiler
│   │   ├── executor/         # 8086 simulator
│   │   └── ai/               # AI integration
│   └── package.json          # AI engine dependencies
│
├── prompts/                    # AI system prompts
│   ├── CORE_SYSTEM_PROMPT.md # Main AI identity
│   ├── INTERFACE_TEMPLATES.md # Output formatting
│   └── EXAMPLES.md            # Interaction examples
│
├── examples/                   # Example assembly code
│
├── docker-compose.yml          # Docker orchestration
├── .env                        # Root environment variables
├── setup-and-run.ps1          # Automated setup script
├── start-dev.ps1              # Development startup script
└── COMPLETE_SETUP_GUIDE.md    # This file
```

---

## Development Workflow

### Daily Development Routine

**1. Start Infrastructure (Once per day):**
```powershell
.\start-dev.ps1
```

**2. Start Backend (Terminal 1):**
```powershell
cd backend
npm run dev
```

**3. Start Frontend (Terminal 2):**
```powershell
cd frontend
npm run dev
```

**4. Make Changes:**
- Edit files in `frontend/` or `backend/`
- Changes auto-reload (hot-reload enabled)

**5. End of Day:**
```powershell
# Stop backend and frontend (Ctrl+C in each terminal)

# Stop Docker services
docker-compose down
```

### Hot Reload

- ✅ **Frontend:** Auto-reloads on file changes
- ✅ **Backend:** Auto-reloads with `tsx watch`
- ✅ **AI Engine:** Auto-reloads with `tsx watch`

### Viewing Logs

**Backend Logs:**
- Visible in the terminal where you ran `npm run dev`

**Frontend Logs:**
- Visible in the terminal where you ran `npm run dev`
- Also in browser console (F12)

**Docker Logs:**
```powershell
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f mongodb
docker-compose logs -f redis
```

### Database Management

**Using MongoDB Compass:**
1. Open Compass
2. Connect to `mongodb://admin:changeme@localhost:27017/asmstudio?authSource=admin`
3. Browse collections, edit documents, run queries

**Using Command Line:**
```powershell
docker exec -it asmstudio-mongodb mongosh -u admin -p changeme --authenticationDatabase admin
```

---

## Application URLs

### Development Mode

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:3001 |
| Health Check | http://localhost:3001/health |
| MongoDB | mongodb://admin:changeme@localhost:27017 |
| Redis | redis://localhost:6379 |

### Docker Mode

| Service | URL |
|---------|-----|
| Frontend | http://localhost |
| Backend API | http://localhost:3001 |
| Health Check | http://localhost:3001/health |
| MongoDB | mongodb://admin:changeme@localhost:27017 |
| Redis | redis://localhost:6379 |

---

## Environment Variables Reference

### Root `.env`
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Backend `.env`
```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://admin:changeme@localhost:27017/asmstudio?authSource=admin
FRONTEND_URL=http://localhost:3000
```

### AI Engine `.env`
```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash-exp
```

---

## Success Checklist

Before you start coding, verify:

- [ ] Docker Desktop is running
- [ ] Gemini API key added to `.env` files
- [ ] MongoDB container running (`docker ps`)
- [ ] Redis container running (`docker ps`)
- [ ] Backend running on port 3001
- [ ] Frontend running on port 3000
- [ ] Can access http://localhost:3000
- [ ] Health check returns OK: http://localhost:3001/health
- [ ] MongoDB Compass can connect (optional)
- [ ] Can create and save projects

---

## Quick Command Reference

```powershell
# Setup and start (first time)
.\setup-and-run.ps1 -Dev

# Start infrastructure only
.\start-dev.ps1

# Start backend
cd backend && npm run dev

# Start frontend
cd frontend && npm run dev

# View Docker logs
docker-compose logs -f

# Stop Docker services
docker-compose down

# Restart MongoDB
docker-compose restart mongodb

# Access MongoDB shell
docker exec -it asmstudio-mongodb mongosh -u admin -p changeme --authenticationDatabase admin

# Check health
curl http://localhost:3001/health
```

---

## Getting Help

### Documentation Files

All documentation is in this single file! You no longer need to check multiple files.

### Common Issues

Check the [Troubleshooting](#troubleshooting) section above for solutions to common problems.

### Logs

Always check logs when something goes wrong:
```powershell
# Backend logs - in the terminal running npm run dev
# Frontend logs - in the terminal running npm run dev
# Docker logs
docker-compose logs -f
```

---

## What's Next?

### Try the Application

1. Open http://localhost:3000
2. Write some assembly code:
   ```asm
   ; Simple addition
   MOV AX, 10H
   MOV BX, 20H
   ADD AX, BX
   ```
3. Click "Run" (F5)
4. Watch the AI execute your code!

### Explore Features

- 📝 Monaco editor with syntax highlighting
- 🤖 AI-powered code assistance
- 🐛 Step-by-step debugging
- 📊 CPU state visualization
- 💾 Save and load projects
- 🌓 Dark/Light theme

### Learn More

- **AI System Prompts:** Check `/prompts/` directory
- **Example Code:** Check `/examples/` directory
- **Architecture:** See `ARCHITECTURE.md`
- **Project Status:** See `CURRENT_STATUS.md`

---

## 🎉 You're All Set!

Your ASM-Studio Pro is now fully configured and running. Start coding in 8086 assembly with AI assistance!

**Happy Coding! 🚀**

---

**Last Updated:** October 20, 2025  
**Version:** 1.0.0
