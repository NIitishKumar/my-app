import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { ROUTES } from '../constants';

const teacherMenuItems = [
  { path: ROUTES.TEACHER_DASHBOARD, label: 'Dashboard' },
  { path: ROUTES.TEACHER_ATTENDANCE, label: 'Attendance' },
  { path: ROUTES.TEACHER_QUERIES, label: 'Queries' },
];

export const TeacherLayout = () => {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar items={teacherMenuItems} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Teacher Panel" userName={user?.name} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

