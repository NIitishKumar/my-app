/**
 * Student Dashboard Component
 * Comprehensive dashboard for students
 */

import { useAuthStore, selectUser } from '../../../store';
import { DashboardStats } from './components/DashboardStats';
import { UpcomingExams } from './components/UpcomingExams';
import { AttendanceOverview } from './components/AttendanceOverview';
import { RecentNotifications } from './components/RecentNotifications';
import { AcademicPerformance } from './components/AcademicPerformance';
import { TodaysSchedule } from './components/TodaysSchedule';
import { QuickActions } from './components/QuickActions';

export const StudentDashboard = () => {
  const user = useAuthStore(selectUser);

  return (
    <div className="p-3 sm:p-4 lg:p-6 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 break-words">
          Welcome back, {user?.name || user?.firstName || 'Student'}!
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">Here's an overview of your academic progress</p>
      </div>

      {/* Statistics Cards */}
      <div className="mb-4 sm:mb-6">
        <DashboardStats />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
        {/* Upcoming Exams */}
        <div className="lg:col-span-2 min-w-0">
          <UpcomingExams />
        </div>

        {/* Today's Schedule */}
        <div className="min-w-0">
          <TodaysSchedule />
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
        {/* Attendance Overview */}
        <div className="lg:col-span-2 min-w-0">
          <AttendanceOverview />
        </div>

        {/* Academic Performance */}
        <div className="min-w-0">
          <AcademicPerformance />
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="mb-4 sm:mb-6">
        <RecentNotifications />
      </div>

      {/* Quick Actions */}
      <div className="mb-4 sm:mb-6">
        <QuickActions />
      </div>
    </div>
  );
};
