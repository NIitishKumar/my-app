import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { ROUTES } from '../constants';

const parentMenuItems = [
  { path: ROUTES.PARENT_DASHBOARD, label: 'Dashboard' },
  { path: ROUTES.PARENT_ATTENDANCE, label: 'Attendance' },
  { path: ROUTES.PARENT_RECORDS, label: 'Academic Records' },
];

export const ParentLayout = () => {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar items={parentMenuItems} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Parent Panel" userName={user?.name} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

