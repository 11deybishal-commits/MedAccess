# 🚀 MediAccess Complete Deployment Guide

**Complete step-by-step guide to deploy MediAccess Frontend, Backend, and AI/ML Service to production.**

---

## 📋 Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Database Setup (MongoDB)](#database-setup-mongodb)
3. [Backend Deployment](#backend-deployment)
4. [Frontend Deployment](#frontend-deployment)
5. [AI/ML Service Deployment](#ai-ml-service-deployment)
6. [Domain & SSL Setup](#domain--ssl-setup)
7. [CI/CD Pipeline](#cicd-pipeline)
8. [Monitoring & Maintenance](#monitoring--maintenance)

---

## ✅ Pre-Deployment Checklist

Before you start deploying, ensure you have:

- [ ] GitHub account (for version control)
- [ ] MongoDB Atlas account (free tier available)
- [ ] Google API credentials (Maps, Places, Generative AI)
- [ ] Choose hosting platform:
  - **Frontend**: Vercel (recommended), Netlify, or AWS S3 + CloudFront
  - **Backend**: Railway, Render, Heroku (free tier ended), or AWS EC2
  - **AI Service**: Railway, Render, or AWS EC2
- [ ] Domain name (optional but recommended)
- [ ] SSL certificate (auto-configured by most platforms)

### Required API Keys
- `GOOGLE_MAPS_API_KEY`
- `GOOGLE_PLACES_API_KEY`
- `GOOGLE_GENERATIVE_AI_KEY` (Gemini API)

---

# 🗄️ Database Setup (MongoDB)

## Step 1: Create MongoDB Atlas Account

### 1.1 Sign Up
1. Go to https://www.mongodb.com/cloud/atlas
2. Click **Sign Up**
3. Create account with email/password or Google
4. Verify email

### 1.2 Create Your First Cluster
1. Click **Create a Deployment**
2. Choose **Free Tier** (M0 - Shared)
3. Select **AWS** as cloud provider
4. Select **Region** closest to your users (us-east-1, eu-west-1, or ap-southeast-1)
5. Click **Create Deployment**
6. Wait 5-10 minutes for cluster to be ready

### 1.3 Set Database Access
1. In Atlas dashboard, go to **Database Access**
2. Click **Add New Database User**
3. Enter username: `mediaccess_admin`
4. Enter password: (use strong password, save it!)
5. Database User Privileges: **Atlas Admin**
6. Click **Add User**

### 1.4 Set Network Access
1. Go to **Network Access**
2. Click **Add IP Address**
3. Choose **Allow Access from Anywhere** (for development)
   - In production, add specific IPs
4. Click **Confirm**

### 1.5 Get Connection String
1. Go to **Databases** → Click **Connect**
2. Choose **Connect your application**
3. Select **Node.js** driver
4. Copy connection string: `mongodb+srv://mediaccess_admin:PASSWORD@cluster.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
5. Replace:
   - `PASSWORD` with your database password
   - `myFirstDatabase` with `mediaccess`

**Save this connection string for later!**

---

# 🔧 Backend Deployment

## Option 1: Deploy to Railway (Recommended - Easiest)

### Step 1: Prepare Code for Deployment

```bash
# 1.1 Navigate to backend
cd backend

# 1.2 Create production .env file
# Open backend/.env and ensure:
MONGODB_URI=mongodb+srv://mediaccess_admin:YOUR_PASSWORD@cluster.mongodb.net/mediaccess
JWT_SECRET=your_super_secret_jwt_key_min_32_chars_long
NODE_ENV=production
PORT=5000
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
GOOGLE_PLACES_API_KEY=your_google_places_api_key
FRONTEND_URL=https://your-frontend-domain.com

# 1.3 Install dependencies
npm install

# 1.4 Test build locally
npm run dev
# Press CTRL+C after testing
```

### Step 2: Push Code to GitHub

```bash
# 2.1 From root directory
cd c:\Users\bisha\Desktop\MediAccess

# 2.2 Initialize git (if not already done)
git init

# 2.3 Add all files
git add .

# 2.4 Make initial commit
git commit -m "Initial commit: MediAccess full stack"

# 2.5 Create repository on GitHub
# Go to https://github.com/new
# Name: MediAccess
# Description: AI-powered healthcare resource locator
# Choose Public/Private
# Don't initialize README (we already have one)

# 2.6 Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/MediAccess.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy Backend to Railway

1. Go to https://railway.app
2. Sign up with GitHub
3. Click **New Project**
4. Select **Deploy from GitHub repo**
5. Select `YOUR_USERNAME/MediAccess`
6. Choose **Backend** as the service name
7. **Add Plugin** → Choose **PostgreSQL** or **MongoDB**
   - Select MongoDB (or Railway will provide one)
8. Go to **Variables** tab
9. Add all environment variables:
   ```
   MONGODB_URI=mongodb+srv://mediaccess_admin:PASSWORD@cluster.mongodb.net/mediaccess
   JWT_SECRET=your_super_secret_jwt_key_min_32_chars_long
   NODE_ENV=production
   PORT=5000
   GOOGLE_MAPS_API_KEY=xxxx
   GOOGLE_PLACES_API_KEY=xxxx
   FRONTEND_URL=https://your-frontend-domain.com
   ```
10. Railway auto-detects Node.js and starts deployment
11. Wait for deployment to complete (see green checkmark)
12. Click **Generate Domain** to get your backend URL
    - Example: `https://mediaccess-backend-production.up.railway.app`

### Step 4: Verify Backend Deployment

```bash
# Test your backend health check
curl https://mediaccess-backend-production.up.railway.app/api/auth/health

# Should return: {"status":"ok"}
```

---

## Option 2: Deploy to Render

1. Go to https://render.com
2. Sign up with GitHub
3. Click **New +** → **Web Service**
4. Connect your GitHub repository
5. Configure:
   - **Name**: MediAccess-Backend
   - **Region**: Ohio (us-east)
   - **Branch**: main
   - **Build Command**: `npm install; npm run build` (if exists)
   - **Start Command**: `npm run dev` or `node server.js`
6. Add environment variables in settings
7. Deploy
8. Get URL: `https://mediaccess-backend.onrender.com`

---

# ⚛️ Frontend Deployment

## Option 1: Deploy to Vercel (Recommended - Best for React)

### Step 1: Prepare Frontend

```bash
# 1.1 Navigate to frontend
cd frontend

# 1.2 Update .env for production
# Open frontend/.env.production:
VITE_API_URL=https://mediaccess-backend-production.up.railway.app/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# 1.3 Build and test
npm run build

# Verify dist folder created successfully
```

### Step 2: Deploy to Vercel

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click **Add New** → **Project**
4. Import GitHub repository (`YOUR_USERNAME/MediAccess`)
5. Configure:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
6. Add Environment Variables:
   ```
   VITE_API_URL=https://your-backend-url.com/api
   VITE_GOOGLE_MAPS_API_KEY=xxxx
   ```
7. Click **Deploy**
8. Wait for deployment (usually 2-3 minutes)
9. Get URL: `https://your-project-name.vercel.app`

### Step 3: Configure Custom Domain (Optional)

1. In Vercel, go to **Settings** → **Domains**
2. Add your domain (e.g., `mediaccess.com`)
3. Update DNS records at your domain registrar:
   - Point to Vercel nameservers
   - Or add CNAME record
4. SSL certificate auto-generated by Vercel

### Step 4: Update Backend CORS & URLs

Go back to your backend environment variables and update:
```
FRONTEND_URL=https://your-vercel-domain.com
```

---

## Option 2: Deploy to Netlify

1. Go to https://netlify.com
2. Sign up with GitHub
3. Click **Add New Site** → **Import an existing project**
4. Choose GitHub repository
5. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Add Build Environment Variables:
   ```
   VITE_API_URL=https://your-backend-url.com/api
   VITE_GOOGLE_MAPS_API_KEY=xxxx
   ```
7. Deploy
8. Get URL: `https://your-site-name.netlify.app`

---

# 🤖 AI/ML Service Deployment

## Prerequisites
- Python 3.8+
- PyPDF2, Tesseract OCR installed
- Google Generative AI API key

## Option 1: Deploy to Railway

### Step 1: Prepare AI Service

```bash
# 1.1 Navigate to ai-service
cd ai-service

# 1.2 Create requirements.txt (if not exists)
pip freeze > requirements.txt

# 1.3 Create Procfile (for Railway)
echo "web: python -m uvicorn main:app --host 0.0.0.0 --port $PORT" > Procfile

# 1.4 Create .env for production
GOOGLE_GENERATIVE_AI_KEY=your_gemini_api_key
BACKEND_URL=https://your-backend-url.com
ENVIRONMENT=production
```

### Step 2: Ensure Tesseract OCR Available

```bash
# For Linux (Railway uses Linux):
# Railway will run this automatically if added to start script

# Create runtime.txt (Python version)
echo "python-3.11.0" > runtime.txt
```

### Step 3: Deploy to Railway

1. In Railway dashboard, click **New Project**
2. Select **Deploy from GitHub repo**
3. Choose MediAccess repository
4. Select `ai-service` directory
5. Add Environment Variables:
   ```
   GOOGLE_GENERATIVE_AI_KEY=xxxx
   BACKEND_URL=https://your-backend-url.com
   ENVIRONMENT=production
   PORT=8000
   ```
6. Railway detects Python and deploys
7. Get URL: `https://mediaccess-ai-service.up.railway.app`

### Step 4: Install Tesseract on Railway

Add this to `Procfile`:
```
web: apt-get install -y tesseract-ocr && python -m uvicorn main:app --host 0.0.0.0 --port $PORT
```

Or create `start.sh`:
```bash
#!/bin/bash
apt-get update
apt-get install -y tesseract-ocr
python -m uvicorn main:app --host 0.0.0.0 --port $PORT
```

Make executable:
```bash
chmod +x start.sh
```

---

## Option 2: Deploy to Render

1. Go to https://render.com
2. Click **New +** → **Web Service**
3. Connect GitHub repository
4. Configure:
   - **Name**: MediAccess-AI
   - **Runtime**: Python 3.11
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python -m uvicorn main:app --host 0.0.0.0 --port 8000`
5. Add Environment Variables:
   ```
   GOOGLE_GENERATIVE_AI_KEY=xxxx
   BACKEND_URL=https://your-backend-url.com
   ```
6. Deploy

---

## Option 3: Deploy to AWS EC2 (More Control)

### Step 1: Launch EC2 Instance

1. Go to AWS Console → EC2
2. **Launch Instance**
3. Choose:
   - **AMI**: Ubuntu Server 22.04 LTS
   - **Instance Type**: t2.medium (minimum for AI service)
   - **Storage**: 20GB SSD
4. Configure Security Group:
   - Allow SSH (port 22) from your IP
   - Allow HTTP (port 80) from anywhere
   - Allow HTTPS (port 443) from anywhere
5. Launch and save key pair

### Step 2: SSH into Instance

```bash
# Open terminal and SSH
ssh -i /path/to/key.pem ubuntu@your-public-ip

# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install Python, pip
sudo apt-get install -y python3-pip python3-venv

# Install Tesseract OCR
sudo apt-get install -y tesseract-ocr

# Install Node.js (for monitoring tools)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install git
sudo apt-get install -y git
```

### Step 3: Deploy AI Service

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/MediAccess.git
cd MediAccess/ai-service

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cat > .env << EOF
GOOGLE_GENERATIVE_AI_KEY=your_key
BACKEND_URL=https://your-backend-url.com
ENVIRONMENT=production
EOF

# Test run
python main.py
# Press CTRL+C after testing
```

### Step 4: Set Up as Service (Auto-run)

```bash
# Create systemd service file
sudo nano /etc/systemd/system/mediaccess-ai.service
```

Paste:
```ini
[Unit]
Description=MediAccess AI Service
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/MediAccess/ai-service
Environment="PATH=/home/ubuntu/MediAccess/ai-service/venv/bin"
ExecStart=/home/ubuntu/MediAccess/ai-service/venv/bin/python main.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable mediaccess-ai
sudo systemctl start mediaccess-ai
sudo systemctl status mediaccess-ai

# Check logs
sudo journalctl -u mediaccess-ai -f
```

### Step 5: Set Up Nginx Reverse Proxy

```bash
# Install Nginx
sudo apt-get install -y nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/mediaccess-ai
```

Paste:
```nginx
server {
    listen 80;
    server_name your-ai-domain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Enable and test:
```bash
sudo ln -s /etc/nginx/sites-available/mediaccess-ai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

# 🌐 Domain & SSL Setup

## Step 1: Register Domain

1. Go to domain registrar:
   - GoDaddy.com
   - Namecheap.com
   - Google Domains
2. Search for domain: `mediaccess.com` or similar
3. Purchase & register

## Step 2: Configure DNS Records

Assuming you have:
- **Frontend**: `vercel-domain.vercel.app` (Vercel)
- **Backend**: `mediaccess-backend.up.railway.app` (Railway)
- **AI Service**: `mediaccess-ai.up.railway.app` (Railway)

At your domain registrar, add these DNS records:

```
Type: CNAME
Name: @ (or leave blank)
Value: your-frontend.vercel.app
TTL: 3600

Type: CNAME
Name: api
Value: mediaccess-backend.up.railway.app
TTL: 3600

Type: CNAME
Name: ai
Value: mediaccess-ai.up.railway.app
TTL: 3600

Type: CNAME
Name: www
Value: your-frontend.vercel.app
TTL: 3600
```

Result:
- `mediaccess.com` → Frontend
- `api.mediaccess.com` → Backend
- `ai.mediaccess.com` → AI Service

## Step 3: Get SSL Certificate

With Vercel, Railway, and Render:
- **SSL certificates auto-generated** for free
- Auto-renewal handled
- No additional steps needed

For AWS EC2, use Let's Encrypt:
```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot certonly --nginx -d your-ai-domain.com
sudo systemctl restart nginx
```

---

# 🔄 CI/CD Pipeline

## GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy MediAccess

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy Backend to Railway
        uses: railway-app/railroad-action@v0
        with:
          token: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy Frontend to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
          working-directory: ./frontend

  deploy-ai:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy AI to Railway
        uses: railway-app/railroad-action@v0
        with:
          token: ${{ secrets.RAILWAY_TOKEN }}
```

Add secrets to GitHub:
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add:
   - `RAILWAY_TOKEN` (from Railway)
   - `VERCEL_TOKEN` (from Vercel)

---

# 📊 Monitoring & Maintenance

## Step 1: Set Up Monitoring

### Backend Health Check

```bash
# Add health endpoint to backend (backend/routes/healthRoutes.js):
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date(),
    uptime: process.uptime()
  });
});
```

Monitor with:
```bash
# Using UptimeRobot (free)
# 1. Go to https://uptimerobot.com
# 2. Create Monitor
# 3. URL: https://api.mediaccess.com/api/health
# 4. Check interval: 5 minutes
# 5. Alerts to email
```

### Database Monitoring

In MongoDB Atlas:
1. Go to **Monitoring**
2. View:
   - Query performance
   - Disk usage
   - Connection count
3. Set alerts for:
   - High memory usage (>80%)
   - High disk usage (>80%)

## Step 2: Set Up Logging

### Backend Logs

```bash
# Access logs on Railway/Render dashboard
# Realtime logs visible in deployment logs tab
```

### Frontend Error Tracking

Add Sentry:
```bash
npm install @sentry/react

# In frontend/src/main.jsx:
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production"
});
```

Go to https://sentry.io to get DSN

## Step 3: Backup Strategy

### MongoDB Automated Backups

1. In MongoDB Atlas, go to **Backup**
2. Backups run automatically every 6 hours
3. Retention: 7 days (free tier)
4. Download backups if needed

### Code Backups

```bash
# Tag releases
git tag -a v1.0.0 -m "Production release"
git push origin v1.0.0
```

## Step 4: Performance Optimization

### Frontend Optimization
- Already using Vite (fast!)
- Enable Vercel image optimization
- Set cache headers

### Backend Optimization
```javascript
// Enable compression (backend/server.js)
const compression = require('compression');
app.use(compression());
```

### Database Optimization
- Index frequently queried fields
- Monitor slow queries
- Set up read replicas

## Step 5: Scaling Checklist

When you have 1000+ users:

- [ ] Enable database replication (MongoDB)
- [ ] Set up CDN for frontend (Cloudflare)
- [ ] Add Redis caching for backend
- [ ] Upgrade AI service to GPU instance
- [ ] Set up load balancer for backend
- [ ] Enable horizontal scaling

---

# 📱 Post-Deployment Testing

## Test Checklist

```
Frontend:
☐ Navigation works
☐ Login/Registration functional
☐ Maps load correctly
☐ Sound effects working
☐ Responsive on mobile
☐ Images loading properly

