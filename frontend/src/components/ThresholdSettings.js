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
    localStorage.setItem('alertThresholds', JSON.stringify(DEFAULT_THRESHOLDS));
  };

  return (
    <>
      <button
        className="btn btn-secondary btn-sm"
        onClick={() => setIsOpen(true)}
      >
        ⚙ Alert Settings
      </button>

      {isOpen && (
        <div className="threshold-overlay" onClick={() => setIsOpen(false)}>
          <div
            className="threshold-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="threshold-header">
              <h3>Alert Threshold Settings</h3>
              <button
                className="threshold-close"
                onClick={() => setIsOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="threshold-body">
              <div className="threshold-section">
                <h4>💧 Soil Moisture</h4>
                <div className="threshold-grid">
                  <div>
                    <label>Critical Below</label>
                    <input
                      type="number"
                      value={thresholds.soilMoisture.critical}
                      onChange={(e) =>
                        handleChange('soilMoisture', 'critical', e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label>Low Below</label>
                    <input
                      type="number"
                      value={thresholds.soilMoisture.low}
                      onChange={(e) =>
                        handleChange('soilMoisture', 'low', e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label>High Above</label>
                    <input
                      type="number"
                      value={thresholds.soilMoisture.high}
                      onChange={(e) =>
                        handleChange('soilMoisture', 'high', e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="threshold-section">
                <h4>🌡 Temperature</h4>
                <div className="threshold-grid">
                  <div>
                    <label>Cold Below</label>
                    <input
                      type="number"
                      value={thresholds.temperature.cold}
                      onChange={(e) =>
                        handleChange('temperature', 'cold', e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label>Hot Above</label>
                    <input
                      type="number"
                      value={thresholds.temperature.hot}
                      onChange={(e) =>
                        handleChange('temperature', 'hot', e.target.value)
                      }
                    />
                  </div>
                  <div>
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

              <div className="threshold-section">
                <h4>🌫 Humidity</h4>
                <div className="threshold-grid">
                  <div>
                    <label>Low Below</label>
                    <input
                      type="number"
                      value={thresholds.humidity.low}
                      onChange={(e) =>
                        handleChange('humidity', 'low', e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label>High Above</label>
                    <input
                      type="number"
                      value={thresholds.humidity.high}
                      onChange={(e) =>
                        handleChange('humidity', 'high', e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="threshold-footer">
              <button className="btn btn-danger btn-sm" onClick={handleReset}>
                Reset
              </button>
              <button className="btn btn-primary btn-sm" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ThresholdSettings;