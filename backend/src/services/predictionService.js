/**
 * Prediction Service
 * Core logic for predicting irrigation needs based on historical trends
 * 
 * ALGORITHM EXPLANATION:
 * =====================
 * 1. Fetch recent sensor readings (last 24 hours or configurable)
 * 2. Calculate moisture drop rate: (moisture_change / time_elapsed)
 * 3. Identify current trend (stable, declining, rising)
 * 4. Project future moisture levels
 * 5. Estimate when moisture reaches critical threshold
 * 
 * This is NOT using ML libraries - it's pure trend analysis
 * Easy to understand, debug, and extend
 */

import SensorData from '../models/SensorData.js';
import IrrigationPrediction from '../models/IrrigationPrediction.js';
import Alert from '../models/Alert.js';

class PredictionService {
  /**
   * Analyze historical data and generate irrigation prediction
   * @param {String} fieldId - Field identifier
   * @param {String} farmId - Farm identifier
   * @param {Number} hoursToAnalyze - Historical period to analyze (default: 24 hours)
   * @returns {Object} Prediction object with estimated irrigation time
   */
  static async generatePrediction(fieldId, farmId = 'farm_001', hoursToAnalyze = 24) {
    try {
      // 1. Fetch recent sensor data
      const cutoffTime = new Date(Date.now() - hoursToAnalyze * 60 * 60 * 1000);
      const historicalData = await SensorData.find(
        {
          fieldId,
          farmId,
          timestamp: { $gte: cutoffTime },
        },
        { soilMoisture: 1, temperature: 1, timestamp: 1 },
        { sort: { timestamp: 1 } }
      ).lean();

      if (historicalData.length < 2) {
        console.warn(`⚠ Insufficient data for field ${fieldId} (need at least 2 readings)`);
        return this._createDefaultPrediction(fieldId, farmId);
      }

      // 2. Get current moisture level (latest reading)
      const currentMoisture = historicalData[historicalData.length - 1].soilMoisture;
      const oldestMoisture = historicalData[0].soilMoisture;

      // 3. Calculate moisture drop rate
      const timeDifferenceHours =
        (historicalData[historicalData.length - 1].timestamp - historicalData[0].timestamp) / (1000 * 60 * 60);
      const moistureDifference = oldestMoisture - currentMoisture;
      const moistureDropRate = moistureDifference / Math.max(timeDifferenceHours, 1);

      // 4. Determine trend
      const trend = this._determineTrend(historicalData);

      // 5. Apply trend factor to drop rate
      // If declining trend, increase drop rate; if rising, decrease it
      let adjustedDropRate = moistureDropRate;
      if (trend === 'declining') {
        adjustedDropRate *= 1.2; // 20% more aggressive prediction
      } else if (trend === 'rising') {
        adjustedDropRate *= 0.8; // 20% less aggressive
      }

      // 6. Calculate time until critical threshold
      const criticalThreshold = 30; // Soil moisture percentage
      const hoursUntilCritical = (currentMoisture - criticalThreshold) / Math.max(adjustedDropRate, 0.1);

      // 7. Calculate estimated irrigation time
      const estimatedIrrigationTime = new Date(Date.now() + Math.max(hoursUntilCritical * 60 * 60 * 1000, 0));

      // 8. Calculate confidence score
      const confidence = this._calculateConfidence(historicalData, trend);

      // 9. Create prediction object
      const prediction = {
        farmId,
        fieldId,
        currentMoisture,
        estimatedIrrigationTime,
        moistureDropRate: parseFloat(adjustedDropRate.toFixed(2)),
        criticalThreshold,
        currentTrend: trend,
        confidence: Math.min(confidence, 100),
        analysisDataPoints: historicalData.length,
        analysisPeriod: `last_${hoursToAnalyze}_hours`,
        timestamp: new Date(),
      };

      // 10. Save prediction to database
      await IrrigationPrediction.findOneAndUpdate({ fieldId, farmId }, prediction, {
        upsert: true,
        new: true,
      });

      return prediction;
    } catch (error) {
      console.error('Error generating prediction:', error);
      throw error;
    }
  }

