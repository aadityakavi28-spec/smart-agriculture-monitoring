import React, { useState } from 'react';
import './ThresholdSettings.css';

const DEFAULT_THRESHOLDS = {
  soilMoisture: { critical: 20, low: 30, high: 85 },
  temperature: { cold: 5, hot: 35, extreme: 40 },
  humidity: { low: 20, high: 90 },
};

const ThresholdSettings = ({ onSave }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [thresholds, setThresholds] = useState(() => {
    const saved = localStorage.getItem('alertThresholds');
    return saved ? JSON.parse(saved) : DEFAULT_THRESHOLDS;
  });

  const handleChange = (category, key, value) => {
    setThresholds((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: parseFloat(value) || 0,
      },
    }));
  };

  const handleSave = () => {
    localStorage.setItem('alertThresholds', JSON.stringify(thresholds));
    if (onSave) onSave(thresholds);
    setIsOpen(false);
  };

  const handleReset = () => {
    setThresholds(DEFAULT_THRESHOLDS);
    localStorage.removeItem('alertThresholds');
  };

  if (!isOpen) {
    return (
      <button
        className="btn btn-ghost btn-sm settings-trigger"
        onClick={() => setIsOpen(true)}
      >
        ⚙️ Alert Settings
      </button>
    );
  }

  return (
    <div className="threshold-overlay" onClick={() => setIsOpen(false)}>
      <div className="threshold-modal" onClick={(e) => e.stopPropagation()}>
        <div className="threshold-header">
          <h3>⚙️ Alert Thresholds</h3>
          <button
            className="threshold-close"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
        </div>

        <div className="threshold-body">
          {/* Soil Moisture */}
          <div className="threshold-section">
            <h4 className="threshold-section-title">💧 Soil Moisture (%)</h4>
            <div className="threshold-inputs">
              <div className="threshold-input-group">
                <label>Critical Below</label>
                <input
                  type="number"
                  value={thresholds.soilMoisture.critical}
                  onChange={(e) =>
                    handleChange('soilMoisture', 'critical', e.target.value)
                  }
                  min="0"
                  max="100"
                />
              </div>
              <div className="threshold-input-group">
                <label>Low Below</label>
                <input
                  type="number"
                  value={thresholds.soilMoisture.low}
                  onChange={(e) =>
                    handleChange('soilMoisture', 'low', e.target.value)
                  }
                  min="0"
                  max="100"
                />
              </div>
              <div className="threshold-input-group">
                <label>High Above</label>
                <input
                  type="number"
                  value={thresholds.soilMoisture.high}
                  onChange={(e) =>
                    handleChange('soilMoisture', 'high', e.target.value)
                  }
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </div>

          {/* Temperature */}
          <div className="threshold-section">
            <h4 className="threshold-section-title">🌡️ Temperature (°C)</h4>
            <div className="threshold-inputs">
              <div className="threshold-input-group">
                <label>Frost Below</label>
                <input
                  type="number"
                  value={thresholds.temperature.cold}
                  onChange={(e) =>
                    handleChange('temperature', 'cold', e.target.value)
                  }
                />
              </div>
              <div className="threshold-input-group">
                <label>Hot Above</label>
                <input
                  type="number"
                  value={thresholds.temperature.hot}
                  onChange={(e) =>
                    handleChange('temperature', 'hot', e.target.value)
                  }
                />
              </div>
              <div className="threshold-input-group">
                <label>Extreme Above</label>
                <input
                  type="number"
                  value={thresholds.temperature.extreme}
                  onChange={(e) =>
                    handleChange('temperature', 'extreme', e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* Humidity */}
          <div className="threshold-section">
            <h4 className="threshold-section-title">🌫️ Humidity (%)</h4>
            <div className="threshold-inputs">
              <div className="threshold-input-group">
                <label>Low Below</label>
                <input
                  type="number"
                  value={thresholds.humidity.low}
                  onChange={(e) =>
                    handleChange('humidity', 'low', e.target.value)
                  }
                  min="0"
                  max="100"
                />
              </div>
              <div className="threshold-input-group">
                <label>High Above</label>
                <input
                  type="number"
                  value={thresholds.humidity.high}
                  onChange={(e) =>
                    handleChange('humidity', 'high', e.target.value)
                  }
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="threshold-footer">
          <button className="btn btn-ghost btn-sm" onClick={handleReset}>
            Reset Defaults
          </button>
          <div className="threshold-footer-right">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleSave}>
              Save Thresholds
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThresholdSettings;