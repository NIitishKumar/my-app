import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { ROUTES } from '../constants';

const studentMenuItems = [
  { path: ROUTES.STUDENT_DASHBOARD, label: 'Dashboard' },
  { path: ROUTES.STUDENT_EXAMS, label: 'Exams' },
  { path: ROUTES.STUDENT_NOTIFICATIONS, label: 'Notifications' },
  { path: ROUTES.STUDENT_RECORDS, label: 'Academic Records' },
];

export const StudentLayout = () => {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar items={studentMenuItems} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Student Panel" userName={user?.name} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

