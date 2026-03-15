# MedAccess - Intelligent Healthcare Resource Locator

A complete, production-ready full-stack web application that helps users quickly find nearby healthcare services during emergencies.

## 🏥 Features

- **Hospital Locator**: Real-time search for nearby hospitals with ratings and directions
- **Pharmacy Finder**: Locate pharmacies in your vicinity
- **Blood Donor Network**: Register as a donor and search for available blood donors
- **Blood Request System**: Create urgent blood requests and connect with donors
- **Emergency Services**: Quick access to ambulances and emergency contacts
- **Resource Reporting**: Report oxygen, ICU beds, blood availability, and medical camps
- **Interactive Maps**: Google Maps integration for location-based services
- **User Authentication**: Secure JWT-based authentication with password hashing
- **Real-time Updates**: Live data from Google Places and custom database
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠 Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Google Places API** - Location services

### Frontend
- **React.js** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Routing
- **Axios** - HTTP client

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- Google Maps API key
- Google Places API key
- npm or yarn

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
cd c:\Users\bisha\Desktop\MediAccess
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file with your credentials
# Edit the .env file and add:
# - MongoDB URI
# - JWT Secret
# - Google API Keys
# - Frontend URL

# Start the server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
# VITE_API_URL=http://localhost:5000/api
# VITE_GOOGLE_MAPS_API_KEY=your_api_key

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Hospitals
- `GET /api/hospitals/nearby` - Get nearby hospitals
- `GET /api/hospitals/details/:placeId` - Get hospital details

### Pharmacies
- `GET /api/pharmacies/nearby` - Get nearby pharmacies
- `GET /api/pharmacies/emergency` - Get emergency services

### Blood Donors
- `POST /api/donors/register` - Register as blood donor
- `GET /api/donors/search` - Search blood donors
- `GET /api/donors/all` - Get all donors
- `GET /api/donors/my-profile` - Get own donor profile
- `PUT /api/donors/update-profile` - Update donor profile

### Blood Requests
- `POST /api/blood-requests` - Create blood request
- `GET /api/blood-requests` - Get blood requests
- `GET /api/blood-requests/my-requests` - Get user's requests
- `PUT /api/blood-requests/:id` - Update blood request
- `DELETE /api/blood-requests/:id` - Delete blood request

### Resources
- `POST /api/resources` - Report resource
- `GET /api/resources/verified` - Get verified resources
- `GET /api/resources/pending` - Get pending reports
- `GET /api/resources/my-reports` - Get user's reports
- `PUT /api/resources/:id/verify` - Verify resource (admin)
- `PUT /api/resources/:id/reject` - Reject resource (admin)
- `DELETE /api/resources/:id` - Delete resource

## 📁 Project Structure

```
MediAccess/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── hospitalController.js
│   │   ├── pharmacyController.js
│   │   ├── donorController.js
│   │   ├── bloodRequestController.js
│   │   └── resourceController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── BloodDonor.js
│   │   ├── BloodRequest.js
│   │   └── ResourceReport.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── hospitalRoutes.js
│   │   ├── pharmacyRoutes.js
│   │   ├── donorRoutes.js
│   │   ├── bloodRequestRoutes.js
│   │   └── resourceRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorHandler.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Sidebar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── HospitalCard.jsx
    │   │   ├── PharmacyCard.jsx
    │   │   ├── DonorCard.jsx
    │   │   ├── BloodRequestCard.jsx
    │   │   ├── ResourceCard.jsx
    │   │   ├── MapComponent.jsx
    │   │   └── EmergencyPanel.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Hospitals.jsx
    │   │   ├── Pharmacies.jsx
    │   │   ├── BloodDonors.jsx
    │   │   ├── BloodRequests.jsx
    │   │   ├── ReportResource.jsx
    │   │   ├── Emergency.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Profile.jsx
    │   │   ├── BloodDonorForm.jsx
    │   │   ├── BloodRequestForm.jsx
    │   │   └── ResourceForm.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── LocationContext.jsx
    │   ├── services/
    │   │   ├── api.js
    │   │   ├── authService.js
    │   │   └── mapService.js
    │   ├── styles/
    │   │   └── navbar.css
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── .env.example
    ├── .gitignore
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── vite.config.js
    └── package.json
```

## 🔐 Security Features

- JWT token-based authentication
- Password hashing using bcryptjs
- Protected API routes with middleware
- Input validation on all endpoints
- CORS configuration for secure requests
- Environment variable management

## 🗄 Database Schemas

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  city: String,
  role: String (user/admin),
  bloodGroup: String,
  isDonor: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### BloodDonor
```javascript
{
  userId: ObjectId,
  bloodGroup: String,
  lastDonationDate: Date,
  availability: Boolean,
  location: GeoJSON Point,
  address: String,
  city: String,
  phone: String,
  donationCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### BloodRequest
```javascript
{
  userId: ObjectId,
  bloodGroup: String,
  hospital: String,
  city: String,
  urgency: String (low/medium/high/critical),
  contact: String,
  unitsNeeded: Number,
  status: String (pending/fulfilled/expired),
  location: GeoJSON Point,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### ResourceReport
```javascript
{
  userId: ObjectId,
  type: String (oxygen/icuBeds/blood/medicalSupplies/camp),
  location: GeoJSON Point,
  address: String,
  city: String,
  quantity: String,
  contact: String,
  notes: String,
  verified: Boolean,
  verifiedBy: ObjectId,
  status: String (pending/verified/rejected),
  createdAt: Date,
  updatedAt: Date
}
```

## 🌐 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy the dist/ folder to Vercel
```

### Backend (Render/Railway)
```bash
# Push to GitHub
# Connect to Render/Railway
# Set environment variables
# Deploy
```

## 🔑 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/medaccess
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
PORT=5000
GOOGLE_PLACES_API_KEY=your_google_places_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## 📞 Support

For emergency services, always call:
- **Ambulance**: 102
- **Police**: 100
- **Fire**: 101

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please create a pull request with your changes.

## 👥 Team

Built with ❤️ for the community

The project has not been deployed yet for some reason till then, you can have a overlook of the project and can clone it on your system and run too:
LINK: 
https://drive.google.com/drive/folders/1av5dLc03it_s2_h_8h4OrUr2WVncouqw?usp=drive_link
---

**Note**: This is a production-ready application. Make sure to set up proper environment variables and secure credentials before deploying to production.