  /**
   * Determine if moisture trend is stable, declining, or rising
   * Uses simple moving average comparison
   */
  static _determineTrend(historicalData) {
    if (historicalData.length < 3) return 'stable';

    // Split data into first half and second half
    const midpoint = Math.floor(historicalData.length / 2);
    const firstHalf = historicalData.slice(0, midpoint);
    const secondHalf = historicalData.slice(midpoint);

    // Calculate average moisture in each half
    const avgFirstHalf = firstHalf.reduce((sum, d) => sum + d.soilMoisture, 0) / firstHalf.length;
    const avgSecondHalf = secondHalf.reduce((sum, d) => sum + d.soilMoisture, 0) / secondHalf.length;

    const difference = avgFirstHalf - avgSecondHalf;

    if (Math.abs(difference) < 5) return 'stable';
    if (difference > 5) return 'declining'; // Moisture is decreasing
    return 'rising'; // Moisture is increasing
  }

  /**
   * Calculate confidence based on data consistency
   * Higher consistency = higher confidence
   */
  static _calculateConfidence(historicalData, trend) {
    // Base confidence: more data points = higher confidence
    let confidence = Math.min(historicalData.length * 5, 60);

    // Bonus for declining trend (more predictable)
    if (trend === 'declining') confidence += 20;
    else if (trend === 'rising') confidence += 10;

    // Calculate variance (consistency)
    const avg = historicalData.reduce((sum, d) => sum + d.soilMoisture, 0) / historicalData.length;
    const variance = historicalData.reduce((sum, d) => sum + Math.pow(d.soilMoisture - avg, 2), 0) / historicalData.length;
    const stdDev = Math.sqrt(variance);

    // Lower variance = higher confidence
    if (stdDev < 5) confidence += 25;
    else if (stdDev < 15) confidence += 10;

    return Math.min(confidence, 100);
  }

  /**
   * Create default prediction when insufficient data
   */
  static _createDefaultPrediction(fieldId, farmId) {
    return {
      farmId,
      fieldId,
      currentMoisture: 50,
      estimatedIrrigationTime: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours from now
      moistureDropRate: 2.0,
      criticalThreshold: 30,
      currentTrend: 'stable',
      confidence: 30,
      analysisDataPoints: 0,
      analysisPeriod: 'insufficient_data',
      timestamp: new Date(),
    };
  }

  /**
   * Get latest prediction with minimum data check
   */
  static async getLatestPrediction(fieldId, farmId = 'farm_001') {
    try {
      let prediction = await IrrigationPrediction.findOne(
        { fieldId, farmId },
        {},
        { sort: { timestamp: -1 } }
      ).lean();

      // If no prediction or prediction is old (> 1 hour), generate new one
      if (!prediction || Date.now() - prediction.timestamp > 60 * 60 * 1000) {
        prediction = await this.generatePrediction(fieldId, farmId);
      }

      return prediction;
    } catch (error) {
      console.error('Error fetching prediction:', error);
      throw error;
    }
  }

  /**
   * Generate alert based on prediction
   */
  static async generateAlertIfNeeded(fieldId, farmId = 'farm_001') {
    try {
      const latestSensor = await SensorData.findOne(
        { fieldId, farmId },
        {},
        { sort: { timestamp: -1 } }
      ).lean();

      if (!latestSensor) return null;

      const { soilMoisture, temperature } = latestSensor;
      let alertType = null;
      let severity = null;
      let message = null;

      // Check moisture levels
      if (soilMoisture < 20) {
        alertType = 'critical_moisture';
        severity = 'critical';
        message = `🚨 CRITICAL: Soil moisture is ${soilMoisture}%. Immediate irrigation needed!`;
      } else if (soilMoisture < 35) {
        alertType = 'low_moisture';
        severity = 'high';
        message = `⚠️  LOW: Soil moisture is ${soilMoisture}%. Irrigation recommended soon.`;
      }

      // Check temperature
      if (temperature > 40) {
        alertType = 'high_temp';
        severity = 'medium';
        message = `⚠️  Temperature is ${temperature}°C. High temperature detected.`;
      }

      // If alert needed, save it
      if (alertType) {
        const alert = new Alert({
          farmId,
          fieldId,
          alertType,
          severity,
          soilMoisture,
          temperature,
          message,
          resolved: false,
          timestamp: new Date(),
        });

        await alert.save();
        return alert;
      }

      return null;
    } catch (error) {
      console.error('Error generating alert:', error);
      throw error;
    }
  }
}

export default PredictionService;
