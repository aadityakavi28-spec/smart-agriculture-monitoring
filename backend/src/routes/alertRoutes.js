// backend/src/routes/alertRoutes.js

const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');

router.get('/active', alertController.getActiveAlerts);
router.get('/history', alertController.getAlertHistory);
router.put('/:id/resolve', alertController.resolveAlert);
router.post('/cleanup', alertController.cleanupExpired);

module.exports = router;