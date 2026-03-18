import React from 'react';

const FieldMap = ({ latestReading }) => {
  return (
    <div style={{ background: '#fff', padding: '20px', borderRadius: '12px' }}>
      <h2>🗺️ Field Map</h2>
      <p>Soil Moisture: {latestReading?.soilMoisture ?? '-'}%</p>
      <p>Temperature: {latestReading?.temperature ?? '-'}°C</p>
      <p>Humidity: {latestReading?.humidity ?? '-'}%</p>

      <iframe
        title="Field Map"
        width="100%"
        height="350"
        style={{ border: 0, borderRadius: '10px', marginTop: '15px' }}
        loading="lazy"
        src="https://www.google.com/maps?q=28.6139,77.2090&z=15&output=embed"
      />
    </div>
  );
};

export default FieldMap;