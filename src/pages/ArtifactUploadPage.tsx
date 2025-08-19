import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface FakeFile {
  id: string;
  name: string;
  type: string;
  size: string;
  description: string;
}

interface ExtractedInsight {
  employeeName: string;
  competency: string;
  insight: string;
  source: string;
}

const ArtifactUploadPage: React.FC = () => {
  const [showFileModal, setShowFileModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FakeFile[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [extractedInsights, setExtractedInsights] = useState<ExtractedInsight[]>([]);

  // Fake files for the modal
  const fakeFiles: FakeFile[] = [
    {
      id: '1',
      name: 'Q4_Performance_Review_2024.pdf',
      type: 'PDF Document',
      size: '2.4 MB',
      description: 'Quarterly performance review documents for development team'
    },
    {
      id: '2',
      name: 'Sprint_Retrospective_Notes.docx',
      type: 'Word Document',
      size: '156 KB',
      description: 'Agile sprint retrospective notes and action items'
    },
    {
      id: '3',
      name: 'Code_Review_Feedback.csv',
      type: 'CSV File',
      size: '89 KB',
      description: 'Code review feedback and quality metrics'
    },
    {
      id: '4',
      name: 'Project_Delivery_Report.xlsx',
      type: 'Excel Spreadsheet',
      size: '1.2 MB',
      description: 'Project delivery timeline and milestone tracking'
    },
    {
      id: '5',
      name: 'Team_Feedback_Survey.json',
      type: 'JSON File',
      size: '45 KB',
      description: '360-degree feedback survey results'
    },
    {
      id: '6',
      name: 'Technical_Assessment_Results.pdf',
      type: 'PDF Document',
      size: '3.1 MB',
      description: 'Technical skills assessment and competency mapping'
    }
  ];

  // Sample insights extracted from employee data
  const sampleInsights: ExtractedInsight[] = [
    {
      employeeName: 'Pedro Bostos',
      competency: 'Execution',
      insight: 'Demonstrated strong problem-solving skills by identifying and fixing a visual bug on widescreen displays.',
      source: 'Pull Request Review'
    },
    {
      employeeName: 'Pedro Bostos',
      competency: 'Leadership',
      insight: 'Effectively collaborated with team members during the review process, leading to a successful and approved merge.',
      source: 'Pull Request Review'
    },
    {
      employeeName: 'Maria Makiling',
      competency: 'Execution',
      insight: 'Achieved 95% unit test coverage for a new module, demonstrating strong technical execution and a commitment to quality.',
      source: 'Agile Retrospective'
    },
    {
      employeeName: 'Maria Makiling',
      competency: 'Leadership',
      insight: 'Actively participated in the retrospective by agreeing with a teammate\'s concern about the sprint planning process.',
      source: 'Agile Retrospective'
    },
    {
      employeeName: 'Jose Martinez',
      competency: 'Execution',
      insight: 'Proactively identified a significant future risk concerning a deprecated dependency in a third-party library.',
      source: 'Project Management Risk Management'
    },
    {
      employeeName: 'Jose Martinez',
      competency: 'Leadership',
      insight: 'Exhibited strong collaboration and humility by proactively seeking a pairing session to address a complex race condition.',
      source: 'Pull Request Review'
    }
  ];

  const handleFileSelect = (file: FakeFile) => {
    setSelectedFiles(prev => {
      const isSelected = prev.find(f => f.id === file.id);
      if (isSelected) {
        return prev.filter(f => f.id !== file.id);
      } else {
        return [...prev, file];
      }
    });
  };

  const startAnalysis = () => {
    if (selectedFiles.length === 0) {
      alert('Please select at least one file before starting analysis.');
      return;
    }

    setIsAnalyzing(true);
    setShowFileModal(false);

    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setIsComplete(true);
      
      // Randomly select insights to show
      const shuffled = [...sampleInsights].sort(() => 0.5 - Math.random());
      const selectedInsights = shuffled.slice(0, Math.min(selectedFiles.length * 2, shuffled.length));
      setExtractedInsights(selectedInsights);
    }, 3000);
  };

  const resetUpload = () => {
    setSelectedFiles([]);
    setIsAnalyzing(false);
    setIsComplete(false);
    setExtractedInsights([]);
  };

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body text-center">
              <h2 className="card-title mb-3">
                <i className="fas fa-upload me-2 text-primary"></i>
                Upload Performance Artifacts
              </h2>
              <p className="card-text text-muted">
                Select performance artifacts to analyze employee competencies using AI
              </p>
              <p className="card-text text-muted small">
                <i className="fas fa-info-circle me-2 text-secondary"></i>
                This is just a mock page to show the seamless process of converting evidence into insights.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body text-center">
              <div className="upload-area p-5 border-2 border-dashed border-secondary rounded">
                <i className="fas fa-cloud-upload-alt fa-3x text-muted mb-3"></i>
                <h5 className="mb-3">Select Performance Artifacts</h5>
                <p className="text-muted mb-3">
                  Click the button below to browse available artifacts
                </p>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => setShowFileModal(true)}
                  disabled={isAnalyzing}
                >
                  <i className="fas fa-folder-open me-2"></i>
                  Browse Artifacts
                </button>
                <p className="text-muted small mt-3 mb-0">
                  Available formats: PDF, Word, Excel, CSV, JSON
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="fas fa-file-alt me-2 text-primary"></i>
                  Selected Artifacts ({selectedFiles.length})
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  {selectedFiles.map((file) => (
                    <div key={file.id} className="col-md-6 col-lg-4 mb-3">
                      <div className="card h-100">
                        <div className="card-body">
                          <div className="d-flex align-items-start">
                            <div className="flex-shrink-0 me-3">
                              <i className="fas fa-file-alt fa-2x text-primary"></i>
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="card-title mb-1 text-truncate" title={file.name}>
                                {file.name}
                              </h6>
                              <p className="card-text small text-muted mb-2">
                                {file.size} • {file.type}
                              </p>
                              <p className="card-text small mb-0">
                                {file.description}
                              </p>
                            </div>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleFileSelect(file)}
                              title="Remove file"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
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

      {/* Analysis Controls */}
      {selectedFiles.length > 0 && !isComplete && (
        <div className="row mb-4">
          <div className="col-12 text-center">
            <button
              className="btn btn-success btn-lg"
              onClick={startAnalysis}
              disabled={isAnalyzing}
            >
              <i className="fas fa-robot me-2"></i>
              {isAnalyzing ? 'Analyzing...' : 'Start AI Analysis'}
            </button>
          </div>
        </div>
      )}

      {/* Analysis Progress */}
      {isAnalyzing && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="fas fa-robot me-2 text-primary"></i>
                  AI Analysis in Progress
                </h5>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="spinner-border text-primary me-3" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <div>
                    <p className="mb-0 fw-bold">Extracting insights from {selectedFiles.length} artifact(s)...</p>
                    <div className="progress mt-2" style={{ height: '8px' }}>
                      <div 
                        className="progress-bar progress-bar-striped progress-bar-animated" 
                        role="progressbar" 
                        style={{ width: '100%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Extracted Insights */}
      {isComplete && extractedInsights.length > 0 && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="fas fa-lightbulb me-2 text-success"></i>
                  Extracted Performance Insights
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  {extractedInsights.map((insight, index) => (
                    <div key={index} className="col-md-6 col-lg-4 mb-3">
                      <div className="card h-100 border-success">
                        <div className="card-body">
                          <div className="d-flex align-items-start">
                            <div className="flex-shrink-0 me-3">
                              <i className="fas fa-user-tie fa-2x text-success"></i>
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="card-title mb-1 text-success">
                                {insight.employeeName}
                              </h6>
                              <span className="badge bg-primary mb-2">
                                {insight.competency}
                              </span>
                              <p className="card-text small mb-2">
                                {insight.insight}
                              </p>
                              <small className="text-muted">
                                Source: {insight.source}
                              </small>
                            </div>
                          </div>
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

      {/* Success Message */}
      {isComplete && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="alert alert-success" role="alert">
              <h4 className="alert-heading">
                <i className="fas fa-check-circle me-2"></i>
                Analysis Complete!
              </h4>
              <p className="mb-3">
                The AI has successfully analyzed {selectedFiles.length} artifact(s) and extracted {extractedInsights.length} performance insights. 
                All relevant employees have been identified and their competencies mapped.
              </p>
              <hr />
              <p className="mb-0">
                You can now return to the team dashboard to view updated employee evaluations.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="row">
        <div className="col-12 text-center">
          <Link to="/" className="btn btn-primary btn-lg me-3">
            <i className="fas fa-arrow-left me-2"></i>
            Return to Team Dashboard
          </Link>
          {isComplete && (
            <button
              className="btn btn-outline-primary btn-lg"
              onClick={resetUpload}
            >
              <i className="fas fa-redo me-2"></i>
              Analyze More Artifacts
            </button>
          )}
        </div>
      </div>

      {/* File Selection Modal */}
      {showFileModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-folder-open me-2 text-primary"></i>
                  Select Performance Artifacts
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowFileModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  {fakeFiles.map((file) => {
                    const isSelected = selectedFiles.find(f => f.id === file.id);
                    return (
                      <div key={file.id} className="col-md-6 col-lg-4 mb-3">
                        <div 
                          className={`card h-100 cursor-pointer ${
                            isSelected ? 'border-primary bg-light' : ''
                          }`}
                          onClick={() => handleFileSelect(file)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="card-body">
                            <div className="d-flex align-items-start">
                              <div className="flex-shrink-0 me-3">
                                <i className={`fas fa-file-alt fa-2x ${
                                  isSelected ? 'text-primary' : 'text-muted'
                                }`}></i>
                              </div>
                              <div className="flex-grow-1">
                                <h6 className="card-title mb-1">{file.name}</h6>
                                <p className="card-text small text-muted mb-2">
                                  {file.size} • {file.type}
                                </p>
                                <p className="card-text small mb-0">
                                  {file.description}
                                </p>
                              </div>
                              {isSelected && (
                                <div className="flex-shrink-0">
                                  <i className="fas fa-check-circle text-primary"></i>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowFileModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setShowFileModal(false);
                    if (selectedFiles.length === 0) {
                      alert('Please select at least one artifact.');
                    }
                  }}
                >
                  Confirm Selection ({selectedFiles.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtifactUploadPage;
