import SensorData from '../models/SensorData.js';
import Alert from '../models/Alert.js';

// ============================================================
// HELPER: GENERATE ALERTS
// ============================================================

const checkAndGenerateAlerts = async (sensorData) => {
  try {
    const alertsToCreate = [];

    if (sensorData.soilMoisture <= 20) {
      alertsToCreate.push({
        type: 'soilMoisture',
        severity: 'critical',
        message: `Soil moisture critically low at ${sensorData.soilMoisture.toFixed(1)}%. Immediate irrigation required!`,
        value: sensorData.soilMoisture,
        threshold: 20,
      });
    } else if (sensorData.soilMoisture <= 30) {
      alertsToCreate.push({
        type: 'soilMoisture',
        severity: 'high',
        message: `Soil moisture low at ${sensorData.soilMoisture.toFixed(1)}%. Consider irrigating soon.`,
        value: sensorData.soilMoisture,
        threshold: 30,
      });
    } else if (sensorData.soilMoisture > 85) {
      alertsToCreate.push({
        type: 'soilMoisture',
        severity: 'medium',
        message: `Soil moisture very high at ${sensorData.soilMoisture.toFixed(1)}%. Possible overwatering.`,
        value: sensorData.soilMoisture,
        threshold: 85,
      });
    }

    if (sensorData.temperature > 40) {
      alertsToCreate.push({
        type: 'temperature',
        severity: 'critical',
        message: `Extreme heat detected: ${sensorData.temperature.toFixed(1)}°C. Crops at risk!`,
        value: sensorData.temperature,
        threshold: 40,
      });
    } else if (sensorData.temperature > 35) {
      alertsToCreate.push({
        type: 'temperature',
        severity: 'high',
        message: `High temperature: ${sensorData.temperature.toFixed(1)}°C. Monitor crop stress.`,
        value: sensorData.temperature,
        threshold: 35,
      });
    } else if (sensorData.temperature < 5) {
      alertsToCreate.push({
        type: 'temperature',
        severity: 'critical',
        message: `Frost risk! Temperature at ${sensorData.temperature.toFixed(1)}°C.`,
        value: sensorData.temperature,
        threshold: 5,
      });
    }

    if (sensorData.humidity > 90) {
      alertsToCreate.push({
        type: 'humidity',
        severity: 'medium',
        message: `Very high humidity: ${sensorData.humidity.toFixed(1)}%. Disease risk elevated.`,
        value: sensorData.humidity,
        threshold: 90,
      });
    } else if (sensorData.humidity < 20) {
      alertsToCreate.push({
        type: 'humidity',
        severity: 'high',
        message: `Very low humidity: ${sensorData.humidity.toFixed(1)}%. Crop dehydration risk.`,
        value: sensorData.humidity,
        threshold: 20,
      });
    }

    for (const alertData of alertsToCreate) {
      await Alert.createIfNotDuplicate(alertData);
    }
  } catch (error) {
    console.error('Error generating alerts:', error.message);
  }
};

// ============================================================
// RECORD SENSOR DATA
// ============================================================

const recordSensorData = async (req, res) => {
  try {
    const { soilMoisture, temperature, humidity } = req.body;

    if (
      soilMoisture === undefined ||
      temperature === undefined ||
      humidity === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: 'soilMoisture, temperature, and humidity are required',
      });
    }

    const newReading = await SensorData.create({
      soilMoisture,
      temperature,
      humidity,
      timestamp: new Date(),
    });

    await checkAndGenerateAlerts(newReading);

    return res.status(201).json({
      success: true,
      message: 'Sensor data recorded successfully',
      data: newReading,
    });
  } catch (error) {
    console.error('Error recording sensor data:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to record sensor data',
      error: error.message,
    });
  }
};

// ============================================================
// GET LATEST READING
// ============================================================

const getLatestReading = async (req, res) => {
  try {
    const latest = await SensorData.findOne().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: latest,
    });
  } catch (error) {
    console.error('Error fetching latest reading:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch latest sensor reading',
      error: error.message,
    });
  }
};

// ============================================================
// GET HISTORICAL DATA
// ============================================================

const getHistoricalData = async (req, res) => {
  try {
    const hours = parseInt(req.query.hours) || 24;
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);

    const history = await SensorData.find({
      createdAt: { $gte: since },
    }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error('Error fetching historical data:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch historical data',
      error: error.message,
    });
  }
};

// ============================================================
// GET STATISTICS
// ============================================================

const getStatistics = async (req, res) => {
  try {
    const hours = parseInt(req.query.hours) || 24;
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);

    const stats = await SensorData.aggregate([
      {
        $match: {
          createdAt: { $gte: since },
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },

          soilMoistureAvg: { $avg: '$soilMoisture' },
          soilMoistureMin: { $min: '$soilMoisture' },
          soilMoistureMax: { $max: '$soilMoisture' },

          temperatureAvg: { $avg: '$temperature' },
          temperatureMin: { $min: '$temperature' },
          temperatureMax: { $max: '$temperature' },

          humidityAvg: { $avg: '$humidity' },
          humidityMin: { $min: '$humidity' },
          humidityMax: { $max: '$humidity' },
        },
      },
    ]);

    const result = stats[0]
      ? {
          count: stats[0].count,
          soilMoisture: {
            avg: stats[0].soilMoistureAvg ?? 0,
            min: stats[0].soilMoistureMin ?? 0,
            max: stats[0].soilMoistureMax ?? 0,
          },
          temperature: {
            avg: stats[0].temperatureAvg ?? 0,
            min: stats[0].temperatureMin ?? 0,
            max: stats[0].temperatureMax ?? 0,
          },
          humidity: {
            avg: stats[0].humidityAvg ?? 0,
            min: stats[0].humidityMin ?? 0,
            max: stats[0].humidityMax ?? 0,
          },
        }
      : {
          count: 0,
          soilMoisture: { avg: 0, min: 0, max: 0 },
          temperature: { avg: 0, min: 0, max: 0 },
          humidity: { avg: 0, min: 0, max: 0 },
        };

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message,
    });
  }
};

export default {
  recordSensorData,
  getLatestReading,
  getHistoricalData,
  getStatistics,
};