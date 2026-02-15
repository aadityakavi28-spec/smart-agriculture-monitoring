/**
 * API Service
 * Centralized API communication layer
 */

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const FIELD_ID = process.env.REACT_APP_FIELD_ID || 'field_001';
const FARM_ID = process.env.REACT_APP_FARM_ID || 'farm_001';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================================
// SENSOR ENDPOINTS
// ============================================================

export const sensorAPI = {
  // Get latest sensor reading
  getLatestReading: () =>
    apiClient.get('/sensors/latest', {
      params: { fieldId: FIELD_ID, farmId: FARM_ID },
    }),

  // Get historical sensor data
  getHistoricalData: (hours = 24) =>
    apiClient.get('/sensors/history', {
      params: { fieldId: FIELD_ID, farmId: FARM_ID, hours },
    }),

  // Get field statistics
  getStatistics: () =>
    apiClient.get('/sensors/statistics', {
      params: { fieldId: FIELD_ID, farmId: FARM_ID },
    }),

  // Record new sensor reading
  recordReading: (data) =>
    apiClient.post('/sensors/data', {
      ...data,
      fieldId: FIELD_ID,
      farmId: FARM_ID,
    }),
};

// ============================================================
// PREDICTION ENDPOINTS
// ============================================================

export const predictionAPI = {
  // Get irrigation forecast
  getForecast: () =>
    apiClient.get('/predictions/forecast', {
      params: { fieldId: FIELD_ID, farmId: FARM_ID },
    }),

  // Generate new prediction
  generatePrediction: (hoursToAnalyze = 24) =>
    apiClient.post('/predictions/generate', {
      fieldId: FIELD_ID,
      farmId: FARM_ID,
      hoursToAnalyze,
    }),

  // Get trend analysis
  getTrendAnalysis: () =>
    apiClient.get('/predictions/trend', {
      params: { fieldId: FIELD_ID, farmId: FARM_ID },
    }),
};

// ============================================================
// ALERT ENDPOINTS
// ============================================================

export const alertAPI = {
  // Get active alerts
  getActiveAlerts: () =>
    apiClient.get('/alerts/active', {
      params: { fieldId: FIELD_ID, farmId: FARM_ID },
    }),

  // Get alert history
  getAlertHistory: (hours = 24) =>
    apiClient.get('/alerts/history', {
      params: { fieldId: FIELD_ID, farmId: FARM_ID, hours },
    }),

  // Resolve alert
  resolveAlert: (alertId) =>
    apiClient.put(`/alerts/${alertId}/resolve`),

  // Get alert statistics
  getAlertStatistics: () =>
    apiClient.get('/alerts/statistics', {
      params: { fieldId: FIELD_ID, farmId: FARM_ID },
    }),
};

// ============================================================
// HEALTH CHECK
// ============================================================

export const healthAPI = {
  checkHealth: () => apiClient.get('/health'),
};

export default apiClient;
