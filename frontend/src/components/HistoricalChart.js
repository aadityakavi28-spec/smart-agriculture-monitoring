/**
 * Historical Data Chart Component
 * Displays sensor data trends over time using Recharts
 */

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './HistoricalChart.css';

const HistoricalChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <div className="chart-empty">📊 No historical data available yet</div>
      </div>
    );
  }

  // Format data for Recharts
  const chartData = data.map((item) => ({
    timestamp: new Date(item.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
    moisture: item.soilMoisture,
    temperature: item.temperature,
    humidity: item.humidity,
  }));

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="timestamp"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            yAxisId="left"
            label={{ value: 'Moisture & Humidity (%)', angle: -90, position: 'insideLeft' }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{ value: 'Temperature (°C)', angle: 90, position: 'insideRight' }}
          />

          <Tooltip
            contentStyle={{
              background: '#f5f5f5',
              border: '2px solid #667eea',
              borderRadius: '8px',
            }}
          />
          <Legend />

          <Line
            yAxisId="left"
            type="monotone"
            dataKey="moisture"
            stroke="#667eea"
            name="Soil Moisture (%)"
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="humidity"
            stroke="#764ba2"
            name="Humidity (%)"
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="temperature"
            stroke="#fd7e14"
            name="Temperature (°C)"
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HistoricalChart;
