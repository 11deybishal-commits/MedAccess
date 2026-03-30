# 🏗️ MediAccess Deployment Architecture

## Complete Deployment Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           END USERS / CLIENTS                               │
│                        (Web Browser / Mobile)                               │
└──────────────────────────────┬──────────────────────────────────────────────┘
                               │
                               │ HTTPS
                               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CLOUDFLARE / CDN (Optional)                          │
│                    Global cache & DDoS Protection                           │
└──────────────────────────────┬──────────────────────────────────────────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                ▼              ▼              ▼
    ┌─────────────────┐ ┌──────────────┐ ┌──────────────┐
    │   FRONTEND      │ │   BACKEND    │ │  AI SERVICE  │
    ├─────────────────┤ ├──────────────┤ ├──────────────┤
    │  React + Vite   │ │ Node + Exp   │ │ FastAPI + ML │
    │  Deployed on    │ │ Deployed on  │ │ Deployed on  │
    │    VERCEL       │ │   RAILWAY    │ │   RAILWAY    │
    │                 │ │              │ │              │
    │ PORT: 3000/443  │ │ PORT: 5000   │ │ PORT: 8000   │
    │    HTTPS        │ │    HTTPS     │ │     HTTPS    │
    └────────────────█│ └──────────────┘ └──────────────┘
                    │         │              │
                    │         │ REST API     │ REST API
                    │         │ (JSON)       │ (JSON/Form)
                    │         │              │
                    │         └──────┬───────┘
                    │                │
                    │       ┌────────▼────────┐
                    │       │  BACKEND SERVER │
                    │       ├──────────────────┤
                    │       │  • Auth Handler  │
                    │       │  • API Routes    │
                    │       │  • OCR Processing│
                    │       │  • File Upload   │
                    │       │  • Business Logic│
                    │       └────────┬─────────┘
                    │                │
                    │         ┌──────▼──────┐
                    │         │ MongoDB      │
                    │         │  DATABASE    │
                    │         ├──────────────┤
                    │         │ • Users      │
                    │         │ • Reports    │
                    │         │ • Donors     │
                    │         │ • Requests   │
                    │         │ • Resources  │
                    │         └──────────────┘
                    │
                    │   ┌─────────────────────┐
                    │   │  Google APIs        │
                    └──▶├─────────────────────┤
                        │ • Maps API          │
                        │ • Places API        │
                        │ • Generative AI     │
                        │ (Gemini)            │
                        └─────────────────────┘
