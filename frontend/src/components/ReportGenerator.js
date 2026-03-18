import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ReportGenerator = ({ latestReading, statistics, alerts, prediction }) => {
  const generatePDF = () => {
    try {
      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text('Smart Agriculture Monitoring Report', 14, 20);

      doc.setFontSize(11);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);

      autoTable(doc, {
        startY: 40,
        head: [['Metric', 'Value']],
        body: [
          ['Soil Moisture', `${latestReading?.soilMoisture ?? '-'} %`],
          ['Temperature', `${latestReading?.temperature ?? '-'} °C`],
          ['Humidity', `${latestReading?.humidity ?? '-'} %`],
        ],
      });

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 15,
        head: [['Metric', 'Average', 'Minimum', 'Maximum']],
        body: [
          [
            'Soil Moisture',
            statistics?.soilMoisture?.avg ?? '-',
            statistics?.soilMoisture?.min ?? '-',
            statistics?.soilMoisture?.max ?? '-',
          ],
          [
            'Temperature',
            statistics?.temperature?.avg ?? '-',
            statistics?.temperature?.min ?? '-',
            statistics?.temperature?.max ?? '-',
          ],
          [
            'Humidity',
            statistics?.humidity?.avg ?? '-',
            statistics?.humidity?.min ?? '-',
            statistics?.humidity?.max ?? '-',
          ],
        ],
      });

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 15,
        head: [['Field', 'Value']],
        body: [
          ['Irrigation Needed', prediction?.irrigationNeeded ? 'Yes' : 'No'],
          ['Hours Until Irrigation', prediction?.hoursUntilIrrigation ?? '-'],
          ['Trend', prediction?.trend ?? '-'],
          ['Confidence', prediction?.confidence ?? '-'],
          ['Recommendation', prediction?.recommendation ?? '-'],
        ],
      });

      const alertRows =
        alerts && alerts.length > 0
          ? alerts.map((a) => [a.severity || '-', a.type || '-', a.message || '-'])
          : [['-', '-', 'No active alerts']];

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 15,
        head: [['Severity', 'Type', 'Message']],
        body: alertRows,
      });

      doc.save('smart-agriculture-report.pdf');
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('PDF generation failed. Check console.');
    }
  };

  return (
    <button
      onClick={generatePDF}
      style={{
        padding: '10px 16px',
        background: '#2d6a4f',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
      }}
    >
      📄 Download Report
    </button>
  );
};

export default ReportGenerator;