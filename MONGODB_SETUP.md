# 🗄️ MedAccess - MongoDB Setup Guide

Complete guide for setting up MongoDB for MedAccess.

## 3 Options: Choose One

### Option 1: MongoDB Atlas (Cloud) - ⭐ Recommended for Beginners

Free cloud database hosting with 512MB storage.

#### Step 1: Create Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up with email or Google
3. Verify your email

#### Step 2: Create Free Cluster

1. Click "Create a Database"
2. Select "Free Tier" (M0)
3. Choose your cloud provider (AWS) and region (closest to you)
4. Click "Create Cluster"
5. Wait 2-3 minutes for cluster to be created

#### Step 3: Create Database User

1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Fill in:
   - **Username:** `medaccess_user`
   - **Password:** Create a strong password (save it!)
   - **Database User Privileges:** "Read and write to any database"
4. Click "Add User"

#### Step 4: Configure Network Access

1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
   - Or enter your specific IP for production
4. Click "Confirm"

#### Step 5: Get Connection String

1. Go to "Clusters" page
2. Click "Connect" button on your cluster
3. Select "Drivers" → "Node.js"
4. Copy the connection string
5. Replace `<password>` with your database user password

**Your connection string looks like:**
```
mongodb+srv://medaccess_user:YOUR_PASSWORD@cluster0.abc123.mongodb.net/medaccess?retryWrites=true&w=majority
```

#### Step 6: Create Database Collections

The database and collections will be created automatically when your app first writes data! No manual setup needed.

---

### Option 2: MongoDB Community (Local) - For Development

Install MongoDB locally on your machine.

#### Step 1: Download & Install

**Windows:**
1. Download from [MongoDB Community Server](https://www.mongodb.com/try/download/community)
2. Run the installer
3. Select "Install MongoDB as a Service"
4. Install MongoDB Compass (GUI tool)

**macOS:**
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu):**
```bash
# Import GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start service
sudo systemctl start mongod
```

#### Step 2: Verify Installation

```bash
# Check if MongoDB is running
mongosh

# You should see a MongoDB shell prompt
# Type: exit to quit
```

#### Step 3: Configuration

**Default connection string (local):**
```
mongodb://localhost:27017/medaccess
```

#### Step 4: Create Collections (Optional)

Collections are created automatically, but you can pre-create with MongoDB Compass:

1. Open MongoDB Compass
2. Default connection: `mongodb://localhost:27017`
3. Click "Create Database"
4. Database: `medaccess`
5. Collections: Create empty collections for each model if desired

---

### Option 3: Docker - Professional Setup

Run MongoDB in a Docker container.

#### Step 1: Install Docker

