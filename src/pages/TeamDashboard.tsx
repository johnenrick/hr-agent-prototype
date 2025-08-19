import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import teamData from '../data/team-data.json';
import type { TeamMember } from '../types';

const TeamDashboard: React.FC = () => {
  const teamMembers: TeamMember[] = teamData.members;
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card bg-gradient-primary text-white">
            <div className="card-body text-center">
              <h1 className="display-4 mb-3">Team Bangan Dashboard</h1>
              <p className="lead mb-0">AI-Powered Employee Evaluation System</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Artifacts Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body text-center">
              <h5 className="card-title mb-3">Upload Performance Artifacts</h5>
              <p className="card-text text-muted mb-3">
                Upload documents, reports, or other performance artifacts to analyze employee competencies
              </p>
              <Link to="/upload" className="btn btn-primary btn-lg">
                <i className="fas fa-upload me-2"></i>
                Upload Artifacts
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="row mb-4">
        <div className="col-12">
          <h3 className="mb-3">Team Members</h3>
        </div>
      </div>

      <div className="row">
        {teamMembers.map((member) => (
          <div key={member.id} className="col-md-6 col-lg-3 mb-4">
            <div className={`card h-100 ${!member.hasData ? 'opacity-50' : ''}`}>
              <div className="card-body text-center">
                <div className="mb-3">
                  <i className="fas fa-user-circle fa-3x text-primary"></i>
                </div>
                <h5 className="card-title mb-2">{member.name}</h5>
                <p className="card-text text-muted mb-3">{member.position}</p>
                
                {member.hasData ? (
                  <Link 
                    to={`/dashboard/${member.id}`} 
                    className="btn btn-primary w-100"
                  >
                    <i className="fas fa-chart-bar me-2"></i>
                    View Dashboard
                  </Link>
                ) : (
                  <button 
                    className="btn btn-secondary w-100" 
                    disabled
                    title="No evaluation data available for this employee"
                  >
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    No Data Available
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* How the System Works */}
      <div className="row mt-5">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h4 className="mb-0">
                <i className="fas fa-info-circle me-2 text-info"></i>
                How the System Works
              </h4>
            </div>
            <div className="card-body">
              {/* Flow Chart - Properly Centered */}
              <div className="row justify-content-center mb-3">
                <div className="col-12">
                  <div className="d-flex justify-content-center">
                    <div className="row" style={{ maxWidth: '1600px', margin: '0 auto', paddingLeft: '20px', paddingRight: '20px' }}>
                      <div className="col text-center" style={{ marginRight: '100px', minWidth: '150px' }}>
                        <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style={{ width: '50px', height: '50px' }}>
                          <i className="fas fa-upload fa-lg"></i>
                        </div>
                        <p className="mb-1 small fw-bold text-muted">Step 1</p>
                        <p className="mb-1 fw-semibold">Upload Artifacts</p>
                        <p className="small text-muted">Documents, reports, retrospectives</p>
                      </div>
                      <div className="col text-center" style={{ marginRight: '100px', minWidth: '150px' }}>
                        <div className="bg-info text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style={{ width: '50px', height: '50px' }}>
                          <i className="fas fa-robot fa-lg"></i>
                        </div>
                        <p className="mb-1 small fw-bold text-muted">Step 2</p>
                        <p className="mb-1 fw-semibold">AI Analysis</p>
                        <p className="small text-muted">Content analysis & insight extraction</p>
                      </div>
                      <div className="col text-center" style={{ marginRight: '100px', minWidth: '150px' }}>
                        <div className="bg-warning text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style={{ width: '50px', height: '50px' }}>
                          <i className="fas fa-chart-line fa-lg"></i>
                        </div>
                        <p className="mb-1 small fw-bold text-muted">Step 3</p>
                        <p className="mb-1 fw-semibold">Match Standards</p>
                        <p className="small text-muted">AI Transform Data to Information</p>
                      </div>
                      <div className="col text-center" style={{ marginRight: '100px', minWidth: '150px' }}>
                        <div className="bg-secondary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style={{ width: '50px', height: '50px' }}>
                          <i className="fas fa-database fa-lg"></i>
                        </div>
                        <p className="mb-1 small fw-bold text-muted">Step 4</p>
                        <p className="mb-1 fw-semibold">Update Data</p>
                        <p className="small text-muted">AI: Information to Evaluation</p>
                      </div>
                      <div className="col text-center" style={{ minWidth: '150px' }}>
                        <div className="bg-danger text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style={{ width: '50px', height: '50px' }}>
                          <i className="fas fa-eye fa-lg"></i>
                        </div>
                        <p className="mb-1 small fw-bold text-muted">Step 5</p>
                        <p className="mb-1 fw-semibold">View Results</p>
                        <p className="small text-muted">Evaluation to Decision</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Show Explanation Button - Center Aligned */}
              <div className="row justify-content-center mb-3">
                <div className="col-12 text-center">
                  <button
                    className="btn btn-outline-info btn-sm"
                    onClick={() => setShowExplanation(!showExplanation)}
                  >
                    <i className={`fas ${showExplanation ? 'fa-eye-slash' : 'fa-eye'} me-2`}></i>
                    {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
                  </button>
                </div>
              </div>

              {/* Toggleable Explanation */}
              {showExplanation && (
                <div className="mt-3">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="d-flex align-items-start mb-3">
                        <i className="fas fa-user text-info me-3 mt-1" style={{minWidth: '20px'}}></i>
                        <div>
                          <strong className="text-info">Step 1:</strong> <span className="text-base">Upload performance artifacts (documents, reports, retrospectives)</span>
                        </div>
                      </div>
                      <div className="d-flex align-items-start mb-3">
                        <i className="fas fa-robot text-secondary me-3 mt-1" style={{minWidth: '20px'}}></i>
                        <div>
                          <strong className="text-secondary">Step 2:</strong> <span className="text-base">AI analyzes content, identifies involved employees, and extracts performance insights</span>
                        </div>
                      </div>
                      <div className="d-flex align-items-start mb-3">
                        <i className="fas fa-robot text-secondary me-3 mt-1" style={{minWidth: '20px'}}></i>
                        <div>
                          <strong className="text-secondary">Step 3:</strong> <span className="text-base">AI matches performance insights with company competency standards</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex align-items-start mb-3">
                        <i className="fas fa-robot text-secondary me-3 mt-1" style={{minWidth: '20px'}}></i>
                        <div>
                          <strong className="text-secondary">Step 4:</strong> <span className="text-base">AI automatically updates employee competency data in real-time</span>
                        </div>
                      </div>
                      <div className="d-flex align-items-start mb-0">
                        <i className="fas fa-user text-info me-3 mt-1" style={{minWidth: '20px'}}></i>
                        <div>
                          <strong className="text-info">Step 5:</strong> <span className="text-base">View updated employee dashboards with new insights and competency analysis</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="alert alert-light border mt-3 py-2">
                <i className="fas fa-lightbulb me-2 text-muted"></i>
                <span className="text-muted small">
                  <strong>Note:</strong> You only need to complete Step 1 (Upload Artifacts). The AI system handles steps 2-4 automatically, and you can view the results in Step 5.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDashboard;
