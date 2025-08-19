import { useState, useEffect } from 'react';
import type { Employee, CompanyCompetency, EmployeeDataHookResult } from '../types';
import { transformDataForHeatmap, transformDataForRadar, transformDataForTrend, transformDataForComparison } from '../utils/chart-transformers';

export const useEmployeeData = (employeeId: string): EmployeeDataHookResult => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [companyCompetency, setCompanyCompetency] = useState<CompanyCompetency[]>([]);
  const [summaryData, setSummaryData] = useState<EmployeeDataHookResult['summaryData']>(null);
  const [chartData, setChartData] = useState<EmployeeDataHookResult['chartData']>({
    heatmap: { series: [], options: {} },
    radar: { series: [], options: {} },
    trend: { series: [], options: {} },
    comparison: { 
      junior: { series: [], options: {} },
      middle: { series: [], options: {} },
      senior: { series: [], options: {} }
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEmployeeData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Dynamically import employee data
        const employeeModule = await import(`../data/employee-${employeeId}.json`);
        const employeeData: Employee = employeeModule.default;

        // Dynamically import company competency data
        const companyModule = await import(`../data/company-competency.json`);
        const companyData: CompanyCompetency[] = companyModule.default;

        setEmployee(employeeData);
        setCompanyCompetency(companyData);

        // Transform data in the correct sequence as defined in the HTML Migration Strategy
        // First: Transform data for all charts
        const heatmapData = transformDataForHeatmap(employeeData, companyData);
        const radarData = transformDataForRadar(employeeData, companyData);
        const trendData = transformDataForTrend();
        const juniorComparisonData = transformDataForComparison(employeeData, companyData, 'junior');
        const middleComparisonData = transformDataForComparison(employeeData, companyData, 'middle');
        const seniorComparisonData = transformDataForComparison(employeeData, companyData, 'senior');

        // Second: Set chart data
        setChartData({
          heatmap: heatmapData,
          radar: radarData,
          trend: trendData,
          comparison: {
            junior: juniorComparisonData,
            middle: middleComparisonData,
            senior: seniorComparisonData
          }
        });

        // Third: Extract summary data from heatmap transformation
        // The summary data is calculated during heatmap transformation
        if (heatmapData.summaryData) {
          setSummaryData(heatmapData.summaryData);
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load employee data');
      } finally {
        setIsLoading(false);
      }
    };

    if (employeeId) {
      loadEmployeeData();
    }
  }, [employeeId]);

  return {
    employee,
    companyCompetency,
    summaryData,
    chartData,
    isLoading,
    error
  };
};
