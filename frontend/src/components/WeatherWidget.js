// frontend/src/components/WeatherWidget.js

import React, { useState, useEffect } from 'react';
import './WeatherWidget.css';

const WeatherWidget = ({ lat = 28.6139, lon = 77.2090 }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Free API - no key needed for basic usage
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`
        );
        const data = await res.json();
        setWeather(data);
        setLoading(false);
      } catch (err) {
        console.error('Weather fetch failed:', err);
        setLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 15 * 60 * 1000); // every 15 min
    return () => clearInterval(interval);
  }, [lat, lon]);

  const getWeatherEmoji = (code) => {
    if (!code && code !== 0) return '🌤️';
    if (code === 0) return '☀️';
    if (code <= 3) return '⛅';
    if (code <= 48) return '🌫️';
    if (code <= 57) return '🌦️';
    if (code <= 67) return '🌧️';
    if (code <= 77) return '🌨️';
    if (code <= 82) return '🌧️';
    if (code <= 86) return '❄️';
    if (code <= 99) return '⛈️';
    return '🌤️';
  };

  if (loading) {
    return (
      <div className="card weather-widget">
        <div className="card-header">
          <h2 className="card-title">
            <span className="icon icon-blue">🌤️</span>
            Weather
          </h2>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">⏳</div>
          <div className="empty-state-title">Loading weather...</div>
        </div>
      </div>
    );
  }

  if (!weather || !weather.current) {
    return (
      <div className="card weather-widget">
        <div className="card-header">
          <h2 className="card-title">
            <span className="icon icon-blue">🌤️</span>
            Weather
          </h2>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">🌐</div>
          <div className="empty-state-title">Weather unavailable</div>
          <div className="empty-state-description">Check internet connection</div>
        </div>
      </div>
    );
  }

  const current = weather.current;
  const daily = weather.daily;
  const emoji = getWeatherEmoji(current.weather_code);

  return (
    <div className="card weather-widget">
      <div className="card-header">
        <h2 className="card-title">
          <span className="icon icon-blue">🌤️</span>
          Live Weather
        </h2>
        <span className="badge badge-info">Outdoor</span>
      </div>

      {/* Current Weather */}
      <div className="weather-current">
        <div className="weather-main">
          <span className="weather-emoji">{emoji}</span>
          <div className="weather-temp-block">
            <span className="weather-temp">
              {current.temperature_2m?.toFixed(1)}°C
            </span>
            <span className="weather-desc">Current</span>
          </div>
        </div>

        <div className="weather-details">
          <div className="weather-detail">
            <span className="weather-detail-icon">💧</span>
            <div className="weather-detail-info">
              <span className="weather-detail-value">
                {current.relative_humidity_2m}%
              </span>
              <span className="weather-detail-label">Humidity</span>
            </div>
          </div>
          <div className="weather-detail">
            <span className="weather-detail-icon">💨</span>
            <div className="weather-detail-info">
              <span className="weather-detail-value">
                {current.wind_speed_10m?.toFixed(1)} km/h
              </span>
              <span className="weather-detail-label">Wind</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Day Forecast */}
      {daily && (
        <div className="weather-forecast">
          <span className="weather-forecast-title">3-Day Forecast</span>
          <div className="weather-forecast-grid">
            {[0, 1, 2].map((i) => {
              const date = new Date(daily.time[i]);
              const dayName =
                i === 0
                  ? 'Today'
                  : date.toLocaleDateString([], { weekday: 'short' });

              return (
                <div key={i} className="weather-forecast-day">
                  <span className="forecast-day-name">{dayName}</span>
                  <span className="forecast-temps">
                    <span className="forecast-high">
                      {daily.temperature_2m_max[i]?.toFixed(0)}°
                    </span>
                    <span className="forecast-low">
                      {daily.temperature_2m_min[i]?.toFixed(0)}°
                    </span>
                  </span>
                  <span className="forecast-rain">
                    🌧 {daily.precipitation_sum[i]?.toFixed(1)}mm
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;