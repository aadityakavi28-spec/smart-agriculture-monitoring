/**
 * Prediction Routes
 * API endpoints for irrigation predictions
 */

import express from 'express';
import PredictionController from '../controllers/predictionController.js';

const router = express.Router();

/**
 * GET /api/predictions/forecast
 * Get latest irrigation forecast
 * Query: fieldId?, farmId?
 */
router.get('/forecast', PredictionController.getIrrigationForecast);

/**
 * POST /api/predictions/generate
 * Generate new prediction
 * Body: { fieldId?, farmId?, hoursToAnalyze? }
 */
router.post('/generate', PredictionController.generateNewPrediction);

/**
 * GET /api/predictions/trend
 * Get trend analysis
 * Query: fieldId?, farmId?
 */
router.get('/trend', PredictionController.getTrendAnalysis);

export default router;
