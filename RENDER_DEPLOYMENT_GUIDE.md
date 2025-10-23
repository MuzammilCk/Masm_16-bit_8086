# 🚀 Complete Render Deployment Guide for MASM Studio

This guide will walk you through deploying both the **backend** (Node.js/Express) and **frontend** (Next.js) to Render.

---

## 📋 Prerequisites

1. **GitHub Account** - Your code must be in a GitHub repository
2. **Render Account** - Sign up at [render.com](https://render.com) (free tier available)
3. **MongoDB Atlas Account** - For database hosting (free tier available)

---

## Step 1: Prepare MongoDB Database (MongoDB Atlas)

Render's free tier doesn't include MongoDB, so we'll use MongoDB Atlas (free).

### 1.1 Create MongoDB Atlas Account
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Click **"Build a Database"**

### 1.2 Configure Database
1. Choose **FREE** tier (M0 Sandbox)
2. Select **AWS** provider and choose closest region to Oregon (e.g., `us-west-2`)
3. Cluster Name: `asmstudio`
4. Click **"Create"**

### 1.3 Create Database User
1. Go to **Database Access** (left sidebar)
2. Click **"Add New Database User"**
3. Username: `asmstudio-admin`
4. Password: Generate a strong password (save it!)
5. Database User Privileges: **Read and write to any database**
6. Click **"Add User"**

### 1.4 Allow Network Access
1. Go to **Network Access** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - *Note: For production, restrict to Render's IP ranges*
4. Click **"Confirm"**

### 1.5 Get Connection String
1. Go to **Database** → **Connect**
2. Choose **"Connect your application"**
3. Driver: **Node.js**, Version: **5.5 or later**
4. Copy the connection string:
   ```
   mongodb+srv://asmstudio-admin:<password>@asmstudio.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Add database name after the `/`: 
   ```
   mongodb+srv://asmstudio-admin:YOUR_PASSWORD@asmstudio.xxxxx.mongodb.net/asmstudio?retryWrites=true&w=majority
   ```

**Save this connection string!** You'll need it for Render environment variables.

---

## Step 2: Push Code to GitHub

1. Initialize git repository (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Render deployment"
   ```

2. Create a new repository on GitHub

3. Push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/MasM8086.git
   git branch -M main
   git push -u origin main
   ```

---

## Step 3: Deploy Backend to Render

### 3.1 Create New Web Service
1. Log into [dashboard.render.com](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select the `MasM8086` repository

### 3.2 Configure Backend Service
Fill in these settings:

| Setting | Value |
|---------|-------|
| **Name** | `asmstudio-backend` |
| **Region** | Oregon (US West) |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | Node |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Plan** | Free |

### 3.3 Add Environment Variables
Click **"Advanced"** → **"Add Environment Variable"**

Add these variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3001` |
| `MONGODB_URI` | Your MongoDB Atlas connection string from Step 1.5 |
| `JWT_SECRET` | Generate random string: `openssl rand -hex 32` |
| `FRONTEND_URL` | Leave empty for now (will update after frontend deployment) |

### 3.4 Deploy
1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Once deployed, you'll get a URL like: `https://asmstudio-backend.onrender.com`

### 3.5 Test Backend
Visit: `https://asmstudio-backend.onrender.com/api/health`

You should see:
```json
{
  "status": "ok",
  "timestamp": "2025-01-23T...",
  "uptime": 123.45,
  "environment": "production"
}
```

**✅ Save your backend URL!**

---

## Step 4: Deploy Frontend to Render

### 4.1 Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Select same GitHub repository (`MasM8086`)

### 4.2 Configure Frontend Service
| Setting | Value |
|---------|-------|
| **Name** | `asmstudio-frontend` |
| **Region** | Oregon (US West) |
| **Branch** | `main` |
| **Root Directory** | `frontend` |
| **Runtime** | Node |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Plan** | Free |

### 4.3 Add Environment Variables
| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `NEXT_PUBLIC_BACKEND_URL` | Your backend URL (e.g., `https://asmstudio-backend.onrender.com`) |

### 4.4 Deploy
1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. You'll get a URL like: `https://asmstudio-frontend.onrender.com`

---

## Step 5: Update Backend CORS Settings

Now that you have the frontend URL, update the backend:

1. Go to **Render Dashboard** → **asmstudio-backend**
2. Click **"Environment"** tab
3. Edit `FRONTEND_URL` variable
4. Set value to: `https://asmstudio-frontend.onrender.com`
5. Click **"Save Changes"**
6. Backend will automatically redeploy

---

## Step 6: Update Frontend API URLs

You need to update the frontend code to use the environment variable for backend URL.

### 6.1 Create API Configuration File

Create `frontend/lib/api-config.ts`:
```typescript
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001',
};
```

### 6.2 Update All Fetch Calls

Replace all hardcoded `http://localhost:3001` with the dynamic URL.

Example in `frontend/components/editor/Toolbar.tsx`:
```typescript
// OLD:
const response = await fetch("http://localhost:3001/api/execute", {

// NEW:
import { API_CONFIG } from "@/lib/api-config";
const response = await fetch(`${API_CONFIG.baseUrl}/api/execute`, {
```

Do this for all files that make API calls:
- `frontend/app/login/page.tsx`
- `frontend/components/editor/Toolbar.tsx`
- `frontend/components/ai/AIChat.tsx`
- Any other files with fetch calls

### 6.3 Commit and Push
```bash
git add .
git commit -m "Use environment variable for backend URL"
git push
```

Render will automatically redeploy your frontend.

---

## 🎉 Your App is Live!

- **Frontend**: `https://asmstudio-frontend.onrender.com`
- **Backend**: `https://asmstudio-backend.onrender.com`

---

## ⚠️ Important Notes for Free Tier

### Render Free Tier Limitations:
1. **Services sleep after 15 minutes of inactivity**
   - First request after sleep takes ~30 seconds to wake up
   - Subsequent requests are fast

2. **750 hours/month limit** per service
   - Enough for 1 month if only one instance runs

3. **Automatic deploys**
   - Every git push triggers a redeploy
   - Builds can take 5-10 minutes

### MongoDB Atlas Free Tier:
1. **512 MB storage** (plenty for this app)
2. **No backup** on free tier
3. **Shared RAM** (adequate for development/testing)

---

## 🐛 Troubleshooting

### Backend fails to start:
1. Check **Logs** in Render dashboard
2. Verify `MONGODB_URI` is correct
3. Ensure MongoDB Atlas IP whitelist includes `0.0.0.0/0`

### Frontend can't connect to backend:
1. Check `NEXT_PUBLIC_BACKEND_URL` is correct
2. Verify backend `FRONTEND_URL` matches frontend URL
3. Check browser console for CORS errors

### Database connection fails:
1. Verify MongoDB Atlas user exists
2. Check password has no special characters (or URL encode them)
3. Ensure database name is included in connection string

### Services keep sleeping:
- Free tier limitation. Consider:
  1. Using a service like [UptimeRobot](https://uptimerobot.com) to ping every 5 minutes
  2. Upgrading to paid plan ($7/month per service)

---

## 🔄 CI/CD Pipeline

Render automatically deploys when you push to `main`:

```bash
# Make changes
git add .
git commit -m "Your commit message"
git push

# Render will:
# 1. Detect the push
# 2. Run build commands
# 3. Deploy automatically
# 4. Show logs in dashboard
```

---

## 📊 Monitoring

### View Logs:
1. Go to Render Dashboard
2. Click on service name
3. Click **"Logs"** tab
4. Real-time logs appear here

### View Metrics:
- Click **"Metrics"** tab to see:
  - CPU usage
  - Memory usage
  - Request count
  - Response times

---

## 🔐 Security Recommendations

1. **Environment Variables**: Never commit `.env` files
2. **JWT Secret**: Use strong random string (minimum 32 characters)
3. **MongoDB**: Restrict IP access in production
4. **API Keys**: Students provide their own Gemini keys (already implemented ✅)

---

## 🎯 Next Steps

1. ✅ Set up custom domain (optional)
2. ✅ Configure SSL certificate (automatic on Render)
3. ✅ Set up monitoring/alerts
4. ✅ Configure automatic backups for MongoDB

---

## 💰 Cost Estimate

**Current Setup (FREE tier):**
- Render Backend: $0/month
- Render Frontend: $0/month  
- MongoDB Atlas: $0/month
- **Total: $0/month** 🎉

**Limitations:**
- Services sleep after 15 minutes
- 750 hours/month per service
- 512 MB MongoDB storage

**Upgrade Path (if needed):**
- Render Starter ($7/month per service) = $14/month
- MongoDB Shared Cluster ($9/month) = $9/month
- **Total with upgrades: ~$23/month**

---

## 📞 Support

If you encounter issues:
1. Check Render [documentation](https://render.com/docs)
2. Review [logs](#monitoring) in Render dashboard
3. MongoDB Atlas [support](https://www.mongodb.com/docs/atlas/)

---

**🎓 Happy Teaching & Learning with MASM Studio!**
