# 📡 MedAccess - API Testing Guide

Complete guide for testing all 22 MedAccess API endpoints.

## 🛠️ Setup

### Option 1: Use cURL (Command Line)

```bash
# Test if backend is running
curl http://localhost:5000/api/auth/profile
# Expected: 401 Unauthorized (no token)
```

### Option 2: Use Postman (Recommended)

1. Download [Postman](https://www.postman.com/downloads/)
2. Create a new collection called "MedAccess"
3. Set base URL: `http://localhost:5000/api`
4. Create a variable for `token` (we'll set it after login)

### Option 3: Use VS Code REST Client Extension

```bash
# Install extension: REST Client (Huachao Mao)
# Create file: requests.http
# Then right-click and "Send Request"
```

## 🔐 Authentication Endpoints

### 1. Register User

**Endpoint:** `POST /auth/register`

**cURL:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123",
    "phone": "+91-9876543210",
    "city": "Delhi"
  }'
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "user_id_here",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91-9876543210",
    "city": "Delhi",
    "bloodGroup": "O+",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Login User

**Endpoint:** `POST /auth/login`

**cURL:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123"
  }'
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "user_id_here",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**⚠️ Important:** Save this token! You'll need it for authenticated endpoints.

### 3. Get User Profile

**Endpoint:** `GET /auth/profile`

**cURL:**
```bash
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "user_id_here",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91-9876543210",
    "city": "Delhi",
    "bloodGroup": "O+",
    "role": "user"
  }
}
```

### 4. Update User Profile

**Endpoint:** `PUT /auth/profile`

**cURL:**
```bash
curl -X PUT http://localhost:5000/api/auth/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "John Doe Updated",
    "phone": "+91-9876543211",
    "city": "Mumbai",
    "bloodGroup": "A+"
  }'
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "user_id_here",
    "name": "John Doe Updated",
    "phone": "+91-9876543211",
    "city": "Mumbai",
    "bloodGroup": "A+"
  }
}
```

## 🏥 Hospital Endpoints

### 5. Get Nearby Hospitals

**Endpoint:** `GET /hospitals/nearby`

**Query Parameters:**
- `latitude` (required): Your latitude
- `longitude` (required): Your longitude
- `radius` (optional): Search radius in meters (default: 10000)

**cURL:**
```bash
curl "http://localhost:5000/api/hospitals/nearby?latitude=28.6139&longitude=77.2090&radius=5000"
```

**Response (200):**
```json
{
  "success": true,
  "hospitals": [
    {
      "placeId": "ChIJ_1-...",
      "name": "Apollo Hospital",
      "address": "New Delhi",
      "rating": 4.5,
      "userRatings": 1200,
      "phone": "+91-11-1234567890",
      "website": "https://www.apollohospitals.com",
      "distance": 2.5,
      "isOpen": true,
      "location": {
        "latitude": 28.5680,
        "longitude": 77.3265
      }
    }
  ],
  "count": 1
}
```

### 6. Get Hospital Details

**Endpoint:** `GET /hospitals/details/:placeId`

**cURL:**
```bash
curl "http://localhost:5000/api/hospitals/details/ChIJ_1-..."
```

**Response (200):**
```json
{
  "success": true,
  "hospital": {
    "placeId": "ChIJ_1-...",
    "name": "Apollo Hospital",
    "address": "New Delhi",
    "rating": 4.5,
    "userRatings": 1200,
    "phone": "+91-11-1234567890",
    "website": "https://www.apollohospitals.com",
    "openingHours": [
      "Open ⋅ Closes 9 PM"
    ],
    "reviews": [
      {
        "author": "User Name",
        "rating": 5,
        "text": "Great experience"
      }
    ]
  }
}
```

## 💊 Pharmacy Endpoints

### 7. Get Nearby Pharmacies

**Endpoint:** `GET /pharmacies/nearby`

**Query Parameters:**
- `latitude` (required)
- `longitude` (required)
- `radius` (optional): Default 10000 meters

**cURL:**
```bash
curl "http://localhost:5000/api/pharmacies/nearby?latitude=28.6139&longitude=77.2090"
```

**Response (200):**
```json
{
  "success": true,
  "pharmacies": [
    {
      "placeId": "ChIJ...",
      "name": "Apollo Pharmacy",
      "address": "New Delhi",
      "rating": 4.2,
      "userRatings": 456,
      "phone": "+91-11-98765432",
      "distance": 1.2,
      "isOpen": true
    }
  ],
  "count": 1
}
```

### 8. Get Nearby Emergency Services

**Endpoint:** `GET /pharmacies/emergency`

**Query Parameters:**
- `latitude` (required)
- `longitude` (required)
- `type` (optional): "police" or "fire"