Backend:
☐ All API endpoints responding
☐ Authentication working
☐ Database connections stable
☐ Error handling working
☐ Rate limiting active

AI Service:
☐ Medical report upload works
☐ OCR extraction successful
☐ Analysis generating summaries
☐ Response time < 5 seconds
☐ Error handling graceful
```

### Automated Testing

```bash
# Test all endpoints
curl -X POST https://api.mediaccess.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password"}'

# Test AI service
curl -X POST https://ai.mediaccess.com/analyze-report \
  -F "file=@report.pdf"
```

---

# 🚨 Troubleshooting Deployment

## Common Issues

### Backend not connecting to database
```
Solution:
1. Verify MONGODB_URI in environment variables
2. Check IP whitelist in MongoDB Atlas
3. Ensure database user has correct password
4. Test with: node -c "console.log(process.env.MONGODB_URI)"
```

### Frontend not loading APIs
```
Solution:
1. Verify VITE_API_URL in .env.production
2. Check CORS settings in backend
3. Verify backend is running
4. Check network tab in browser dev tools
```

### AI service timeout
```
Solution:
1. Increase timeout: set timeout to 60s in frontend
2. Upgrade instance size (t2.medium minimum)
3. Enable GPU on Railway/Render
4. Check Tesseract installation
```

### SSL certificate issues
```
Solution:
1. Wait 24-48 hours for DNS to propagate
2. Clear browser cache
3. Force HTTPS redirect
4. Verify DNS records at whatsmydns.net
```

---

# 📞 Support Resources

- **Railway Support**: https://railway.app/support
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas Help**: https://docs.atlas.mongodb.com
- **Google Generative AI**: https://makersuite.google.com/app/apikey

---

## Final Checklist Before Going Live

- [ ] All code committed to GitHub
- [ ] Environment variables configured
- [ ] Database seeded with test data
- [ ] SSL certificates active
- [ ] DNS records propagated
- [ ] Monitoring set up
- [ ] Backups configured
- [ ] Error logging enabled
- [ ] Team has access credentials
- [ ] Tested on mobile & desktop
- [ ] Performance acceptable
- [ ] Security audit completed

---

**Deployment Complete!** 🎉

Your MediAccess platform is now live and ready for users.

For updates: Push to main branch → GitHub Actions auto-deploys → Live in minutes!

Questions? Check TROUBLESHOOTING.md or create an issue on GitHub.
