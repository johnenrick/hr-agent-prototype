import type { Employee, CompanyCompetency, ChartData, SummaryData, CompetencyLevelType, ChartDataPoint } from '../types';

// Heatmap Data Structure
interface HeatmapData {
  series: { name: string; data: ChartDataPoint[] }[];
  options: Record<string, unknown>;
  summaryData: SummaryData;
  cogSeries: { name: string; data: ChartDataPoint[] }[];
}

/**
 * Transforms employee evaluation data into ApexCharts heatmap format
 * @param employeeData - Raw employee evaluation data
 * @param companyCompetency - Company competency framework
 * @returns ApexCharts heatmap configuration with summary data
 */
export function transformDataForHeatmap(employeeData: Employee, companyCompetency: CompanyCompetency[]): HeatmapData {
  // First, add adjusted points to the employee data (like line 240 in working HTML)
  const addAdjustedPointsToData = (data: Employee) => {
    data.employeeEvaluationSheets.forEach(sheet => {
      sheet.competencyEvaluations.forEach(comp => {
        Object.keys(comp.competencyLevel).forEach(levelKey => {
          const numericLevel = parseInt(levelKey, 10) as CompetencyLevelType;
          const levelData = comp.competencyLevel[numericLevel];
          if (levelData.factors) {
            levelData.factors.forEach((factor) => {
              if (factor.conclusion && typeof factor.conclusion.points !== 'undefined') {
                const basePoints = factor.conclusion.points;
                const adjustedPoints = Math.round(basePoints * (1 + (numericLevel / 100)));
                factor.conclusion.adjustedPoints = adjustedPoints;
              }
            });
          }
        });
      });
    });
  };

  // Transform the data first
  addAdjustedPointsToData(employeeData);

  // Extract competency areas from company competency data
  const competencyAreas = companyCompetency.map(comp => comp.description);
  const levels: CompetencyLevelType[] = [1,2,3,4,5,6,7,8,9];
  
  // Get the evaluation sheet and competency evaluations
  const evaluationSheet = employeeData.employeeEvaluationSheets[0];
  const competencyEvaluations = evaluationSheet.competencyEvaluations;
  
  // Helper function to get factors for a specific competency and level
  const getFactors = (competencyName: string, level: CompetencyLevelType) => {
    const evaluation = competencyEvaluations.find(ce => ce.competency === competencyName);
    if (!evaluation) return [];
    return evaluation.competencyLevel[level]?.factors || [];
  };
  
  // Calculate average adjusted points for a competency and level
  const calculateAverageAdjustedPoints = (competencyName: string, level: CompetencyLevelType) => {
    const factors = getFactors(competencyName, level);
    if (factors.length === 0) return 0;
    const totalAdjustedPoints = factors.reduce((sum: number, factor) => sum + (factor.conclusion?.adjustedPoints || 0), 0);
    return Math.round(totalAdjustedPoints / factors.length);
  };
  
  // Calculate average conclusion points for a competency and level
  const calculateAverageConclusionPoints = (competencyName: string, level: CompetencyLevelType) => {
    const factors = getFactors(competencyName, level);
    if (factors.length === 0) return 0;
    const totalPoints = factors.reduce((sum: number, factor) => sum + (factor.conclusion?.points || 0), 0);
    return Math.round(totalPoints / factors.length);
  };
  
  // Calculate average scores (consistency and confidence) for a competency and level
  const calculateAverageScores = (competencyName: string, level: CompetencyLevelType) => {
    const factors = getFactors(competencyName, level);
    if (factors.length === 0) return { consistency: 0, confidence: 0 };
    const totalConsistency = factors.reduce((sum: number, factor) => sum + (factor.score?.consistency || 0), 0);
    const totalConfidence = factors.reduce((sum: number, factor) => sum + (factor.score?.confidence || 0), 0);
    return {
      consistency: Math.round(totalConsistency / factors.length),
      confidence: Math.round(totalConfidence / factors.length)
    };
  };

  // Calculate summary data (Center of Gravity, etc.)
  const calculateSummaryData = (): SummaryData => {
    const competencyCenterOfGravity: Record<string, number> = {};
    const competencyLowestLevel: Record<string, number> = {};
    const competencyHighestLevel: Record<string, number> = {};

    competencyAreas.forEach(competency => {
      let weightedSum = 0;
      let totalWeight = 0;
      let lowestLevel: number | null = null;
      let highestLevel: number | null = null;

      levels.forEach(level => {
        const avgAdjustedPoints = calculateAverageAdjustedPoints(competency, level);
        const avgOriginalPoints = calculateAverageConclusionPoints(competency, level);

        if (avgAdjustedPoints > 0) {
          weightedSum += level * avgAdjustedPoints;
          totalWeight += avgAdjustedPoints;
        }
        
        if (avgOriginalPoints > 0) {
          if (lowestLevel === null) {
            lowestLevel = level;
          }
          highestLevel = level;
        }
      });

      competencyCenterOfGravity[competency] = totalWeight > 0 ? (weightedSum / totalWeight) : 0;
      competencyLowestLevel[competency] = lowestLevel || 0;
      competencyHighestLevel[competency] = highestLevel || 0;
    });

    return { competencyCenterOfGravity, competencyLowestLevel, competencyHighestLevel };
  };

  // Calculate summary data
  const summaryData = calculateSummaryData();

  // Create heatmap series data
  const series = competencyAreas.map(competency => {
    const data = levels.map(level => {
      const avgAdjustedPoints = calculateAverageAdjustedPoints(competency, level);
      const avgOriginalPoints = calculateAverageConclusionPoints(competency, level);
      const avgScores = calculateAverageScores(competency, level);
      return { 
        x: `Level ${level}`, 
        y: avgOriginalPoints,
        avgAdjustedPoints: avgAdjustedPoints,
        consistency: avgScores.consistency, 
        confidence: avgScores.confidence 
      };
    });
    return { name: competency, data: data };
  }).reverse();

  const options = {
    chart: {
      type: 'heatmap',
      height: 350,
      toolbar: { show: false },
      fontFamily: 'inherit'
    },
    plotOptions: {
      heatmap: {
        radius: 4,
        enableShades: true,
        states: {
          active: {
            filter: { type: 'none' }
          }
        },
        colorScale: {
          ranges: [
            { from: 0, to: 0, color: '#F8F9FA', name: 'No Data' }, 
            { from: 1, to: 20, color: '#E8F5E9', name: 'Very Low' }, 
            { from: 21, to: 40, color: '#A5D6A7', name: 'Low' }, 
            { from: 41, to: 60, color: '#66BB6A', name: 'Medium' },
            { from: 61, to: 80, color: '#43A047', name: 'High' },
            { from: 81, to: 100, color: '#2E7D32', name: 'Very High' }
          ]
        }
      }
    },
    dataLabels: {
      enabled: false,
      style: {
        colors: ['#333'],
        fontFamily: 'inherit',
        fontSize: '0.8rem',
        fontWeight: 600,
      }
    },
    xaxis: { type: 'category' },
    yaxis: { labels: { style: { fontSize: '14px', fontWeight: 500 } } },
    tooltip: {
      custom: function({ seriesIndex, dataPointIndex, w }: { seriesIndex: number; dataPointIndex: number; w: { config: { series: Array<{ name: string; data: Array<{ y: number; x: string; avgAdjustedPoints?: number; consistency?: number; confidence?: number }> }> } } }) {
        const series = w.config.series[seriesIndex];
        const cellData = series.data[dataPointIndex];
        const seriesName = series.name;

        if (cellData.y === 0) return '';

        return `
          <div class="p-2">
            <div class="fw-bold mb-1">${seriesName}: ${cellData.x}</div>
            <div>Avg. Points: <strong>${cellData.y}</strong></div>
            <div>Avg. Adjusted: <strong>${cellData.avgAdjustedPoints || 'N/A'}</strong></div>
            <hr class="my-1">
            <div>Consistency: <strong>${cellData.consistency || 'N/A'}</strong></div>
            <div>Confidence: <strong>${cellData.confidence || 'N/A'}</strong></div>
          </div>
        `;
      }
    },
    stroke: { width: 2, colors: ['#fff'] }
  };

  // Create Center of Gravity series (like lines 358-370 in dashboard.html)
  const cogSeries = series.map(seriesItem => {
    const competencyName = seriesItem.name;
    const cogLevel = Math.round(summaryData.competencyCenterOfGravity[competencyName]);

    const newData = seriesItem.data.map((dataPoint, index) => {
      const currentLevel = index + 1;
      if (currentLevel === cogLevel) {
        return { ...dataPoint, y: 100 }; // Show CoG level as 100
      }
      return { ...dataPoint, y: 0 }; // Hide other levels
    });
    return { name: seriesItem.name, data: newData };
  });

  return { series, options, summaryData, cogSeries };
}

