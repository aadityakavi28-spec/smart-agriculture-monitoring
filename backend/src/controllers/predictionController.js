import PredictionService from '../services/predictionService.js';

class PredictionController {

  static async getIrrigationForecast(req, res) {
    try {
      const { fieldId = 'field_001', farmId = 'farm_001' } = req.query;

      const prediction = await PredictionService.getLatestPrediction(fieldId, farmId);

      if (!prediction) {
        return res.status(200).json({
          success: true,
          data: {
            message: "Not enough data yet",
            readableEstimate: "Collecting sensor data...",
            recommendation: "Waiting for more readings"
          }
        });
      }

      const response = {
        success: true,
        data: {
          ...prediction,
          readableEstimate: formatPredictionTime(prediction.estimatedIrrigationTime),
          moistureStatus: getMoistureStatus(prediction.currentMoisture),
          recommendation: getRecommendation(prediction),
        },
      };

      return res.status(200).json(response);

    } catch (error) {
      console.error('Error fetching prediction:', error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching prediction',
        error: error.message,
      });
    }
  }

  static async generateNewPrediction(req, res) {
    try {
      const { fieldId = 'field_001', farmId = 'farm_001', hoursToAnalyze = 24 } = req.body;

      const prediction = await PredictionService.generatePrediction(
        fieldId,
        farmId,
        parseInt(hoursToAnalyze)
      );

      return res.status(200).json({
        success: true,
        data: {
          ...prediction,
          readableEstimate: formatPredictionTime(prediction?.estimatedIrrigationTime),
          recommendation: getRecommendation(prediction),
        },
      });

    } catch (error) {
      console.error('Error generating prediction:', error);
      return res.status(500).json({
        success: false,
        message: 'Error generating prediction',
        error: error.message,
      });
    }
  }

  static async getTrendAnalysis(req, res) {
    try {
      const { fieldId = 'field_001', farmId = 'farm_001' } = req.query;

      const prediction = await PredictionService.getLatestPrediction(fieldId, farmId);

      if (!prediction) {
        return res.status(200).json({
          success: true,
          data: {
            message: "Not enough data yet"
          }
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          fieldId,
          farmId,
          currentMoisture: prediction.currentMoisture,
          trend: prediction.currentTrend,
          dropRate: prediction.moistureDropRate,
          confidence: prediction.confidence,
          trendDescription: describeTrend(
            prediction.currentTrend,
            prediction.moistureDropRate
          ),
        },
      });

    } catch (error) {
      console.error('Error fetching trend:', error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching trend analysis',
        error: error.message,
      });
    }
  }
}

/* ================= Helper Functions ================= */

function formatPredictionTime(estimatedTime) {
  if (!estimatedTime) return "Not enough data";

  const now = new Date();
  const target = new Date(estimatedTime);

  if (isNaN(target)) return "Invalid time";

  const diffHours = Math.round((target - now) / (1000 * 60 * 60));

  if (diffHours <= 0) return "Irrigation needed NOW";
  if (diffHours === 1) return "Irrigation needed in 1 hour";
  if (diffHours < 24) return `Irrigation needed in ${diffHours} hours`;

  const days = Math.round(diffHours / 24);
  return `Irrigation needed in ${days} day(s)`;
}

function getMoistureStatus(moisture) {
  if (moisture == null) return "No data";

  if (moisture < 20) return 'CRITICAL';
  if (moisture < 35) return 'LOW';
  if (moisture < 50) return 'MODERATE';
  if (moisture < 70) return 'GOOD';
  return 'EXCELLENT';
}

function getRecommendation(prediction) {
  if (!prediction) return "Collect more data";

  const { currentMoisture } = prediction;

  if (currentMoisture < 20)
    return "🚨 Irrigate immediately";

  if (currentMoisture < 35)
    return "⚠️ Plan irrigation soon";

  return "✅ Monitoring normally";
}

function describeTrend(trend, dropRate) {
  if (!trend) return "Not enough data";

  if (trend === "declining")
    return `Moisture decreasing at ${Math.abs(dropRate || 0).toFixed(2)}% per hour`;

  if (trend === "rising")
    return "Moisture increasing";

  return "Moisture stable";
}

export default PredictionController;