```

---

## Detailed Component Architecture

### 1️⃣ FRONTEND LAYER (Vercel)

```
┌────────────────────────────────────────┐
│         VERCEL DEPLOYMENT              │
├────────────────────────────────────────┤
│  Domain: mediaccess.com                │
│  SSL: Auto ✅                          │
│  CDN: Global Cache ✅                  │
│  Auto-scaling: Yes ✅                  │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │     React Application            │ │
│  ├──────────────────────────────────┤ │
│  │ • Pages (Login, Dashboard, etc)  │ │
│  │ • Components (Cards, Maps, etc)  │ │
│  │ • Context (Auth, Location)       │ │
│  │ • Services (API calls)           │ │
│  │ • Sound Effects Engine           │ │
│  │ • Text-to-Speech                 │ │
│  │ • 3D Organ Viewer                │ │
│  └──────────────────────────────────┘ │
│                                        │
│  Build: npm run build (Vite)           │
│  Output: dist/ folder                  │
│  Deployment: Automatic on git push     │
└────────────────────────────────────────┘
```

### 2️⃣ BACKEND LAYER (Railway)

```
┌──────────────────────────────────────────┐
│      RAILWAY DEPLOYMENT (Backend)        │
├──────────────────────────────────────────┤
│  Domain: api.mediaccess.com              │
│  Auto-scaling: Horizontal ✅            │
│  Health Check: Every 30s ✅             │
│  Auto-restart on crash: Yes ✅          │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  EXPRESS.JS SERVER                 │ │
│  ├────────────────────────────────────┤ │
│  │  Routes:                           │ │
│  │  ├─ /api/auth/                     │ │
│  │  ├─ /api/hospitals/                │ │
│  │  ├─ /api/pharmacies/               │ │
│  │  ├─ /api/blood-donors/             │ │
│  │  ├─ /api/blood-requests/           │ │
│  │  ├─ /api/resources/                │ │
│  │  └─ /api/ai/                       │ │
│  │                                    │ │
│  │  Middleware:                       │ │
│  │  ├─ JWT Authentication             │ │
│  │  ├─ CORS                           │ │
│  │  ├─ Error Handling                 │ │
│  │  └─ Rate Limiting                  │ │
│  │                                    │ │
│  │  Controllers:                      │ │
│  │  ├─ Auth Controller                │ │
│  │  ├─ Hospital Controller            │ │
│  │  ├─ AI Controller                  │ │
│  │  ├─ Donor Controller               │ │
│  │  └─ Resource Controller            │ │
│  └────────────────────────────────────┘ │
│                                          │
│  Environment: Node.js 18                 │
│  Memory: 1GB (auto-upgradeable)          │
└──────────────────────────────────────────┘
```

### 3️⃣ AI/ML SERVICE LAYER (Railway)

```
┌──────────────────────────────────────────┐
│     RAILWAY DEPLOYMENT (AI Service)      │
├──────────────────────────────────────────┤
│  Domain: ai.mediaccess.com               │
│  GPU: Optional (upgradeable) 🚀          │
│  Memory: 2GB (for ML models)             │
│  Auto-scaling: Horizontal ✅            │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  FASTAPI SERVER                    │ │
│  ├────────────────────────────────────┤ │
│  │  Endpoints:                        │ │
│  │  ├─ POST /analyze-report           │ │
│  │  ├─ GET /health                    │ │
│  │  └─ POST /symptom-check            │ │
│  │                                    │ │
│  │  ┌───────────────────────────────┐ │ │
│  │  │  ML Pipeline                  │ │ │
│  │  ├───────────────────────────────┤ │ │
│  │  │  1. File Ingestion            │ │ │
│  │  │  2. OCR (Tesseract)           │ │ │
│  │  │  3. Image Analysis (TF/CNN)   │ │ │
│  │  │  4. NLP Text Analysis (spaCy) │ │ │
│  │  │  5. LLM (Gemini API)          │ │ │
│  │  │  6. Output Generation         │ │ │
│  │  └───────────────────────────────┘ │ │
│  │                                    │ │
│  │  Models Loaded:                    │ │
│  │  ├─ ResNet (Medical Images)        │ │
│  │  ├─ Symptom Classifier             │ │
│  │  ├─ Risk Assessment Model          │ │
│  │  └─ Report Summarizer              │ │
│  └────────────────────────────────────┘ │
│                                          │
│  Dependencies:                           │
│  ├─ FastAPI, Uvicorn                    │ │
│  ├─ TensorFlow/Keras                    │ │
│  ├─ Tesseract OCR                       │ │
│  ├─ OpenCV                              │ │
│  ├─ spaCy (NLP)                         │ │
│  └─ Google Generative AI SDK            │ │
└──────────────────────────────────────────┘
```

### 4️⃣ DATABASE LAYER (MongoDB Atlas)

```
┌──────────────────────────────────────────┐
│   MONGODB ATLAS (Database)               │
├──────────────────────────────────────────┤
│  Tier: M0 (Free) or M5 (Paid)            │
│  Region: us-east-1 / eu-west-1          │
│  Backup: Every 6 hours ✅               │
│  Encryption: At rest & in transit ✅    │
│  Replication: 3-node replica set ✅     │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  Collections:                      │ │
│  ├────────────────────────────────────┤ │
│  │  • users {email, password, etc}    │ │
│  │  • blooddonors {blood_group, etc}  │ │
│  │  • bloodrequests {status, etc}     │ │
│  │  • reports {analysis_result}       │ │
│  │  • resourcereports {type, qty}     │ │
│  │  • appointments {schedule_data}    │ │
│  │  • sessions {jwt_tokens}           │ │
│  └────────────────────────────────────┘ │
│                                          │
│  Indexes:                                │
│  ├─ email (unique)                       │
│  ├─ blood_group + location               │
│  ├─ userId (for quick lookup)            │
│  └─ createdAt (for sorting)              │
│                                          │
│  Retention: Depends on plan              │
└──────────────────────────────────────────┘
```

---

## Network & Traffic Flow

```
                          INTERNET
                           │ HTTPS
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
    USER'S            USER'S             USER'S
    BROWSER           MOBILE             TABLET
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                    ┌──────▼──────┐
                    │   DNS       │
                    │ Resolution  │
                    └──────┬──────┘
                           │
                    ┌──────▼──────────┐
                    │   Vercel CDN    │
                    │  (Global Edge)  │
                    └──────┬──────────┘
                           │
                ┌──────────┼──────────┐
                │          │          │
                ▼          ▼          ▼
            Frontend   API Calls   Webhooks
             HTML/JS   (REST/JSON) (Events)
                │          │          │
                └──────────┼──────────┘
                           │
                    ┌──────▼──────┐
                    │  Railway    │
                    │  Load Bal   │
                    └──────┬──────┘
                           │
                ┌──────────┴──────────┐
                │                     │
                ▼                     ▼
            Backend          AI Service
            Server           Server
            (Node.js)        (FastAPI)
                │                     │
                └──────┬──────────────┘
                       │
                ┌──────▼──────────┐
                │   MongoDB       │
                │   Cluster       │
                │   (3 nodes)     │
                └──────┬──────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
     Google        Google           Google
     Maps API      Places API       Gemini AI
        │              │              │
        └──────────────┴──────────────┘
