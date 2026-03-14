# 🚀 MedAccess - Deployment Guide

Complete guide to deploy MedAccess to production.

## Deployment Options

| Platform | Backend | Frontend | Database | Cost | Setup Time |
|----------|---------|----------|----------|------|------------|
| **Vercel** | ❌ | ✅ Best | - | Free | 5 min |
| **Render** | ✅ Best | ✅ | - | Free Tier | 10 min |
| **Railway** | ✅ | ✅ | ✅ | $5/month | 10 min |
| **Heroku** | ✅ | ✅ | - | Paid | 10 min |
| **AWS** | ✅ | ✅ | ✅ | Variable | 30 min |

## 📍 Quick Reference

- **Backend to:** Render or Railway
- **Frontend to:** Vercel (optimal)
- **Database:** MongoDB Atlas (cloud)
- **Time:** 30 minutes total

---

## Phase 1: Prepare for Production

### Step 1: Update Environment Variables

**Backend (`backend/.env`):**
```env
# Production settings
MONGODB_URI=mongodb+srv://prod_user:strong_password@prod-cluster.mongodb.net/medaccess?retryWrites=true&w=majority
JWT_SECRET=generate_a_new_secret_for_production
NODE_ENV=production
PORT=5000
GOOGLE_PLACES_API_KEY=your_production_key
GOOGLE_MAPS_API_KEY=your_production_key
FRONTEND_URL=https://your-frontend-domain.com
```

**Frontend (`frontend/.env.production`):**
```env
VITE_API_URL=https://your-backend-domain.com/api
VITE_GOOGLE_MAPS_API_KEY=your_production_key
```

### Step 2: Generate Production Keys

```bash
# Generate new JWT secret for production
# On Mac/Linux:
openssl rand -base64 32

# On Windows PowerShell:
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

# Use Google Cloud Console to generate production API keys
# (Use separate API keys for development and production)
```

### Step 3: Database Setup

1. Create production MongoDB Atlas cluster
2. Set strong password (min 16 characters)
3. Whitelist production server IPs only
4. Enable automated daily backups
5. Test connection before deploying

### Step 4: Security Checklist

- [ ] All passwords changed from defaults
- [ ] API keys regenerated for production
- [ ] CORS updated to production domain
- [ ] HTTPS enabled everywhere
- [ ] Database backups configured
- [ ] Error logging set up
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints

---

## Method 1: Deploy Backend to Render (⭐ Recommended)

### Step 1: Setup Your Repository

```bash
# Push backend code to GitHub
cd backend
git init
git add .
git commit -m "Ready for production"
git push origin main
```

### Step 2: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub account
3. Authorize Render to access GitHub

### Step 3: Create New Service

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Choose backend folder repository

### Step 4: Configure Service

Fill in the following:

| Field | Value |
|-------|-------|
| **Name** | `medaccess-backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Environment** | `production` |

### Step 5: Add Environment Variables

Click "Environment" and add:

```
MONGODB_URI = mongodb+srv://user:pass@cluster.mongodb.net/medaccess
JWT_SECRET = your_secret_here
NODE_ENV = production
PORT = 5000
GOOGLE_PLACES_API_KEY = your_key
GOOGLE_MAPS_API_KEY = your_key
FRONTEND_URL = https://your-frontend-domain.com
```

### Step 6: Deploy

Click "Deploy Web Service"

Wait for:
1. Build (2-3 minutes)
2. Deploy (automatic)
3. Check dashboard for status

**Your backend URL:** `https://medaccess-backend.onrender.com`

### Step 7: Update Frontend

Update `frontend/.env.production`:
```
VITE_API_URL=https://medaccess-backend.onrender.com/api
```

---

## Method 2: Deploy Backend to Railway

### Step 1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create new project

### Step 2: Deploy

```bash
# Login to Railway CLI
npm i -g @railway/cli
railway login

# Navigate to backend
cd backend

# Initialize Railway
railway init

# Deploy
railway up
```

### Step 3: Add Environment Variables

Railway Dashboard → Variables:

```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret
NODE_ENV=production
...
```

