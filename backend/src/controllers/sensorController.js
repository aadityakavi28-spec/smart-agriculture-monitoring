// backend/src/controllers/sensorController.js
// ADD this function or update your existing recordSensorData

const Alert = require('../models/Alert');

/**
 * Generate alerts based on sensor thresholds
 * Called after every sensor reading is saved
 */
const checkAndGenerateAlerts = async (sensorData) => {
  const alertsToCreate = [];

  // ── Soil Moisture Checks ────────────────────
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

  // ── Temperature Checks ──────────────────────
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

  // ── Humidity Checks ─────────────────────────
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

  // ── Create Alerts (with duplicate prevention) ──
  const results = [];
  for (const alertData of alertsToCreate) {
    const result = await Alert.createIfNotDuplicate(alertData);
    results.push(result);
  }

  return results;
};

// USE this in your recordSensorData function:
// const recordSensorData = async (req, res) => {
//   ... save sensor data ...
//   await checkAndGenerateAlerts(savedData);
//   ... send response ...
// };

module.exports = { checkAndGenerateAlerts };