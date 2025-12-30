/**
 * TeacherDashboard Component
 * Enhanced dashboard with comprehensive statistics and overview
 */

import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/auth.store';
import { DashboardStats } from './components/DashboardStats';
import { TodaysClasses } from './components/TodaysClasses';
import { RecentActivity } from './components/RecentActivity';
import { AttendanceChart } from './components/AttendanceChart';

export const TeacherDashboard = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
          Welcome back, {user?.name || 'Teacher'}!
        </h1>
        <p className="text-sm text-gray-600 mt-1">Here's an overview of your classes and activities</p>
      </div>

      {/* Statistics Cards */}
      <div className="mb-6">
        <DashboardStats />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Today's Classes */}
        <div className="lg:col-span-2">
          <TodaysClasses />
        </div>

        {/* Attendance Chart */}
        <div>
          <AttendanceChart />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-6">
        <RecentActivity />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/teacher/classes')}
            className="p-4 border-2 border-indigo-200 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-all text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <i className="fas fa-chalkboard-teacher text-indigo-600 text-xl"></i>
              </div>
              <div>
                <div className="font-semibold text-gray-900">My Classes</div>
                <div className="text-sm text-gray-600">View all assigned classes</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/teacher/attendance')}
            className="p-4 border-2 border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <i className="fas fa-clipboard-check text-green-600 text-xl"></i>
              </div>
              <div>
                <div className="font-semibold text-gray-900">Mark Attendance</div>
                <div className="text-sm text-gray-600">Record attendance for classes</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/teacher/queries')}
            className="p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <i className="fas fa-comments text-blue-600 text-xl"></i>
              </div>
              <div>
                <div className="font-semibold text-gray-900">Queries</div>
                <div className="text-sm text-gray-600">View and respond to queries</div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
