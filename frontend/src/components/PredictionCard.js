/**
 * PredictionCard Component
 * Shows irrigation forecast with confidence gauge
 */

import React from 'react';
import './PredictionCard.css';

const PredictionCard = ({ prediction }) => {
  if (!prediction) {
    return (
      <div className="card prediction-card">
        <div className="card-header">
          <h2 className="card-title">
            <span className="icon icon-yellow">🔮</span>
            Irrigation Forecast
          </h2>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">🌱</div>
          <div className="empty-state-title">Building prediction model</div>
          <div className="empty-state-description">
            Needs more sensor data for accurate forecasting
          </div>
        </div>
      </div>
    );
  }

  const {
    irrigationNeeded,
    hoursUntilIrrigation,
    confidence,
    trend,
    recommendation,
    currentMoisture,
    predictedMoisture,
  } = prediction;

  // Status based on urgency
  const getUrgency = () => {
    if (!irrigationNeeded) return { level: 'good', label: 'No Action Needed', icon: '✅' };
    if (hoursUntilIrrigation <= 2) return { level: 'critical', label: 'Urgent', icon: '🚨' };
    if (hoursUntilIrrigation <= 6) return { level: 'warning', label: 'Soon', icon: '⚠️' };
    return { level: 'info', label: 'Planned', icon: '📋' };
  };

  const urgency = getUrgency();

  // Trend icon
  const trendIcons = {
    declining: '📉',
    stable: '➡️',
    rising: '📈',
  };

  // Confidence bar color
  const getConfidenceColor = (val) => {
    if (val >= 75) return 'var(--color-primary-500)';
    if (val >= 50) return 'var(--color-earth-500)';
    return 'var(--color-danger-400)';
  };

  return (
    <div className={`card prediction-card prediction-${urgency.level}`}>
      <div className="card-header">
        <h2 className="card-title">
          <span className="icon icon-yellow">🔮</span>
          Irrigation Forecast
        </h2>
        <span className={`badge badge-${urgency.level === 'good' ? 'success' : urgency.level === 'critical' ? 'danger' : 'warning'}`}>
          {urgency.icon} {urgency.label}
        </span>
      </div>

      <div className="prediction-content">
        {/* Main Prediction */}
        <div className="prediction-hero">
          {irrigationNeeded ? (
            <>
              <span className="prediction-time">
                {hoursUntilIrrigation?.toFixed(1)}
              </span>
              <span className="prediction-time-unit">hours</span>
              <span className="prediction-time-label">until irrigation needed</span>
            </>
          ) : (
            <>
              <span className="prediction-ok-icon">🌿</span>
              <span className="prediction-time-label">
                Moisture levels are healthy
              </span>
            </>
          )}
        </div>

        {/* Stats Grid */}
        <div className="prediction-stats">
          <div className="prediction-stat">
            <span className="prediction-stat-label">Current</span>
            <span className="prediction-stat-value">
              {currentMoisture?.toFixed(1) || '—'}%
            </span>
          </div>
          <div className="prediction-stat">
            <span className="prediction-stat-label">Projected</span>
            <span className="prediction-stat-value">
              {predictedMoisture?.toFixed(1) || '—'}%
            </span>
          </div>
          <div className="prediction-stat">
            <span className="prediction-stat-label">Trend</span>
            <span className="prediction-stat-value">
              {trendIcons[trend] || '—'} {trend || '—'}
            </span>
          </div>
        </div>

        {/* Confidence Bar */}
        {confidence !== undefined && (
          <div className="prediction-confidence">
            <div className="confidence-header">
              <span className="confidence-label">Model Confidence</span>
              <span
                className="confidence-value"
                style={{ color: getConfidenceColor(confidence) }}
              >
                {confidence}%
              </span>
            </div>
            <div className="confidence-track">
              <div
                className="confidence-fill"
                style={{
                  width: `${confidence}%`,
                  background: getConfidenceColor(confidence),
                }}
              />
            </div>
          </div>
        )}

        {/* Recommendation */}
        {recommendation && (
          <div className="prediction-recommendation">
            <span className="recommendation-icon">💡</span>
            <p className="recommendation-text">{recommendation}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionCard;