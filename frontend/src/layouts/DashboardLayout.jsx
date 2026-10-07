import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Dynamic Page Content (This is where Dashboard, Evidence, etc. render) */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet /> 
      </main>
    </div>
  );
}