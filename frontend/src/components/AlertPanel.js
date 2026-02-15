/**
 * Alert Panel Component
 * Displays active alerts and alert history
 */

import React from 'react';
import './AlertPanel.css';

const AlertPanel = ({ alerts = [] }) => {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="alert-panel card">
        <div className="card-header">
          <h2 className="card-title">🔔 Alerts</h2>
        </div>
        <div className="alert-empty">✅ No active alerts - Everything looks good!</div>
      </div>
    );
  }

  const getSeverityBadgeClass = (severity) => {
    return {
      critical: 'badge-critical',
      high: 'badge-danger',
      medium: 'badge-warning',
      low: 'badge-success',
    }[severity] || 'badge-warning';
  };

  const getAlertIcon = (alertType) => {
    return {
      critical_moisture: '🚨',
      low_moisture: '⚠️',
      high_temp: '🔥',
      prediction: '📊',
    }[alertType] || '📢';
  };

  return (
    <div className="alert-panel card">
      <div className="card-header">
        <h2 className="card-title">🔔 Alerts</h2>
        <span className="badge badge-danger">{alerts.length} Active</span>
      </div>

      <div className="alerts-list">
        {alerts.map((alert) => (
          <div key={alert._id} className="alert-item">
            <div className="alert-header">
              <span className="alert-icon">{getAlertIcon(alert.alertType)}</span>
              <span className={`badge ${getSeverityBadgeClass(alert.severity)}`}>
                {alert.severity.toUpperCase()}
              </span>
              <span className="alert-time">
                {new Date(alert.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div className="alert-message">{alert.message}</div>
            {alert.soilMoisture && (
              <div className="alert-details">
                <span>💧 Moisture: {alert.soilMoisture}%</span>
                {alert.temperature && <span>🌡️ Temp: {alert.temperature}°C</span>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertPanel;
