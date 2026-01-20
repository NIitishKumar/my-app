/**
 * AttendanceChart Component
 * Chart visualization for attendance trends
 */

import React from 'react';
import type { MonthlyBreakdown } from '../types/attendance.types';
import { formatPercentage } from '../../../../shared/utils/attendance/attendance.formatters';

interface AttendanceChartProps {
  monthlyBreakdown: MonthlyBreakdown[];
  className?: string;
}

export const AttendanceChart: React.FC<AttendanceChartProps> = ({
  monthlyBreakdown,
  className = '',
}) => {
  if (!monthlyBreakdown || monthlyBreakdown.length === 0) {
    return (
      <div className={`bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-500 ${className}`}>
        <p>No chart data available</p>
      </div>
    );
  }

  const maxPercentage = Math.max(
    ...monthlyBreakdown.map((m) => m.attendanceRate),
    100
  );

  const getColorClass = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-600';
    if (percentage >= 75) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Trends</h3>
      <div className="space-y-3">
        {monthlyBreakdown.map((month) => {
          const percentage = month.attendanceRate;
          const widthPercentage = (percentage / maxPercentage) * 100;
          const colorClass = getColorClass(percentage);

          return (
            <div key={month.month} className="flex items-center gap-3">
              <div className="w-20 text-xs font-medium text-gray-600 flex-shrink-0">
                {month.month}
              </div>
              <div className="flex-1 min-w-0">
                <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                  <div
                    className={`${colorClass} h-6 flex items-center justify-end pr-2 transition-all duration-500`}
                    style={{ width: `${Math.min(widthPercentage, 100)}%` }}
                  >
                    <span className="text-xs font-semibold text-white">
                      {formatPercentage(percentage)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-16 text-xs text-gray-600 text-right flex-shrink-0">
                {month.presentDays}/{month.totalDays}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

