// frontend/src/pages/Dashboard.js

/**
 * Main Dashboard Page
 * Orchestrates all components and data management
 */

import React, { useState, useEffect, useCallback } from 'react';
import SensorGauge from '../components/SensorGauge';
import HistoricalChart from '../components/HistoricalChart';
import PredictionCard from '../components/PredictionCard';
import AlertPanel from '../components/AlertPanel';
import StatisticsPanel from '../components/StatisticsPanel';
import ThresholdSettings from '../components/ThresholdSettings';
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
  // DATA FETCHING
  // ============================================================

  const fetchAllData = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      const [latestRes, historyRes, predictionRes, alertsRes, statsRes] =
        await Promise.all([
          sensorAPI.getLatestReading(),
          sensorAPI.getHistoricalData(24),
          predictionAPI.getForecast(),
          alertAPI.getActiveAlerts(),
          sensorAPI.getStatistics(),
        ]);

      if (latestRes.data?.success) setLatestReading(latestRes.data.data);
      if (historyRes.data?.success) setHistoricalData(historyRes.data.data);
      if (predictionRes.data?.success) setPrediction(predictionRes.data.data);
      if (alertsRes.data?.success) setAlerts(alertsRes.data.data);
      if (statsRes.data?.success) setStatistics(statsRes.data.data);

      setLastUpdate(new Date());
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Unable to connect. Is the backend running?');
      setLoading(false);
    }
  }, []);

  // ============================================================
  // LIFECYCLE
  // ============================================================

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  useEffect(() => {
    const interval = setInterval(fetchAllData, 30 * 1000);
    return () => clearInterval(interval);
  }, [fetchAllData]);

  // ============================================================
  // HANDLERS
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

  const handleThresholdSave = (thresholds) => {
    console.log('Thresholds updated:', thresholds);
    // Thresholds are saved to localStorage inside ThresholdSettings
    // You can also send them to backend here if needed:
    // await sensorAPI.updateThresholds(thresholds);
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="dashboard">
      {/* ── Header ─────────────────────────────── */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="header-logo">🌾</div>
            <div className="header-text">
              <h1>Smart Agriculture</h1>
              <p className="header-subtitle">
                Real-time Soil & Environmental Monitoring
              </p>
            </div>
          </div>

          <div className="header-right">
            <ThresholdSettings onSave={handleThresholdSave} />

            <div className="header-status">
              <span className="status-time">
                <span className={`status-dot ${error ? 'error' : ''}`} />
                {error ? 'Disconnected' : 'Live'} ·{' '}
                {lastUpdate.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              {error && <span className="status-error">{error}</span>}
            </div>

            <button
              className="refresh-btn"
              onClick={handleRefresh}
              disabled={loading}
            >
              <span className="refresh-icon">⟳</span>
              {loading ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content ───────────────────────── */}
      <main className="dashboard-main">
        <div className="container">
          {/* Row 1: Live Data + Prediction */}
          <div className="section-label">Live Monitoring</div>
          <div className="dashboard-grid grid-2 animate-fade-in stagger-1">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">
                  <span className="icon icon-green">📊</span>
                  Sensor Readings
                </h2>
                {latestReading && (
                  <span className="badge badge-success">● Live</span>
                )}
              </div>
              {latestReading ? (
                <SensorGauge
                  soilMoisture={latestReading.soilMoisture}
                  temperature={latestReading.temperature}
                  humidity={latestReading.humidity}
                />
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon">📡</div>
                  <div className="empty-state-title">
                    Waiting for sensor data
                  </div>
                  <div className="empty-state-description">
                    Start the simulator to begin receiving readings
                  </div>
                </div>
              )}
            </div>

            <PredictionCard prediction={prediction} />
          </div>

          {/* Row 2: Historical Chart */}
          <div className="section-label">Trend Analysis</div>
          <div className="dashboard-section card animate-fade-in stagger-2">
            <div className="card-header">
              <h2 className="card-title">
                <span className="icon icon-blue">📈</span>
                24-Hour History
              </h2>
              <span className="badge badge-info">
                {historicalData.length} readings
              </span>
            </div>
            <HistoricalChart data={historicalData} />
          </div>

          {/* Row 3: Alerts + Statistics */}
          <div className="section-label">Alerts & Statistics</div>
          <div className="dashboard-grid grid-2 animate-fade-in stagger-3">
            <AlertPanel
              alerts={alerts}
              onResolve={handleResolveAlert}
            />
            <StatisticsPanel stats={statistics} />
          </div>
        </div>
      </main>

      {/* ── Footer ─────────────────────────────── */}
      <footer className="dashboard-footer">
        <div className="footer-content">
          <span className="footer-brand">🌱 Smart Agriculture v1.0</span>
          <span className="footer-info">
            IoT-enabled precision farming platform
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;