Download from [Docker Desktop](https://www.docker.com/products/docker-desktop)

#### Step 2: Run MongoDB Container

```bash
# Pull and run MongoDB image
docker run -d \
  --name medaccess-mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=medaccess_user \
  -e MONGO_INITDB_ROOT_PASSWORD=yourpassword \
  mongo:6.0

# Verify it's running
docker ps
```

#### Step 3: Connection String

```
mongodb://medaccess_user:yourpassword@localhost:27017/medaccess?ssl=false&authSource=admin
```

#### Step 4: Stop/Start Container

```bash
# Stop
docker stop medaccess-mongodb

# Start
docker start medaccess-mongodb

# Remove
docker rm medaccess-mongodb
```

---

## 🔧 Configure Backend

### Step 1: Create .env File

In `backend/` folder, create `.env`:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://medaccess_user:PASSWORD@cluster.mongodb.net/medaccess?retryWrites=true&w=majority

# Or for local MongoDB:
# MONGODB_URI=mongodb://localhost:27017/medaccess

# Other configurations
JWT_SECRET=generate_a_random_string_here_min_32_chars_long
NODE_ENV=development
PORT=5000
GOOGLE_PLACES_API_KEY=your_google_places_key
GOOGLE_MAPS_API_KEY=your_google_maps_key
FRONTEND_URL=http://localhost:5173
```

### Step 2: Generate Random JWT Secret

Use this command to generate a secure JWT secret:

```bash
# On Mac/Linux
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

# Or use online: https://www.uuidgenerator.net/
```

Copy the output to `JWT_SECRET` in your `.env` file.

### Step 3: Test Connection

```bash
cd backend
npm install
node -e "require('dotenv').config(); console.log(process.env.MONGODB_URI)"
```

If you see the URI printed, the .env file is loaded correctly.

---

## 📊 Database Schema

MedAccess automatically creates these collections:

### 1. Users Collection

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  city: String,
  bloodGroup: String,
  role: String, // "user" or "admin"
  createdAt: Date,
  updatedAt: Date
}
```

### 2. Blood Donors Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId (foreign key),
  bloodGroup: String,
  city: String,
  phone: String,
  address: String,
  lastDonationDate: Date,
  donationCount: Number, // default: 0
  isAvailable: Boolean, // default: true
  location: {
    type: "Point",
    coordinates: [longitude, latitude] // [77.2090, 28.6139]
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Index:** `2dsphere` on location field for geospatial queries

### 3. Blood Requests Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId (foreign key),
  hospitalName: String,
  city: String,
  bloodGroup: String,
  unitsNeeded: Number,
  urgencyLevel: String, // "low", "medium", "high", "critical"
  patientName: String,
  contact: String,
  notes: String,
  status: String, // "active", "fulfilled", "cancelled"
  location: {
    type: "Point",
    coordinates: [longitude, latitude]
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 4. Resource Reports Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId (foreign key),
  resourceType: String, // "oxygen", "icuBeds", "blood", "medicalSupplies", "camp"
  address: String,
  city: String,
  quantity: Number,
  contact: String,
  notes: String,
  status: String, // "active", "inactive"
  verificationStatus: String, // "pending", "verified", "rejected"
  rejectionReason: String,
  location: {
    type: "Point",
    coordinates: [longitude, latitude]
  },
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔍 Database Management Tools

### MongoDB Compass (GUI) - Recommended

Free graphical tool to manage MongoDB

1. Download from [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect to your database:
   - **For Atlas:** Paste your connection string
   - **For Local:** `mongodb://localhost:27017`
3. Create indexes
4. View documents
5. Run queries
6. Create backups

### mongosh (Command Line)

MongoDB's interactive shell

```bash
# Connect to Atlas
mongosh "mongodb+srv://user:password@cluster.mongodb.net/medaccess"

# Connect to local
mongosh

# Common commands
show databases           # List all databases
use medaccess          # Switch to medaccess database
show collections       # List collections
db.users.find()        # View all users
db.users.find({_id: ObjectId("...")})  # Find by ID
db.users.updateOne({_id: ObjectId("...")}, {$set: {role: "admin"}})  # Update
db.users.deleteOne({_id: ObjectId("...")})  # Delete
db.users.drop()        # Drop entire collection
```

### MongoDB Atlas Dashboard

Manage directly in browser at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)

---

## 🗂️ Create Indexes (Recommended)

Indexes improve query performance. Run these in Compass or mongosh:

```javascript
// Create unique index on email
db.users.createIndex({ email: 1 }, { unique: true })

// Create geospatial index for location queries
db.blooddonors.createIndex({ location: "2dsphere" })
db.bloodrequests.createIndex({ location: "2dsphere" })
db.resourcereports.createIndex({ location: "2dsphere" })

// Create indexes for common searches
db.blooddonors.createIndex({ bloodGroup: 1, city: 1 })
db.bloodrequests.createIndex({ bloodGroup: 1, urgencyLevel: 1 })
db.resourcereports.createIndex({ resourceType: 1, city: 1 })
```

---

## 💾 Backup & Restore

### Backup MongoDB Atlas

1. Go to MongoDB Atlas Dashboard
2. Select your cluster
3. Go to "Backup" section
4. Click "Backup Now"
5. Download snapshot when ready

### Backup Local MongoDB

```bash
# Export all data
mongodump --out ./backup

# Export specific collection
mongodump -d medaccess -c users -o ./backup

# Export as JSON
mongoexport -d medaccess -c users -o users.json
```

### Restore MongoDB

```bash
# Restore from backup
mongorestore ./backup

# Import JSON
mongoimport -d medaccess -c users < users.json
```

---

## 🔐 Security Best Practices

### For Production (MongoDB Atlas)

1. ✅ Use strong passwords (min 12 characters)
2. ✅ Enable IP Whitelist (not "Allow from Anywhere")
3. ✅ Use environment variables for credentials
4. ✅ Enable SSL for connections
5. ✅ Regular automated backups
6. ✅ Monitor database activity
7. ✅ Use read-only users for non-admin operations

### For Local Development

```bash
# Create admin user
mongosh

> use admin
> db.createUser({
  user: "admin",
  pwd: "admin_password",
  roles: ["root"]
})

# Create app user (limited permissions)
> db.createUser({
  user: "medaccess_user",
  pwd: "medaccess_password",
  roles: ["readWrite"]
})
```

---

## 🧪 Test Data Setup

### Create Sample Users

```javascript
db.users.insertMany([
  {
    name: "John Donor",
    email: "john@test.com",
    password: "hashed_password_here",
    phone: "+91-9876543210",
    city: "Delhi",
    bloodGroup: "O+",
    role: "user",
    createdAt: new Date()
  },
  {
    name: "Admin User",
    email: "admin@test.com",
    password: "hashed_password_here",
    phone: "+91-9876543211",
    city: "Delhi",
    bloodGroup: "A+",
    role: "admin",
    createdAt: new Date()
  }
])
```

### Create Sample Donors

```javascript
db.blooddonors.insertMany([
  {
    userId: ObjectId("user_id_here"),
    bloodGroup: "O+",
    city: "Delhi",
    phone: "+91-9876543210",
    address: "123 Main St, Delhi",
    lastDonationDate: new Date("2024-01-15"),
    donationCount: 3,
    isAvailable: true,
    location: {
      type: "Point",
      coordinates: [77.2090, 28.6139]
    },
    createdAt: new Date()
  }
])
```

---

## 📈 Monitor Database Usage

### View Database Stats

```bash
mongosh

> db.stats()
> db.users.stats()
> db.users.countDocuments()
```

### MongoDB Atlas Monitoring

1. Go to MongoDB Atlas
2. Select your cluster
3. Click "Monitoring" tab
4. View:
   - Database operations per second
   - Connection count
   - Storage used
   - Query performance

---

## ⚠️ Troubleshooting

### Connection Refused

```
Error: connect ECONNREFUSED 127.0.0.1:27017

Solution:
- Local MongoDB not running
- Run: mongod (Mac/Linux) or use MongoDB Compass
- Or check service: systemctl status mongod (Linux)
```

### Authentication Failed

```
Error: unable to get local issuer certificate

Solution:
- Check username and password in URI
- Check that user exists in database
- For local connections, remove credentials:
  mongodb://localhost:27017/medaccess
```

### IP Whitelist Error

```
Error: not authorized on admin to execute command

Solution (MongoDB Atlas):
- Go to Network Access
- Add your IP address
- Or allow from anywhere (for development)
```

### Geospatial Query Error

```
Error: no geo index

Solution:
- Create 2dsphere index:
  db.blooddonors.createIndex({ location: "2dsphere" })
```

---

## 📚 Useful Commands

```bash
# Start MongoDB (local)
mongod

# Connect to MongoDB (local)
mongosh

# Connect to Atlas
mongosh "mongodb+srv://user:pass@cluster.mongodb.net/medaccess"

# View all databases
show databases

# Switch database
use medaccess

# View collections
show collections

# Count documents
db.users.countDocuments()

# Find all
db.users.find()

# Find with filter
db.users.find({ city: "Delhi" })

# Find one
db.users.findOne({ email: "john@test.com" })

# Update
db.users.updateOne({ _id: ObjectId("...") }, { $set: { role: "admin" } })

# Delete
db.users.deleteOne({ _id: ObjectId("...") })

# Create index
db.users.createIndex({ email: 1 }, { unique: true })

# View indexes
db.users.getIndexes()

# Drop collection
db.users.drop()

# Drop database
db.dropDatabase()
```

---

## ✅ Verify Setup

After setup, verify everything works:

```bash
# 1. Check .env file exists
cat backend/.env

# 2. Start backend
cd backend
npm run dev

# You should see:
# 🚀 MedAccess Server running on port 5000
# 📦 Connected to MongoDB

# 3. Test API
curl http://localhost:5000/api/hospitals/nearby?latitude=28.6139&longitude=77.2090

# 4. Should return hospitals (or empty array if no Google key set)
```

---

## 🎯 Production Deployment

For production, use MongoDB Atlas with:

```env
# Production .env
MONGODB_URI=mongodb+srv://prod_user:strong_password@prod-cluster.mongodb.net/medaccess?retryWrites=true&w=majority
NODE_ENV=production
PORT=5000
JWT_SECRET=long_random_secret_string
```

**Security Checklist:**
- [ ] Change default username/password
- [ ] Enable IP whitelist (only allow your server IPs)
- [ ] Enable SSL/TLS encryption
- [ ] Set up automated backups
- [ ] Enable database activity monitoring
- [ ] Use environment variables for all credentials
- [ ] Encrypt connection in transit (SSL required)
- [ ] Regular security audits

---

## 📞 Getting Help

- MongoDB Docs: https://docs.mongodb.com/
- Atlas Support: https://www.mongodb.com/cloud/atlas/contact
- Atlas Status: https://status.mongodb.com/

Enjoy using MedAccess! 🚀
