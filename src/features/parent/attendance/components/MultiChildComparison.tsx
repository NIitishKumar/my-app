/**
 * MultiChildComparison Component
 */

import React from 'react';
import { formatPercentage } from '../../../../shared/utils/attendance/attendance.formatters';
import type { AttendanceComparison } from '../types/attendance.types';

interface MultiChildComparisonProps {
  comparison: AttendanceComparison;
  className?: string;
}

export const MultiChildComparison: React.FC<MultiChildComparisonProps> = ({
  comparison,
  className = '',
}) => {
  const { children, average } = comparison;

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Comparison</h3>
      
      <div className="space-y-4">
        {children.map((child) => {
          const width = Math.min(child.attendanceRate, 100);
          const colorClass =
            child.attendanceRate >= 90
              ? 'bg-green-500'
              : child.attendanceRate >= 75
              ? 'bg-yellow-500'
              : 'bg-red-500';

          return (
            <div key={child.childId} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">{child.childName}</span>
                <span className="text-gray-600">
                  {formatPercentage(child.attendanceRate)}
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

      {children.length > 1 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Average</span>
            <span className="text-lg font-semibold text-gray-900">
              {formatPercentage(average.attendanceRate)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

