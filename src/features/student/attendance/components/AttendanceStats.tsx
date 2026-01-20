/**
 * AttendanceStats Component
 * Display attendance statistics with overall percentage and breakdown
 */

import React from 'react';
import type { AttendanceStatistics } from '../types/attendance.types';
import { formatPercentage } from '../../../../shared/utils/attendance/attendance.formatters';

interface AttendanceStatsProps {
  stats: AttendanceStatistics;
  className?: string;
}

export const AttendanceStats: React.FC<AttendanceStatsProps> = ({
  stats,
  className = '',
}) => {
  const { overall, monthlyBreakdown, classWiseBreakdown } = stats;

  const getTrendIcon = () => {
    switch (overall.trend) {
      case 'improving':
        return 'fa-arrow-up text-green-500';
      case 'declining':
        return 'fa-arrow-down text-red-500';
      default:
        return 'fa-minus text-gray-400';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overall Statistics */}
      <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Overall Attendance</h3>
          <i className={`fas ${getTrendIcon()} text-xl`}></i>
        </div>
        <div className="flex items-baseline gap-3 mb-4">
          <span className="text-5xl font-bold">{formatPercentage(overall.attendanceRate)}</span>
          <span className="text-sm opacity-90">
            {overall.trend === 'improving' && 'Improving'}
            {overall.trend === 'declining' && 'Declining'}
            {overall.trend === 'stable' && 'Stable'}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          <div>
            <p className="text-xs opacity-90 mb-1">Present</p>
            <p className="text-2xl font-bold">{overall.presentDays}</p>
          </div>
          <div>
            <p className="text-xs opacity-90 mb-1">Absent</p>
            <p className="text-2xl font-bold">{overall.absentDays}</p>
          </div>
          <div>
            <p className="text-xs opacity-90 mb-1">Late</p>
            <p className="text-2xl font-bold">{overall.lateDays}</p>
          </div>
          <div>
            <p className="text-xs opacity-90 mb-1">Total</p>
            <p className="text-2xl font-bold">{overall.totalDays}</p>
          </div>
        </div>
      </div>

      {/* Monthly Breakdown */}
      {monthlyBreakdown.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Breakdown</h3>
          <div className="space-y-3">
            {monthlyBreakdown.map((month) => {
              const width = Math.min(month.attendanceRate, 100);
              const colorClass =
                month.attendanceRate >= 90
                  ? 'bg-green-500'
                  : month.attendanceRate >= 75
                  ? 'bg-yellow-500'
                  : 'bg-red-500';

              return (
                <div key={month.month} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">{month.month}</span>
                    <span className="text-gray-600">{formatPercentage(month.attendanceRate)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`${colorClass} h-3 transition-all duration-500`}
                      style={{ width: `${width}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Class-wise Breakdown */}
      {classWiseBreakdown.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Class-wise Breakdown</h3>
          <div className="space-y-3">
            {classWiseBreakdown.map((classItem) => {
              const width = Math.min(classItem.attendanceRate, 100);
              const colorClass =
                classItem.attendanceRate >= 90
                  ? 'bg-indigo-500'
                  : classItem.attendanceRate >= 75
                  ? 'bg-yellow-500'
                  : 'bg-red-500';

              return (
                <div key={classItem.classId} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">{classItem.className}</span>
                    <span className="text-gray-600">
                      {formatPercentage(classItem.attendanceRate)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`${colorClass} h-3 transition-all duration-500`}
                      style={{ width: `${width}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