**cURL:**
```bash
curl "http://localhost:5000/api/pharmacies/emergency?latitude=28.6139&longitude=77.2090&type=police"
```

**Response:**
```json
{
  "success": true,
  "services": [
    {
      "name": "Police Station",
      "address": "New Delhi",
      "phone": "100",
      "distance": 2.5
    }
  ]
}
```

## 🩸 Blood Donor Endpoints

### 9. Register as Blood Donor

**Endpoint:** `POST /donors/register`

**Requires:** Authentication token

**cURL:**
```bash
curl -X POST http://localhost:5000/api/donors/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "bloodGroup": "O+",
    "city": "Delhi",
    "phone": "+91-9876543210",
    "address": "123 Main St, Delhi",
    "lastDonationDate": "2024-01-15",
    "location": {
      "latitude": 28.6139,
      "longitude": 77.2090
    }
  }'
```

**Response (201):**
```json
{
  "success": true,
  "message": "Donor registered successfully",
  "donor": {
    "id": "donor_id",
    "userId": "user_id",
    "bloodGroup": "O+",
    "city": "Delhi",
    "phone": "+91-9876543210",
    "address": "123 Main St, Delhi",
    "location": {
      "coordinates": [77.2090, 28.6139]
    },
    "donationCount": 1,
    "isAvailable": true
  }
}
```

### 10. Search Blood Donors

**Endpoint:** `GET /donors/search`

**Query Parameters:**
- `bloodGroup` (optional): "O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"
- `city` (optional)
- `latitude` (optional): For geospatial search
- `longitude` (optional)
- `radius` (optional): In meters

**cURL:**
```bash
curl "http://localhost:5000/api/donors/search?bloodGroup=O%2B&city=Delhi&latitude=28.6139&longitude=77.2090&radius=5000"
```

**Response:**
```json
{
  "success": true,
  "donors": [
    {
      "id": "donor_id",
      "name": "John Doe",
      "bloodGroup": "O+",
      "city": "Delhi",
      "phone": "+91-9876543210",
      "address": "123 Main St",
      "donationCount": 5,
      "lastDonationDate": "2024-01-15",
      "isAvailable": true,
      "distance": 2.3
    }
  ],
  "count": 1
}
```

### 11. Get All Donors

**Endpoint:** `GET /donors/all`

**cURL:**
```bash
curl http://localhost:5000/api/donors/all
```

### 12. Get My Donor Profile

**Endpoint:** `GET /donors/my-profile`

**Requires:** Authentication token

**cURL:**
```bash
curl http://localhost:5000/api/donors/my-profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 13. Update Donor Profile

**Endpoint:** `PUT /donors/update-profile`

**Requires:** Authentication token

**cURL:**
```bash
curl -X PUT http://localhost:5000/api/donors/update-profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "bloodGroup": "A+",
    "city": "Mumbai",
    "isAvailable": false
  }'
```

## 🩹 Blood Request Endpoints

### 14. Create Blood Request

**Endpoint:** `POST /blood-requests/create`

**Requires:** Authentication token

**cURL:**
```bash
curl -X POST http://localhost:5000/api/blood-requests/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "hospitalName": "Apollo Hospital",
    "city": "Delhi",
    "bloodGroup": "O+",
    "unitsNeeded": 2,
    "urgencyLevel": "critical",
    "patientName": "Patient Name",
    "contact": "+91-9876543210",
    "notes": "URGENT: A+ blood needed for emergency surgery",
    "location": {
      "latitude": 28.6139,
      "longitude": 77.2090
    }
  }'
```

**Response (201):**
```json
{
  "success": true,
  "message": "Blood request created successfully",
  "request": {
    "id": "request_id",
    "hospitalName": "Apollo Hospital",
    "bloodGroup": "O+",
    "unitsNeeded": 2,
    "urgencyLevel": "critical",
    "status": "active",
    "createdAt": "2024-01-20T10:30:00Z"
  }
}
```

### 15. Get All Blood Requests

**Endpoint:** `GET /blood-requests/all`

**Query Parameters:**
- `bloodGroup` (optional)
- `urgencyLevel` (optional): "low", "medium", "high", "critical"
- `status` (optional): "active", "fulfilled", "cancelled"

**cURL:**
```bash
curl "http://localhost:5000/api/blood-requests/all?urgencyLevel=critical&status=active"
```

### 16. Get My Blood Requests

**Endpoint:** `GET /blood-requests/my-requests`

**Requires:** Authentication token

**cURL:**
```bash
curl http://localhost:5000/api/blood-requests/my-requests \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 17. Update Blood Request

**Endpoint:** `PUT /blood-requests/:id`

**Requires:** Authentication token, Must be request creator

**cURL:**
```bash
curl -X PUT http://localhost:5000/api/blood-requests/request_id \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "status": "fulfilled",
    "unitsNeeded": 2
  }'
```

