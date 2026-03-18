import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema(
  {
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
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 5 * 60 * 1000),
      index: { expires: 0 },
    },
  },
  { timestamps: true }
);

alertSchema.index({ status: 1, createdAt: -1 });
alertSchema.index({ farmId: 1, fieldId: 1, status: 1 });
alertSchema.index({ type: 1, status: 1 });

alertSchema.statics.getActiveAlerts = function (
  farmId = 'farm-1',
  fieldId = 'field-1'
) {
  return this.find({
    farmId,
    fieldId,
    status: 'active',
    expiresAt: { $gt: new Date() },
  })
    .sort({ createdAt: -1 })
    .limit(30);
};

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

const Alert = mongoose.model('Alert', alertSchema);

export default Alert;