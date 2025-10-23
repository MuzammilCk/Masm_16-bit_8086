# ✅ Render Deployment Checklist

Use this checklist to ensure a smooth deployment to Render.

---

## Pre-Deployment

### 1. Code Preparation
- [ ] All code is committed to git
- [ ] `.env` files are **NOT** committed (check `.gitignore`)
- [ ] All API calls use `apiUrl()` helper (not hardcoded localhost)
- [ ] `render.yaml` is in root directory
- [ ] Build commands work locally:
  ```bash
  # Test backend build
  cd backend && npm install && npm run build
  
  # Test frontend build  
  cd frontend && npm install && npm run build
  ```

### 2. GitHub Repository
- [ ] Code is pushed to GitHub
- [ ] Repository is public or Render has access
- [ ] Branch is `main` (or update `render.yaml`)

### 3. MongoDB Atlas Setup
- [ ] Free tier cluster created
- [ ] Database user created with password
- [ ] IP whitelist set to `0.0.0.0/0`
- [ ] Connection string copied and saved

---

## Backend Deployment

### 4. Create Render Backend Service
- [ ] Go to [dashboard.render.com](https://dashboard.render.com)
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub repository
- [ ] Configure service:
  - Name: `asmstudio-backend`
  - Root Directory: `backend`
  - Build Command: `npm install && npm run build`
  - Start Command: `npm start`
  - Plan: Free

### 5. Backend Environment Variables
Add these in Render Dashboard → Backend → Environment:

- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `3001`
- [ ] `MONGODB_URI` = `mongodb+srv://user:pass@cluster.mongodb.net/asmstudio`
- [ ] `JWT_SECRET` = Generate with: `openssl rand -hex 32`
- [ ] `FRONTEND_URL` = (leave empty, fill after frontend deployment)

### 6. Deploy Backend
- [ ] Click "Create Web Service"
- [ ] Wait for deployment (~5-10 minutes)
- [ ] Check logs for errors
- [ ] Test health endpoint: `https://your-backend.onrender.com/api/health`
- [ ] Save backend URL

---

## Frontend Deployment

### 7. Create Render Frontend Service
- [ ] Click "New +" → "Web Service"
- [ ] Select same GitHub repository
- [ ] Configure service:
  - Name: `asmstudio-frontend`
  - Root Directory: `frontend`
  - Build Command: `npm install && npm run build`
  - Start Command: `npm start`
  - Plan: Free

### 8. Frontend Environment Variables
- [ ] `NODE_ENV` = `production`
- [ ] `NEXT_PUBLIC_BACKEND_URL` = Your backend URL from step 6

### 9. Deploy Frontend
- [ ] Click "Create Web Service"
- [ ] Wait for deployment (~5-10 minutes)
- [ ] Check logs for errors
- [ ] Save frontend URL

---

## Post-Deployment

### 10. Update Backend CORS
- [ ] Go to Backend service → Environment
- [ ] Update `FRONTEND_URL` with your frontend URL
- [ ] Save (triggers auto-redeploy)

### 11. Test Full Application
- [ ] Open frontend URL in browser
- [ ] Test sign-in with:
  - Username: `testuser`
  - Password: `test123`
  - API Key: Your Gemini API key
- [ ] Try running sample assembly code
- [ ] Check debug panels work
- [ ] Verify AI chat responds

### 12. Monitor Services
- [ ] Check backend logs for errors
- [ ] Check frontend logs for errors
- [ ] Test from different devices/browsers

---

## Troubleshooting

### Backend Won't Start
**Check:**
- [ ] MongoDB connection string is correct
- [ ] All environment variables are set
- [ ] Build logs for compilation errors
- [ ] Health endpoint responds

### Frontend Can't Connect to Backend
**Check:**
- [ ] `NEXT_PUBLIC_BACKEND_URL` is correct
- [ ] Backend `FRONTEND_URL` matches frontend
- [ ] Browser console for CORS errors
- [ ] Network tab shows correct API URLs

### Database Connection Fails
**Check:**
- [ ] MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- [ ] Database user exists and password is correct
- [ ] Connection string includes database name
- [ ] Special characters in password are URL-encoded

### Service Keeps Sleeping
**This is normal on free tier:**
- Services sleep after 15 minutes of inactivity
- First request takes ~30 seconds to wake up
- Consider using UptimeRobot for pings
- Or upgrade to paid plan ($7/month)

---

## Optional Enhancements

### Custom Domain
- [ ] Purchase domain (optional)
- [ ] Add custom domain in Render settings
- [ ] Update DNS records
- [ ] Wait for SSL certificate

### Monitoring
- [ ] Set up UptimeRobot for health checks
- [ ] Configure Render alerts
- [ ] Set up error tracking (Sentry, etc.)

### Backups
- [ ] Enable MongoDB Atlas backups (paid feature)
- [ ] Export database regularly
- [ ] Keep code backed up on GitHub

---

## Success Criteria

Your deployment is successful when:

- ✅ Frontend loads without errors
- ✅ Backend health check returns `{"status": "ok"}`
- ✅ Can sign in with valid credentials
- ✅ Can execute assembly code
- ✅ Debug panels show register/memory data
- ✅ AI chat responds to queries
- ✅ No CORS errors in browser console

---

## Important URLs

**Save these URLs:**

- Frontend: `https://asmstudio-frontend.onrender.com`
- Backend: `https://asmstudio-backend.onrender.com`
- Backend Health: `https://asmstudio-backend.onrender.com/api/health`
- MongoDB Atlas: `https://cloud.mongodb.com`
- Render Dashboard: `https://dashboard.render.com`

---

## Support Resources

- **Render Docs**: [render.com/docs](https://render.com/docs)
- **MongoDB Atlas Docs**: [mongodb.com/docs/atlas](https://www.mongodb.com/docs/atlas/)
- **Deployment Guide**: See `RENDER_DEPLOYMENT_GUIDE.md`
- **Environment Variables**: See `ENVIRONMENT_VARIABLES.md`

---

**Last Updated:** January 2025

**Estimated Deployment Time:** 30-45 minutes
