# 🚀 Quick Start Guide - Hospital Admin System

## Getting Started in 5 Minutes

### 1. Start Backend Server
```bash
cd backend
npm install  # (if not already done)
npm start
```
Expected output: `Server running on port 5000`

### 2. Start Frontend Dev Server
```bash
cd frontend
npm install  # (if not already done)
npm run dev
```
Expected output: `Local: http://localhost:5173`

### 3. Open Application
- Navigate to: **http://localhost:5173**
- Click on "Join MedAccess" or find the register link

---

## 🏥 Testing Hospital Registration

### Step 1: Create Hospital Account
```
1. Click "Join MedAccess" button OR click "Register" in navbar
2. On Registration page, scroll down to find:
   "Are you a hospital?" section
3. Click "Register Your Hospital" button
4. You'll see a 3-step form:
   - Step 1: Admin Information
   - Step 2: Hospital Details  
   - Step 3: Services & Capacity
```

### Step 2: Fill Step 1 - Admin Information
```
Name:                John Smith
Email:               admin@hospital.com
Password:            SecurePassword123
Confirm Password:    SecurePassword123
Phone:               +91-9876543210
```

### Step 3: Fill Step 2 - Hospital Details
```
Hospital Name:           City General Hospital
Hospital Address:        123 Health Street, Downtown
Registration Number:     REG-2024-001234
Phone:                   +91-1234567890
Hospital Description:    State-of-the-art healthcare facility
```

### Step 4: Fill Step 3 - Services & Capacity
```
Services Select:
  ✓ Cardiology
  ✓ Neurology
  ✓ Orthopedics
  ✓ General Surgery
  ✓ Emergency Medicine

Total Beds:        150
Available Beds:    85
```

### Step 5: Submit
- Click "Submit Hospital" button
- You'll be automatically logged in
- Redirected to: **http://localhost:5173/admin/dashboard**

---

## 📊 Testing Admin Dashboard

### What You'll See:
```
Header:
  - Hospital name and address
  - Settings button (⚙️)
  - Logout button

Statistics Cards:
  - Total Appointments: [number]
  - Confirmed: [number]
  - Pending: [number]
  - Cancelled: [number]

Hospital Status:
  - Registration Number
  - Verification Status
  - Hospital Rating
  - Contact Phone

Bed Status:
  - Available Beds: X/150
  - Visual progress bar

Today's Load:
  - Number of appointments today
  - Percentage of total load
```

### Navigation Buttons:
- **Manage Appointments** → `/admin/appointments`
- **View Patients** → `/admin/patients`
- **Hospital Settings** → `/admin/settings`

---

## 📅 Testing Appointments Management

### Navigate to Appointments:
1. Click "Manage Appointments" button on dashboard
2. You'll see appointment list (if any exist)

### Features to Test:
```
Filters:
  - Filter by Status (All/Confirmed/Scheduled/Completed/Cancelled)
  - Sort by Date or Status

For Each Appointment:
  - Patient Name
  - Appointment Date & Time
  - Patient Phone, Email
  - Blood Group
  - Current Status badge

Edit Appointment:
  - Click the edit icon (pencil)
  - Change status from dropdown
  - Add hospital notes
  - Click "Save Changes"
```

### Sample Actions:
1. View all appointments
2. Filter by "Scheduled" status
3. Click edit on an appointment
4. Change status to "Confirmed"
5. Add note: "Patient confirmed. Room 302 ready."
6. Click Save
7. See status updated in real-time

---

## 👥 Testing Patients Management

### Navigate to Patients:
1. Click "View Patients" button on dashboard
2. See list of all unique patients

### Features to Test:
```
Search Box:
  - Type patient name, email, or phone
  - Results filter in real-time

Blood Group Filter:
  - Select from dropdown (A+, B+, O+, AB+, etc)
  - Shows only patients with selected blood group

Patient Cards:
  - Click card to expand
  - See full patient details
  - Quick action buttons
```

### Sample Search:
1. Type a patient name in search
2. See results filtered
3. Click on a patient card
4. See expanded details
5. Click "View History"
6. Click "Send Message"
7. Click "Download Records"

### Statistics:
- Total Patients: Shows count
- Blood Group counts
- New patients this month

---

## ⚙️ Testing Hospital Settings

### Navigate to Settings:
1. Click "Hospital Settings" button
2. See tabbed interface

### Tab 1: Basic Info
```
Update:
  - Hospital Name
  - Hospital Address
  - Phone Number
  - Description
```

### Tab 2: Services
```
Select Medical Specialties:
  ✓ Cardiology
  ✓ Neurology
  ✓ Orthopedics
  ✓ Pediatrics
  ... and 20+ more

Shows count of selected specialties
```

### Tab 3: Capacity
```
Modify:
  - Total Beds (e.g., 150)
  - Available Beds (e.g., 85)

Visual Chart Shows:
  - Available (blue bar)
  - Occupied (red bar)
  - Percentage calculation
```

### Tab 4: Location
```
Enter Coordinates:
  - Latitude: 28.7041
  - Longitude: 77.1025

(Find on Google Maps by right-clicking and selecting "What's here?")
```

### Save Changes:
- Fill/modify any fields
- Click "Save Changes" button
- See success toast notification
- Data saved to database