/**
 * Transforms employee evaluation data into ApexCharts radar format
 */
export function transformDataForRadar(employeeData: Employee, companyCompetency: CompanyCompetency[]): ChartData {
  // First, add adjusted points to the employee data (like line 240 in working HTML)
  const addAdjustedPointsToData = (data: Employee) => {
    data.employeeEvaluationSheets.forEach(sheet => {
      sheet.competencyEvaluations.forEach(comp => {
        Object.keys(comp.competencyLevel).forEach(levelKey => {
          const numericLevel = parseInt(levelKey, 10) as CompetencyLevelType;
          const levelData = comp.competencyLevel[numericLevel];
          if (levelData.factors) {
            levelData.factors.forEach((factor) => {
              if (factor.conclusion && typeof factor.conclusion.points !== 'undefined') {
                const basePoints = factor.conclusion.points;
                const adjustedPoints = Math.round(basePoints * (1 + (numericLevel / 100)));
                factor.conclusion.adjustedPoints = adjustedPoints;
              }
            });
          }
        });
      });
    });
  };

  // Transform the data first
  addAdjustedPointsToData(employeeData);

  // Extract competency areas from company competency data
  const competencyAreas = companyCompetency.map(comp => comp.description);
  const levels: CompetencyLevelType[] = [1,2,3,4,5,6,7,8,9];
  
  // Get the evaluation sheet and competency evaluations
  const evaluationSheet = employeeData.employeeEvaluationSheets[0];
  const competencyEvaluations = evaluationSheet.competencyEvaluations;
  
  // Helper function to get factors for a specific competency and level
  const getFactors = (competencyName: string, level: CompetencyLevelType) => {
    const evaluation = competencyEvaluations.find(ce => ce.competency === competencyName);
    if (!evaluation) return [];
    return evaluation.competencyLevel[level]?.factors || [];
  };
  
  // Calculate average adjusted points for a competency and level
  const calculateAverageAdjustedPoints = (competencyName: string, level: CompetencyLevelType) => {
    const factors = getFactors(competencyName, level);
    if (factors.length === 0) return 0;
    const totalAdjustedPoints = factors.reduce((sum: number, factor) => sum + (factor.conclusion?.adjustedPoints || 0), 0);
    return Math.round(totalAdjustedPoints / factors.length);
  };
  
  // Calculate average conclusion points for a competency and level
  const calculateAverageConclusionPoints = (competencyName: string, level: CompetencyLevelType) => {
    const factors = getFactors(competencyName, level);
    if (factors.length === 0) return 0;
    const totalPoints = factors.reduce((sum: number, factor) => sum + (factor.conclusion?.points || 0), 0);
    return Math.round(totalPoints / factors.length);
  };

  // Calculate summary data (Center of Gravity, etc.)
  const calculateSummaryData = (): SummaryData => {
    const competencyCenterOfGravity: Record<string, number> = {};
    const competencyLowestLevel: Record<string, number> = {};
    const competencyHighestLevel: Record<string, number> = {};

    competencyAreas.forEach(competency => {
      let weightedSum = 0;
      let totalWeight = 0;
      let lowestLevel: number | null = null;
      let highestLevel: number | null = null;

      levels.forEach(level => {
        const avgAdjustedPoints = calculateAverageAdjustedPoints(competency, level);
        const avgOriginalPoints = calculateAverageConclusionPoints(competency, level);

        if (avgAdjustedPoints > 0) {
          weightedSum += level * avgAdjustedPoints;
          totalWeight += avgAdjustedPoints;
        }
        
        if (avgOriginalPoints > 0) {
          if (lowestLevel === null) {
            lowestLevel = level;
          }
          highestLevel = level;
        }
      });

      competencyCenterOfGravity[competency] = totalWeight > 0 ? (weightedSum / totalWeight) : 0;
      competencyLowestLevel[competency] = lowestLevel || 0;
      competencyHighestLevel[competency] = highestLevel || 0;
    });

    return { competencyCenterOfGravity, competencyLowestLevel, competencyHighestLevel };
  };

  // Calculate summary data
  const summaryData = calculateSummaryData();

  // Create radar series data (using simple arrays for radar charts)
  const series = [
    { 
      name: 'Center of Gravity', 
      data: competencyAreas.map(competency => summaryData.competencyCenterOfGravity[competency])
    },
    { 
      name: 'Lowest Level', 
      data: competencyAreas.map(competency => summaryData.competencyLowestLevel[competency])
    },
    { 
      name: 'Highest Level', 
      data: competencyAreas.map(competency => summaryData.competencyHighestLevel[competency])
    }
  ];

  const options = {
    chart: {
      type: 'radar',
      height: 500,
      toolbar: { show: false }
    },
    xaxis: {
      categories: companyCompetency.map(c => c.description.replace(' Capabilities', '').replace(' Skills', ''))
    },
    yaxis: {
      min: 0,
      max: 9,
      tickAmount: 3,
    },
    stroke: { width: 2 },
    fill: { opacity: 0.25 },
    markers: { size: 3 },
    legend: { show: false },
    colors: ['#4CAF50', '#90A4AE'],
    tooltip: { 
      y: { formatter: (val: number) => val.toFixed(2) } 
    }
  };

  return { series, options };
}

