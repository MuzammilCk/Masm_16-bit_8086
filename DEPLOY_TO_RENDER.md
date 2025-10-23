# 🚀 Quick Deploy to Render

Deploy ASM-Studio Pro to Render in **30 minutes**!

---

## 📚 Documentation Files

This deployment package includes:

1. **[RENDER_DEPLOYMENT_GUIDE.md](./RENDER_DEPLOYMENT_GUIDE.md)** - Complete step-by-step guide
2. **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Quick checklist
3. **[ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md)** - All environment variables explained
4. **[render.yaml](./render.yaml)** - Render Blueprint configuration

---

## ⚡ Quick Start (For the Impatient)

### 1. MongoDB Setup (5 minutes)
```
1. Go to mongodb.com/cloud/atlas
2. Create FREE cluster
3. Create database user
4. Allow IP: 0.0.0.0/0
5. Copy connection string
```

### 2. Push to GitHub (2 minutes)
```bash
git init
git add .
git commit -m "Deploy to Render"
git remote add origin https://github.com/YOUR_USERNAME/MasM8086.git
git push -u origin main
```

### 3. Deploy Backend (10 minutes)
```
1. Login to dashboard.render.com
2. New + → Web Service
3. Connect GitHub repo
4. Root Directory: backend
5. Build: npm install && npm run build
6. Start: npm start
7. Add Environment Variables:
   - NODE_ENV=production
   - PORT=3001
   - MONGODB_URI=(your MongoDB Atlas connection string)
   - JWT_SECRET=(generate with: openssl rand -hex 32)
   - FRONTEND_URL=(leave empty for now)
8. Deploy!
9. Save your backend URL
```

### 4. Deploy Frontend (10 minutes)
```
1. New + → Web Service
2. Same GitHub repo
3. Root Directory: frontend
4. Build: npm install && npm run build
5. Start: npm start
6. Add Environment Variables:
   - NODE_ENV=production
   - NEXT_PUBLIC_BACKEND_URL=(your backend URL from step 3)
7. Deploy!
8. Save your frontend URL
```

### 5. Update Backend CORS (2 minutes)
```
1. Go to Backend service → Environment
2. Set FRONTEND_URL to your frontend URL
3. Save (auto-redeploys)
```

### 6. Test! 🎉
```
1. Open your frontend URL
2. Sign in with any username/password (auto-registers)
3. Enter your Gemini API key
4. Write assembly code
5. Click Run
```

---

## 📋 What You Need

- **GitHub account** (free)
- **Render account** (free tier available)
- **MongoDB Atlas account** (free tier available)
- **Gemini API key** (free from Google AI Studio)

**Total Cost: $0/month** (free tier) 🎉

---

## 🔧 What Was Changed for Deployment

### Backend Changes
✅ Added `/api/health` endpoint for Render health checks
✅ Environment variables properly configured
✅ MongoDB connection using Atlas
✅ CORS setup for production

### Frontend Changes
✅ Created `lib/api-config.ts` for dynamic backend URLs
✅ All API calls now use `apiUrl()` helper
✅ Environment variable support via `NEXT_PUBLIC_BACKEND_URL`
✅ Next.js configured for production build

### New Files Created
- `render.yaml` - Render deployment configuration
- `frontend/lib/api-config.ts` - API URL helper
- `frontend/.env.example` - Frontend environment template
- Documentation guides (3 markdown files)

---

## 🎯 Deployment Architecture

```
┌─────────────────────┐
│   MongoDB Atlas     │  (Database - Free Tier)
│   cloud.mongodb.com │
└──────────┬──────────┘
           │
           │ MongoDB Connection
           │
┌──────────▼──────────┐
│  Backend (Node.js)  │  (Render Web Service - Free)
│  Express + Socket.IO│
│  asmstudio-backend  │
└──────────┬──────────┘
           │
           │ REST API
           │
┌──────────▼──────────┐
│  Frontend (Next.js) │  (Render Web Service - Free)
│  React + Monaco     │
│  asmstudio-frontend │
└─────────────────────┘
           │
           │
    ┌──────▼──────┐
    │   Students  │
    │   Browsers  │
    └─────────────┘
```

