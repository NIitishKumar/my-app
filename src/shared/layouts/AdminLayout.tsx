import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { ROUTES } from '../constants';

const adminMenuItems = [
  { path: ROUTES.ADMIN_DASHBOARD, label: 'Dashboard' },
  { path: ROUTES.ADMIN_CLASSES, label: 'Classes' },
  { path: ROUTES.ADMIN_TEACHERS, label: 'Teachers' },
  { path: ROUTES.ADMIN_LECTURES, label: 'Lectures' },
];

export const AdminLayout = () => {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar items={adminMenuItems} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Admin Panel" userName={user?.name} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

