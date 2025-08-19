import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useEmployeeData } from '../hooks/useEmployeeData';
import CompetencyHeatmap from '../components/charts/CompetencyHeatmap';
import LevelAnalysisRadar from '../components/charts/LevelAnalysisRadar';
import TrendSlopeChart from '../components/charts/TrendSlopeChart';
import ComparisonRadarChart from '../components/charts/ComparisonRadarChart';
import CompetencyFactorModal from '../components/CompetencyFactorModal';
import type { CompetencyLevelFactorEvaluation } from '../types';

const EmployeeDashboard: React.FC = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const { employee, summaryData, chartData, isLoading, error } = useEmployeeData(employeeId || '');
  
  // Handle heatmap cell click
  const handleHeatmapCellClick = (competencyName: string, level: number) => {
    console.log('🎯 Parent handleHeatmapCellClick called with:', { competencyName, level, hasEmployee: !!employee });
    
    if (!employee) {
      console.log('❌ No employee data available');
      return;
    }
    
    // Find the competency evaluation
    const evaluationSheet = employee.employeeEvaluationSheets[0];
    console.log('📋 Evaluation sheet:', evaluationSheet);
    
    const competencyEvaluation = evaluationSheet.competencyEvaluations.find(
      ce => ce.competency === competencyName
    );
    
    console.log('🔍 Found competency evaluation:', competencyEvaluation);
    
    if (competencyEvaluation) {
      // Convert level to string since competencyLevel keys are strings
      const levelKey = level.toString();
      const levelData = (competencyEvaluation.competencyLevel as any)[levelKey];
      console.log('📊 Level data for level', levelKey, ':', levelData);
      
              if (levelData && levelData.factors && levelData.factors.length > 0) {
          console.log('✅ Opening modal with factors:', levelData.factors);
          setSelectedCompetency(competencyName);
          setSelectedLevel(level);
          setSelectedFactors(levelData.factors);
          setIsModalOpen(true);
        } else {
          console.log('⚠️ No factors found for level', levelKey);
        }
    } else {
      console.log('⚠️ No competency evaluation found for:', competencyName);
    }
  };
  
  // Local state for chart toggles
  const [showLabels, setShowLabels] = useState(false);
  const [showCenterOfGravity, setShowCenterOfGravity] = useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompetency, setSelectedCompetency] = useState('');
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [selectedFactors, setSelectedFactors] = useState<CompetencyLevelFactorEvaluation[]>([]);
  


  if (isLoading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Loading Employee Data</h4>
          <p>{error || 'Employee not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Back Navigation */}
      <div className="row mb-3">
        <div className="col-12">
          <Link to="/" className="btn btn-outline-secondary">
            <i className="fas fa-arrow-left me-2"></i>
            Back to Team Dashboard
          </Link>
        </div>
      </div>

      {/* Employee Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body text-center">
              <h2 className="card-title mb-2">{employee.name}</h2>
              <p className="card-text text-muted mb-0">{employee.position}</p>
              <p className="card-text small text-muted">
                Employee ID: {employee.id} | Last Updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="row mb-4">
        <div className="col-12">
          <CompetencyHeatmap
            series={chartData.heatmap.series}
            cogSeries={chartData.heatmap.cogSeries}
            options={chartData.heatmap.options}
            showLabels={showLabels}
            showCenterOfGravity={showCenterOfGravity}
            onToggleLabels={() => setShowLabels(!showLabels)}
            onToggleCenterOfGravity={() => setShowCenterOfGravity(!showCenterOfGravity)}
            onCellClick={handleHeatmapCellClick}
          />
        </div>
      </div>

      {/* Secondary Charts Row */}
      <div className="row mb-4">
        <div className="col-md-6">
          <LevelAnalysisRadar
            series={chartData.radar.series}
            options={chartData.radar.options}
          />
        </div>
        <div className="col-md-6">
          <TrendSlopeChart
            series={chartData.trend.series}
            options={chartData.trend.options}
          />
        </div>
      </div>

      {/* Comparison Charts Row */}
      <div className="card section-other-position-comparison">
        <div className="card-header">
          <h5 className="mb-0">
            <i className="fas fa-balance-scale me-2 text-primary"></i>
            Competency Comparison by Position
          </h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-lg-4">
              <h6 className="text-center text-muted">vs. Average Junior Developer</h6>
              <ComparisonRadarChart
                series={chartData.comparison.junior.series}
                options={chartData.comparison.junior.options}
                comparisonType="junior"
              />
            </div>
            <div className="col-lg-4">
              <h6 className="text-center text-muted">vs. Average Middle Developer</h6>
              <ComparisonRadarChart
                series={chartData.comparison.middle.series}
                options={chartData.comparison.middle.options}
                comparisonType="middle"
              />
            </div>
            <div className="col-lg-4">
              <h6 className="text-center text-muted">vs. Average Senior Developer</h6>
              <ComparisonRadarChart
                series={chartData.comparison.senior.series}
                options={chartData.comparison.senior.options}
                comparisonType="senior"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Summary Data Display */}
      {summaryData && (
        <div className="row mt-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="fas fa-chart-pie me-2 text-primary"></i>
                  Competency Summary
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  {Object.entries(summaryData.competencyCenterOfGravity).map(([competency, cog]) => (
                    <div key={competency} className="col-md-3 mb-3">
                      <div className="text-center">
                        <h6 className="mb-1">{competency}</h6>
                        <div className="badge bg-primary fs-6">
                          CoG: {cog.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Competency Factor Modal */}
      <CompetencyFactorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        competencyName={selectedCompetency}
        level={selectedLevel}
        factors={selectedFactors}
      />
    </div>
  );
};

export default EmployeeDashboard;
