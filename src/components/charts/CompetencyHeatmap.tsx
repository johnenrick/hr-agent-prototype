import React, { useCallback, useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import type { CompetencyHeatmapProps } from '../../types';

const CompetencyHeatmap: React.FC<CompetencyHeatmapProps> = ({
  series,
  cogSeries,
  options,
  showLabels,
  showCenterOfGravity,
  onToggleLabels,
  onToggleCenterOfGravity,
  onCellClick
}) => {
  // Track render count to debug re-rendering issues
  const renderCount = React.useRef(0);
  renderCount.current += 1;
  
  console.log('🎨 CompetencyHeatmap rendering #', renderCount.current, 'with:', { 
    seriesCount: series.length, 
    hasOnCellClick: !!onCellClick,
    showLabels,
    showCenterOfGravity,
    onCellClickRef: onCellClick
  });

    // Memoize the click handler to prevent recreation on each render
  const handleCellClick = useCallback((_event: unknown, _chartContext: unknown, config: { seriesIndex: number; dataPointIndex: number }) => {
    console.log('🔥 Heatmap cell clicked via onDataPointSelection!', { config, series });
    console.log('🔍 Handler function reference:', handleCellClick);
    console.log('📋 onCellClick reference:', onCellClick);
    
    const seriesIndex = config.seriesIndex;
    const dataPointIndex = config.dataPointIndex;
    
    console.log('📊 Click details:', { 
      seriesIndex, 
      dataPointIndex, 
      hasCallback: !!onCellClick 
    });
    
    // Validate indices and series data
    if (seriesIndex < 0 || dataPointIndex < 0 || 
        !series || !series[seriesIndex] || !series[seriesIndex].name) {
      console.log('⚠️ Invalid indices or missing series data, returning');
      return;
    }

    const competencyName = series[seriesIndex].name;
    const level = Number(dataPointIndex) + 1; // Convert index to level (1-9)
    
    console.log('🎯 Calculated data:', { competencyName, level });
    
    // Call the parent callback if provided
    if (onCellClick) {
      console.log('✅ Calling onCellClick callback');
      onCellClick(competencyName, level);
    } else {
      console.log('❌ No onCellClick callback provided');
    }
  }, [series, onCellClick]);

  // Memoize chart options to prevent recreation on each render
  const chartOptions = useMemo(() => ({
    ...options,
    chart: {
      ...(options.chart as Record<string, unknown>),
      events: {
        click: handleCellClick
      }
    },
    dataLabels: {
      ...(options.dataLabels as Record<string, unknown>),
      enabled: showLabels,
      formatter: function(val: number, opts: { w: { config: { series: Array<{ data: Array<{ consistency?: number; confidence?: number }> }> }; seriesIndex: number; dataPointIndex: number } }) {
        if (!opts || !opts.w || !opts.w.config || !opts.w.config.series) {
          return val.toString();
        }
        const { w } = opts;
        const series = w.config.series[w.seriesIndex];
        if (!series || !series.data || !series.data[w.dataPointIndex]) {
          return val.toString();
        }
        const { consistency, confidence } = series.data[w.dataPointIndex];
        if (val === 0) return '';
        return [val, `● ${consistency || 'N/A'}  ● ${confidence || 'N/A'}`];
      }
    }
  }), [options, showLabels, handleCellClick]);

  return (
    <div className="card competency-heatmap">
      <div className="card-header">
        <h5 className="mb-0">
          <i className="fas fa-th me-2 text-primary"></i>
          Competency Heatmap Analysis
        </h5>
      </div>
      <div className="card-body">
        <p className="explanatory-text">
          This heatmap displays the <strong>average Conclusion Score</strong> for each competency level.
          Darker shades indicate higher scores. Below the main score are the ● Consistency and ● Confidence metrics.
          Click any cell for details.
        </p>
        
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="chart-container">
            <ReactApexChart
              options={chartOptions}
              series={showCenterOfGravity && cogSeries ? cogSeries : series}
              type="heatmap"
              height={350}
            />
          </div>
        </div>
        
        <div className="text-center mt-3 d-flex justify-content-center gap-2">
          <button
            type="button"
            className={`btn btn-outline-secondary btn-sm ${showLabels ? 'active' : ''}`}
            onClick={onToggleLabels}
          >
            <i className={`fas ${showLabels ? 'fa-eye-slash' : 'fa-eye'} me-1`}></i>
            {showLabels ? 'Hide Cell Labels' : 'Show Cell Labels'}
          </button>
          <button
            type="button"
            className={`btn ${showCenterOfGravity ? 'btn-primary' : 'btn-outline-primary'} btn-sm`}
            onClick={onToggleCenterOfGravity}
          >
            <i className="fas fa-crosshairs me-1"></i>
            {showCenterOfGravity ? 'Hide Center of Gravity' : 'Show Center of Gravity'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompetencyHeatmap;
