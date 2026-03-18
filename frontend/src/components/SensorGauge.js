/**
 * SensorGauge Component
 * Displays soil moisture as a visual gauge + temp/humidity cards
 */

import React from 'react';
import './SensorGauge.css';

const SensorGauge = ({ soilMoisture, temperature, humidity }) => {
  // Determine moisture status
  const getMoistureStatus = (value) => {
    if (value <= 20) return { label: 'Critical', color: '#ef4444', bg: '#fef2f2', level: 'critical' };
    if (value <= 35) return { label: 'Low', color: '#f97316', bg: '#fff7ed', level: 'low' };
    if (value <= 55) return { label: 'Moderate', color: '#eab308', bg: '#fefce8', level: 'moderate' };
    if (value <= 75) return { label: 'Good', color: '#22c55e', bg: '#f0fdf4', level: 'good' };
    return { label: 'Excellent', color: '#15803d', bg: '#f0fdf4', level: 'excellent' };
  };

  const status = getMoistureStatus(soilMoisture);

  // SVG gauge calculations
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const progress = (soilMoisture / 100) * circumference;
  const offset = circumference - progress;

  return (
    <div className="sensor-gauge">
      {/* Main Gauge */}
      <div className="gauge-container">
        <svg className="gauge-svg" viewBox="0 0 200 200">
          {/* Background track */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="#f0f0f0"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Progress arc */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={status.color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 100 100)"
            className="gauge-progress"
            style={{ filter: `drop-shadow(0 0 6px ${status.color}40)` }}
          />
        </svg>
        <div className="gauge-center">
          <span className="gauge-value">{soilMoisture.toFixed(1)}</span>
          <span className="gauge-unit">%</span>
          <span
            className="gauge-label"
            style={{ color: status.color }}
          >
            {status.label}
          </span>
        </div>
      </div>

      <p className="gauge-title">Soil Moisture</p>

      {/* Metric Cards */}
      <div className="metric-cards">
        <div className="metric-card metric-temp">
          <div className="metric-icon">🌡️</div>
          <div className="metric-info">
            <span className="metric-value">
              {temperature.toFixed(1)}
              <span className="metric-unit">°C</span>
            </span>
            <span className="metric-label">Temperature</span>
          </div>
        </div>

        <div className="metric-card metric-humid">
          <div className="metric-icon">💧</div>
          <div className="metric-info">
            <span className="metric-value">
              {humidity.toFixed(1)}
              <span className="metric-unit">%</span>
            </span>
            <span className="metric-label">Humidity</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorGauge;