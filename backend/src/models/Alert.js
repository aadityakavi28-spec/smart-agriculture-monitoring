// backend/src/models/Alert.js

const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['soilMoisture', 'temperature', 'humidity'],
  },
  severity: {
    type: String,
    required: true,
    enum: ['critical', 'high', 'medium', 'low'],
  },
  message: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
  },
  threshold: {
    type: Number,
  },
  fieldId: {
    type: String,
    default: 'field-1',
  },
  farmId: {
    type: String,
    default: 'farm-1',
  },
  status: {
    type: String,
    enum: ['active', 'resolved', 'expired'],
    default: 'active',
  },
  resolvedAt: {
    type: Date,
  },
  // THIS IS THE KEY FIELD - MongoDB auto-deletes after 5 minutes
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
    index: { expires: 0 }, // TTL index - MongoDB removes doc when expiresAt passes
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ============================================================
// INDEXES
// ============================================================

// TTL index handles auto-deletion (already defined above in schema)
// These indexes speed up common queries
alertSchema.index({ status: 1, createdAt: -1 });
alertSchema.index({ farmId: 1, fieldId: 1, status: 1 });
alertSchema.index({ type: 1, status: 1 });

// ============================================================
// STATIC METHODS
// ============================================================

/**
 * Get only non-expired active alerts
 * Extra safety filter in case TTL hasn't cleaned up yet
 */
alertSchema.statics.getActiveAlerts = function (farmId = 'farm-1', fieldId = 'field-1') {
  return this.find({
    farmId,
    fieldId,
    status: 'active',
    expiresAt: { $gt: new Date() }, // Only alerts that haven't expired
  })
    .sort({ createdAt: -1 })
    .limit(20);
};

/**
 * Manually expire all old alerts (cleanup utility)
 */
alertSchema.statics.expireOldAlerts = async function (minutesOld = 5) {
  const cutoff = new Date(Date.now() - minutesOld * 60 * 1000);

  const result = await this.updateMany(
    {
      status: 'active',
      createdAt: { $lt: cutoff },
    },
    {
      $set: { status: 'expired' },
    }
  );

  return result.modifiedCount;
};

/**
 * Create alert only if no duplicate exists in last 2 minutes
 * Prevents alert spam
 */
alertSchema.statics.createIfNotDuplicate = async function (alertData) {
  const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

  const existingAlert = await this.findOne({
    type: alertData.type,
    severity: alertData.severity,
    farmId: alertData.farmId || 'farm-1',
    fieldId: alertData.fieldId || 'field-1',
    status: 'active',
    createdAt: { $gt: twoMinutesAgo },
  });

  if (existingAlert) {
    return { created: false, alert: existingAlert, reason: 'duplicate' };
  }

  const newAlert = await this.create({
    ...alertData,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  return { created: true, alert: newAlert };
};

module.exports = mongoose.model('Alert', alertSchema);