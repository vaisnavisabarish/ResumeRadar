import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Upload from './pages/Upload/Upload';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import Evidence from './pages/Evidence/Evidence';
import Gaps from './pages/Gaps/Gaps';
import RoleAnalyzer from './pages/RoleAnalyzer/RoleAnalyzer';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* DashboardLayout now wraps EVERYTHING, making it a common layout */}
        <Route path="/" element={<DashboardLayout />}>
          
          {/* Default screen when you load the app */}
          <Route index element={<Upload />} /> 
          
          {/* The rest of your screens */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="evidence" element={<Evidence />} />
          <Route path="gaps" element={<Gaps />} />
          <Route path="role-analyzer" element={<RoleAnalyzer />} />
        
        </Route>
      </Routes>
    </BrowserRouter>
  );
}