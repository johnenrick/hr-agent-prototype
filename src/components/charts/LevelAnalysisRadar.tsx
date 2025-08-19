import React from 'react';
import ReactApexChart from 'react-apexcharts';
import type { LevelAnalysisRadarProps } from '../../types';

const LevelAnalysisRadar: React.FC<LevelAnalysisRadarProps> = ({ series, options }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">
          <i className="fas fa-radar me-2 text-primary"></i>
          Competency Level Analysis
        </h5>
      </div>
      <div className="card-body">
        <div className="chart-container d-flex flex-column flex-grow-1">
          <p className="explanatory-text">
            This chart analyzes skill distribution across competencies. It shows the <strong>Lowest</strong> and <strong>Highest</strong> levels with demonstrated skills, alongside the <strong>Center of Gravity</strong>—the weighted average competency level based on performance scores.
          </p>
          <div className="flex-grow-1 d-flex align-items-center justify-content-center radar-chart-container">
            <ReactApexChart
              options={options}
              series={series}
              type="radar"
              height={500}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelAnalysisRadar;
