import express from 'express';
import sensorController from '../controllers/sensorController.js';

const router = express.Router();

router.post('/data', sensorController.recordSensorData);
router.get('/latest', sensorController.getLatestReading);
router.get('/history', sensorController.getHistoricalData);
router.get('/statistics', sensorController.getStatistics);

export default router;