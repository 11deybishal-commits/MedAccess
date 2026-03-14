# 🚀 MedAccess - Quick Start Guide

## ⚡ 5-Minute Setup

### Step 1: Get Your API Keys

1. **Google Maps API Key**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project
   - Enable Maps JavaScript API and Places API
   - Create an API key from Credentials section
   - Note: Don't forget to enable billing for the account

2. **MongoDB Atlas**
   - Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a cluster (free tier available)
   - Get your connection string

### Step 2: Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/medaccess
JWT_SECRET=your_super_secret_jwt_key_here_generate_random_string
NODE_ENV=development
PORT=5000
GOOGLE_PLACES_API_KEY=your_google_places_key_here
GOOGLE_MAPS_API_KEY=your_google_maps_key_here
FRONTEND_URL=http://localhost:5173
EOF

# Start the server
npm run dev
```

You should see: `🚀 MedAccess Server running on port 5000`

### Step 3: Frontend Setup

```bash
# Open new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key_here
EOF

# Start development server
npm run dev
```

You should see: `VITE v4.5.0  ready in XXX ms`

## ✅ Check if Everything Works

1. Open [http://localhost:5173](http://localhost:5173) in your browser
2. You should see the MedAccess home page
3. Try these actions:
   - Click "Find Hospitals" (no login required)
   - Scroll down to see emergency panel
   - Click "Sign Up" to create an account

## 🔑 First User Registration

1. Go to [Register Page](http://localhost:5173/register)
2. Fill in the form:
   - Name: Your Name
   - Email: your-email@example.com
   - Password: (minimum 6 characters)
   - Phone: (optional) +91-XXXXXXXXXX
   - City: (optional) Your City
3. Click "Create Account"
4. You'll be logged in automatically!

## 🧪 Test Features

### 1. Find Hospitals
- Go to "Nearby Hospitals"
- Your location will be auto-detected
- See list of hospitals with ratings and distances
- Click "Get Directions" to open Google Maps

### 2. Register as Blood Donor
- Go to "Blood Donors" page
- Click "Register as Donor"
- Fill in your blood group, city, phone
- Enable location (optional but recommended)
- Submit the form

### 3. Create a Blood Request
- Go to "Blood Requests"
- Click "Create Request"
- Fill in hospital name, blood group, urgency level
- Submit - donors will see your request!

### 4. Report Medical Resource
- Go to "Report Resource"
- Select resource type (Oxygen, ICU Beds, etc.)
- Add address and contact details
- Submit for admin verification

## 🐛 Troubleshooting

### Port Already in Use
```bash
# If port 5000 is already in use:
# Edit backend/.env and change PORT=5001

# If port 5173 is already in use:
# The dev server will automatically use 5174
```

### MongoDB Connection Error
```
Error: connect ENOTFOUND cluster.mongodb.net

Solution:
- Check MongoDB URI in .env is correct
- Make sure IP address is whitelisted in MongoDB Atlas
  (Go to Network Access → Add IP Address → Allow from Anywhere)
```

### Google API Error
```
Error: Invalid API key

Solution:
- Verify API key is correctly copied
- Make sure Maps JavaScript API is enabled
- Make sure Places API is enabled
- Check if billing is enabled on Google Cloud
```

### CORS Error
```
Access to XMLHttpRequest blocked:

Solution:
- Make sure FRONTEND_URL in backend .env matches your frontend URL
- If running locally, update to http://localhost:5173
```

## 📱 Test on Mobile

```bash
# Get your local IP
ipconfig getifaddr en0  # macOS
ip addr  # Linux
ipconfig  # Windows

# Then access from mobile on same wifi:
http://YOUR_LOCAL_IP:5173
```

## 🚀 Deploy to Production

### Deploy Backend to Render
1. Push code to GitHub
2. Go to [Render.com](https://render.com)
3. Create new Web Service
4. Connect your GitHub repository
5. Set environment variables from .env
6. Deploy!

### Deploy Frontend to Vercel
```bash
cd frontend
npm run build
# Then push to GitHub and connect to Vercel
```

## 📚 Next Steps

1. **Customize branding**: Update logo and colors in components
2. **Add more locations**: Expand search radius in Hospitals.jsx
3. **Analytics**: Add Google Analytics for tracking
4. **Admin Panel**: Build admin dashboard for resource verification
5. **Push Notifications**: Implement real-time alerts for blood requests
6. **SMS Integration**: Add SMS notifications via Twilio

## 🆘 Need Help?

### Check Backend Logs
```bash
# Terminal 1 - Backend
cd backend && npm run dev
# Watch for errors in console
```

### Check Frontend Console
```
Browser → F12 → Console tab
Check for any JavaScript errors
```

### Test API Endpoints with Curl
```bash
# Test health check
curl http://localhost:5000/health

# Test register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"123456"}'
```

## ✨ Pro Tips

1. **Use Postman** for easier API testing
2. **Enable React DevTools** browser extension for debugging
3. **Use MongoDB Compass Gui** to view database
4. **Check Network tab** in browser to see API requests
5. **Use VSCode REST Client** extension for quick API testing

## 🎯 Features Checklist

- [x] Hospital/Pharmacy locator with Google Maps
- [x] Blood donor registration and search
- [x] Blood request system
- [x] Medical resource reporting
- [x] User authentication (JWT)
- [x] Emergency quick access panel
- [x] Interactive maps
- [x] Responsive mobile design
- [x] Fully functional forms
- [x] Real-time location services

## 🎉 You're All Set!

The application is now ready to use. Start exploring and helping the community!

---

**Questions?** Check the main README.md or create an issue on GitHub.

**Found a bug?** Report it with steps to reproduce.

**Want to contribute?** Fork, make changes, and submit a PR!
