import Alert from '../models/Alert.js';

const getActiveAlerts = async (req, res) => {
  try {
    const { farmId = 'farm-1', fieldId = 'field-1' } = req.query;

    const alerts = await Alert.getActiveAlerts(farmId, fieldId);

    return res.status(200).json({
      success: true,
      data: alerts,
      count: alerts.length,
    });
  } catch (error) {
    console.error('Error fetching active alerts:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch active alerts',
      error: error.message,
    });
  }
};

const getAlertHistory = async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    const alerts = await Alert.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    return res.status(200).json({
      success: true,
      data: alerts,
      count: alerts.length,
    });
  } catch (error) {
    console.error('Error fetching alert history:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch alert history',
      error: error.message,
    });
  }
};

const resolveAlert = async (req, res) => {
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
        message: 'Alert not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Alert resolved successfully',
      data: alert,
    });
  } catch (error) {
    console.error('Error resolving alert:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to resolve alert',
      error: error.message,
    });
  }
};

export default {
  getActiveAlerts,
  getAlertHistory,
  resolveAlert,
};