**Your backend URL:** `https://medaccess-api.railway.app`

---

## Method 3: Deploy Frontend to Vercel (⭐ Best Option)

### Step 1: Prepare Repository

```bash
# Push frontend to GitHub
cd frontend
git init
git add .
git commit -m "Ready for production"
git push origin main
```

### Step 2: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Authorize Vercel

### Step 3: Import Project

1. Click "Import Project"
2. Select your frontend repository
3. Click "Import"

### Step 4: Configure

Framework: **Vite**

Environment Variables:
```
VITE_API_URL = https://your-backend-url.com/api
VITE_GOOGLE_MAPS_API_KEY = your_key
```

### Step 5: Deploy

Click "Deploy"

Wait for build and deployment (2-3 minutes)

**Your frontend URL:** `https://medaccess.vercel.app`

---

## Method 4: Deploy Everything with Railway (All-in-One)

### Complete Setup in One Platform

```bash
# 1. Create Railway account and login
npm install -g @railway/cli
railway login

# 2. Create project
cd /path/to/medaccess
railway init

# 3. Create backend service
cd backend
railway service add

# 4. Create frontend service
cd ../frontend
railway service add

# 5. Link MongoDB Atlas
# Go to Railway Dashboard → Connect External Database

# 6. Deploy all
railway up
```

---

## deploy to AWS (Professional setup)

### Using Elastic Beanstalk

```bash
# Install EB CLI
npm install -g @aws-amplify/cli

# Configure AWS credentials
eb init

# Create environment
eb create production

# Deploy
eb deploy

# Monitor
eb open
```

---

## 🔄 Post-Deployment Steps

### Step 1: Test All Features

```bash
# Test backend health
curl https://your-backend-url.com/api/auth/profile

# Test hospital search
curl "https://your-backend-url.com/api/hospitals/nearby?latitude=28.6139&longitude=77.2090"

# Test frontend loads
Visit https://your-frontend-url.com
```

### Step 2: Setup Domain Names

**For Backend:**
- Go to your hosting provider (Render/Railway)
- Add custom domain
- Update DNS records

**For Frontend:**
- Use Vercel's free domain or add custom domain
- Configure DNS

### Step 3: Setup SSL Certificate

Most platforms handle this automatically:
- ✅ Vercel: Automatic
- ✅ Render: Automatic  
- ✅ Railway: Automatic
- AWS: Use AWS Certificate Manager

### Step 4: Setup Monitoring

**Render/Railway Dashboards:**
- View logs in real-time
- Monitor CPU/Memory
- Alert on failures

**Google Cloud Console:**
- Monitor API usage
- View pricing
- Set spending alerts

### Step 5: Configure Backups

**MongoDB Atlas:**
1. Go to Cluster → Backup
2. Enable automated daily snapshots
3. Set 30-day retention

---

## 🔒 Production Security

### Database Security

```
✅ IP Whitelist: Only production server IPs
✅ Strong Password: 16+ characters
✅ SSL Connection: Enabled
✅ Auto Backup: Daily for 30 days
✅ Activity Monitoring: Enabled
```

### Backend Security

```bash
# Install security packages
npm install helmet express-rate-limit cors express-validator

# Update server.js to use them
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));
```

### API Keys Security

```
✅ Use environment variables only
✅ Regenerate keys for production
✅ Restrict API key permissions (IP whitelist)
✅ Monitor key usage
✅ Rotate keys quarterly
```

### Frontend Security

```
✅ HTTPS only
✅ No hardcoded secrets
✅ CSP headers configured
✅ XSS protection enabled
✅ CSRF tokens for forms
```

---

## 📊 Deployment Status Check

After deployment, verify:

```bash
# Backend health
curl -i https://your-backend-url.com/health

# Frontend loads
curl -i https://your-frontend-url.com

# API response
curl https://your-backend-url.com/api/hospitals/nearby \
  -H "Content-Type: application/json" \
  -d '{"latitude":28.6139,"longitude":77.2090}'
```

Expected responses:
- Backend: 200 OK
- Frontend: 200 OK
- API: 200 OK with data

---

## 🐛 Troubleshooting Deployment

