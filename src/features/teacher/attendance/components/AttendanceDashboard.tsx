/**
 * AttendanceDashboard Component
 * Overview dashboard with quick stats, pending attendance, and recent activity
 */

import { useAttendanceDashboard } from '../hooks/useAttendanceDashboard';
import { PendingAttendanceList } from './PendingAttendanceList';
import { RecentActivity } from './RecentActivity';
import { formatPercentage } from '../utils/attendance.utils';

interface AttendanceDashboardProps {
  onMarkAttendance?: (classId: string) => void;
}

export const AttendanceDashboard = ({ onMarkAttendance }: AttendanceDashboardProps) => {
  const { data: dashboardData, isLoading, error } = useAttendanceDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <i className="fas fa-exclamation-circle text-red-500 text-4xl mb-4"></i>
        <p className="text-red-800 font-medium">Failed to load dashboard data</p>
        <p className="text-sm text-red-600 mt-1">Please try again later</p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-12">
        <i className="fas fa-inbox text-gray-400 text-4xl mb-4"></i>
        <p className="text-gray-600 font-medium">No dashboard data available</p>
      </div>
    );
  }

  const pendingRate = dashboardData.totalClasses > 0
    ? formatPercentage((dashboardData.pendingAttendance / dashboardData.totalClasses) * 100)
    : '0%';

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Classes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-indigo-100 rounded-lg p-3">
              <i className="fas fa-chalkboard-teacher text-indigo-600 text-2xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Classes</p>
              <p className="text-2xl font-semibold text-gray-900">{dashboardData.totalClasses}</p>
            </div>
          </div>
        </div>

        {/* Pending Attendance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-100 rounded-lg p-3">
              <i className="fas fa-clock text-yellow-600 text-2xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">
                {dashboardData.pendingAttendance}
              </p>
              <p className="text-xs text-gray-500 mt-1">{pendingRate} of classes</p>
            </div>
          </div>
        </div>

        {/* Today's Attendance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
              <i className="fas fa-check-circle text-green-600 text-2xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Marked Today</p>
              <p className="text-2xl font-semibold text-gray-900">
                {dashboardData.todayAttendance}
              </p>
              <p className="text-xs text-gray-500 mt-1">Classes with attendance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Attendance List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending Attendance</h2>
          <PendingAttendanceList onClassSelect={onMarkAttendance} />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <RecentActivity activities={dashboardData.recentActivity} />
        </div>
      </div>

      {/* Upcoming Classes (if any) */}
      {dashboardData.upcomingClasses.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Classes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboardData.upcomingClasses.map((classItem) => (
              <div
                key={classItem.classId}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="font-medium text-gray-900 mb-1">{classItem.className}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  <i className="fas fa-clock mr-2"></i>
                  {classItem.scheduledTime}
                </p>
                {classItem.hasAttendance ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <i className="fas fa-check-circle mr-1"></i>
                    Marked
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <i className="fas fa-exclamation-circle mr-1"></i>
                    Pending
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