```

---

## Deployment Timeline

```
Day 0: Setup
├─ MongoDB Atlas account created
├─ GitHub repository created
├─ API keys obtained
└─ Code pushed to main branch

Day 1: Deployment (QUICK_DEPLOY.md)
├─ 09:00 AM ─ Deploy Backend to Railway (5 min)
├─ 09:05 AM ─ Deploy Frontend to Vercel (5 min)
├─ 09:10 AM ─ Deploy AI Service to Railway (5 min)
├─ 09:15 AM ─ Configure DNS records (5 min)
├─ 09:20 AM ─ Verify all services (5 min)
└─ 09:25 AM ─ LIVE! 🎉

Day 2: Optimization
├─ Enable CDN
├─ Set up monitoring
├─ Configure backups
└─ Performance tuning

Day 3+: Operations
├─ Monitor logs
├─ Fix issues
├─ Plan scaling
└─ Add features
```

---

## Scaling Timeline

```
PHASE 1: MVP (0-1,000 users)
├─ Single instance backend (Railway t2.micro)
├─ Single instance AI (Railway t2.small)
├─ Free MongoDB Atlas (M0)
└─ Vercel Free tier

PHASE 2: Growth (1,000-10,000 users)
├─ Upgrade to Railway Pro ($12/mo)
├─ Add Redis cache
├─ MongoDB Atlas M2 ($9/mo)
├─ Vercel Pro ($20/mo)
└─ Enable horizontal scaling

PHASE 3: Scale (10,000+ users)
├─ Railway Pro + multiple instances
├─ MongoDB Atlas M10+ with sharding
├─ Upgrade AI to GPU instances
├─ Private CDN (Cloudflare Pro)
├─ Load balancer
└─ Database read replicas
```

---

## Cost Breakdown (Monthly)

### Minimal Setup (Free)
```
Frontend (Vercel)         $0
Backend (Railway)         $0 (free tier)
AI Service (Railway)      $0 (free tier)
MongoDB Atlas             $0 (M0 cluster)
Google APIs               $0 (free tier credits)
─────────────────────────────
Total Monthly             $0 ✅
```

### Production Setup (Recommended)
```
Frontend (Vercel Pro)     $20
Backend (Railway Pro)     $12
AI Service (Railway Pro)  $12
MongoDB Atlas (M2)        $9
Google APIs               ~$5
Monitoring (Sentry)       $0 (free tier)
─────────────────────────────
Total Monthly             ~$58/mo
```

### Enterprise Setup (10k+ users)
```
Frontend (Vercel)         $100+ (usage)
Backend (Railway Pro+)    $50+ (multiple instances)
AI Service (GPU)          $100+ (GPU instances)
MongoDB Atlas (M10)       $57+
Google APIs               $50+
CDN (Cloudflare Pro)      $200+
Monitoring & Logging      $50+
─────────────────────────────
Total Monthly             $600+/mo
```

---

## High Availability Setup (Future)

```
                    GLOBAL USERS
                         │
            ┌────────────┼────────────┐
            │            │            │
        Europe        Americas     Asia-Pacific
            │            │            │
        ┌───▼───┐    ┌───▼───┐    ┌───▼───┐
        │Vercel │    │Vercel │    │Vercel │
        │EU CDN │    │US CDN │    │AP CDN │
        └───┬───┘    └───┬───┘    └───┬───┘
            │            │            │
        ┌───▼───┐    ┌───▼───┐    ┌───▼───┐
        │Railway│    │Railway│    │Railway│
        │EU     │    │US     │    │AP     │
        │Backend│    │Backend│    │Backend│
        └───┬───┘    └───┬───┘    └───┬───┘
            │            │            │
            └────────────┼────────────┘
                         │
             ┌───────────┼───────────┐
             │                       │
         ┌───▼────┐         ┌───────▼──┐
         │MongoDB │         │MongoDB   │
         │Primary │         │Secondary │
         │(EU)    │         │(US)      │
         └────────┘         └──────────┘
             ├─────────────────────────┤
             │ Replication: Real-time  │
             └─────────────────────────┘
