/**
 * Sensor Data Simulator
 * Generates realistic sensor data every 10 seconds and sends to backend
 * 
 * FEATURES:
 * - Simulates sensors with realistic patterns
 * - Soil moisture follows consumption patterns
 * - Temperature varies realistically
 * - Can be customized for different field conditions
 * - Error handling and retry logic
 */

const BACKEND_API = 'http://localhost:5000/api';
const FIELD_ID = 'field_001';
const FARM_ID = 'farm_001';
const SENSOR_INTERVAL = 10 * 1000; // 10 seconds in milliseconds

// ============================================================
// SENSOR STATE - Tracks realistic environmental changes
// ============================================================

let sensorState = {
  baseMoisture: 65, // Starting moisture level
  baseTemperature: 25, // Starting temperature
  moistureConsumptionRate: 1.2, // % per 10 seconds
  temperatureVariation: 0.5, // Celsius variance
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Generate realistic sensor reading
 * Simulates natural variations and consumption patterns
 */
function generateSensorReading() {
  // Simulate soil moisture consumption (plant uptake + evaporation)
  const consumedMoisture = (Math.random() * 0.5 + 0.7) * sensorState.moistureConsumptionRate;
  sensorState.baseMoisture = Math.max(
    15,
    Math.min(95, sensorState.baseMoisture - consumedMoisture)
  );

  // Add slight randomness to moisture
  const moistureNoise = (Math.random() - 0.5) * 2; // ±1%
  let soilMoisture = Math.max(
    15,
    Math.min(95, sensorState.baseMoisture + moistureNoise)
  );

  // Simulate daily temperature variation (sinusoidal pattern)
  const hourOfDay = (new Date().getHours() + new Date().getMinutes() / 60) / 24;
  const tempPhase = Math.sin(hourOfDay * Math.PI * 2) * 8; // ±8°C daily variation
  const tempNoise = (Math.random() - 0.5) * sensorState.temperatureVariation * 2;
  const temperature = Math.round((sensorState.baseTemperature + tempPhase + tempNoise) * 10) / 10;

  // Humidity roughly inverse to temperature + randomness
  const humidity = Math.max(
    20,
    Math.min(
      95,
      70 - temperature + (Math.random() - 0.5) * 20
    )
  );

  return {
    soilMoisture: Math.round(soilMoisture * 10) / 10,
    temperature: temperature,
    humidity: Math.round(humidity * 10) / 10,
    timestamp: new Date(),
  };
}

/**
 * Send sensor data to backend API
 */
async function sendSensorData(data) {
  try {
    const response = await fetch(`${BACKEND_API}/sensors/data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        fieldId: FIELD_ID,
        farmId: FARM_ID,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log(
      `✅ [${new Date().toLocaleTimeString()}] Sensor data sent:`,
      `Moisture: ${data.soilMoisture}%`,
      `Temp: ${data.temperature}°C`,
      `Humidity: ${data.humidity}%`
    );

    return result;
  } catch (error) {
    console.error(
      `❌ [${new Date().toLocaleTimeString()}] Error sending sensor data:`,
      error.message
    );
    throw error;
  }
}

/**
 * Get latest reading from backend
 */
async function getLatestReading() {
  try {
    const response = await fetch(
      `${BACKEND_API}/sensors/latest?fieldId=${FIELD_ID}&farmId=${FARM_ID}`
    );
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching latest reading:', error);
    return null;
  }
}

/**
 * Simulate irrigation event (increases moisture)
 */
function simulateIrrigation() {
  console.log('💧 Irrigation event triggered!');
  sensorState.baseMoisture = Math.min(95, sensorState.baseMoisture + 25);
}

// ============================================================
// MAIN SIMULATION LOOP
// ============================================================

let readingCount = 0;

async function runSimulation() {
  console.log('🌱 Smart Agriculture Sensor Simulator');
  console.log(`📡 Backend URL: ${BACKEND_API}`);
  console.log(`🏗️  Field: ${FARM_ID}/${FIELD_ID}`);
  console.log(`⏱️  Interval: Every ${SENSOR_INTERVAL / 1000} seconds`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // Start sensor reading loop
  const intervalId = setInterval(async () => {
    readingCount++;

    // Generate realistic data
    const sensorData = generateSensorReading();

    // Send to backend
    try {
      await sendSensorData(sensorData);

      // Simulate irrigation every 100 readings (if moisture drops too low)
      if (sensorData.soilMoisture < 25 && readingCount % 10 === 0) {
        console.log('🔔 LOW MOISTURE DETECTED - Simulating irrigation...');
        simulateIrrigation();
      }

      // Every 50th reading, fetch prediction
      if (readingCount % 30 === 0) {
        try {
          const prediction = await fetch(
            `${BACKEND_API}/predictions/forecast?fieldId=${FIELD_ID}&farmId=${FARM_ID}`
          ).then(r => r.json());

          if (prediction.success) {
            console.log(
              `📊 Prediction Update: ${prediction.data.readableEstimate}`,
              `| Trend: ${prediction.data.currentTrend}`,
              `| Confidence: ${prediction.data.confidence}%`
            );
          }
        } catch (err) {
          // Silent fail for prediction fetch
        }
      }
    } catch (error) {
      console.error('Failed to send reading:', error.message);
    }
  }, SENSOR_INTERVAL);

  // Graceful shutdown on CTRL+C
  process.on('SIGINT', () => {
    console.log('\n\n🛑 Shutting down simulator...');
    clearInterval(intervalId);
    console.log(`📊 Total readings sent: ${readingCount}`);
    console.log('✅ Simulator stopped');
    process.exit(0);
  });
}

// ============================================================
// START SIMULATION
// ============================================================

runSimulation().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
