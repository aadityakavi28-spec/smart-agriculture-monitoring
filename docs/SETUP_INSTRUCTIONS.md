# Step-by-Step Setup Instructions

## ⚙️ Complete Setup Guide

### Part 1: Prerequisites

#### Step 1.1: Install Node.js
- Download from https://nodejs.org/ (LTS version recommended)
- Verify: `node --version` and `npm --version`

#### Step 1.2: Install MongoDB
**Option A: Local MongoDB (Windows)**
1. Download from https://www.mongodb.com/try/download/community
2. Run installer
3. During installation, uncheck "MongoDB Compass" if not needed
4. Verify: `mongod --version`
5. Start MongoDB: Open PowerShell as Admin
   ```powershell
   net start MongoDB
   ```

**Option B: MongoDB Atlas (Cloud - Recommended)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster (M0 free tier)
4. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/smart-agriculture...`
5. Update backend `.env` with this URI

#### Step 1.3: Code Editor
- Download VS Code: https://code.visualstudio.com/

---

### Part 2: Backend Setup (Express + Node.js)

#### Step 2.1: Navigate to backend directory
```powershell
cd "c:\Users\ASUS\OneDrive\Pictures\Desktop\MERN\HACK\smart-agriculture-monitoring\backend"
```

#### Step 2.2: Create .env file
```powershell
# Copy example
Copy-Item .env.example .env

# Edit with your MongoDB URI
notepad .env
```

**Content of .env:**
```
MONGODB_URI=mongodb://localhost:27017/smart-agriculture
# OR for Atlas:
# MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/smart-agriculture?retryWrites=true&w=majority

PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
FIELD_ID=field_001
FARM_ID=farm_001
```

#### Step 2.3: Install dependencies
```powershell
npm install
```

**What gets installed:**
- express: Web framework
- mongoose: MongoDB connector
- cors: Cross-origin requests
- dotenv: Environment variables

#### Step 2.4: Start backend
```powershell
npm run dev
```

**Expected output:**
```
✓ MongoDB Connected: localhost:27017
✅ Backend server running on http://localhost:5000
📡 Frontend URL: http://localhost:3000
🌍 Environment: development
```

**Test backend is working:**
Open browser: http://localhost:5000/api/health

---

### Part 3: Frontend Setup (React)

#### Step 3.1: Navigate to frontend directory
```powershell
cd "c:\Users\ASUS\OneDrive\Pictures\Desktop\MERN\HACK\smart-agriculture-monitoring\frontend"
```

#### Step 3.2: Create .env file
```powershell
Copy-Item .env.example .env
```

**Content of .env:**
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_FIELD_ID=field_001
REACT_APP_FARM_ID=farm_001
```

#### Step 3.3: Install dependencies
```powershell
npm install
```

**This installs:**
- react: UI library
- axios: HTTP client
- recharts: Charts library

#### Step 3.4: Start frontend
```powershell
npm start
```

**Expected:** Browser automatically opens at http://localhost:3000

---

### Part 4: Sensor Simulator

#### Step 4.1: Navigate to simulator directory
```powershell
cd "c:\Users\ASUS\OneDrive\Pictures\Desktop\MERN\HACK\smart-agriculture-monitoring\simulator"
```

#### Step 4.2: Start simulator
```powershell
npm start
```

**Expected output:**
```
🌱 Smart Agriculture Sensor Simulator
📡 Backend URL: http://localhost:5000/api
🏗️  Field: farm_001/field_001
⏱️  Interval: Every 10 seconds
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ [14:30:45] Sensor data sent: Moisture: 65.2% Temp: 25.1°C Humidity: 58%
✅ [14:30:55] Sensor data sent: Moisture: 65.1% Temp: 25.2°C Humidity: 58.5%
...
```

---

### Part 5: Access the Dashboard

1. Backend running on port 5000 ✅
2. Frontend running on port 3000 ✅
3. Simulator sending data ✅

**Open dashboard:** http://localhost:3000

**You should see:**
- Live soil moisture gauge (colored indicator)
- Current temperature and humidity readings
- 24-hour historical chart (will populate after ~5 minutes)
- Irrigation prediction card
- Alert panel
- Field statistics

---

## 🧪 Testing the System

### Test 1: Verify Data Flow

#### Backend API Test
```powershell
# Open PowerShell in new terminal

# Get latest sensor reading
curl -Uri "http://localhost:5000/api/sensors/latest?fieldId=field_001&farmId=farm_001" -UseBasicParsing | ConvertFrom-Json

# Should return:
# {
#   "success": true,
#   "data": {
#     "soilMoisture": 65.2,
#     "temperature": 25.1,
#     "humidity": 58,
#     "timestamp": "2024-02-15T14:30:45Z"
#   }
# }
```

#### Frontend Test
1. Open DevTools (F12)
2. Go to Network tab
3. Refresh page
4. Should see GET requests to:
   - `/api/sensors/latest` (returns current reading)
   - `/api/sensors/history` (returns 24h data)
   - `/api/predictions/forecast` (returns prediction)
   - `/api/alerts/active` (returns active alerts)

