/**
 * Alert Routes
 * API endpoints for alert management
 */

import express from 'express';
import AlertController from '../controllers/alertController.js';

const router = express.Router();

/**
 * GET /api/alerts/active
 * Get all active alerts
 * Query: fieldId?, farmId?
 */
router.get('/active', AlertController.getActiveAlerts);

/**
 * GET /api/alerts/history
 * Get alert history
 * Query: fieldId?, farmId?, hours?
 */
router.get('/history', AlertController.getAlertHistory);

/**
 * PUT /api/alerts/:alertId/resolve
 * Mark alert as resolved
 * Params: alertId
 */
router.put('/:alertId/resolve', AlertController.resolveAlert);

/**
 * GET /api/alerts/statistics
 * Get alert statistics
 * Query: fieldId?, farmId?
 */
router.get('/statistics', AlertController.getAlertStatistics);

export default router;
