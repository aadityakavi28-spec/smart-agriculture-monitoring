import express from 'express';
import alertController from '../controllers/alertController.js';

const router = express.Router();

router.get('/active', alertController.getActiveAlerts);
router.get('/history', alertController.getAlertHistory);
router.put('/:id/resolve', alertController.resolveAlert);

export default router;