/**
 * Sensor Gauge Component
 * Displays real-time soil moisture with analog gauge style
 */

import React from 'react';
import './SensorGauge.css';

const SensorGauge = ({ soilMoisture = 50, temperature = 25, humidity = 60 }) => {
  const getGaugeColor = (moisture) => {
    if (moisture < 20) return '#dc3545'; // Critical
    if (moisture < 35) return '#fd7e14'; // Low
    if (moisture < 70) return '#ffc107'; // Moderate
    return '#28a745'; // Good
  };

  const getMoistureStatus = (moisture) => {
    if (moisture < 20) return 'CRITICAL';
    if (moisture < 35) return 'LOW';
    if (moisture < 70) return 'MODERATE';
    return 'GOOD';
  };

  const gaugeColor = getGaugeColor(soilMoisture);
  const rotation = (soilMoisture / 100) * 180 - 90; // Convert to -90 to 90 degrees

  return (
    <div className="sensor-gauge-container">
      <div className="gauge">
        <svg viewBox="0 0 200 120" className="gauge-svg">
          {/* Gauge background arc */}
          <circle cx="100" cy="100" r="80" fill="none" stroke="#e0e0e0" strokeWidth="20" />

          {/* Colored arcs */}
          <path
            d="M 30 100 A 70 70 0 0 1 170 100"
            fill="none"
            stroke="#dc3545"
            strokeWidth="20"
            strokeDasharray="39 244"
          />
          <path
            d="M 30 100 A 70 70 0 0 1 170 100"
            fill="none"
            stroke="#fd7e14"
            strokeWidth="20"
            strokeDasharray="61 244"
            strokeDashoffset="-39"
          />
          <path
            d="M 30 100 A 70 70 0 0 1 170 100"
            fill="none"
            stroke="#ffc107"
            strokeWidth="20"
            strokeDasharray="85 244"
            strokeDashoffset="-100"
          />
          <path
            d="M 30 100 A 70 70 0 0 1 170 100"
            fill="none"
            stroke="#28a745"
            strokeWidth="20"
            strokeDasharray="59 244"
            strokeDashoffset="-185"
          />

          {/* Needle */}
          <g transform={`rotate(${rotation} 100 100)`}>
            <line x1="100" y1="100" x2="100" y2="30" stroke={gaugeColor} strokeWidth="4" />
            <circle cx="100" cy="100" r="6" fill={gaugeColor} />
          </g>

          {/* Labels */}
          <text x="35" y="115" fontSize="12" fill="#999" textAnchor="middle">
            0%
          </text>
          <text x="100" y="115" fontSize="12" fill="#999" textAnchor="middle">
            50%
          </text>
          <text x="165" y="115" fontSize="12" fill="#999" textAnchor="middle">
            100%
          </text>
        </svg>

        <div className="gauge-center">
          <div className="gauge-value">{soilMoisture.toFixed(1)}%</div>
          <div className="gauge-status" style={{ color: gaugeColor }}>
            {getMoistureStatus(soilMoisture)}
          </div>
        </div>
      </div>

      {/* Sensor readings below gauge */}
      <div className="sensor-readings">
        <div className="reading">
          <span className="label">🌡️ Temperature</span>
          <span className="value">{temperature.toFixed(1)}°C</span>
        </div>
        <div className="reading">
          <span className="label">💧 Humidity</span>
          <span className="value">{humidity.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
};

export default SensorGauge;
