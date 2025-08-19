// Employee Evaluation System Type Definitions

// Base Types
export type CompetencyLevelType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

// Score and Conclusion Types
export interface Score {
  consistency: number;
  confidence: number;
}

export interface Conclusion {
  points: number;
  explanation: string;
  adjustedPoints?: number;
}

// Factor Types
export interface CompetencyLevelFactorEvaluation {
  competencyLevelFactorDescription: string;
  employeePerformanceArtifactInsights: string[];
  score: Score | null;
  conclusion: Conclusion | null;
}

// Competency Level Types
export interface CompetencyLevelData {
  factors: CompetencyLevelFactorEvaluation[];
}

export interface CompetencyLevel {
  1: CompetencyLevelData;
  2: CompetencyLevelData;
  3: CompetencyLevelData;
  4: CompetencyLevelData;
  5: CompetencyLevelData;
  6: CompetencyLevelData;
  7: CompetencyLevelData;
  8: CompetencyLevelData;
  9: CompetencyLevelData;
}

// Competency Evaluation Types
export interface CompetencyEvaluation {
  competency: string;
  competencyLevel: CompetencyLevel;
}

// Employee Performance Artifact Types
export interface EmployeePerformanceArtifact {
  artifactId: string;
  artifact_identifier: string;
  employeeId: string;
  createdAt: string;
  source: string;
  importance: string;
  competencyInsights: string[];
  prLink?: string;
  status?: string;
  prOwnerEmployeeId?: string;
  projectName?: string;
  sprintId?: string;
  respondingExpert?: string;
  respondentRelation?: string;
  respondingEmployee?: string;
}

// Employee Evaluation Sheet Types
export interface EmployeeEvaluationSheet {
  employeeId: string;
  evaluationDate: string;
  competencyEvaluations: CompetencyEvaluation[];
}

// Main Employee Type
export interface Employee {
  id: string;
  name: string;
  position: string;
  employeePerformanceArtifacts: EmployeePerformanceArtifact[];
  employeeEvaluationSheets: EmployeeEvaluationSheet[];
}

// Company Competency Types
export interface CompanyCompetencyFactor {
  id: number;
  description: string;
  factorPoints: number;
  judgementCriteria: any[];
}

export interface CompanyCompetencyLevel {
  factors: CompanyCompetencyFactor[];
}

export interface CompanyCompetency {
  id: number;
  description: string;
  levels: {
    [key: string]: CompanyCompetencyLevel;
  };
}

// Team Data Types
export interface TeamMember {
  id: string;
  name: string;
  position: string;
  hasData: boolean;
}

export interface TeamData {
  teamName: string;
  members: TeamMember[];
}

// Chart Data Types
export interface ChartDataPoint {
  x: string;
  y: number;
  consistency?: number;
  confidence?: number;
  avgAdjustedPoints?: number;
}

export interface ChartSeries {
  name: string;
  data: ChartDataPoint[] | number[];
}

export interface ChartData {
  series: ChartSeries[];
  options: Record<string, unknown>;
}

// Summary Data Types
export interface SummaryData {
  competencyCenterOfGravity: Record<string, number>;
  competencyLowestLevel: Record<string, number>;
  competencyHighestLevel: Record<string, number>;
}

// Hook Return Types
export interface EmployeeDataHookResult {
  employee: Employee | null;
  companyCompetency: CompanyCompetency[];
  summaryData: SummaryData | null;
  chartData: {
    heatmap: { series: { name: string; data: ChartDataPoint[] }[]; options: Record<string, unknown>; cogSeries?: { name: string; data: ChartDataPoint[] }[] };
    radar: ChartData;
    trend: ChartData;
    comparison: {
      junior: ChartData;
      middle: ChartData;
      senior: ChartData;
    };
  };
  isLoading: boolean;
  error: string | null;
}

// Component Props Types
export interface CompetencyHeatmapProps {
  series: { name: string; data: ChartDataPoint[] }[];
  cogSeries?: { name: string; data: ChartDataPoint[] }[];
  options: Record<string, unknown>;
  showLabels: boolean;
  showCenterOfGravity: boolean;
  onToggleLabels: () => void;
  onToggleCenterOfGravity: () => void;
  onCellClick?: (competencyName: string, level: number) => void;
}

export interface LevelAnalysisRadarProps {
  series: ChartSeries[];
  options: Record<string, unknown>;
}

export interface TrendSlopeChartProps {
  series: ChartSeries[];
  options: Record<string, unknown>;
}

export interface ComparisonRadarChartProps {
  series: ChartSeries[];
  options: Record<string, unknown>;
  comparisonType: 'junior' | 'middle' | 'senior';
}

// Page Props Types
export interface TeamDashboardProps {
  // No props needed for this page
}

export interface ArtifactUploadPageProps {
  // No props needed for this page
}

export interface EmployeeDashboardProps {
  // No props needed for this page - gets employeeId from URL params
}
