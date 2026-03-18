import mongoose from 'mongoose';

const sensorDataSchema = new mongoose.Schema(
  {
    soilMoisture: {
      type: Number,
      required: true,
    },
    temperature: {
      type: Number,
      required: true,
    },
    humidity: {
      type: Number,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

sensorDataSchema.index({ createdAt: -1 });
sensorDataSchema.index({ timestamp: -1 });

const SensorData = mongoose.model('SensorData', sensorDataSchema);

export default SensorData;