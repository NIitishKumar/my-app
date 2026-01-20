/**
 * ChildAttendanceOverview Component
 * Overview card for a single child's attendance
 */

import React from 'react';
import { AttendanceStatusBadge } from '../../../../shared/components/attendance/AttendanceStatusBadge';
import { formatDate, formatPercentage } from '../../../../shared/utils/attendance/attendance.formatters';
import { getTrendIconClass } from '../utils/attendance.utils';
import type { ChildAttendanceSummary } from '../types/attendance.types';

interface ChildAttendanceOverviewProps {
  childAttendance: ChildAttendanceSummary;
  className?: string;
}

export const ChildAttendanceOverview: React.FC<ChildAttendanceOverviewProps> = ({
  childAttendance,
  className = '',
}) => {
  const { childName, className: childClassName, summary, recentRecords } = childAttendance;

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{childName}</h3>
          <p className="text-sm text-gray-600">{childClassName}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-gray-900">
              {formatPercentage(summary.attendanceRate)}
            </span>
            <i className={`fas ${getTrendIconClass(summary.trend)} text-xl`}></i>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {summary.presentDays} / {summary.totalDays} days
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-600 mb-1">Present</p>
          <p className="text-xl font-semibold text-green-600">{summary.presentDays}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Absent</p>
          <p className="text-xl font-semibold text-red-600">{summary.absentDays}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Late</p>
          <p className="text-xl font-semibold text-yellow-600">{summary.lateDays}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Excused</p>
          <p className="text-xl font-semibold text-blue-600">{summary.excusedDays}</p>
        </div>
      </div>

      {recentRecords.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Records</h4>
          <div className="space-y-2">
            {recentRecords.slice(0, 3).map((record, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
              >
                <span className="text-sm text-gray-700">{formatDate(record.date)}</span>
                <AttendanceStatusBadge status={record.status} size="sm" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

