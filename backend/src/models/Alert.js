/**
 * Alert Model
 * Tracks irrigation alerts and thresholds
 */

import mongoose from 'mongoose';

const AlertSchema = new mongoose.Schema(
  {
    farmId: {
      type: String,
      required: true,
      index: true,
    },
    fieldId: {
      type: String,
      required: true,
      index: true,
    },
    alertType: {
      type: String,
      enum: ['low_moisture', 'critical_moisture', 'high_temp', 'prediction'],
      required: true,
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    soilMoisture: Number,
    temperature: Number,
    humidity: Number,
    message: String,
    resolved: {
      type: Boolean,
      default: false,
      index: true,
    },
    resolvedAt: Date,
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'alerts',
  }
);

// Index for active alerts
AlertSchema.index({ fieldId: 1, resolved: 1, timestamp: -1 });

const Alert = mongoose.model('Alert', AlertSchema);

export default Alert;