### Test 2: Manual Sensor Reading

Send a test reading:
```powershell
$body = @{
    soilMoisture = 50
    temperature = 28
    humidity = 65
    fieldId = "field_001"
    farmId = "farm_001"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/sensors/data" `
  -Method POST `
  -Body $body `
  -ContentType "application/json"
```

### Test 3: Generate Prediction

```powershell
$body = @{
    fieldId = "field_001"
    farmId = "farm_001"
    hoursToAnalyze = 24
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/predictions/generate" `
  -Method POST `
  -Body $body `
  -ContentType "application/json"
```

---

## 🔧 Troubleshooting

### Issue: "Cannot connect to MongoDB"

**Solution:**
1. Verify MongoDB is running: `Get-Process mongod`
2. If using local: Start `mongod` in separate terminal
3. If using Atlas: Check connection string in `.env`
4. Check firewall isn't blocking port 27017

### Issue: "Port 5000 already in use"

```powershell
# Find process using port 5000
Get-NetTCPConnection -LocalPort 5000 | Select-Object OwningProcess

# Kill it (replace PID):
Stop-Process -Id <PID> -Force
```

### Issue: Frontend won't connect to backend

1. Verify backend is running: http://localhost:5000/api/health
2. Check `REACT_APP_API_URL` in frontend `.env`
3. Clear browser cache (Ctrl+Shift+Delete)
4. Check browser console for CORS errors

### Issue: No data showing in charts

1. Verify simulator is running and sending data
2. Wait 5-10 minutes for enough readings
3. Check backend logs for errors
4. Try `npm run dev` to see detailed logs

### Issue: "npm not found"

- Make sure Node.js is installed: `node --version`
- Restart terminal after Node.js installation
- Add Node.js to PATH if needed

---

## 📊 Expected Data Flow Example

```
Timeline:
T+0s:   Simulator generates: Moisture: 65%, Temp: 25°C, Humidity: 60%
        └─> POST /api/sensors/data
            └─> Stored in MongoDB

T+10s:  Simulator generates: Moisture: 64.8%, Temp: 25.1°C, Humidity: 59.8%
        └─> POST /api/sensors/data
            └─> Stored in MongoDB

T+30s:  Frontend refreshes
        ├─> GET /api/sensors/latest
        │   └─> Returns latest reading (Moisture: 64.8%)
        ├─> GET /api/sensors/history?hours=24
        │   └─> Returns [reading1, reading2, reading3]
        ├─> GET /api/predictions/forecast
        │   └─> Returns prediction (irrigation in 60 hours)
        └─> GET /api/alerts/active
            └─> Returns [] (no alerts yet)

Frontend Dashboard Update:
├─ Gauge shows: 64.8% (slightly red)
├─ Chart adds two points
├─ Prediction shows: "Irrigation needed in 60 hours"
└─ Alerts: "No active alerts"
```

---

## 📮 Common Tasks

### Add more sensor readings manually

**Option 1: Use curl**
```powershell
$readings = @(
    @{ soilMoisture = 50; temperature = 26; humidity = 62 },
    @{ soilMoisture = 48; temperature = 27; humidity = 61 },
    @{ soilMoisture = 46; temperature = 28; humidity = 60 }
)

foreach ($reading in $readings) {
    $body = $reading + @{ fieldId = "field_001"; farmId = "farm_001" } | ConvertTo-Json
    Invoke-RestMethod -Uri "http://localhost:5000/api/sensors/data" `
      -Method POST -Body $body -ContentType "application/json"
    Start-Sleep -Seconds 1
}
```

### Stop all services

```powershell
# Stop backend: Press Ctrl+C in backend terminal
# Stop frontend: Press Ctrl+C in frontend terminal
# Stop simulator: Press Ctrl+C in simulator terminal
# Stop MongoDB: net stop MongoDB
```

### View MongoDB data directly

```powershell
# Install MongoDB tools if needed
# Then:
mongosh
> use smart-agriculture
> db.sensor_data.find().limit(5)  # See last 5 readings
> db.alerts.find()                # See all alerts
> db.irrigation_predictions.findOne()  # See latest prediction
```

---

## ✅ Verification Checklist

- [ ] Node.js installed (`node --version`)
- [ ] MongoDB running (local or Atlas)
- [ ] Backend `.env` configured
- [ ] Frontend `.env` configured
- [ ] Backend starts without errors (`npm run dev`)
- [ ] Frontend starts and opens browser
- [ ] Simulator is generating data
- [ ] Dashboard shows real-time gauge
- [ ] Charts populate after ~5 minutes
- [ ] Prediction card shows forecast
- [ ] API health check works: http://localhost:5000/api/health

---

## 🎉 You're Ready!

Once everything is running, you have a complete production-ready smart agriculture monitoring system!

**Next Steps:**
1. Explore the code structure
2. Modify simulator to test different scenarios
3. Add more fields (change `fieldId` in `.env`)
4. Review the prediction algorithm logic
5. Deploy to production (see DEPLOYMENT.md)

