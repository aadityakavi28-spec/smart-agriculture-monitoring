/**
 * HistoricalChart Component
 * Interactive 24-hour line charts with custom styling
 */

import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import './HistoricalChart.css';

const METRICS = [
  { key: 'soilMoisture', label: 'Moisture', color: '#22c55e', unit: '%' },
  { key: 'temperature', label: 'Temperature', color: '#f97316', unit: '°C' },
  { key: 'humidity', label: 'Humidity', color: '#0ea5e9', unit: '%' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">
        {new Date(label).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </p>
      {payload.map((entry, index) => {
        const metric = METRICS.find((m) => m.key === entry.dataKey);
        return (
          <div key={index} className="chart-tooltip-item">
            <span
              className="chart-tooltip-dot"
              style={{ background: entry.color }}
            />
            <span className="chart-tooltip-name">{metric?.label}:</span>
            <span className="chart-tooltip-value">
              {entry.value?.toFixed(1)}
              {metric?.unit}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const HistoricalChart = ({ data }) => {
  const [activeMetric, setActiveMetric] = useState('soilMoisture');

  if (!data || data.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📊</div>
        <div className="empty-state-title">No historical data yet</div>
        <div className="empty-state-description">
          Charts will appear after the simulator collects a few minutes of data
        </div>
      </div>
    );
  }

  const currentMetric = METRICS.find((m) => m.key === activeMetric);

  // Format data for chart
  const chartData = data.map((item) => ({
    ...item,
    time: new Date(item.timestamp || item.createdAt).getTime(),
  }));

  return (
    <div className="historical-chart">
      {/* Metric Toggle */}
      <div className="chart-toggle">
        {METRICS.map((metric) => (
          <button
            key={metric.key}
            className={`chart-toggle-btn ${
              activeMetric === metric.key ? 'active' : ''
            }`}
            onClick={() => setActiveMetric(metric.key)}
            style={{
              '--toggle-color': metric.color,
              '--toggle-bg': `${metric.color}15`,
            }}
          >
            <span
              className="chart-toggle-dot"
              style={{ background: metric.color }}
            />
            {metric.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id={`gradient-${activeMetric}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={currentMetric.color}
                  stopOpacity={0.2}
                />
                <stop
                  offset="95%"
                  stopColor={currentMetric.color}
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f0f0f0"
              vertical={false}
            />

            <XAxis
              dataKey="time"
              type="number"
              scale="time"
              domain={['auto', 'auto']}
              tickFormatter={(ts) =>
                new Date(ts).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              }
              stroke="#a8a29e"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#e7e5e4' }}
            />

            <YAxis
              stroke="#a8a29e"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={40}
              tickFormatter={(val) =>
                `${val}${currentMetric.unit}`
              }
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey={activeMetric}
              stroke={currentMetric.color}
              strokeWidth={2.5}
              fill={`url(#gradient-${activeMetric})`}
              dot={false}
              activeDot={{
                r: 5,
                fill: currentMetric.color,
                stroke: '#fff',
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HistoricalChart;