/**
 * Transforms employee evaluation data into ApexCharts trend format
 */
export function transformDataForTrend(): ChartData {
  // Generate realistic trend data like the HTML reference
  const generateTrendData = (start: number, length: number, pattern: 'improve' | 'decline' | 'steady') => {
    const data = [start];
    for (let i = 1; i < length; i++) {
      const prev = data[i - 1];
      let change = 0;
      switch (pattern) {
        case 'improve': change = Math.random() * 5; break;
        case 'decline': change = Math.random() * -5; break;
        case 'steady': change = (Math.random() - 0.5) * 4; break;
      }
      data.push(Math.round(Math.max(0, Math.min(100, prev + change))));
    }
    return data;
  };

  // Generate months for the last 12 months
  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (11 - i));
    return d.toLocaleString('default', { month: 'short' });
  });

  // Create trend series with realistic progression patterns
  const technicalData = generateTrendData(75, 12, 'improve');
  const executionData = generateTrendData(85, 12, 'decline');
  const pmData = generateTrendData(35, 12, 'steady');
  const leadershipData = generateTrendData(25, 12, 'steady');

  const series = [
    { name: 'Technical Capabilities', data: months.map((month, index) => ({ x: month, y: technicalData[index] })) },
    { name: 'Execution', data: months.map((month, index) => ({ x: month, y: executionData[index] })) },
    { name: 'Project Management', data: months.map((month, index) => ({ x: month, y: pmData[index] })) },
    { name: 'Leadership', data: months.map((month, index) => ({ x: month, y: leadershipData[index] })) }
  ];

  const options = {
    chart: { 
      height: 350,
      width: '100%',
      type: 'line', 
      zoom: { enabled: false }, 
      toolbar: { show: true } 
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'straight', width: 3 },
    markers: { size: 5 },
    xaxis: { 
      categories: months,
      labels: { style: { fontSize: '12px' } }
    },
    yaxis: { 
      min: 0, 
      max: 100,
      labels: { style: { fontSize: '12px' } }
    },
    legend: { 
      position: 'top', 
      horizontalAlign: 'right', 
      floating: false, 
      offsetY: 0, 
      offsetX: 0,
      fontSize: '12px',
      itemWidth: 120,
      onItemClick: { toggleDataSeries: false }
    },
    colors: ['#43A047', '#2196F3', '#FF9800', '#9C27B0'],
    tooltip: {
      y: { formatter: (val: number) => val.toFixed(0) }
    }
  };

  return { series, options };
}