---

## 🧠 Testing Interactive Organ Viewer

### Find on Home Page:
1. Go to home page: http://localhost:5173
2. Scroll down past Emergency Panel
3. Find "Interactive Human Body Explorer" section

### Organs Available:
1. 🧠 Brain
2. ❤️ Heart
3. 🫁 Lungs
4. 🍽️ Stomach
5. 🫘 Kidneys
6. 👁️ Eyes
7. 🦴 Skeletal System

### Testing Steps:
```
1. See rotating organ icon in center
2. Click "Listen to Explanation"
   - Hear voice explanation (if supported)
3. Click "Mute Sound" to disable audio
4. Read "Key Facts" section
5. Review "Common Conditions"
6. Read "Health Tips"
7. Click organ selector dots at bottom to switch
8. Repeat for different organs
```

### Features to Try:
- Navigate with Previous/Next arrows
- Click organ dots to jump to specific organ
- Note the real-time rotation effect
- Check responsive design on mobile

---

## 🔐 Testing Authentication

### Test Hospital Admin Login:
```
1. Go to http://localhost:5173/login
2. Enter credentials:
   Email:    admin@hospital.com
   Password: SecurePassword123
3. Click "Sign in"
4. Should redirect to: /admin/dashboard
```

### Test Role-Based Access:
```
1. Create regular user account at /register
2. Login with user account
3. Try to access /admin/dashboard
4. Should redirect to /login (unauthorized)
```

### Test Logout:
```
1. From admin dashboard, click "Logout"
2. Should redirect to login page
3. Session cleared
```

---

## 📱 Testing Responsive Design

### Desktop (1440px+):
- All 4 columns visible in stats
- Full sidebar layout
- Optimal spacing

### Tablet (768px+):
- 2 columns for stats
- Adjusted layout
- Touch-friendly buttons

### Mobile (390px):
- 1 column layout
- Stacked elements
- Full-width inputs
- Mobile-optimized navigation

### Test By Resizing Browser:
1. Open DevTools (F12)
2. Toggle device toolbar
3. Try different screen sizes
4. Verify responsive behavior

---

## 🐛 Troubleshooting

### Issue: "Hospital admin access required" error
**Solution:** 
- Ensure you're logged in with hospital account
- Check user role in browser console: `console.log(user.role)`
- Re-login if needed

### Issue: Appointments not showing
**Solution:**
- Create appointments from patient side first (if available)
- Check MongoDB has appointment data
- Verify backend is running

### Issue: Settings not saving
**Solution:**
- Check backend is running (`npm start` in backend folder)
- Verify API endpoint: http://localhost:5000/api/admin/profile
- Check browser console for API errors
- Clear localStorage and try again

### Issue: Text-to-speech not working
**Solution:**
- Browser must support Web Speech API (Chrome, Edge, Safari)
- Check browser console for errors
- Try different browser if issue persists
- Use mute button to disable if causing issues

### Issue: Styling looks broken
**Solution:**
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+Shift+R)
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Try different browser

---

## 🎯 Complete Testing Checklist

### Registration ✓
- [ ] Navigate to hospital registration
- [ ] Fill all 3 steps correctly
- [ ] Submit successfully
- [ ] Redirected to admin dashboard
- [ ] Hospital info displays correctly

### Dashboard ✓
- [ ] Statistics cards show numbers
- [ ] Hospital info displays
- [ ] Bed status visualization works
- [ ] Recent appointments list shows
- [ ] Quick action buttons work

### Appointments ✓
- [ ] View all appointments
- [ ] Filter by status works
- [ ] Sort options work
- [ ] Edit appointment works
- [ ] Update status works
- [ ] Save notes works

### Patients ✓
- [ ] See patient list
- [ ] Search by name works
- [ ] Search by email works
- [ ] Search by phone works
- [ ] Filter by blood group works
- [ ] Expand patient details works

### Settings ✓
- [ ] Navigate between tabs
- [ ] Update basic info
- [ ] Select services/specialties
- [ ] Update bed capacity
- [ ] Enter location coordinates
- [ ] Save all changes
- [ ] Data persists after refresh

### Organ Viewer ✓
- [ ] Organs rotate correctly
- [ ] Navigation arrows work
- [ ] Organ dots selector works
- [ ] Listen button works
- [ ] Audio explanation plays
- [ ] Mute button works
- [ ] Information displays correctly

### Responsive ✓
- [ ] Works on desktop
- [ ] Works on tablet
- [ ] Works on mobile
- [ ] All buttons clickable
- [ ] Text readable
- [ ] No horizontal scroll issues

---

## 📞 Need Help?

If you encounter any issues:

1. **Check Console Errors:**
   - Open DevTools (F12)
   - Go to Console tab
   - Look for red errors
   - Note exact error message

2. **Check Network Errors:**
   - Go to Network tab
   - Look for failed API calls
   - Check response status codes

3. **Verify Servers Running:**
   - Backend: http://localhost:5000/health
   - Frontend: http://localhost:5173

4. **Review Logs:**
   - Backend terminal for server logs
   - Browser console for client logs

---

**Your MediAccess Hospital Admin System is ready! Happy testing! 🎉**
