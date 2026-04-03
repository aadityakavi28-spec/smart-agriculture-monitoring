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
// AUTH ENDPOINTS
// ============================================================

export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
};

// ============================================================
// SENSOR ENDPOINTS
// ============================================================

export const sensorAPI = {
  getLatestReading: () =>
    apiClient.get('/sensors/latest', {
      params: { fieldId: FIELD_ID, farmId: FARM_ID },
    }),

  getHistoricalData: (hours = 24) =>
    apiClient.get('/sensors/history', {
      params: { fieldId: FIELD_ID, farmId: FARM_ID, hours },
    }),

  getStatistics: () =>
    apiClient.get('/sensors/statistics', {
      params: { fieldId: FIELD_ID, farmId: FARM_ID },
    }),

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
  getForecast: () =>
    apiClient.get('/predictions/forecast', {
      params: { fieldId: FIELD_ID, farmId: FARM_ID },
    }),

  generatePrediction: (hoursToAnalyze = 24) =>
    apiClient.post('/predictions/generate', {
      fieldId: FIELD_ID,
      farmId: FARM_ID,
      hoursToAnalyze,
    }),

  getTrendAnalysis: () =>
    apiClient.get('/predictions/trend', {
      params: { fieldId: FIELD_ID, farmId: FARM_ID },
    }),
};

// ============================================================
// ALERT ENDPOINTS
// ============================================================

export const alertAPI = {
  getActiveAlerts: () =>
    apiClient.get('/alerts/active', {
      params: { fieldId: FIELD_ID, farmId: FARM_ID },
    }),

  getAlertHistory: (hours = 24) =>
    apiClient.get('/alerts/history', {
      params: { fieldId: FIELD_ID, farmId: FARM_ID, hours },
    }),

  resolveAlert: (alertId) =>
    apiClient.put(`/alerts/${alertId}/resolve`),

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

// ============================================================
// ADMIN ENDPOINTS
// ============================================================

export const adminAPI = {
  getAllUsers: () => apiClient.get('/admin/users'),
  getUserStats: () => apiClient.get('/admin/stats'),
  toggleUserStatus: (userId) => apiClient.put(`/admin/users/${userId}/toggle-status`),
  changeUserRole: (userId, role) => apiClient.put(`/admin/users/${userId}/role`, { role }),
};

export default apiClient;