// backend/src/controllers/alertController.js

const Alert = require('../models/Alert');

const alertController = {
  // ============================================================
  // GET ACTIVE ALERTS (only non-expired)
  // ============================================================
  getActiveAlerts: async (req, res) => {
    try {
      const { farmId = 'farm-1', fieldId = 'field-1' } = req.query;

      const alerts = await Alert.getActiveAlerts(farmId, fieldId);

      res.json({
        success: true,
        data: alerts,
        count: alerts.length,
        message: `${alerts.length} active alert(s)`,
      });
    } catch (error) {
      console.error('Error fetching active alerts:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch alerts',
      });
    }
  },

  // ============================================================
  // GET ALERT HISTORY (includes expired)
  // ============================================================
  getAlertHistory: async (req, res) => {
    try {
      const { farmId = 'farm-1', limit = 50 } = req.query;

      // For history, query before TTL deletes them
      // Or use a separate history collection (see enhancement below)
      const alerts = await Alert.find({ farmId })
        .sort({ createdAt: -1 })
        .limit(parseInt(limit));

      res.json({
        success: true,
        data: alerts,
        count: alerts.length,
      });
    } catch (error) {
      console.error('Error fetching alert history:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch alert history',
      });
    }
  },

  // ============================================================
  // RESOLVE ALERT MANUALLY
  // ============================================================
  resolveAlert: async (req, res) => {
    try {
      const { id } = req.params;

      const alert = await Alert.findByIdAndUpdate(
        id,
        {
          status: 'resolved',
          resolvedAt: new Date(),
        },
        { new: true }
      );

      if (!alert) {
        return res.status(404).json({
          success: false,
          error: 'Alert not found (may have already expired)',
        });
      }

      res.json({
        success: true,
        data: alert,
        message: 'Alert resolved',
      });
    } catch (error) {
      console.error('Error resolving alert:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to resolve alert',
      });
    }
  },

  // ============================================================
  // MANUAL CLEANUP (admin endpoint)
  // ============================================================
  cleanupExpired: async (req, res) => {
    try {
      const count = await Alert.expireOldAlerts(5);

      res.json({
        success: true,
        message: `Expired ${count} old alerts`,
        expiredCount: count,
      });
    } catch (error) {
      console.error('Error cleaning up alerts:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to cleanup alerts',
      });
    }
  },
};

module.exports = alertController;