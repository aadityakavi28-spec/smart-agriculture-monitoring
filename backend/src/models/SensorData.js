/**
 * SensorData Model
 * Schema for storing real-time sensor readings
 * 
 * Architecture:
 * - Each document represents a sensor reading at a specific timestamp
 * - Indexed for fast queries on timestamp and fieldId
 * - TTL index can be added for automatic old data cleanup
 */

import mongoose from 'mongoose';

const SensorDataSchema = new mongoose.Schema(
  {
    // Farm and Field identification
    farmId: {
      type: String,
      required: true,
      default: 'farm_001',
      index: true, // For filtering by farm
    },
    fieldId: {
      type: String,
      required: true,
      default: 'field_001',
      index: true, // For filtering by specific field
    },

    // Environmental sensor readings
    soilMoisture: {
      type: Number,
      required: true,
      min: 0,
      max: 100, // Percentage
      description: 'Soil moisture level as percentage',
    },
    temperature: {
      type: Number,
      required: true,
      min: -50,
      max: 60, // Celsius
      description: 'Ambient temperature',
    },
    humidity: {
      type: Number,
      required: true,
      min: 0,
      max: 100, // Percentage
      description: 'Relative humidity',
    },

    // Metadata
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
      index: true, // Critical for time-range queries
    },
    source: {
      type: String,
      enum: ['simulated', 'hardware', 'api'],
      default: 'simulated',
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    collection: 'sensor_data',
  }
);

/**
 * INDEXES for Performance:
 * 1. Compound index on (fieldId, timestamp) - For fetching latest data for a field
 * 2. Single index on timestamp - For time-range queries
 * 3. Single index on fieldId - For field-based filtering
 * 4. TTL Index can be added: sensor_data expires after 90 days
 */

// Compound index: Query latest data for specific field efficiently
SensorDataSchema.index({ fieldId: 1, timestamp: -1 });

// TTL Index: Automatically delete records older than 90 days
// Uncomment to enable: SensorDataSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 });

const SensorData = mongoose.model('SensorData', SensorDataSchema);

export default SensorData;