---

## 🐛 Common Issues & Fixes

### "Backend won't start"
- ✅ Check MongoDB connection string is correct
- ✅ Verify all environment variables are set
- ✅ Check logs in Render dashboard

### "Frontend can't connect to backend"
- ✅ Verify `NEXT_PUBLIC_BACKEND_URL` is correct
- ✅ Check backend `FRONTEND_URL` matches frontend
- ✅ Look for CORS errors in browser console

### "Database connection failed"
- ✅ Check MongoDB Atlas IP whitelist (should be 0.0.0.0/0)
- ✅ Verify database username/password
- ✅ Ensure connection string includes database name

### "Services keep sleeping"
- ℹ️ This is normal on free tier
- ℹ️ Services sleep after 15 min of inactivity
- ℹ️ First request takes ~30 sec to wake up
- 💡 Use UptimeRobot to ping every 5 minutes (free)
- 💡 Or upgrade to paid plan ($7/month per service)

---

## 📊 Free Tier Limits

| Service | Free Tier | Limit |
|---------|-----------|-------|
| **Render Backend** | ✅ Yes | 750 hrs/month, sleeps after 15 min |
| **Render Frontend** | ✅ Yes | 750 hrs/month, sleeps after 15 min |
| **MongoDB Atlas** | ✅ Yes | 512 MB storage, shared RAM |
| **Total Cost** | **$0/month** | Perfect for student projects! |

---

## 🚀 Upgrade Path (Optional)

If you need production-grade:

| Service | Plan | Cost | Benefits |
|---------|------|------|----------|
| Render Backend | Starter | $7/mo | No sleep, better performance |
| Render Frontend | Starter | $7/mo | No sleep, better performance |
| MongoDB Atlas | Shared | $9/mo | Backups, better performance |
| **Total** | | **$23/mo** | Production-ready |

---

## 📞 Need Help?

1. **Check the guides:**
   - Full guide: [RENDER_DEPLOYMENT_GUIDE.md](./RENDER_DEPLOYMENT_GUIDE.md)
   - Checklist: [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
   - Env vars: [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md)

2. **Check Render logs:**
   - Dashboard → Service → Logs tab

3. **Test health endpoint:**
   - `https://your-backend.onrender.com/api/health`

4. **Common solutions:**
   - Restart service in Render dashboard
   - Clear browser cache
   - Check environment variables spelling
   - Verify MongoDB Atlas IP whitelist

---

## ✅ Success Checklist

Your deployment is successful when:

- ✅ Backend health check returns `{"status": "ok"}`
- ✅ Frontend loads without errors
- ✅ Can sign in with username/password/API key
- ✅ Can execute assembly code
- ✅ Debug panels show data
- ✅ AI chat responds
- ✅ No CORS errors in console

---

## 🎓 What's Deployed

**ASM-Studio Pro** - Full-featured 8086 assembly IDE with:
- ✅ Monaco code editor with syntax highlighting
- ✅ AI-powered execution (Gemini API)
- ✅ Step-by-step trace visualization
- ✅ Register & memory debugging panels
- ✅ AI assistant for help
- ✅ User authentication
- ✅ Code sharing
- ✅ Real-time collaboration (Socket.IO)

---

## 📖 Next Steps After Deployment

1. **Share your app** - Send the frontend URL to students
2. **Get Gemini API keys** - Guide students to get free keys
3. **Monitor usage** - Check Render dashboard regularly
4. **Set up alerts** - Configure notifications in Render
5. **Optional**: Set up custom domain
6. **Optional**: Configure backups for MongoDB

---

## 🎉 That's It!

You now have a fully deployed assembly language IDE running on Render's free tier!

**Your URLs:**
- Frontend: `https://asmstudio-frontend.onrender.com`
- Backend: `https://asmstudio-backend.onrender.com`

**Happy Teaching! 🚀**

---

*Last Updated: January 2025*
*Deployment Time: ~30 minutes*
*Cost: $0/month on free tier*
