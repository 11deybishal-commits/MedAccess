# 🔧 MedAccess - Troubleshooting Guide

Common issues and solutions for MedAccess setup, development, and deployment.

## Quick Navigation

- [🚀 Startup Issues](#startup-issues)
- [🗄️ Database Issues](#database-issues)
- [🔗 API Issues](#api-issues)
- [🖥️ Frontend Issues](#frontend-issues)
- [🔑 Authentication Issues](#authentication-issues)
- [📍 Location/Maps Issues](#locationmaps-issues)
- [📱 Mobile Issues](#mobile-issues)
- [🚀 Deployment Issues](#deployment-issues)
- [⚡ Performance Issues](#performance-issues)

---

## 🚀 Startup Issues

### Backend Won't Start

**Problem:** `npm run dev` shows errors

**Solution 1: Port Already in Use**
```bash
# Check what's using port 5000
lsof -i :5000  # Mac/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process:
kill -9 <PID>  # Mac/Linux
taskkill /PID <PID> /F  # Windows

# Or change port in backend/.env:
PORT=5001
```

**Solution 2: Missing Dependencies**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Solution 3: Node Version Mismatch**
```bash
# Check Node version
node --version  # Should be 16+

# Update Node if needed
# Download from nodejs.org or:
nvm install 18
nvm use 18
```

### Frontend Won't Start

**Problem:** `npm run dev` in frontend folder fails

**Solution 1: Vite Port in Use**
```bash
# Frontend usually tries 5173, then 5174, etc.
# If stuck, manually specify:
npm run dev -- --port 5174
```

**Solution 2: Clear Cache**
```bash
cd frontend
rm -rf node_modules .vite package-lock.json
npm install
npm run dev
```

**Solution 3: Node Memory Issue**
```bash
# Increase Node memory
NODE_OPTIONS="--max-old-space-size=4096" npm run dev
```

### Can't Connect Frontend to Backend

**Problem:** Frontend can't reach backend API

**Check 1: Backend is running**
```bash
# Try in another terminal
curl http://localhost:5000/api/hospitals/nearby?latitude=28.6139&longitude=77.2090
# Should return data (or empty if no API key)
```

**Check 2: Frontend .env is correct**
```bash
# In frontend/.env, verify:
VITE_API_URL=http://localhost:5000/api

# NOT: http://localhost:5000 (missing /api)
# NOT: http://localhost:3000 (wrong port)
```

**Check 3: API Proxy**
```javascript
// If using Vite proxy in vite.config.js:
// Make sure proxy path matches your needs
proxy: {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true,
  },
}
```

---

## 🗄️ Database Issues

### MongoDB Connection Refused

**Problem:** `Error: connect ECONNREFUSED 127.0.0.1:27017`

**For Local MongoDB:**
```bash
# Start MongoDB service
# Mac:
brew services start mongodb-community

# Linux:
sudo systemctl start mongod

# Windows:
# Open Services app → Find MongoDB → Start
# Or use MongoDB Compass GUI

# Verify it's running:
mongosh
# Should show: test>
```

**For MongoDB Atlas:**
```
Error: not authorized on admin to execute command

Solutions:
1. Check username/password in URI is correct
2. Check spelling of cluster name
3. Verify user exists in Atlas Database Access
4. Check IP is whitelisted in Network Access
5. Try allow from "Anywhere" for testing
```

### Cannot Find Database

**Problem:** Collections not appearing in MongoDB Compass

**Solution:**
Collections are created automatically when data is first inserted. Until then, they won't show.

```bash
# Create sample data to initialize collections:
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"Test123"}'

# Now check MongoDB Compass - users collection should appear
```

### Geospatial Query Error

**Problem:** `Error: no geo index`

**Solution:**
```javascript
// In mongosh or MongoDB Compass, create index:
use medaccess
db.blooddonors.createIndex({ location: "2dsphere" })
db.bloodrequests.createIndex({ location: "2dsphere" })
db.resourcereports.createIndex({ location: "2dsphere" })

// Verify:
db.blooddonors.getIndexes()
```

### Database Getting Full

**Problem:** MongoDB Atlas free tier (512MB) is full

**Solution:**
1. Upgrade MongoDB Atlas to paid tier
2. Or switch to different cluster
3. Or delete test data:
```javascript
use medaccess
db.users.deleteMany({})  // Delete all users
db.blooddonors.deleteMany({})  // Delete all donors
// etc.
```

---

## 🔗 API Issues

### 404 Not Found errors

**Problem:** API returns 404

**Solution 1: Check endpoint spelling**
```
❌ /api/hospitals
✅ /api/hospitals/nearby or /api/hospitals/details/:placeId

❌ /api/blood-requests/create
✅ /api/blood-requests/create (correct path exists)
```

**Solution 2: Check HTTP method**
```
❌ GET /api/auth/register
✅ POST /api/auth/register

❌ POST /api/hospitals/nearby
✅ GET /api/hospitals/nearby
```

**Solution 3: Backend not running**
```bash
# Verify backend is running
curl http://localhost:5000/
# Should not show "Connection refused"
```

### 401 Unauthorized

**Problem:** API returns 401 on protected routes

**Solution 1: Missing token**
```bash
# ❌ Wrong:
curl http://localhost:5000/api/auth/profile

# ✅ Correct:
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Solution 2: Invalid/expired token**
```bash
# Get new token by logging in:
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"yourpassword"}'

# Copy token from response and use it
```

**Solution 3: Token format wrong**
```
❌ Authorization: YOUR_TOKEN_HERE
❌ Authorization: Token YOUR_TOKEN_HERE
✅ Authorization: Bearer YOUR_TOKEN_HERE
```

### CORS Error

**Problem:** Browser shows `Access to XMLHttpRequest blocked`

**Solution 1: Check CORS is enabled in backend**
```javascript
// In server.js:
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

**Solution 2: Update CORS origin**
```javascript
// In backend/.env:
FRONTEND_URL=http://localhost:5173

// Make sure it matches your actual frontend URL
// NOT: http://localhost:3000
// NOT: http://127.0.0.1:5173 (use localhost, not 127.0.0.1)
```

**Solution 3: Check preflight request**
```javascript
// Server should handle OPTIONS requests
app.options('*', cors());
```

### Validation Error

**Problem:** Form submission returns validation error

**Response Example:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Email must be valid" }
  ]
}
```

**Solution:**
Check what field failed:
```javascript
// Common errors:
- email: Must be valid email format (test@example.com)
- password: Must be minimum 6 characters
- phone: Must match format
- bloodGroup: Must be valid group (O+, A+, B+, AB+, O-, A-, B-, AB-)
```

Resend request with valid data.

---

## 🖥️ Frontend Issues

### Page Won't Load

**Problem:** Blank white screen

**Solution 1: Check console for errors**
```
Open browser → F12 → Console tab
Look for JavaScript errors
Search for "[object Object]" errors
```

**Solution 2: Check Network tab**
```
F12 → Network tab
Reload page
Look for failed requests (red color)
Check if API calls are failing
```

**Solution 3: Clear cache**
```bash
# Hard refresh browser
Ctrl+Shift+R (Windows)
Cmd+Shift+R (Mac)

# Clear browser cache completely
F12 → Application → Clear Site Data
```

### Component Not Rendering

**Problem:** Component appears but is blank/empty

**Check 1: Props being passed correctly**
```jsx
// Check parent is passing required props:
<HospitalCard hospital={hospital} />

// Check child component receives them:
function HospitalCard({ hospital }) {
  if (!hospital) return <div>Loading...</div>
  return <div>{hospital.name}</div>
}
```

**Check 2: Data is loaded**
```jsx
// Add loading state check:
if (loading) return <div>Loading...</div>
if (!data) return <div>No data</div>
return <YourComponent data={data} />
```

**Check 3: Styling issue**
```css
/* Check if component is hidden: */
/* Maybe display: none? */
/* Maybe opacity: 0? */
/* Check z-index conflicts */
```

### Images Not Loading

**Problem:** Image placeholder or broken image icon

**Solution:**
```jsx
// Check image URL
console.log('Image URL:', imageUrl)

// Make sure URL is valid
<img src={imageUrl} alt="description" />

// Add fallback:
<img 
  src={imageUrl} 
  alt="description"
  onError={(e) => e.target.src = '/default-image.png'}
/>
```

### Form Not Submitting

**Problem:** Form won't submit or shows error

**Check 1: Form validation**
```javascript
// Check browser console for validation errors
// Verify all required fields are filled
// Check email format, password length, etc.
```

**Check 2: API endpoint is correct**
```javascript
// In service/authService.js, check:
// POST endpoint is correct
// Headers include Content-Type
// Data is stringified
```

**Check 3: Network tab**
```
F12 → Network tab
Submit form
Look for failed requests
Check response status and error message
```

---

## 🔑 Authentication Issues

### Can't Register Account

**Problem:** Registration form shows error

**Check 1: Verify backend is running**
```bash
curl http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"Test123"}'
```

**Check 2: Check for duplicate email**
```
Error: Email already registered

Solution: Use a different email address
```

**Check 3: Check password requirements**
```
Error: Password must be at least 6 characters

Solution: Use password with 6+ characters
```

### Can't Login

**Problem:** Login fails with "Invalid credentials"

**Solution 1: Check email exists**
```bash
# Verify user was created by registering first
# Or check database:
mongosh
db.users.find({email: "your@email.com"})
```

**Solution 2: Check password matches**
```
Note: Password must match exactly (case-sensitive)
Make sure CAPS LOCK is off
```

**Solution 3: Check backend is running**
```bash
# Verify backend connection works
curl http://localhost:5000/api/
```

### Token Expired

**Problem:** Get redirected to login after some time

**Solution:**
This is normal behavior. JWT tokens expire (usually 7 days).

```javascript
// In backend/controllers/authController.js:
expiresIn: '7d'  // Token valid for 7 days

// To refresh:
1. User logs in again
2. New token is issued
3. Token is stored in localStorage
```

### Lost Login Information

**Problem:** After page refresh, logged in user is forgotten

**Check:** AuthContext should persist token in localStorage

```javascript
// In frontend/src/context/AuthContext.jsx:
// Save to localStorage on login:
localStorage.setItem('token', newToken)
localStorage.setItem('user', JSON.stringify(userData))

// Load on app start:
useEffect(() => {
  const token = localStorage.getItem('token')
  if (token) setToken(token)  // Auto-login
}, [])
```

If this isn't working, check:
1. localStorage is enabled in browser
2. Private/Incognito mode doesn't persist localStorage
3. Clear localStorage and login again

---

## 📍 Location/Maps Issues

### Google Maps Not Loading

**Problem:** Map shows blank or "Map is not defined"

**Solution 1: Check API key**
```env
# In frontend/.env:
VITE_GOOGLE_MAPS_API_KEY=your_actual_key_here

# NOT: 
VITE_GOOGLE_MAPS_API_KEY=your_key_placeholder
```

**Solution 2: Enable Maps API**
```
In Google Cloud Console:
1. Go to APIs & Services
2. Enable "Maps JavaScript API"
3. Enable "Places API"
```

**Solution 3: Check script loading**
```html
<!-- In frontend/index.html:
<script async
  src="https://maps.googleapis.com/maps/api/js?key=YOUR_KEY&libraries=places">
</script>
```

**Solution 4: API Error in console**
```
Error: Google Maps API not loaded

Solution:
1. Wait 2-3 seconds for script to load
2. Check API key is valid
3. Check browser console for API errors
```

### Geolocation Not Working

**Problem:** "Allow location access?" prompt doesn't appear or location isn't found

**Solution 1: Browser doesn't support geolocation**
```javascript
// Add fallback:
if (!navigator.geolocation) {
  console.error('Geolocation not supported')
  // Use default location instead
}
```

**Solution 2: User doesn't grant permission**
```
Browser shows "Block/Allow" dialog
If user clicks "Block", no location access
Solution: Click the 🔒 lock icon in URL bar → Allow Location
```

**Solution 3: HTTPS required**
```
Note: Geolocation requires HTTPS (except localhost)
Local development: Works on http://localhost:5173
Production: Must use https://
```

### Markers Not Appearing

**Problem:** Map loads but no location markers show

**Solution 1: Check data is loading**
```javascript
// In browser console:
open F12 → Network tab
Check if /api/hospitals/nearby request succeeded
Check response data has latitude/longitude
```

**Solution 2: Check coordinates format**
```javascript
// Correct format:
{ latitude: 28.6139, longitude: 77.2090 }

// NOT:
{ lat: 28.6139, lng: 77.2090 }
{ coordinates: [28.6139, 77.2090] }
```

**Solution 3: Check map bounds**
```javascript
// Make sure markers are within visible map area
// Zoom out to see markers
// Check latitude/longitude values are realistic
// India: 8-35°N, 68-97°E
```

---

## 📱 Mobile Issues

### App doesn't work on mobile

**Problem:** Features don't work on phone

**Solution 1: Fix viewport**
```html
<!-- In frontend/index.html:
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

**Solution 2: Test on real device**
```bash
# Get your local IP:
ipconfig getifaddr en0  # Mac
hostname -I | awk '{print $1}'  # Linux
ipconfig  # Windows

# Access from mobile on same network:
http://YOUR_LOCAL_IP:5173
```

**Solution 3: Mobile-specific styling**
```css
/* Add media queries: */
@media (max-width: 768px) {
  /* Mobile styles */
}
```

### Geolocation doesn't work on mobile

**Problem:** "Allow location access?" doesn't appear on phone

**Solution 1: Must be HTTPS**
```
Localhost: Works fine
Production: MUST use https://
```

**Solution 2: Check browser permissions**
```
1. Go to browser settings
2. Find location/privacy permissions
3. Make sure site is allowed location access
4. Refresh app
```

**Solution 3: Try different browser**
```
If Chrome doesn't work, try:
- Safari (iPhone)
- Firefox
- Edge
```

---

## 🚀 Deployment Issues

### Vercel deployment fails

**Problem:** Build fails on Vercel

**Solution 1: Check build command**
```
Vercel settings → Build & Development Settings
Build Command: npm run build
Output Directory: dist
```

**Solution 2: Environment variables**
```
Settings → Environment Variables
Add:
VITE_API_URL = your_backend_url
VITE_GOOGLE_MAPS_API_KEY = your_key
```

**Solution 3: Check logs**
```
Deployments → Failed deployment → View Logs
Look for errors in build output
```

### Render deployment fails

**Problem:** Backend deployment stalled or failed

**Solution 1: Check logs**
```
Render Dashboard → Service Logs
Look for errors during npm install or npm start
```

**Solution 2: Increase resource limits**
```
Render Settings → Memory/CPU
Free tier might need upgrade for large apps
```

**Solution 3: Environment variables**
```
Render Dashboard → Environment
Add all variables from backend/.env
Make sure MONGODB_URI is correct
```

### Database connection fails in production

**Problem:** `Error: connect ECONNREFUSED` on production

**Solution 1: MongoDB Atlas IP whitelist**
```
Atlas Dashboard → Network Access
Add production server IP to whitelist
Or allow from "Anywhere" (not secure but for testing)
```

**Solution 2: Verify URI**
```
1. Go to MongoDB Atlas
2. Click "Connect"
3. Get new connection string
4. Update environment variable with exact URI
```

**Solution 3: Check credentials**
```
Database Access section:
1. Verify username exists
2. Reset password if needed
3. Update MONGODB_URI with new password
```

---

## ⚡ Performance Issues

### App is slow

**Problem:** Slow loading or responsiveness

**Solution 1: Check API response time**
```bash
# Time API request:
time curl http://localhost:5000/api/hospitals/nearby?latitude=28.6139&longitude=77.2090
# Should be under 1-2 seconds
```

**Solution 2: Optimize database queries**
```javascript
// Add indexes in MongoDB:
db.blooddonors.createIndex({ bloodGroup: 1, city: 1 })
db.hospitals.createIndex({ location: "2dsphere" })
```

**Solution 3: Frontend optimization**
```javascript
// Add lazy loading:
const LazyComponent = lazy(() => import('./Component'))
<Suspense fallback={<Loading />}>
  <LazyComponent />
</Suspense>
```

### High CPU usage

**Problem:** Server using 100% CPU

**Solution:**
```javascript
// Check for infinite loops:
// Look for setInterval without clearInterval
// Look for recursive functions without termination
// Check for memory leaks
```

```bash
# Get backend PID and check:
top
# Find Node process and check CPU %
```

### Memory running out

**Problem:** `FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed`

**Solution:**
```bash
# Increase Node memory:
NODE_OPTIONS="--max-old-space-size=4096" npm start

# Or in package.json:
"start": "node --max-old-space-size=4096 server.js"
```

---

## 🆘 Can't Find Your Issue?

### Debug Checklist

1. **Check terminal output** - Look for error messages
2. **Check browser console** - F12 → Console tab
3. **Check Network tab** - F12 → Network tab
4. **Check backend logs** - Terminal where server is running
5. **Check database** - MongoDB Compass
6. **Google the error** - Copy exact error message
7. **Check documentation** - README.md, QUICKSTART.md

### Enable Debug Mode

```javascript
// In frontend, add to App.jsx:
console.log('Auth Context:', AuthContext)
console.log('Location Context:', LocationContext)

// In backend, add to server.js:
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
  next()
})
```

### Get Help

1. **Check documentation** - README.md, QUICKSTART.md, etc
2. **Review code comments** - Look for explanations
3. **Read error carefully** - Error messages are usually helpful
4. **Try a simple example** - Test with minimal code
5. **Restart everything** - Sometimes helps!

---

## 📞 Common Error Messages & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `Cannot find module` | Package not installed | `npm install package-name` |
| `EADDRINUSE` | Port in use | Kill process or change port |
| `ECONNREFUSED` | Service not running | Start the service |
| `MongoDB Connection Error` | Database not accessible | Check URI, IP whitelist |
| `CORS error` | Frontend/backend mismatch | Fix CORS headers |
| `JWT verify failed` | Token invalid/expired | Login again |
| `404 Not Found` | Wrong endpoint | Check endpoint path |
| `401 Unauthorized` | Missing token | Add Authorization header |
| `500 Server Error` | Backend error | Check server logs |

---

## ✅ Verification Steps

Use this checklist to diagnose issues:

```
Operating Environment:
☐ Node.js version 16+
☐ npm/yarn installed
☐ Git installed
☐ Internet connection

Backend Setup:
☐ backend/ folder exists
☐ package.json has dependencies
☐ .env file created with MONGODB_URI
☐ MongoDB running (local or Atlas)
☐ npm install completed
☐ npm run dev shows "Server running"

Frontend Setup:
☐ frontend/ folder exists
☐ package.json has dependencies
☐ .env file created with VITE_API_URL
☐ npm install completed
☐ npm run dev shows server started

Connectivity:
☐ Backend responds to curl
☐ Frontend loads in browser
☐ Can reach API from frontend
☐ Browser console has no errors

Databases:
☐ MongoDB connection works
☐ Collections created
☐ Can insert/query data

APIs:
☐ All endpoints tested
☐ Responses return correct format
☐ Error handling working

Authentication:
☐ Can register user
☐ Can login user
☐ Token stored in localStorage
☐ Authorized requests work
```

---

Good luck! Most issues can be solved by checking the checklist above. If you're still stuck, check the relevant documentation file.

🚀 Happy debugging!
