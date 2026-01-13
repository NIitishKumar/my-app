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
    <div className="p-3 sm:p-4 lg:p-6 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 break-words">
          Welcome back, {user?.name || 'Teacher'}!
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">Here's an overview of your classes and activities</p>
      </div>

      {/* Statistics Cards */}
      <div className="mb-4 sm:mb-6">
        <DashboardStats />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
        {/* Today's Classes */}
        <div className="lg:col-span-2 min-w-0">
          <TodaysClasses />
        </div>

        {/* Attendance Chart */}
        <div className="min-w-0">
          <AttendanceChart />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-4 sm:mb-6">
        <RecentActivity />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          <button
            onClick={() => navigate('/teacher/classes')}
            className="p-3 sm:p-4 border-2 border-indigo-200 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-all text-left w-full"
          >
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-2 bg-indigo-100 rounded-lg flex-shrink-0">
                <i className="fas fa-chalkboard-teacher text-indigo-600 text-lg sm:text-xl"></i>
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-gray-900 text-sm sm:text-base truncate">My Classes</div>
                <div className="text-xs sm:text-sm text-gray-600">View all assigned classes</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/teacher/attendance')}
            className="p-3 sm:p-4 border-2 border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all text-left w-full"
          >
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                <i className="fas fa-clipboard-check text-green-600 text-lg sm:text-xl"></i>
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-gray-900 text-sm sm:text-base truncate">Mark Attendance</div>
                <div className="text-xs sm:text-sm text-gray-600">Record attendance for classes</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/teacher/queries')}
            className="p-3 sm:p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all text-left w-full sm:col-span-2 md:col-span-1"
          >
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                <i className="fas fa-comments text-blue-600 text-lg sm:text-xl"></i>
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-gray-900 text-sm sm:text-base truncate">Queries</div>
                <div className="text-xs sm:text-sm text-gray-600">View and respond to queries</div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
