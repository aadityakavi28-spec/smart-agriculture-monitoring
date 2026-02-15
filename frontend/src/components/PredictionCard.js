/**
 * Prediction Card Component
 * Displays irrigation prediction and recommendations
 */

import React from 'react';
import './PredictionCard.css';

const PredictionCard = ({ prediction }) => {
  if (!prediction) {
    return (
      <div className="prediction-card card">
        <div className="card-header">
          <h2 className="card-title">🚜 Irrigation Prediction</h2>
        </div>
        <div className="prediction-empty">Loading prediction data...</div>
      </div>
    );
  }

  const getRecommendationColor = (confidence) => {
    if (confidence > 70) return '#28a745';
    if (confidence > 40) return '#ffc107';
    return '#fd7e14';
  };

  return (
    <div className="prediction-card card">
      <div className="card-header">
        <h2 className="card-title">🚜 Irrigation Prediction</h2>
        <span className="badge" style={{ background: getRecommendationColor(prediction.confidence) }}>
          {prediction.confidence}% Confidence
        </span>
      </div>

      <div className="prediction-content">
        {/* Estimated Time */}
        <div className="prediction-item">
          <span className="prediction-label">⏰ Estimated Irrigation Time:</span>
          <span className="prediction-value highlight">
            {prediction.readableEstimate}
          </span>
        </div>

        {/* Current Moisture */}
        <div className="prediction-item">
          <span className="prediction-label">💧 Current Moisture Level:</span>
          <span className="prediction-value">{prediction.currentMoisture}%</span>
        </div>

        {/* Drop Rate */}
        <div className="prediction-item">
          <span className="prediction-label">📉 Moisture Drop Rate:</span>
          <span className="prediction-value">{prediction.moistureDropRate.toFixed(2)}% per hour</span>
        </div>

        {/* Trend */}
        <div className="prediction-item">
          <span className="prediction-label">📊 Current Trend:</span>
          <span className="prediction-value trend-badge" data-trend={prediction.currentTrend}>
            {prediction.currentTrend.toUpperCase()}
          </span>
        </div>

        {/* Critical Threshold */}
        <div className="prediction-item">
          <span className="prediction-label">🚨 Critical Threshold:</span>
          <span className="prediction-value">{prediction.criticalThreshold}%</span>
        </div>

        {/* Analysis Details */}
        <div className="prediction-item">
          <span className="prediction-label">📊 Analysis Details:</span>
          <span className="prediction-value">
            {prediction.analysisDataPoints} readings over {prediction.analysisPeriod}
          </span>
        </div>

        {/* Recommendation */}
        <div className="prediction-recommendation">
          <div className="recommendation-title">💡 Recommendation:</div>
          <div className="recommendation-text">{prediction.recommendation}</div>
        </div>
      </div>
    </div>
  );
};

export default PredictionCard;