/**
 * Transforms employee evaluation data into ApexCharts comparison format
 */
export function transformDataForComparison(employeeData: Employee, companyCompetency: CompanyCompetency[], benchmarkType: 'junior' | 'middle' | 'senior' = 'junior'): ChartData {
  // First, add adjusted points to the employee data (like line 240 in working HTML)
  const addAdjustedPointsToData = (data: Employee) => {
    data.employeeEvaluationSheets.forEach(sheet => {
      sheet.competencyEvaluations.forEach(comp => {
        Object.keys(comp.competencyLevel).forEach(levelKey => {
          const numericLevel = parseInt(levelKey, 10) as CompetencyLevelType;
          const levelData = comp.competencyLevel[numericLevel];
          if (levelData.factors) {
            levelData.factors.forEach((factor) => {
              if (factor.conclusion && typeof factor.conclusion.points !== 'undefined') {
                const basePoints = factor.conclusion.points;
                const adjustedPoints = Math.round(basePoints * (1 + (numericLevel / 100)));
                factor.conclusion.adjustedPoints = adjustedPoints;
              }
            });
          }
        });
      });
    });
  };

  // Transform the data first
  addAdjustedPointsToData(employeeData);

  // Extract competency areas from company competency data
  const competencyAreas = companyCompetency.map(comp => comp.description);
  const levels: CompetencyLevelType[] = [1,2,3,4,5,6,7,8,9];
  
  // Get the evaluation sheet and competency evaluations
  const evaluationSheet = employeeData.employeeEvaluationSheets[0];
  const competencyEvaluations = evaluationSheet.competencyEvaluations;
  
  // Helper function to get factors for a specific competency and level
  const getFactors = (competencyName: string, level: CompetencyLevelType) => {
    const evaluation = competencyEvaluations.find(ce => ce.competency === competencyName);
    if (!evaluation) return [];
    return evaluation.competencyLevel[level]?.factors || [];
  };
  
  // Calculate average adjusted points for a competency and level
  const calculateAverageAdjustedPoints = (competencyName: string, level: CompetencyLevelType) => {
    const factors = getFactors(competencyName, level);
    if (factors.length === 0) return 0;
    const totalAdjustedPoints = factors.reduce((sum: number, factor) => sum + (factor.conclusion?.adjustedPoints || 0), 0);
    return Math.round(totalAdjustedPoints / factors.length);
  };

  // Calculate summary data (Center of Gravity)
  const calculateSummaryData = (): SummaryData => {
    const competencyCenterOfGravity: Record<string, number> = {};
    const competencyLowestLevel: Record<string, number> = {};
    const competencyHighestLevel: Record<string, number> = {};

    competencyAreas.forEach(competency => {
      let weightedSum = 0;
      let totalWeight = 0;
      let lowestLevel: number | null = null;
      let highestLevel: number | null = null;

      levels.forEach(level => {
        const avgAdjustedPoints = calculateAverageAdjustedPoints(competency, level);
        const avgOriginalPoints = calculateAverageConclusionPoints(competency, level);

        if (avgAdjustedPoints > 0) {
          weightedSum += level * avgAdjustedPoints;
          totalWeight += avgAdjustedPoints;
        }
        
        if (avgOriginalPoints > 0) {
          if (lowestLevel === null) {
            lowestLevel = level;
          }
          highestLevel = level;
        }
      });

      competencyCenterOfGravity[competency] = totalWeight > 0 ? (weightedSum / totalWeight) : 0;
      competencyLowestLevel[competency] = lowestLevel || 0;
      competencyHighestLevel[competency] = highestLevel || 0;
    });

    return { competencyCenterOfGravity, competencyLowestLevel, competencyHighestLevel };
  };

  // Calculate average conclusion points for a competency and level
  const calculateAverageConclusionPoints = (competencyName: string, level: CompetencyLevelType) => {
    const factors = getFactors(competencyName, level);
    if (factors.length === 0) return 0;
    const totalPoints = factors.reduce((sum: number, factor) => sum + (factor.conclusion?.points || 0), 0);
    return Math.round(totalPoints / factors.length);
  };

  // Calculate summary data
  const summaryData = calculateSummaryData();

  // Create comparison series data with exact values from HTML reference
  const getBenchmarkData = (type: 'junior' | 'middle' | 'senior') => {
    switch (type) {
      case 'junior': return [3, 4, 4, 3]; // [Execution, Leadership, Technical, PM]
      case 'middle': return [6, 6, 6, 5];
      case 'senior': return [8, 7, 8, 7];
      default: return [3, 4, 4, 3];
    }
  };

  const getBenchmarkName = (type: 'junior' | 'middle' | 'senior') => {
    switch (type) {
      case 'junior': return 'Junior Avg.';
      case 'middle': return 'Middle Avg.';
      case 'senior': return 'Senior Avg.';
      default: return 'Junior Avg.';
    }
  };

  const series = [
    { 
      name: 'Employee CoG', 
      data: competencyAreas.map(competency => summaryData.competencyCenterOfGravity[competency])
    },
    { 
      name: getBenchmarkName(benchmarkType), 
      data: getBenchmarkData(benchmarkType)
    }
  ];

  const options = {
    chart: {
      type: 'radar',
      height: 500,
      toolbar: { show: false }
    },
    xaxis: {
      categories: competencyAreas.map(c => c.replace(' Capabilities', '').replace(' Skills', ''))
    },
    yaxis: {
      min: 0,
      max: 9,
      tickAmount: 3,
    },
    stroke: { width: 2 },
    fill: { opacity: 0.25 },
    markers: { size: 3 },
    legend: { show: false },
    colors: ['#4CAF50', '#90A4AE'],
    tooltip: { 
      y: { formatter: (val: number) => val.toFixed(2) } 
    }
  };

  return { series, options };
}
