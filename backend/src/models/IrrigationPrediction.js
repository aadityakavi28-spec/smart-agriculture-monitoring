/**
 * IrrigationPrediction Model
 * Stores calculated predictions for future irrigation needs
 */

import mongoose from 'mongoose';

const IrrigationPredictionSchema = new mongoose.Schema(
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
    
    // Current state
    currentMoisture: {
      type: Number,
      required: true,
    },
    
    // Prediction results
    estimatedIrrigationTime: {
      type: Date,
      required: true, // When irrigation is needed
    },
    moistureDropRate: {
      type: Number,
      required: true, // Percentage per hour
    },
    criticalThreshold: {
      type: Number,
      default: 30, // Soil moisture percentage
    },
    currentTrend: {
      type: String,
      enum: ['stable', 'declining', 'rising'],
      default: 'stable',
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100, // Confidence percentage
    },
    
    // Historical data range used for prediction
    analysisDataPoints: Number, // Number of readings analyzed
    analysisPeriod: String, // e.g., "last_24_hours"
    
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'irrigation_predictions',
  }
);

// Index for latest prediction per field
IrrigationPredictionSchema.index({ fieldId: 1, timestamp: -1 });

const IrrigationPrediction = mongoose.model('IrrigationPrediction', IrrigationPredictionSchema);

export default IrrigationPrediction;
