/**
 * Alert Service
 * Manages alert operations and notifications
 */

import Alert from '../models/Alert.js';

class AlertService {
  /**
   * Get all active (unresolved) alerts for a field
   */
  static async getActiveAlerts(fieldId, farmId = 'farm_001') {
    try {
      const alerts = await Alert.find(
        {
          fieldId,
          farmId,
          resolved: false,
        },
        {},
        { sort: { timestamp: -1 } }
      ).lean();
      return alerts;
    } catch (error) {
      console.error('Error fetching active alerts:', error);
      throw error;
    }
  }

  /**
   * Get all alerts (resolved and unresolved) for time range
   */
  static async getAlertHistory(fieldId, hoursBack = 24, farmId = 'farm_001') {
    try {
      const cutoffTime = new Date(Date.now() - hoursBack * 60 * 60 * 1000);
      
      const alerts = await Alert.find(
        {
          fieldId,
          farmId,
          timestamp: { $gte: cutoffTime },
        },
        {},
        { sort: { timestamp: -1 } }
      ).lean();

      return alerts;
    } catch (error) {
      console.error('Error fetching alert history:', error);
      throw error;
    }
  }

  /**
   * Mark alert as resolved
   */
  static async resolveAlert(alertId) {
    try {
      const alert = await Alert.findByIdAndUpdate(
        alertId,
        {
          resolved: true,
          resolvedAt: new Date(),
        },
        { new: true }
      );
      return alert;
    } catch (error) {
      console.error('Error resolving alert:', error);
      throw error;
    }
  }

  /**
   * Get alert statistics
   */
  static async getAlertStatistics(fieldId, farmId = 'farm_001') {
    try {
      const stats = await Alert.aggregate([
        {
          $match: {
            fieldId,
            farmId,
          },
        },
        {
          $group: {
            _id: '$severity',
            count: { $sum: 1 },
          },
        },
      ]);

      return stats;
    } catch (error) {
      console.error('Error fetching alert statistics:', error);
      throw error;
    }
  }
}

export default AlertService;
