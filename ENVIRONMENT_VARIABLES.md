# 🔐 Environment Variables Reference

This document lists all environment variables needed for MASM Studio deployment.

---

## Backend Environment Variables

### Required Variables

| Variable | Description | Example | Where to Get |
|----------|-------------|---------|--------------|
| `NODE_ENV` | Environment mode | `production` or `development` | Set manually |
| `PORT` | Server port | `3001` | Any available port |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` | [MongoDB Atlas](https://cloud.mongodb.com) |
| `JWT_SECRET` | Secret key for JWT tokens | `your-super-secret-key-here` | Generate: `openssl rand -hex 32` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://asmstudio-frontend.onrender.com` | Your Render frontend URL |

### Optional Variables

| Variable | Description | Default | Notes |
|----------|-------------|---------|-------|
| `ADMIN_SECRET_KEY` | Admin dashboard access | Random string | For future admin features |

---

## Frontend Environment Variables

### Required Variables

| Variable | Description | Example | Where to Get |
|----------|-------------|---------|--------------|
| `NEXT_PUBLIC_BACKEND_URL` | Backend API URL | `https://asmstudio-backend.onrender.com` | Your Render backend URL |

### Build-time Variables

These are only used during the build process:

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Build environment | `production` |

---

## Local Development Setup

### Backend `.env` File

Create `backend/.env`:

```env
# Server Configuration
NODE_ENV=development
PORT=3001

# MongoDB Configuration
MONGODB_URI=mongodb://admin:changeme@localhost:27017/asmstudio?authSource=admin

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# JWT Secret (generate with: openssl rand -hex 32)
JWT_SECRET=your-local-development-secret-key-change-this

# Admin Secret (optional)
ADMIN_SECRET_KEY=your-admin-secret-key
```

### Frontend `.env.local` File

Create `frontend/.env.local`:

```env
# Backend API URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

---

## Production (Render) Setup

### Backend Service Environment Variables

Set these in Render Dashboard → Backend Service → Environment:

```
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://asmstudio-admin:YOUR_PASSWORD@cluster.mongodb.net/asmstudio?retryWrites=true&w=majority
JWT_SECRET=<generate with: openssl rand -hex 32>
FRONTEND_URL=https://asmstudio-frontend.onrender.com
```

### Frontend Service Environment Variables

Set these in Render Dashboard → Frontend Service → Environment:

```
NODE_ENV=production
NEXT_PUBLIC_BACKEND_URL=https://asmstudio-backend.onrender.com
```

---

## Security Best Practices

### 🔒 Secrets Management

1. **Never commit `.env` files to git**
   - Already in `.gitignore`
   - Use `.env.example` for templates

2. **Use strong JWT secrets**
   ```bash
   # Generate random secret
   openssl rand -hex 32
   ```

3. **Rotate secrets regularly**
   - Change JWT_SECRET every 90 days
   - Update in Render dashboard

4. **Database credentials**
   - Use strong passwords
   - URL encode special characters in MongoDB URI
   - Restrict IP access in MongoDB Atlas

### 🔑 API Keys

**Note:** This app uses **user-provided API keys**, not server-side keys.
- Students enter their own Gemini API keys during sign-in
- Keys stored in browser localStorage (client-side only)
- No server-side API key needed ✅

---

## Troubleshooting

### "Cannot read environment variable"

**Problem:** Variable not found

**Solution:**
1. Check variable name spelling (exact match)
2. Restart server after adding variables
3. For frontend: Variable must start with `NEXT_PUBLIC_`

### "CORS error in browser"

**Problem:** `FRONTEND_URL` mismatch

**Solution:**
1. Verify `FRONTEND_URL` in backend matches actual frontend URL
2. No trailing slash in URLs
3. Use `https://` for production

### "Database connection failed"

**Problem:** Invalid `MONGODB_URI`

**Solution:**
1. Check username/password are correct
2. URL encode special characters in password
3. Verify database name is included
4. Check MongoDB Atlas IP whitelist

### "JWT token invalid"

**Problem:** `JWT_SECRET` mismatch

**Solution:**
1. Ensure same secret used for signing and verification
2. Check for extra spaces in variable value
3. Restart backend after changing secret

---

## How to Generate Secrets

### JWT Secret (Linux/Mac):
```bash
openssl rand -hex 32
```

### JWT Secret (Windows PowerShell):
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### JWT Secret (Node.js):
```javascript
require('crypto').randomBytes(32).toString('hex')
```

### Admin Secret:
Same as JWT secret generation above.

---

## Environment Variable Priority

1. **Render Dashboard** (production) - Highest priority
2. **`.env.local`** (local development) - Overrides `.env`
3. **`.env`** (local development) - Base configuration
4. **Default values** in code - Fallback

---

## Quick Reference

### Start Development:
```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your values
npm run dev

# Frontend  
cd frontend
cp .env.example .env.local
# Edit .env.local with your values
npm run dev
```

### Deploy to Render:
1. Set environment variables in Render Dashboard
2. Push code to GitHub
3. Render auto-deploys ✅

---

## Support

For environment variable issues:
1. Check Render logs: Dashboard → Service → Logs
2. Verify all required variables are set
3. Ensure no typos in variable names
4. Check for special characters that need URL encoding

---

**Last Updated:** January 2025
