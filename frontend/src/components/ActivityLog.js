// frontend/src/components/ActivityLog.js

import React, { useState } from 'react';
import './ActivityLog.css';

const ActivityLog = () => {
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('irrigationLogs');
    return saved ? JSON.parse(saved) : [];
  });

  const [showForm, setShowForm] = useState(false);
  const [duration, setDuration] = useState(15);
  const [method, setMethod] = useState('drip');
  const [notes, setNotes] = useState('');

  const addLog = () => {
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      duration,
      method,
      notes,
    };

    const updated = [newLog, ...logs].slice(0, 50); // keep last 50
    setLogs(updated);
    localStorage.setItem('irrigationLogs', JSON.stringify(updated));
    setShowForm(false);
    setDuration(15);
    setNotes('');
  };

  const deleteLog = (id) => {
    const updated = logs.filter((l) => l.id !== id);
    setLogs(updated);
    localStorage.setItem('irrigationLogs', JSON.stringify(updated));
  };

  const formatTime = (iso) => {
    const d = new Date(iso);
    const now = new Date();
    const diffH = Math.floor((now - d) / 3600000);

    if (diffH < 1) return 'Just now';
    if (diffH < 24) return `${diffH}h ago`;
    if (diffH < 48) return 'Yesterday';
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const methodEmojis = {
    drip: '💧',
    sprinkler: '🌊',
    flood: '🌊',
    manual: '🚿',
  };

  return (
    <div className="card activity-log">
      <div className="card-header">
        <h2 className="card-title">
          <span className="icon icon-green">📝</span>
          Irrigation Log
        </h2>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Cancel' : '+ Log Irrigation'}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="log-form">
          <div className="log-form-row">
            <div className="log-form-field">
              <label>Duration (min)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                min="1"
                max="480"
              />
            </div>
            <div className="log-form-field">
              <label>Method</label>
              <select value={method} onChange={(e) => setMethod(e.target.value)}>
                <option value="drip">💧 Drip</option>
                <option value="sprinkler">🌊 Sprinkler</option>
                <option value="flood">🌊 Flood</option>
                <option value="manual">🚿 Manual</option>
              </select>
            </div>
          </div>
          <div className="log-form-field">
            <label>Notes (optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Morning watering, field-2..."
            />
          </div>
          <button className="btn btn-primary btn-sm" onClick={addLog}>
            ✓ Save Entry
          </button>
        </div>
      )}

      {/* Log List */}
      <div className="log-list">
        {logs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <div className="empty-state-title">No irrigation logged</div>
            <div className="empty-state-description">
              Tap "Log Irrigation" to record watering activity
            </div>
          </div>
        ) : (
          logs.slice(0, 10).map((log) => (
            <div key={log.id} className="log-item">
              <div className="log-item-left">
                <span className="log-item-emoji">
                  {methodEmojis[log.method] || '💧'}
                </span>
                <div className="log-item-info">
                  <span className="log-item-title">
                    {log.method.charAt(0).toUpperCase() + log.method.slice(1)}{' '}
                    irrigation · {log.duration} min
                  </span>
                  <span className="log-item-time">
                    {formatTime(log.timestamp)}
                    {log.notes && ` · ${log.notes}`}
                  </span>
                </div>
              </div>
              <button
                className="log-delete-btn"
                onClick={() => deleteLog(log.id)}
                title="Delete"
              >
                🗑
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityLog;