import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';

export default function DashboardLayout() {
  return (
    <div className="candidate-workspace">
      <Sidebar />
      <main id="candidate-content" className="candidate-main" tabIndex={-1}>
        <div className="candidate-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
