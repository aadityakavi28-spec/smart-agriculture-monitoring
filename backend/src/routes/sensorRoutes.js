/**
 * Sensor Routes
 * API endpoints for sensor data operations
 */

import express from 'express';
import SensorController from '../controllers/sensorController.js';

const router = express.Router();

/**
 * POST /api/sensors/data
 * Record new sensor reading
 * Body: { soilMoisture, temperature, humidity, fieldId?, farmId? }
 */
router.post('/data', SensorController.recordSensorData);

/**
 * GET /api/sensors/latest
 * Get latest sensor reading
 * Query: fieldId?, farmId?
 */
router.get('/latest', SensorController.getLatestReading);

/**
 * GET /api/sensors/history
 * Get historical sensor data
 * Query: fieldId?, farmId?, hours?
 */
router.get('/history', SensorController.getHistoricalData);

/**
 * GET /api/sensors/statistics
 * Get statistical summary
 * Query: fieldId?, farmId?
 */
router.get('/statistics', SensorController.getStatistics);

export default router;
