// frontend/src/components/AlertPanel.js

import React, { useState, useEffect } from 'react';
import './AlertPanel.css';

const AlertPanel = ({ alerts = [], onResolve }) => {
  const [displayAlerts, setDisplayAlerts] = useState([]);
  const [fadingAlerts, setFadingAlerts] = useState(new Set());

  // ============================================================
  // CLIENT-SIDE EXPIRY TRACKING
  // Even if backend TTL hasn't kicked in, we hide expired alerts
  // ============================================================

  useEffect(() => {
    const EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

    const filterExpired = () => {
      const now = Date.now();
      const valid = [];
      const fading = new Set();

      alerts.forEach((alert) => {
        const createdTime = new Date(alert.createdAt).getTime();
        const age = now - createdTime;

        if (age < EXPIRY_MS) {
          // Check if about to expire (last 30 seconds)
          if (age > EXPIRY_MS - 30000) {
            fading.add(alert._id);
          }
          valid.push({
            ...alert,
            timeRemaining: Math.max(0, EXPIRY_MS - age),
            progress: Math.min(100, (age / EXPIRY_MS) * 100),
          });
        }
      });

      setDisplayAlerts(valid);
      setFadingAlerts(fading);
    };

    // Filter immediately
    filterExpired();

    // Re-filter every 10 seconds for smooth countdown
    const interval = setInterval(filterExpired, 10000);

    return () => clearInterval(interval);
  }, [alerts]);

  // ============================================================
  // HELPERS
  // ============================================================

  const getSeverityConfig = (severity) => {
    switch (severity) {
      case 'critical':
        return { icon: '🔴', color: '#ef4444', bg: '#fef2f2', border: '#fecaca' };
      case 'high':
        return { icon: '🟠', color: '#f97316', bg: '#fff7ed', border: '#fed7aa' };
      case 'medium':
        return { icon: '🟡', color: '#eab308', bg: '#fefce8', border: '#fef08a' };
      default:
        return { icon: '🔵', color: '#0ea5e9', bg: '#f0f9ff', border: '#bae6fd' };
    }
  };

  const formatTimeRemaining = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (minutes > 0) return `${minutes}m ${seconds}s left`;
    return `${seconds}s left`;
  };

  const formatTimeAgo = (timestamp) => {
    const diff = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);

    if (diff < 10) return 'Just now';
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="card alert-panel">
      <div className="card-header">
        <h2 className="card-title">
          <span className="icon icon-red">🔔</span>
          Active Alerts
        </h2>
        <div className="alert-header-right">
          {displayAlerts.length > 0 && (
            <span className="badge badge-danger">{displayAlerts.length}</span>
          )}
          <span className="alert-auto-label">Auto-clears in 5min</span>
        </div>
      </div>

      <div className="alert-list">
        {displayAlerts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">✅</div>
            <div className="empty-state-title">All clear</div>
            <div className="empty-state-description">
              No active alerts. Alerts auto-expire after 5 minutes.
            </div>
          </div>
        ) : (
          displayAlerts.map((alert) => {
            const config = getSeverityConfig(alert.severity);
            const isFading = fadingAlerts.has(alert._id);

            return (
              <div
                key={alert._id}
                className={`alert-item ${isFading ? 'alert-fading' : ''}`}
                style={{
                  '--alert-bg': config.bg,
                  '--alert-border': config.border,
                  '--alert-color': config.color,
                }}
              >
                {/* Expiry Progress Bar */}
                <div className="alert-expiry-bar">
                  <div
                    className="alert-expiry-fill"
                    style={{
                      width: `${100 - alert.progress}%`,
                      background: config.color,
                    }}
                  />
                </div>

                <div className="alert-body">
                  <div className="alert-indicator" />
                  <div className="alert-content">
                    <div className="alert-top">
                      <span className="alert-severity">
                        {config.icon} {alert.severity}
                      </span>
                      <div className="alert-time-info">
                        <span className="alert-time">
                          {formatTimeAgo(alert.createdAt)}
                        </span>
                        <span className="alert-countdown">
                          ⏱ {formatTimeRemaining(alert.timeRemaining)}
                        </span>
                      </div>
                    </div>
                    <p className="alert-message">{alert.message}</p>
                    {alert.value !== undefined && (
                      <span className="alert-value">
                        Reading: {alert.value.toFixed(1)}
                        {alert.type === 'temperature' ? '°C' : '%'}
                      </span>
                    )}
                  </div>
                  {onResolve && (
                    <button
                      className="alert-resolve-btn"
                      onClick={() => onResolve(alert._id)}
                      title="Dismiss alert"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AlertPanel;