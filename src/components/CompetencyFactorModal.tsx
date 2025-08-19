import React from 'react';
import type { CompetencyLevelFactorEvaluation } from '../types';

interface CompetencyFactorModalProps {
  isOpen: boolean;
  onClose: () => void;
  competencyName: string;
  level: number;
  factors: CompetencyLevelFactorEvaluation[];
}

const CompetencyFactorModal: React.FC<CompetencyFactorModalProps> = ({
  isOpen,
  onClose,
  competencyName,
  level,
  factors
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-xl modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              Detailed Factor Analysis: {competencyName} - Level {level}
            </h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body p-4">
            {factors.length === 0 ? (
              <div className="text-center text-muted py-4">
                <i className="fas fa-info-circle fa-2x mb-3"></i>
                <p>No factors available for this competency level.</p>
              </div>
            ) : (
              factors.map((factor, index) => (
                <div key={index} className="factor-card">
                  <p className="factor-description">{factor.competencyLevelFactorDescription}</p>
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <strong>Consistency Score:</strong> {factor.score?.consistency || 'N/A'}
                    </div>
                    <div className="col-md-6">
                      <strong>Confidence Score:</strong> {factor.score?.confidence || 'N/A'}
                    </div>
                  </div>
                  {factor.conclusion && (
                    <div className="card conclusion-card p-3 mb-4">
                      <strong>
                        Conclusion ({factor.conclusion.points} pts | 
                        Adjusted: {factor.conclusion.adjustedPoints || 'N/A'} pts):
                      </strong>
                      <p className="mb-0 mt-2">{factor.conclusion.explanation}</p>
                    </div>
                  )}
                  <h6 className="mt-4">
                    <i className="fas fa-lightbulb me-2"></i>
                    Supporting Performance Insights
                  </h6>
                  <table className="table table-sm table-bordered artifacts-table mt-3">
                    <tbody>
                      {factor.employeePerformanceArtifactInsights?.map((insight, insightIndex) => (
                        <tr key={insightIndex}>
                          <td>{insight}</td>
                        </tr>
                      )) || (
                        <tr>
                          <td>No performance insights available</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              ))
            )}
          </div>
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetencyFactorModal;
