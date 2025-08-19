import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TeamDashboard from './pages/TeamDashboard';
import ArtifactUploadPage from './pages/ArtifactUploadPage';
import EmployeeDashboard from './pages/EmployeeDashboard';
import Footer from './components/ui/Footer';

function App() {
  return (
    <Router>
      <div className="App d-flex flex-column min-vh-100">
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<TeamDashboard />} />
            <Route path="/upload" element={<ArtifactUploadPage />} />
            <Route path="/dashboard/:employeeId" element={<EmployeeDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
