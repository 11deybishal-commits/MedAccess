# ⚡ MediAccess Quick Deployment Checklist

**Fast-track deployment in 30 minutes**

---

## 🎯 QUICK START (Recommended)
**Using: Railway (Backend + AI) + Vercel (Frontend) + MongoDB Atlas**

---

## Phase 1: Setup (5 minutes)

### MongoDB Atlas
- [ ] Sign up: https://mongodb.com/cloud/atlas
- [ ] Create free M0 cluster
- [ ] Create user: `mediaccess_admin` / password
- [ ] Get connection string: `mongodb+srv://mediaccess_admin:PASSWORD@cluster.mongodb.net/mediaccess`
- [ ] Copy to clipboard

### GitHub
- [ ] Push entire project to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/MediAccess.git
git branch -M main
git push -u origin main
```

### API Keys
- [ ] Get Google Maps API key: https://console.cloud.google.com
- [ ] Get Gemini API key: https://makersuite.google.com/app/apikey
- [ ] Save both

---

## Phase 2: Deploy Backend (5 minutes)

1. Go to https://railway.app
2. Login with GitHub
3. **New Project** → select `MediAccess` repo
4. Set **Root Directory**: `backend`
5. Add Variables:
```
MONGODB_URI=mongodb+srv://mediaccess_admin:PASSWORD@cluster.mongodb.net/mediaccess
JWT_SECRET=your_very_secret_key_at_least_32_chars_long_random_string
NODE_ENV=production
GOOGLE_MAPS_API_KEY=xxxx
GOOGLE_PLACES_API_KEY=xxxx
FRONTEND_URL=https://your-frontend-domain.com
```
6. Deploy ✅
7. Wait for green checkmark
8. **Generate Domain** → Copy URL (example: `https://mediaccess-backend.up.railway.app`)

---

## Phase 3: Deploy Frontend (5 minutes)

1. Go to https://vercel.com
2. Login with GitHub
3. **New Project** → select `MediAccess` repo
4. Set **Root Directory**: `frontend`
5. Add Variables:
```
VITE_API_URL=https://mediaccess-backend.up.railway.app/api
VITE_GOOGLE_MAPS_API_KEY=xxxx
```
6. Deploy ✅
7. Get URL (example: `https://mediaccess-vercel.app`)
8. **Settings** → **Domains** → Add custom domain (optional)

---

## Phase 4: Deploy AI Service (5 minutes)

1. Go to Railway dashboard
2. **New Project** → select `MediAccess` repo
3. Set **Root Directory**: `ai-service`
4. Add Variables:
```
GOOGLE_GENERATIVE_AI_KEY=xxxx
BACKEND_URL=https://mediaccess-backend.up.railway.app
ENVIRONMENT=production
```
5. Add Plugin: **Python** (detects automatically)
6. Deploy ✅
7. Get URL from Railway dashboard

---

## Phase 5: Update Backend URLs (2 minutes)

Go back to Railway Backend settings:
- Update `FRONTEND_URL` → Your Vercel URL

---

## ✅ Testing (3 minutes)

### Test Backend
```bash
curl https://mediaccess-backend.up.railway.app/api/auth/health
# Should return: {"status":"ok"}
```

### Test Frontend
- Open: https://your-frontend-domain.com
- [ ] Page loads
- [ ] Try login/register
- [ ] Check map loads

### Test AI Service
- Upload a medical report in frontend
- [ ] Gets analyzed successfully
- [ ] Summary appears

---

## 🎯 What You Now Have

| Service | URL | Platform |
|---------|-----|----------|
| Frontend | https://mediaccess.com | Vercel |
| Backend | https://api.mediaccess.com | Railway |
| AI Service | Running on Railway | Railway |
| Database | MongoDB Atlas | Cloud |

---

## 📱 **Optional: Add Custom Domain (5 min)**

### Register Domain
- GoDaddy / Namecheap / Google Domains
- Buy: `mediaccess.com`

### Point to Vercel
1. Vercel: **Settings** → **Domains**
2. Add domain
3. Update DNS at registrar
4. SSL auto-configured ✅

### API Subdomain
At domain registrar DNS:
```
Type: CNAME
Name: api
Target: mediaccess-backend.up.railway.app

Type: CNAME
Name: ai
Target: mediaccess-ai.up.railway.app
```

---

## 🔒 **Environment Variables Summary**

### Backend (.env production)
```
MONGODB_URI=mongodb+srv://mediaccess_admin:PASSWORD@cluster.mongodb.net/mediaccess
JWT_SECRET=your_secret_key_here_min_32_chars
NODE_ENV=production
PORT=5000
GOOGLE_MAPS_API_KEY=AIzaSyD...
GOOGLE_PLACES_API_KEY=AIzaSyD...
FRONTEND_URL=https://mediaccess.com
```

### Frontend (.env.production)
```
VITE_API_URL=https://api.mediaccess.com/api
VITE_GOOGLE_MAPS_API_KEY=AIzaSyD...
```

### AI Service (.env)
```
GOOGLE_GENERATIVE_AI_KEY=AIzaSyJ...
BACKEND_URL=https://api.mediaccess.com
ENVIRONMENT=production
```

---

## 🚀 **Auto-Deploy on Code Push**

GitHub Actions auto-deploys when you:
```bash
git add .
git commit -m "feature: add new feature"
git push origin main
```

Deployment happens automatically! ✅

---

## 📊 **Monitor Your Deployment**

- **Railway Dashboard**: https://railway.app → View logs
- **Vercel Dashboard**: https://vercel.com → Analytics
- **MongoDB Atlas**: https://account.mongodb.com/account/login → Database metrics

---

## ❌ **If Something Goes Wrong**

### Backend won't start
```
Check: MONGODB_URI correct?
Check: GitHub Actions logs for errors
Check: Railway variables all set?
```

### Frontend blank page
```
Check: VITE_API_URL in Vercel variables
Check: API service running?
Check: Browser console for errors (F12)
```

### API calls failing
```
Check: Backend health: curl https://api.mediaccess.com/api/auth/health
Check: CORS enabled in backend
Check: API keys valid
```

---

## 📍 **Your Deployed URLs**

After deployment, you have:

```
🌐 Frontend:   https://mediaccess.com
🔌 Backend:    https://mediaccess-backend.up.railway.app
🤖 AI Service: https://mediaccess-ai.up.railway.app
🗄️ Database:   MongoDB Atlas Cloud
```

---

## 🎉 **DEPLOYMENT COMPLETE!**

Your MediAccess platform is live! 🚀

### Next Steps:
1. Share URL with team
2. Set up monitoring (UptimeRobot)
3. Configure backups
4. Monitor database usage
5. Plan scaling for growth

---

## 📚 **More Details?**

→ See `DEPLOYMENT_GUIDE.md` for in-depth instructions
→ See `TROUBLESHOOTING.md` for common issues
→ See `README.md` for feature overview

---

**Happy Deployment!** 🎊
