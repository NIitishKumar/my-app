/**
 * AttendanceHistory Component
 * List/table view of attendance records
 */

import React from 'react';
import { AttendanceStatusBadge } from '../../../../shared/components/attendance/AttendanceStatusBadge';
import { formatDate } from '../../../../shared/utils/attendance/attendance.formatters';
import type { StudentAttendanceRecord } from '../types/attendance.types';

interface AttendanceHistoryProps {
  records: StudentAttendanceRecord[];
  isLoading?: boolean;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  totalPages?: number;
  className?: string;
}

export const AttendanceHistory: React.FC<AttendanceHistoryProps> = ({
  records,
  isLoading = false,
  onPageChange,
  currentPage = 1,
  totalPages = 1,
  className = '',
}) => {
  if (isLoading) {
    return (
      <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!records || records.length === 0) {
    return (
      <div className={`bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-500 ${className}`}>
        <i className="fas fa-calendar-times text-4xl mb-3 text-gray-400"></i>
        <p>No attendance records found</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${className}`}>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Class
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Remarks
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {records.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(record.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {record.className}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <AttendanceStatusBadge status={record.status} size="sm" />
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {record.remarks || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-gray-200">
        {records.map((record) => (
          <div key={record.id} className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm font-medium text-gray-900">{formatDate(record.date)}</p>
                <p className="text-xs text-gray-500 mt-1">{record.className}</p>
              </div>
              <AttendanceStatusBadge status={record.status} size="sm" />
            </div>
            {record.remarks && (
              <p className="text-xs text-gray-600 mt-2">{record.remarks}</p>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && onPageChange && (
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

