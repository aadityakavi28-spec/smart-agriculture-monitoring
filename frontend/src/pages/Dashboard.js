/**
 * Main Dashboard Page
 * Orchestrates all components and data management
 */

import React, { useState, useEffect } from 'react';
import SensorGauge from '../components/SensorGauge';
import HistoricalChart from '../components/HistoricalChart';
import PredictionCard from '../components/PredictionCard';
import AlertPanel from '../components/AlertPanel';
import StatisticsPanel from '../components/StatisticsPanel';
import { sensorAPI, predictionAPI, alertAPI } from '../services/api';
import '../styles/global.css';
import './Dashboard.css';

const Dashboard = () => {
  // ============================================================
  // STATE MANAGEMENT
  // ============================================================

  const [latestReading, setLatestReading] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // ============================================================
  // DATA FETCHING FUNCTIONS
  // ============================================================

  const fetchAllData = async () => {
    try {
      setError(null);
      setLoading(true);

      // Fetch all data in parallel for better performance
      const [latestRes, historyRes, predictionRes, alertsRes, statsRes] = await Promise.all([
        sensorAPI.getLatestReading(),
        sensorAPI.getHistoricalData(24),
        predictionAPI.getForecast(),
        alertAPI.getActiveAlerts(),
        sensorAPI.getStatistics(),
      ]);

      // Update state only if requests were successful
      if (latestRes.data?.success) setLatestReading(latestRes.data.data);
      if (historyRes.data?.success) setHistoricalData(historyRes.data.data);
      if (predictionRes.data?.success) setPrediction(predictionRes.data.data);
      if (alertsRes.data?.success) setAlerts(alertsRes.data.data);
      if (statsRes.data?.success) setStatistics(statsRes.data.data);

      setLastUpdate(new Date());
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data. Is the backend running?');
      setLoading(false);
    }
  };

  // ============================================================
  // LIFECYCLE HOOKS
  // ============================================================

  // Initial data load
  useEffect(() => {
    fetchAllData();
  }, []);

  // Refresh data periodically (every 30 seconds)
  useEffect(() => {
    const interval = setInterval(fetchAllData, 30 * 1000);
    return () => clearInterval(interval);
  }, []);

  // ============================================================
  // EVENT HANDLERS
  // ============================================================

  const handleRefresh = async () => {
    await fetchAllData();
  };

  const handleResolveAlert = async (alertId) => {
    try {
      await alertAPI.resolveAlert(alertId);
      setAlerts(alerts.filter((a) => a._id !== alertId));
    } catch (err) {
      console.error('Error resolving alert:', err);
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <h1>🌾 Smart Agriculture Monitoring System</h1>
            <p className="header-subtitle">Real-time Soil & Environmental Monitoring</p>
          </div>
          <button className="btn btn-primary" onClick={handleRefresh} disabled={loading}>
            {loading ? '🔄 Refreshing...' : '🔄 Refresh Now'}
          </button>
        </div>
        <div className="header-status">
          Last updated: {lastUpdate.toLocaleTimeString()}
          {error && <span className="status-error">⚠️ {error}</span>}
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="container">
          {/* Top Row: Gauge and Prediction */}
          <div className="dashboard-grid grid-2">
            {/* Live Gauge */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">📊 Live Sensor Data</h2>
              </div>
              {latestReading ? (
                <SensorGauge
                  soilMoisture={latestReading.soilMoisture}
                  temperature={latestReading.temperature}
                  humidity={latestReading.humidity}
                />
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                  No sensor data available yet
                </div>
              )}
            </div>

            {/* Prediction Card */}
            <PredictionCard prediction={prediction} />
          </div>

          {/* Historical Chart */}
          <div className="dashboard-section card">
            <div className="card-header">
              <h2 className="card-title">📈 Historical Data (24 Hours)</h2>
            </div>
            <HistoricalChart data={historicalData} />
          </div>

          {/* Bottom Row: Alerts and Statistics */}
          <div className="dashboard-grid grid-2">
            <AlertPanel alerts={alerts} />
            <StatisticsPanel stats={statistics} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <div className="footer-content">
          <p>🌱 Smart Agriculture Monitoring Platform v1.0</p>
          <p>Designed for scalable, modular IoT-enabled farming systems</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
