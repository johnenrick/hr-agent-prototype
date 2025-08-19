import React from 'react';
import ReactApexChart from 'react-apexcharts';
import type { ComparisonRadarChartProps } from '../../types';

const ComparisonRadarChart: React.FC<ComparisonRadarChartProps> = ({ series, options, comparisonType }) => {
  // Update series names based on comparison type (like the HTML reference)
  const updatedSeries = series.map((s, index) => {
    if (index === 1) { // The second series is the benchmark
      switch (comparisonType) {
        case 'junior': return { ...s, name: 'Junior Avg.' };
        case 'middle': return { ...s, name: 'Middle Avg.' };
        case 'senior': return { ...s, name: 'Senior Avg.' };
        default: return s;
      }
    }
    return s;
  });

  return (
    <div className="chart-container comparison-chart-container">
      <ReactApexChart
        options={options}
        series={updatedSeries}
        type="radar"
        height={300}
      />
    </div>
  );
};

export default ComparisonRadarChart;
