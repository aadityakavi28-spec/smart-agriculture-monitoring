/**
 * Alert Controller
 * Handles HTTP requests for alert operations
 */

import AlertService from '../services/alertService.js';

class AlertController {
  /**
   * GET /api/alerts/active
   * Get all active alerts for a field
   */
  static async getActiveAlerts(req, res) {
    try {
      const { fieldId = 'field_001', farmId = 'farm_001' } = req.query;

      const alerts = await AlertService.getActiveAlerts(fieldId, farmId);

      res.status(200).json({
        success: true,
        alertCount: alerts.length,
        data: alerts,
      });
    } catch (error) {
      console.error('Error fetching active alerts:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching alerts',
        error: error.message,
      });
    }
  }

  /**
   * GET /api/alerts/history
   * Get alert history for time range
   */
  static async getAlertHistory(req, res) {
    try {
      const { fieldId = 'field_001', farmId = 'farm_001', hours = 24 } = req.query;

      const alerts = await AlertService.getAlertHistory(
        fieldId,
        parseInt(hours),
        farmId
      );

      res.status(200).json({
        success: true,
        alertCount: alerts.length,
        data: alerts,
      });
    } catch (error) {
      console.error('Error fetching alert history:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching alert history',
        error: error.message,
      });
    }
  }

  /**
   * PUT /api/alerts/:alertId/resolve
   * Mark alert as resolved
   */
  static async resolveAlert(req, res) {
    try {
      const { alertId } = req.params;

      if (!alertId) {
        return res.status(400).json({
          success: false,
          message: 'Alert ID is required',
        });
      }

      const alert = await AlertService.resolveAlert(alertId);

      if (!alert) {
        return res.status(404).json({
          success: false,
          message: 'Alert not found',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Alert resolved successfully',
        data: alert,
      });
    } catch (error) {
      console.error('Error resolving alert:', error);
      res.status(500).json({
        success: false,
        message: 'Error resolving alert',
        error: error.message,
      });
    }
  }

  /**
   * GET /api/alerts/statistics
   * Get alert statistics
   */
  static async getAlertStatistics(req, res) {
    try {
      const { fieldId = 'field_001', farmId = 'farm_001' } = req.query;

      const stats = await AlertService.getAlertStatistics(fieldId, farmId);

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error('Error fetching alert statistics:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching statistics',
        error: error.message,
      });
    }
  }
}

export default AlertController;
