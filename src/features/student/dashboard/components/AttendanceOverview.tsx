/**
 * Attendance Overview Component
 * Attendance statistics and chart for student dashboard
 */

import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAttendanceStats } from '../hooks/useDashboard';
import { DashboardStatsSkeleton } from '../../../../shared/components/skeletons';

const getAttendanceColor = (percentage: number) => {
  if (percentage >= 90) return 'bg-green-600';
  if (percentage >= 75) return 'bg-yellow-600';
  return 'bg-red-600';
};

const getStatusColor = (status: 'present' | 'absent' | 'late') => {
  switch (status) {
    case 'present':
      return 'bg-green-100 text-green-700 border-green-300';
    case 'absent':
      return 'bg-red-100 text-red-700 border-red-300';
    case 'late':
      return 'bg-yellow-100 text-yellow-700 border-yellow-300';
  }
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const AttendanceOverview = () => {
  const navigate = useNavigate();
  const { data: attendance, isLoading } = useAttendanceStats();

  const maxPercentage = useMemo(() => {
    if (!attendance) return 100;
    return Math.max(...attendance.monthlyData.map((d) => d.percentage), 100);
  }, [attendance]);

  if (isLoading) {
    return <DashboardStatsSkeleton />;
  }

  if (!attendance) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <i className="fas fa-chart-line text-indigo-600 flex-shrink-0"></i>
          <span className="truncate">Attendance Overview</span>
        </h2>
        <button
          onClick={() => navigate('#attendance')}
          className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-700 font-medium whitespace-nowrap flex-shrink-0"
        >
          View Details →
        </button>
      </div>

      {/* Overall Percentage */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-baseline gap-2 mb-2">
          <p className="text-3xl sm:text-4xl font-bold text-gray-900">
            {attendance.overallPercentage.toFixed(1)}%
          </p>
          {attendance.trend && (
            <i
              className={`fas ${
                attendance.trend === 'up' ? 'fa-arrow-up' : attendance.trend === 'down' ? 'fa-arrow-down' : 'fa-minus'
              } text-sm ${
                attendance.trend === 'up' ? 'text-green-500' : attendance.trend === 'down' ? 'text-red-500' : 'text-gray-400'
              }`}
            ></i>
          )}
        </div>
        <p className="text-sm text-gray-600">Overall Attendance Rate</p>
      </div>

      {/* Monthly Chart */}
      <div className="mb-4 sm:mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Monthly Breakdown</h3>
        <div className="space-y-2">
          {attendance.monthlyData.map((month) => {
            const percentage = month.percentage;
            const widthPercentage = (percentage / maxPercentage) * 100;
            const colorClass = getAttendanceColor(percentage);

            return (
              <div key={month.month} className="flex items-center gap-3">
                <div className="w-12 text-xs font-medium text-gray-600 flex-shrink-0">{month.month}</div>
                <div className="flex-1 min-w-0">
                  <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                    <div
                      className={`${colorClass} h-6 flex items-center justify-end pr-2 transition-all`}
                      style={{ width: `${Math.min(widthPercentage, 100)}%` }}
                    >
                      <span className="text-xs font-semibold text-white">{percentage}%</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Records */}
      {attendance.recentRecords.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Recent Attendance</h3>
          <div className="space-y-2">
            {attendance.recentRecords.slice(0, 5).map((record, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-2 rounded-lg border ${getStatusColor(record.status)}`}
              >
                <div className="flex items-center gap-2">
                  <i
                    className={`fas ${
                      record.status === 'present'
                        ? 'fa-check-circle'
                        : record.status === 'absent'
                        ? 'fa-times-circle'
                        : 'fa-clock'
                    }`}
                  ></i>
                  <span className="text-sm font-medium">{formatDate(record.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs">{record.subject}</span>
                  <span className="text-xs font-semibold capitalize">{record.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

