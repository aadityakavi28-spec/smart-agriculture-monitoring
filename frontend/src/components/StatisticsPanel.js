/**
 * Statistics Panel Component
 * Displays field statistics and metrics
 */

import React from 'react';
import './StatisticsPanel.css';

const StatisticsPanel = ({ stats = null }) => {
  if (!stats) {
    return (
      <div className="stats-panel card">
        <div className="card-header">
          <h2 className="card-title">📊 Field Statistics (24h)</h2>
        </div>
        <div className="stats-empty">Loading statistics...</div>
      </div>
    );
  }

  return (
    <div className="stats-panel card">
      <div className="card-header">
        <h2 className="card-title">📊 Field Statistics (24h)</h2>
      </div>

      <div className="stats-grid">
        {/* Moisture Stats */}
        <div className="stat-item">
          <div className="stat-label">💧 Soil Moisture</div>
          <div className="stat-values">
            <div className="stat-display">
              <span className="stat-avg">Avg: {stats.avgMoisture?.toFixed(1) || 'N/A'}%</span>
              <span className="stat-range">
                {stats.minMoisture?.toFixed(1) || 'N/A'}% - {stats.maxMoisture?.toFixed(1) || 'N/A'}%
              </span>
            </div>
          </div>
        </div>

        {/* Temperature Stats */}
        <div className="stat-item">
          <div className="stat-label">🌡️ Temperature</div>
          <div className="stat-values">
            <div className="stat-display">
              <span className="stat-avg">Avg: {stats.avgTemperature?.toFixed(1) || 'N/A'}°C</span>
              <span className="stat-range">
                Max: {stats.maxTemperature?.toFixed(1) || 'N/A'}°C
              </span>
            </div>
          </div>
        </div>

        {/* Humidity Stats */}
        <div className="stat-item">
          <div className="stat-label">💨 Humidity</div>
          <div className="stat-values">
            <div className="stat-display">
              <span className="stat-avg">Avg: {stats.avgHumidity?.toFixed(1) || 'N/A'}%</span>
            </div>
          </div>
        </div>

        {/* Reading Count */}
        <div className="stat-item">
          <div className="stat-label">📈 Readings</div>
          <div className="stat-values">
            <div className="stat-display">
              <span className="stat-avg">{stats.readingCount || 0}</span>
              <span className="stat-range">total readings</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPanel;
