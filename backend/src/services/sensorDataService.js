/**
 * Sensor Data Service
 * Handles all database operations for sensor readings
 */

import SensorData from '../models/SensorData.js';

class SensorDataService {
  /**
   * Save new sensor reading to database
   * @param {Object} data - { soilMoisture, temperature, humidity, fieldId, farmId }
   * @returns {Object} Saved sensor data
   */
  static async saveSensorReading(data) {
    try {
      const sensorData = new SensorData({
        farmId: data.farmId || 'farm_001',
        fieldId: data.fieldId || 'field_001',
        soilMoisture: data.soilMoisture,
        temperature: data.temperature,
        humidity: data.humidity,
        source: data.source || 'simulated',
        timestamp: data.timestamp || new Date(),
      });

      await sensorData.save();
      return sensorData;
    } catch (error) {
      console.error('Error saving sensor data:', error);
      throw error;
    }
  }

  /**
   * Get latest sensor reading for a field
   */
  static async getLatestReading(fieldId, farmId = 'farm_001') {
    try {
      const reading = await SensorData.findOne(
        { fieldId, farmId },
        {},
        { sort: { timestamp: -1 } }
      ).lean();
      return reading;
    } catch (error) {
      console.error('Error fetching latest reading:', error);
      throw error;
    }
  }

  /**
   * Get historical readings for time range
   * @param {String} fieldId - Field identifier
   * @param {Number} hoursBack - Number of hours to look back
   * @param {String} farmId - Farm identifier
   */
  static async getHistoricalData(fieldId, hoursBack = 24, farmId = 'farm_001') {
    try {
      const cutoffTime = new Date(Date.now() - hoursBack * 60 * 60 * 1000);
      
      const data = await SensorData.find(
        {
          fieldId,
          farmId,
          timestamp: { $gte: cutoffTime },
        },
        { soilMoisture: 1, temperature: 1, humidity: 1, timestamp: 1 },
        { sort: { timestamp: 1 } }
      ).lean();

      return data;
    } catch (error) {
      console.error('Error fetching historical data:', error);
      throw error;
    }
  }

  /**
   * Get aggregated statistics for a field
   */
  static async getFieldStatistics(fieldId, farmId = 'farm_001') {
    try {
      const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      const stats = await SensorData.aggregate([
        {
          $match: {
            fieldId,
            farmId,
            timestamp: { $gte: cutoffTime },
          },
        },
        {
          $group: {
            _id: '$fieldId',
            avgMoisture: { $avg: '$soilMoisture' },
            maxMoisture: { $max: '$soilMoisture' },
            minMoisture: { $min: '$soilMoisture' },
            avgTemperature: { $avg: '$temperature' },
            maxTemperature: { $max: '$temperature' },
            avgHumidity: { $avg: '$humidity' },
            readingCount: { $sum: 1 },
          },
        },
      ]);

      return stats[0] || null;
    } catch (error) {
      console.error('Error calculating statistics:', error);
      throw error;
    }
  }

  /**
   * Delete old sensor data (cleanup)
   * @param {Number} daysOld - Delete data older than this many days
   */
  static async deleteOldData(daysOld = 90) {
    try {
      const cutoffTime = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
      
      const result = await SensorData.deleteMany({
        timestamp: { $lt: cutoffTime },
      });

      console.log(`✓ Deleted ${result.deletedCount} old sensor readings`);
      return result;
    } catch (error) {
      console.error('Error deleting old data:', error);
      throw error;
    }
  }
}

export default SensorDataService;
