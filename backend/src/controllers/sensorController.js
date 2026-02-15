/**
 * Sensor Controller
 * Handles HTTP requests for sensor data operations
 */

import SensorDataService from '../services/sensorDataService.js';
import PredictionService from '../services/predictionService.js';

class SensorController {
  /**
   * POST /api/sensors/data
   * Receive and store new sensor reading
   */
  static async recordSensorData(req, res) {
    try {
      const { soilMoisture, temperature, humidity, fieldId, farmId } = req.body;

      // Validation
      if (soilMoisture === undefined || temperature === undefined || humidity === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: soilMoisture, temperature, humidity',
        });
      }

      // Save sensor reading
      const sensorData = await SensorDataService.saveSensorReading({
        soilMoisture,
        temperature,
        humidity,
        fieldId: fieldId || 'field_001',
        farmId: farmId || 'farm_001',
        source: 'simulated', // or 'hardware' if from real sensors
      });

      // Generate alert if needed (async, no need to await)
      PredictionService.generateAlertIfNeeded(
        fieldId || 'field_001',
        farmId || 'farm_001'
      ).catch(err => console.error('Error generating alert:', err));

      res.status(201).json({
        success: true,
        message: 'Sensor data recorded successfully',
        data: sensorData,
      });
    } catch (error) {
      console.error('Error recording sensor data:', error);
      res.status(500).json({
        success: false,
        message: 'Error recording sensor data',
        error: error.message,
      });
    }
  }

  /**
   * GET /api/sensors/latest
   * Get latest sensor reading for a field
   */
  static async getLatestReading(req, res) {
    try {
      const { fieldId = 'field_001', farmId = 'farm_001' } = req.query;

      const reading = await SensorDataService.getLatestReading(fieldId, farmId);

      if (!reading) {
        return res.status(404).json({
          success: false,
          message: 'No sensor data found for this field',
        });
      }

      res.status(200).json({
        success: true,
        data: reading,
      });
    } catch (error) {
      console.error('Error fetching latest reading:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching sensor data',
        error: error.message,
      });
    }
  }

  /**
   * GET /api/sensors/history
   * Get historical sensor data for time range
   */
  static async getHistoricalData(req, res) {
    try {
      const { fieldId = 'field_001', farmId = 'farm_001', hours = 24 } = req.query;

      const data = await SensorDataService.getHistoricalData(
        fieldId,
        parseInt(hours),
        farmId
      );

      res.status(200).json({
        success: true,
        dataPoints: data.length,
        data,
      });
    } catch (error) {
      console.error('Error fetching historical data:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching historical data',
        error: error.message,
      });
    }
  }

  /**
   * GET /api/sensors/statistics
   * Get statistical summary for a field
   */
  static async getStatistics(req, res) {
    try {
      const { fieldId = 'field_001', farmId = 'farm_001' } = req.query;

      const stats = await SensorDataService.getFieldStatistics(fieldId, farmId);

      if (!stats) {
        return res.status(404).json({
          success: false,
          message: 'No statistical data available',
        });
      }

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching statistics',
        error: error.message,
      });
    }
  }
}

export default SensorController;
