/**
 * AttendanceStats Component
 * Summary cards and visual indicators for attendance statistics
 */

import { useAttendanceStats } from '../hooks/useAttendanceStats';
import type { AttendanceStats as AttendanceStatsType } from '../types/attendance.types';

interface AttendanceStatsProps {
  classId: string;
}

export const AttendanceStats = ({ classId }: AttendanceStatsProps) => {
  const { stats, isLoading, error } = useAttendanceStats(classId);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-600">
        Error loading statistics: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Days',
      value: stats.totalDays,
      icon: 'fa-calendar-alt',
      color: 'indigo',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      borderColor: 'border-indigo-200',
    },
    {
      label: 'Present Days',
      value: stats.presentDays,
      icon: 'fa-check-circle',
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      borderColor: 'border-green-200',
    },
    {
      label: 'Absent Days',
      value: stats.absentDays,
      icon: 'fa-times-circle',
      color: 'red',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      borderColor: 'border-red-200',
    },
    {
      label: 'Attendance Rate',
      value: `${stats.percentage.toFixed(1)}%`,
      icon: 'fa-chart-line',
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`bg-white rounded-xl shadow-sm border ${card.borderColor} p-6`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.label}</p>
                <p className={`mt-2 text-3xl font-bold ${card.textColor}`}>
                  {card.value}
                </p>
              </div>
              <div className={`${card.bgColor} p-3 rounded-lg`}>
                <i className={`fas ${card.icon} ${card.textColor} text-2xl`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Present</span>
              <span className="text-sm font-bold text-green-600">{stats.presentDays}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{
                  width: stats.totalDays > 0 ? `${(stats.presentDays / stats.totalDays) * 100}%` : '0%',
                }}
              ></div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Absent</span>
              <span className="text-sm font-bold text-red-600">{stats.absentDays}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-600 h-2 rounded-full"
                style={{
                  width: stats.totalDays > 0 ? `${(stats.absentDays / stats.totalDays) * 100}%` : '0%',
                }}
              ></div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Late</span>
              <span className="text-sm font-bold text-yellow-600">{stats.lateDays}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-600 h-2 rounded-full"
                style={{
                  width: stats.totalDays > 0 ? `${(stats.lateDays / stats.totalDays) * 100}%` : '0%',
                }}
              ></div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Excused</span>
              <span className="text-sm font-bold text-blue-600">{stats.excusedDays}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{
                  width: stats.totalDays > 0 ? `${(stats.excusedDays / stats.totalDays) * 100}%` : '0%',
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Overall Attendance Rate */}
        <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-indigo-900">Overall Attendance Rate</span>
            <span className="text-lg font-bold text-indigo-600">{stats.percentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-indigo-200 rounded-full h-3">
            <div
              className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(stats.percentage, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

