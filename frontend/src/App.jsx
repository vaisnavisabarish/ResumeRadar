import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome/Welcome';
import ApplicantLogin from './pages/Applicant/Applicant';
import RecruiterLogin from './pages/Recruiter/Recruiter';
import Upload from './pages/Upload/Upload';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import Evidence from './pages/Evidence/Evidence';
import Gaps from './pages/Gaps/Gaps';
import RoleAnalyzer from './pages/RoleAnalyzer/RoleAnalyzer';
import RecruiterDashboard from './pages/RecruiterDashboard/RecruiterDashboard'; // Create or link your recruiter dashboard here
import ResumeImprover from './pages/ResumeImprover/ResumeImprover'; // Create or link your resume improver page here
import Jobs from './pages/Jobs/Jobs'; // Create or link your jobs page here

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default Landing Portal Selection Screen */}
        <Route path="/" element={<Welcome />} />

        {/* Dedicated Login Portals with Google OAuth Simulation */}
        <Route path="/applicant/login" element={<ApplicantLogin />} />
        <Route path="/recruiter/login" element={<RecruiterLogin />} />

        {/* Recruiter Dashboard Route */}
        <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
        <Route path="/jobs" element={<Jobs />} />

        {/* Applicant Dashboard Layout & Nested Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="upload" element={<Upload />} />
          <Route path="evidence" element={<Evidence />} />
          <Route path="gaps" element={<Gaps />} />
          <Route path="role-analyzer" element={<RoleAnalyzer />} />
          <Route path="resume-improver" element={<ResumeImprover />} />
        </Route>

        {/* Fallback root upload route if accessed directly */}
        <Route element={<DashboardLayout />}>
          <Route path="/upload" element={<Upload />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}