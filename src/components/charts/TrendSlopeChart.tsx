import React from 'react';
import ReactApexChart from 'react-apexcharts';
import type { TrendSlopeChartProps } from '../../types';

const TrendSlopeChart: React.FC<TrendSlopeChartProps> = ({ series, options }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">
          <i className="fas fa-chart-line me-2 text-primary"></i>
          Competency Score Trends (12 Months)
        </h5>
      </div>
      <div className="card-body">
        <div className="chart-container d-flex flex-column flex-grow-1">
          <p className="explanatory-text">
            This chart shows illustrative competency trends over the last year, helping track the professional development journey. (Note: This is dummy data for demonstration).
          </p>
          <div className="slope-chart-container">
            <ReactApexChart
              options={options}
              series={series}
              type="line"
              height={350}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendSlopeChart;