```

---

## Monitoring Dashboard

```
┌─────────────────────────────────────────────────┐
│          MEDIACCESS OPERATIONS DASHBOARD        │
├─────────────────────────────────────────────────┤
│                                                 │
│  Frontend (Vercel)        Backend (Railway)     │
│  ├─ Uptime: 99.99%        ├─ Uptime: 99.95%    │
│  ├─ Response: 150ms       ├─ Response: 200ms   │
│  ├─ Requests: 10M/mo      ├─ Requests: 5M/mo   │
│  ├─ Deployments: 24       ├─ Builds: 24        │
│  └─ Last Deploy: 2m ago   └─ Last Deploy: 2m   │
│                                                 │
│  AI Service (Railway)     Database (MongoDB)    │
│  ├─ Uptime: 99.9%         ├─ Uptime: 99.99%    │
│  ├─ Avg Time: 3.2s        ├─ Size: 2.1GB       │
│  ├─ Reports Analyzed: 1K  ├─ Documents: 50K    │
│  ├─ Success Rate: 98%     ├─ Connections: 150  │
│  └─ GPU Util: 45%         └─ Replication: OK   │
│                                                 │
│  ALERTS                                        │
│  └─ All systems OPERATIONAL ✅                │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Disaster Recovery Plan

```
Component      Backup Strategy        Recovery Time    Retention
─────────────────────────────────────────────────────────────────
Frontend       Git commit history     < 5 minutes      Infinite
               Vercel snapshot every  
               deployment

Backend        Git commit history     < 5 minutes      Infinite
               Docker images on Docker Hub
               Environment backups

Database       MongoDB automatic      < 1 hour         7 days
               daily backups
               Point-in-time recovery 5 min intervals

API Keys       Encrypted .env files   < 5 minutes      Git history
               in secure storage

User Data      Daily MongoDB backups  < 1 hour         30 days
               Encrypted at rest
               Replicated across regions
```

---

## Security Architecture

```
┌─────────────────────────────────────────────────┐
│              SECURITY LAYERS                    │
├─────────────────────────────────────────────────┤
│                                                 │
│  Layer 1: Network                              │
│  ├─ HTTPS/TLS encryption (all traffic)        │
│  ├─ DDoS protection (Cloudflare)              │
│  └─ Rate limiting (backend)                   │
│                                                 │
│  Layer 2: Application                          │
│  ├─ JWT token authentication                  │
│  ├─ bcryptjs password hashing                 │
│  ├─ Input validation & sanitization           │
│  ├─ CORS policy enforcement                   │
│  └─ Error message obfuscation                 │
│                                                 │
│  Layer 3: Data                                 │
│  ├─ MongoDB encryption at rest                │
│  ├─ Encrypted sensitive fields                │
│  ├─ Database user authentication              │
│  └─ IP whitelist (DB access)                  │
│                                                 │
│  Layer 4: Secrets Management                   │
│  ├─ Environment variables secured             │
│  ├─ API keys double-encrypted                 │
│  ├─ OAuth 2.0 for third-party APIs           │
│  └─ Secret rotation policy                    │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

**This architecture provides scalability, reliability, and security for MediAccess!**

For detailed deployment steps, see → `DEPLOYMENT_GUIDE.md`