### 18. Delete Blood Request

**Endpoint:** `DELETE /blood-requests/:id`

**Requires:** Authentication token

**cURL:**
```bash
curl -X DELETE http://localhost:5000/api/blood-requests/request_id \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📋 Resource Reporting Endpoints

### 19. Report Medical Resource

**Endpoint:** `POST /resources/report`

**Requires:** Authentication token

**cURL:**
```bash
curl -X POST http://localhost:5000/api/resources/report \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "resourceType": "oxygen",
    "address": "123 Medical Center, Delhi",
    "city": "Delhi",
    "quantity": 50,
    "contact": "+91-9876543210",
    "notes": "Medical oxygen available for emergency use",
    "location": {
      "latitude": 28.6139,
      "longitude": 77.2090
    }
  }'
```

**Response (201):**
```json
{
  "success": true,
  "message": "Resource reported successfully",
  "resource": {
    "id": "resource_id",
    "resourceType": "oxygen",
    "address": "123 Medical Center, Delhi",
    "quantity": 50,
    "status": "pending",
    "verificationStatus": "pending",
    "createdAt": "2024-01-20T10:30:00Z"
  }
}
```

### 20. Get Verified Resources

**Endpoint:** `GET /resources/verified`

**Query Parameters:**
- `resourceType` (optional): "oxygen", "icuBeds", "blood", "medicalSupplies", "camp"
- `city` (optional)

**cURL:**
```bash
curl "http://localhost:5000/api/resources/verified?resourceType=oxygen&city=Delhi"
```

### 21. Get Pending Resources (Admin Only)

**Endpoint:** `GET /resources/pending`

**Requires:** Admin authentication token

**cURL:**
```bash
curl http://localhost:5000/api/resources/pending \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"
```

### 22. Verify Resource (Admin Only)

**Endpoint:** `PUT /resources/verify/:id`

**Requires:** Admin authentication token

**cURL:**
```bash
curl -X PUT http://localhost:5000/api/resources/verify/resource_id \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE" \
  -d '{"status": "verified"}'
```

### 23. Reject Resource (Admin Only)

**Endpoint:** `PUT /resources/reject/:id`

**Requires:** Admin authentication token

**cURL:**
```bash
curl -X PUT http://localhost:5000/api/resources/reject/resource_id \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE" \
  -d '{"reason": "Incomplete information"}'
```

## 🔍 Common Response Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | GET request succeeded |
| 201 | Created | New resource created |
| 400 | Bad Request | Missing required fields |
| 401 | Unauthorized | No/invalid token |
| 403 | Forbidden | Not admin (for admin routes) |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Backend error |

## 📤 Error Response Format

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description here",
  "error": "Detailed error message if available"
}
```

**Example:**
```json
{
  "success": false,
  "message": "Invalid email or password",
  "error": "User not found"
}
```

## 🧪 Test Scenarios

### Scenario 1: Create Account & Find Hospitals

```bash
# 1. Register
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"Test123"}' \
  | jq -r '.token')

# 2. Find hospitals
curl "http://localhost:5000/api/hospitals/nearby?latitude=28.6139&longitude=77.2090"
```

### Scenario 2: Register as Donor

```bash
# Save your token from registration above
TOKEN="your_token_here"

curl -X POST http://localhost:5000/api/donors/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "bloodGroup":"O+",
    "city":"Delhi",
    "phone":"+91-9876543210",
    "address":"123 St"
  }'
```

### Scenario 3: Create & Find Blood Requests

```bash
# Create request
curl -X POST http://localhost:5000/api/blood-requests/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "hospitalName":"Apollo",
    "bloodGroup":"O+",
    "unitsNeeded":2,
    "urgencyLevel":"critical",
    "contact":"+91-9876543210"
  }'

# View all requests
curl http://localhost:5000/api/blood-requests/all
```

## 🔗 Postman Collection Template

```json
{
  "info": {
    "name": "MedAccess API",
    "version": "1.0"
  },
  "baseUrl": "http://localhost:5000/api",
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{token}}",
        "type": "string"
      }
    ]
  }
}
```

## 📝 Tips for Testing

1. **Save tokens** in Postman variables after login
2. **Use environment variables** for base URLs (localhost vs production)
3. **Test auth flows** first (register → login → profile)
4. **Test without auth** first (hospitals, pharmacies, donors/all)
5. **Use pretty-print** for JSON responses
6. **Check headers** for CORS and content-type issues
7. **Monitor backend logs** while testing for errors

## 🚀 Next Steps

- Load balance across multiple backend instances
- Add rate limiting to prevent abuse
- Implement webhook notifications for blood requests
- Add request timeout handling
- Implement retry logic for failed requests
