# Pharmacy Portal - Quick Start Guide

## 🚀 Quick Setup

### 1. Start Backend Server
```powershell
cd c:\Users\bisha\Desktop\MediAccess\backend
npm run dev
```
Server runs on: `http://localhost:5000`

### 2. Start Frontend Server  
```powershell
cd c:\Users\bisha\Desktop\MediAccess\frontend
npm run dev
```
Frontend runs on: `http://localhost:5173`

---

## 🔐 Access Pharmacy Portal

### 1. From Home Page
- Click "Pharmacy Portal" button in navigation (between Hospital Registration and Book Consultation)
- Or direct URL: `http://localhost:5173/pharmacy-login`

### 2. Create Test Pharmacy Account
**Registration URL:** `http://localhost:5173/pharmacy-register`

**Test Data:**
```
Pharmacy Name: MediCare Plus
Email: medax@test.com
Password: Test@123
Phone: 555-123-4567
Address: 123 Main Street
City: New York
```

### 3. Login to Pharmacy Dashboard
**Login URL:** `http://localhost:5173/pharmacy-login`

**Dashboard URL:** `http://localhost:5173/pharmacy-admin`

---

## 📊 Features to Test

### Tab 1: Medicines Inventory
1. Click "Add Medicine" button
2. Fill in details:
   - Name: Aspirin
   - Dosage: 500mg
   - Quantity: 100
   - Price: 5.99
   - Description: Pain reliever
3. Click "Add Medicine"
4. See medicine appear in list

### Tab 2: Price Comparator
1. Click 💹 icon on any medicine
2. View price comparison across pharmacies
3. See AI-generated analysis from Gemini
4. Check market average and your pricing

---

## 🔑 Key Features

✅ **Pharmacy Registration & Authentication**
- Secure password hashing
- JWT token-based sessions
- 30-day token expiry

✅ **Medicine Management**
- Add/View/Edit/Delete medicines
- Track quantity and pricing
- Store batch and expiry info

✅ **AI Price Comparator**
- Real-time market analysis
- Gemini AI insights
- Competitive pricing recommendations
- Market average calculations

✅ **Updated Footer**
- Changed from 2024 to 2026

---

## 📱 API Endpoints

### Authentication
```
POST /api/pharmacy/register
POST /api/pharmacy/login
```

### Medicines
```
POST /api/pharmacy/medicines
GET /api/pharmacy/medicines/:pharmacyId
PUT /api/pharmacy/medicines/:medicineId
DELETE /api/pharmacy/medicines/:medicineId
```

### Price Comparison
```
POST /api/pharmacy/price-comparison
```

---

## 🎨 Frontend Pages

| Page | URL | Purpose |
|------|-----|---------|
| Registration | `/pharmacy-register` | Create pharmacy account |
| Login | `/pharmacy-login` | Pharmacy login |
| Dashboard | `/pharmacy-admin` | Manage inventory & pricing |

---

## 🗂️ Project Structure

```
MediAccess/
├── backend/
│   ├── models/
│   │   ├── Pharmacy.js (NEW)
│   │   └── Medicine.js (NEW)
│   ├── controllers/
│   │   └── pharmacyController.js (UPDATED)
│   └── routes/
│       └── pharmacyRoutes.js (UPDATED)
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── PharmacyLogin.jsx (NEW)
│   │   │   ├── PharmacyRegister.jsx (NEW)
│   │   │   └── PharmacyAdminDashboard.jsx (NEW)
│   │   ├── components/
│   │   │   ├── Navbar.jsx (UPDATED)
│   │   │   └── Footer.jsx (UPDATED - Year 2026)
│   │   └── App.jsx (UPDATED)
```

---

## 🔧 Configuration

### Environment Variables (.env)
```
VITE_API_URL=https://medaccess-r15r.onrender.com/api
VITE_GOOGLE_MAPS_API_KEY=AIzaSyAEboEMlgxSpJ_tdM7ToOmHJRtglusipEA
```

### Backend (.env)
```
GEMINI_API_KEY=AIzaSyAEboEMlgxSpJ_tdM7ToOmHJRtglusipEA
JWT_SECRET=your-secret-key
MONGODB_URI=your-connection-string
```

---

## 🚨 Troubleshooting

### Issue: "Pharmacy not found" on login
**Solution:** Make sure you registered first at `/pharmacy-register`

### Issue: Price Comparator shows no data
**Solution:** Add medicines in at least 2 pharmacies before comparing

### Issue: "API Error" on dashboard
**Solution:** Verify backend is running and MongoDB connection is active

---

## ✅ System Status

- ✅ Pharmacy Registration: READY
- ✅ Pharmacy Login: READY
- ✅ Medicine Management: READY
- ✅ Price Comparator: READY
- ✅ Gemini AI Integration: READY
- ✅ Footer 2026 Update: READY
- ✅ Navigation Integration: READY

---

## 📞 Support

All features are production-ready. The pharmacy portal is fully integrated with:
- Complete backend API
- Frontend UI with animations
- Database persistence
- AI-powered analysis
- Error handling

Start testing now! 🎉
