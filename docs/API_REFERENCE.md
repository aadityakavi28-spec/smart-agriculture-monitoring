# API Reference

## Base URL
```
http://localhost:5000/api
```

---

## 📡 General Response Format

### Success Response (2xx)
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

### Error Response (4xx, 5xx)
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (dev mode only)"
}
```

---

## 🌾 Sensor Endpoints

### POST `/sensors/data`
Record new sensor reading from a sensor/simulator

**Request:**
```json
{
  "soilMoisture": 45.5,
  "temperature": 25.2,
  "humidity": 60,
  "fieldId": "field_001",
  "farmId": "farm_001"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Sensor data recorded successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "farmId": "farm_001",
    "fieldId": "field_001",
    "soilMoisture": 45.5,
    "temperature": 25.2,
    "humidity": 60,
    "timestamp": "2024-02-15T14:30:45.123Z",
    "source": "simulated"
  }
}
```

**Error Responses:**
- 400: `Missing required fields: soilMoisture, temperature, humidity`
- 500: Database error

---

### GET `/sensors/latest`
Get the latest sensor reading for a field

**Query Parameters:**
```
fieldId: string (default: "field_001")
farmId: string (default: "farm_001")
```

**Example:**
```
GET /sensors/latest?fieldId=field_001&farmId=farm_001
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "farmId": "farm_001",
    "fieldId": "field_001",
    "soilMoisture": 45.5,
    "temperature": 25.2,
    "humidity": 60,
    "timestamp": "2024-02-15T14:30:45.123Z"
  }
}
```

**Error Responses:**
- 404: `No sensor data found for this field`
- 500: Database error

---

### GET `/sensors/history`
Get historical sensor data for a field (time range)

**Query Parameters:**
```
fieldId: string (default: "field_001")
farmId: string (default: "farm_001")
hours: number (default: 24, range: 1-720)
```

**Example:**
```
GET /sensors/history?fieldId=field_001&hours=24
```

**Response (200 OK):**
```json
{
  "success": true,
  "dataPoints": 144,
  "data": [
    {
      "soilMoisture": 50,
      "temperature": 25,
      "humidity": 60,
      "timestamp": "2024-02-14T14:30:45.123Z"
    },
    {
      "soilMoisture": 49.8,
      "temperature": 25.1,
      "humidity": 60.2,
      "timestamp": "2024-02-14T14:40:45.123Z"
    }
    // ... more readings
  ]
}
```

---

### GET `/sensors/statistics`
Get aggregated statistics (avg, min, max) for last 24 hours

**Query Parameters:**
```
fieldId: string (default: "field_001")
farmId: string (default: "farm_001")
```

**Example:**
```
GET /sensors/statistics?fieldId=field_001
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "field_001",
    "avgMoisture": 45.2,
    "maxMoisture": 65.5,
    "minMoisture": 25.0,
    "avgTemperature": 24.8,
    "maxTemperature": 28.5,
    "avgHumidity": 62.3,
    "readingCount": 144
  }
}
```

---

## 🚜 Prediction Endpoints

### GET `/predictions/forecast`
Get latest irrigation forecast/prediction

**Query Parameters:**
```
fieldId: string (default: "field_001")
farmId: string (default: "farm_001")
```

**Example:**
```
GET /predictions/forecast?fieldId=field_001
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "farmId": "farm_001",
    "fieldId": "field_001",
    "currentMoisture": 45.2,
    "estimatedIrrigationTime": "2024-02-18T02:00:00.000Z",
    "moistureDropRate": 0.25,
    "criticalThreshold": 30,
    "currentTrend": "declining",
    "confidence": 85,
    "analysisDataPoints": 144,
    "analysisPeriod": "last_24_hours",
    "timestamp": "2024-02-15T14:30:00.000Z",
    "readableEstimate": "Irrigation needed in 60 hours",
    "moistureStatus": "MODERATE - Watch closely",
    "recommendation": "📉 Declining trend detected. Monitor closely and prepare irrigation."
  }
}
```

**Fields Explained:**
- `currentMoisture`: Current soil moisture level (%)
- `estimatedIrrigationTime`: ISO timestamp when irrigation is needed
- `moistureDropRate`: Percentage of moisture lost per hour
- `currentTrend`: "declining", "rising", or "stable"
- `confidence`: 0-100 score of prediction accuracy
- `readableEstimate`: User-friendly time estimate
- `recommendation`: Actionable recommendation for farmer

---

### POST `/predictions/generate`
Manually generate a new prediction (normally auto-generated)

**Request:**
```json
{
  "fieldId": "field_001",
  "farmId": "farm_001",
  "hoursToAnalyze": 24
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Prediction generated successfully",
  "data": { /* same as forecast endpoint */ }
}
```

---

### GET `/predictions/trend`
Get trend analysis without full prediction

**Query Parameters:**
```
fieldId: string (default: "field_001")
farmId: string (default: "farm_001")
```

**Example:**
```
GET /predictions/trend?fieldId=field_001
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "fieldId": "field_001",
    "farmId": "farm_001",
    "currentMoisture": 45.2,
    "trend": "declining",
    "dropRate": 0.25,
    "confidence": 85,
    "trendDescription": "Moisture is decreasing at 0.25% per hour - soil is drying out"
  }
}
```

---

## 🔔 Alert Endpoints

### GET `/alerts/active`
Get all active (unresolved) alerts

**Query Parameters:**
```
fieldId: string (default: "field_001")
farmId: string (default: "farm_001")
```

**Example:**
```
GET /alerts/active?fieldId=field_001
```

**Response (200 OK):**
```json
{
  "success": true,
  "alertCount": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "fieldId": "field_001",
      "farmId": "farm_001",
      "alertType": "low_moisture",
      "severity": "high",
      "soilMoisture": 32,
      "temperature": 26,
      "message": "⚠️ LOW: Soil moisture is 32%. Irrigation recommended soon.",
      "resolved": false,
      "timestamp": "2024-02-15T14:30:45.123Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "fieldId": "field_001",
      "farmId": "farm_001",
      "alertType": "high_temp",
      "severity": "medium",
      "temperature": 42,
      "message": "⚠️ Temperature is 42°C. High temperature detected.",
      "resolved": false,
      "timestamp": "2024-02-15T14:25:15.123Z"
    }
  ]
}
```

---

### GET `/alerts/history`
Get alert history (resolved and unresolved)

**Query Parameters:**
```
fieldId: string (default: "field_001")
farmId: string (default: "farm_001")
hours: number (default: 24)
```

**Example:**
```
GET /alerts/history?fieldId=field_001&hours=24
```

**Response (200 OK):**
```json
{
  "success": true,
  "alertCount": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "alertType": "low_moisture",
      "severity": "high",
      "message": "...",
      "resolved": true,
      "resolvedAt": "2024-02-15T16:30:00.000Z",
      "timestamp": "2024-02-15T14:30:45.123Z"
    }
    // ... more alerts
  ]
}
```

---

### PUT `/alerts/:alertId/resolve`
Mark an alert as resolved

**URL Parameter:**
```
alertId: ObjectId (from alert object)
```

**Example:**
```
PUT /alerts/507f1f77bcf86cd799439011/resolve
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Alert resolved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "alertType": "low_moisture",
    "resolved": true,
    "resolvedAt": "2024-02-15T16:35:00.000Z"
  }
}
```

---

### GET `/alerts/statistics`
Get alert statistics (count by severity)

**Query Parameters:**
```
fieldId: string (default: "field_001")
farmId: string (default: "farm_001")
```

**Example:**
```
GET /alerts/statistics?fieldId=field_001
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "critical",
      "count": 2
    },
    {
      "_id": "high",
      "count": 5
    },
    {
      "_id": "medium",
      "count": 8
    },
    {
      "_id": "low",
      "count": 3
    }
  ]
}
```

---

## ❤️ Health Check

### GET `/health`
Check if backend is running

**Example:**
```
GET /health
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Smart Agriculture Backend is running",
  "timestamp": "2024-02-15T14:30:45.123Z"
}
```

---

## 🔌 Integration Examples

### JavaScript / Node.js

```javascript
const API_URL = 'http://localhost:5000/api';

