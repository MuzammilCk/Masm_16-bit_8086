# Quick Installation Guide

## Prerequisites
- Node.js 18+ installed
- MongoDB installed and running (or MongoDB Atlas account)
- Gemini API key from Google AI Studio

## One-Command Setup

### Windows (PowerShell)
```powershell
# Navigate to project
cd d:\projects\MasM8086

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Return to root
cd ..
```

### Linux/Mac (Bash)
```bash
# Install all dependencies
cd backend && npm install && cd ../frontend && npm install && cd ..
```

## Environment Setup

1. **Copy example env file:**
```bash
cd backend
copy .env.example .env  # Windows
# OR
cp .env.example .env    # Linux/Mac
```

2. **Edit `.env` file** and add:
```env
JWT_SECRET=<GENERATE_RANDOM_STRING>
GEMINI_API_KEY=<YOUR_API_KEY>
MONGODB_URI=mongodb://localhost:27017/asmstudio
```

3. **Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Start Services

### Start MongoDB (if local)
```bash
mongod --dbpath <path-to-data-folder>
```

### Start Backend
```bash
cd backend
npm run dev
```

### Start Frontend (new terminal)
```bash
cd frontend
npm run dev
```

## Verify Installation

1. **Backend Health Check:**
   - Open: http://localhost:3001/health
   - Should see: `{"status":"ok",...}`

2. **Frontend:**
   - Open: http://localhost:3000
   - Should see the ASM-Studio Pro interface

## Test Authentication

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "username": "testuser",
    "password": "test123"
  }'
```

## Common Issues

### Port Already in Use
```bash
# Find process using port 3001
netstat -ano | findstr :3001  # Windows
lsof -ti:3001                 # Mac/Linux

# Kill the process
taskkill /PID <PID> /F        # Windows
kill -9 <PID>                 # Mac/Linux
```

### MongoDB Connection Failed
- Check MongoDB is running: `mongod --version`
- Check connection string in `.env`
- Try: `mongodb://127.0.0.1:27017/asmstudio`

### Gemini API Errors
- Verify API key is correct
- Check quota at: https://ai.google.dev/
- Make sure no extra spaces in `.env`

## Next Steps

1. ✅ Installation complete
2. 📖 Read `COMPLETE_SETUP_GUIDE.md` for full features
3. 🧪 Test the API endpoints
4. 🎨 Integrate frontend components
5. 🚀 Deploy!

**Everything is ready to go! Start building awesome features! 🎉**
