/**
 * StatisticsPanel Component
 * Shows aggregated statistics with visual indicators
 */

import React from 'react';
import './StatisticsPanel.css';

const StatisticsPanel = ({ stats }) => {
  if (!stats) {
    return (
      <div className="card statistics-panel">
        <div className="card-header">
          <h2 className="card-title">
            <span className="icon icon-blue">📋</span>
            Field Statistics
          </h2>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <div className="empty-state-title">No statistics available</div>
          <div className="empty-state-description">
            Statistics will appear as data accumulates
          </div>
        </div>
      </div>
    );
  }

  const metrics = [
    {
      key: 'soilMoisture',
      label: 'Soil Moisture',
      icon: '💧',
      unit: '%',
      color: '#22c55e',
      bg: '#f0fdf4',
    },
    {
      key: 'temperature',
      label: 'Temperature',
      icon: '🌡️',
      unit: '°C',
      color: '#f97316',
      bg: '#fff7ed',
    },
    {
      key: 'humidity',
      label: 'Humidity',
      icon: '🌫️',
      unit: '%',
      color: '#0ea5e9',
      bg: '#f0f9ff',
    },
  ];

  return (
    <div className="card statistics-panel">
      <div className="card-header">
        <h2 className="card-title">
          <span className="icon icon-blue">📋</span>
          Field Statistics
        </h2>
        <span className="badge badge-info">24h</span>
      </div>

      <div className="stats-list">
        {metrics.map((metric) => {
          const data = stats[metric.key] || stats;
          const avg = data?.avg ?? data?.average;
          const min = data?.min ?? data?.minimum;
          const max = data?.max ?? data?.maximum;

          if (avg === undefined && min === undefined) return null;

          // Calculate position of avg between min and max
          const range = (max || 100) - (min || 0);
          const avgPosition = range > 0
            ? (((avg || 0) - (min || 0)) / range) * 100
            : 50;

          return (
            <div
              key={metric.key}
              className="stat-row"
              style={{ '--stat-color': metric.color }}
            >
              <div className="stat-header">
                <span className="stat-name">
                  <span className="stat-icon">{metric.icon}</span>
                  {metric.label}
                </span>
              </div>

              <div className="stat-values">
                <div className="stat-value-item">
                  <span className="stat-label">Min</span>
                  <span className="stat-number">
                    {min?.toFixed(1) ?? '—'}
                    <span className="stat-unit">{metric.unit}</span>
                  </span>
                </div>
                <div className="stat-value-item stat-value-avg">
                  <span className="stat-label">Avg</span>
                  <span className="stat-number stat-number-highlight">
                    {avg?.toFixed(1) ?? '—'}
                    <span className="stat-unit">{metric.unit}</span>
                  </span>
                </div>
                <div className="stat-value-item">
                  <span className="stat-label">Max</span>
                  <span className="stat-number">
                    {max?.toFixed(1) ?? '—'}
                    <span className="stat-unit">{metric.unit}</span>
                  </span>
                </div>
              </div>

              {/* Range Bar */}
              <div className="stat-range">
                <div className="stat-range-track">
                  <div
                    className="stat-range-fill"
                    style={{
                      left: '0%',
                      width: '100%',
                      background: `linear-gradient(90deg, ${metric.color}20, ${metric.color}60, ${metric.color}20)`,
                    }}
                  />
                  <div
                    className="stat-range-marker"
                    style={{
                      left: `${Math.min(Math.max(avgPosition, 5), 95)}%`,
                      background: metric.color,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reading count */}
      {stats.count && (
        <div className="stats-footer">
          <span className="stats-count">
            Based on {stats.count} readings
          </span>
        </div>
      )}
    </div>
  );
};

export default StatisticsPanel;