// Get latest reading
async function getLatestReading(fieldId = 'field_001') {
  const response = await fetch(
    `${API_URL}/sensors/latest?fieldId=${fieldId}`
  );
  return response.json();
}

// Record new reading
async function recordReading(data) {
  const response = await fetch(`${API_URL}/sensors/data`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
}

// Get prediction
async function getPrediction(fieldId = 'field_001') {
  const response = await fetch(
    `${API_URL}/predictions/forecast?fieldId=${fieldId}`
  );
  return response.json();
}

// Get alerts
async function getAlerts(fieldId = 'field_001') {
  const response = await fetch(
    `${API_URL}/alerts/active?fieldId=${fieldId}`
  );
  return response.json();
}
```

### Python

```python
import requests

API_URL = 'http://localhost:5000/api'

# Get latest reading
response = requests.get(f'{API_URL}/sensors/latest', params={'fieldId': 'field_001'})
data = response.json()
print(data)

# Record new reading
payload = {
    'soilMoisture': 45.5,
    'temperature': 25.2,
    'humidity': 60
}
response = requests.post(f'{API_URL}/sensors/data', json=payload)
print(response.json())

# Get prediction
response = requests.get(f'{API_URL}/predictions/forecast')
print(response.json())
```

### cURL

```bash
# Get latest reading
curl "http://localhost:5000/api/sensors/latest?fieldId=field_001"

# Record reading
curl -X POST "http://localhost:5000/api/sensors/data" \
  -H "Content-Type: application/json" \
  -d '{"soilMoisture":45.5,"temperature":25.2,"humidity":60}'

# Get prediction
curl "http://localhost:5000/api/predictions/forecast"

# Resolve alert
curl -X PUT "http://localhost:5000/api/alerts/<alertId>/resolve"
```

---

## 📊 Rate Limiting

Currently, there are no rate limits. For production, add:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## 🔐 Authentication (Future)

Add JWT authentication:

```javascript
// Login
POST /auth/login
{
  "email": "farmer@example.com",
  "password": "password"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": "...", "email": "..." }
}

// Use token in headers
GET /sensors/latest
Authorization: Bearer <token>
```

---

## 🐛 Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| 200 | OK | Success |
| 201 | Created | Resource created |
| 400 | Bad Request | Check request parameters |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Backend error, check logs |
| 503 | Unavailable | Database connection failed |

---

## 📈 Performance Tips

1. **Batch requests** - Get multiple endpoints in one? Consider aggregating
2. **Cache predictions** - Don't call `/predictions/forecast` every second
3. **Limit history range** - Don't fetch 1 year of data, use pagination
4. **Subscribe to WebSockets** - Future feature for real-time updates

---

## 📚 More Resources

- [Frontend API Client](../frontend/src/services/api.js)
- [Backend Routes](../backend/src/routes/)
- [Deployment Guide](./DEPLOYMENT.md)