### Backend Won't Start

**Error:** `Port already in use`
```
Solution: Render/Railway handle ports automatically
Check: Restart service from dashboard
```

**Error:** `MongoDB Connection Refused`
```
Solution: 
1. Verify MONGODB_URI environment variable
2. Check IP whitelist in MongoDB Atlas
3. Ensure user password is correct
```

**Error:** `Cannot find module`
```
Solution:
1. Verify package.json exists
2. Try: rm -rf node_modules && npm install
3. Push and redeploy
```

### Frontend Won't Load

**Error:** `API not found` in console
```
Solution:
1. Verify VITE_API_URL in production env
2. Check backend is deployed and running
3. Test API endpoint in browser
```

**Error:** `Google Maps not loading`
```
Solution:
1. Verify VITE_GOOGLE_MAPS_API_KEY is set
2. Check API key has Maps JS API enabled
3. Verify billing enabled on Google Cloud
```

### CORS Errors

**Error:** `Access to XMLHttpRequest blocked by CORS`
```
Solution:
1. Backend: Update FRONTEND_URL in .env
2. Backend: Update CORS allowedOrigins
3. Use full domain including https://
4. Restart backend service
```

---

## 📈 Scaling Tips

### Database Scaling

- Start: MongoDB Atlas Free Tier (512MB)
- Growing: M2 Shared Tier (2GB)
- Production: M10+ Dedicated Cluster

### Backend Scaling

- Current: Single Render/Railway service
- Growing: Add load balancer
- Large: Docker container orchestration

### Frontend Scaling

- Vercel handles auto-scaling
- Use Edge Caching
- Optimize images

---

## 💰 Cost Estimation

### Monthly Costs (Estimation)

| Service | Free Tier | Paid Tier |
|---------|-----------|-----------|
| Render (Backend) | $0 (sleeps) | $7/month |
| Vercel (Frontend) | $0 | Pro: $20/month |
| MongoDB Atlas | $0 (512MB) | M2: $9/month |
| **Total** | **$0** | **~$36/month** |

**Startup Usage:** Free tier is usually enough

---

## 🔄 Continuous Deployment

### GitHub Actions (Auto-Deploy)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy Backend
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
        run: |
          npm install -g @railway/cli
          railway up
```

---

## ✅ Deployment Checklist

**Before Going Live:**

- [ ] All environment variables set correctly
- [ ] Production database configured and tested
- [ ] API keys regenerated for production
- [ ] CORS whitelist updated
- [ ] HTTPS verified on all domains
- [ ] Database backups enabled
- [ ] Monitoring and alerts configured
- [ ] Email notifications working
- [ ] Error logging set up
- [ ] Rate limiting configured
- [ ] Security headers added
- [ ] SSL certificate valid
- [ ] Domain DNS properly configured

**After Deployment:**

- [ ] All endpoints tested
- [ ] Forms submission working
- [ ] Location services operational
- [ ] Maps loading correctly
- [ ] Performance acceptable
- [ ] User authentication working
- [ ] Admin features accessible
- [ ] Logs monitoring active

---

## 📞 Support & Monitoring

### Setup Monitoring Alerts

**Render Dashboard:**
1. Settings → Notifications
2. Add email for service alerts
3. Enable deployed notifications

**MongoDB Atlas:**
1. Alerts → Create Alert
2. Trigger: Database exceeds thresholds
3. Notification: Email

**Google Cloud:**
1. Monitoring → Uptime Checks
2. Create check for API endpoint
3. Alert on failure

---

## 🎯 Next Steps

1. **Promote:** Share live URL with users
2. **Monitor:** Watch logs for errors
3. **Optimize:** Improve performance
4. **Feedback:** Collect user feedback
5. **Iterate:** Deploy updates via GitHub push

---

## 🚀 You're Live!

Congratulations! Your MedAccess application is now live in production!

**Share Your Success:**
- Add to portfolio
- Share on social media
- Submit to hackathons
- Get user feedback

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [MongoDB Atlas Best Practices](https://docs.atlas.mongodb.com)
- [Node.js Production Checklist](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

Happy deploying! 🎉
