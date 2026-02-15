/**
 * Main Express Application
 * Smart Agriculture Monitoring System Backend
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';

// Import routes
import sensorRoutes from './routes/sensorRoutes.js';
import predictionRoutes from './routes/predictionRoutes.js';
import alertRoutes from './routes/alertRoutes.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// ============================================================
// MIDDLEWARE
// ============================================================

// CORS Configuration - Allow frontend to communicate with backend
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// ============================================================
// ROUTES
// ============================================================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Smart Agriculture Backend is running',
    timestamp: new Date(),
  });
});

// Sensor API routes
app.use('/api/sensors', sensorRoutes);

// Prediction API routes
app.use('/api/predictions', predictionRoutes);

// Alert API routes
app.use('/api/alerts', alertRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Smart Agriculture Monitoring System Backend API',
    version: '1.0.0',
    endpoints: {
      sensors: '/api/sensors',
      predictions: '/api/predictions',
      alerts: '/api/alerts',
      health: '/api/health',
    },
  });
});

// ============================================================
// ERROR HANDLING
// ============================================================

// 404 - Not Found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// ============================================================
// DATABASE CONNECTION & SERVER START
// ============================================================

const startServer = async () => {
  try {
    // Connect to MongoDB
    console.log('🔄 Connecting to MongoDB...');
    await connectDB();

    // Start HTTP server
    app.listen(PORT, () => {
      console.log(`✅ Backend server running on http://localhost:${PORT}`);
      console.log(`📡 Frontend URL: ${FRONTEND_URL}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

export default app;
