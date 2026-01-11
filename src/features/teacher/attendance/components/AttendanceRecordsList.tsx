/**
 * AttendanceRecordsList Component
 * Table/list view of attendance records with filters, pagination, and export
 */

import { useState, useMemo } from 'react';
import { useAttendanceRecords } from '../hooks/useAttendanceRecords';
import { useDeleteAttendance } from '../hooks/useDeleteAttendance';
import { AttendanceFilters } from './AttendanceFilters';
import { formatAttendanceDate, getStatusColorClass, exportToExcel, exportToCSV } from '../utils/attendance.utils';
import { ATTENDANCE_STATUS_OPTIONS } from '../constants/attendance.constants';
import { useUIStore } from '../../../../store/ui.store';
import type { AttendanceRecord, AttendanceFilters as AttendanceFiltersType } from '../types/attendance.types';

interface AttendanceRecordsListProps {
  onEdit?: (record: AttendanceRecord) => void;
  onView?: (record: AttendanceRecord) => void;
}

export const AttendanceRecordsList = ({ onEdit, onView }: AttendanceRecordsListProps) => {
  const [filters, setFilters] = useState<AttendanceFiltersType>({
    page: 1,
    limit: 20,
  });
  const [sortField, setSortField] = useState<'date' | 'className'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { data: recordsResponse, isLoading, error } = useAttendanceRecords(filters);
  const deleteAttendance = useDeleteAttendance();
  const addToast = useUIStore((state) => state.addToast);

  // Sort records
  const sortedRecords = useMemo(() => {
    if (!recordsResponse?.data) return [];
    const records = [...recordsResponse.data];
    return records.sort((a, b) => {
      let aValue: any, bValue: any;
      if (sortField === 'date') {
        aValue = new Date(a.date).getTime();
        bValue = new Date(b.date).getTime();
      } else {
        aValue = a.className || '';
        bValue = b.className || '';
      }
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });
  }, [recordsResponse, sortField, sortOrder]);

  const handleSort = (field: 'date' | 'className') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleDelete = async (record: AttendanceRecord) => {
    if (!confirm(`Are you sure you want to delete attendance for ${formatAttendanceDate(record.date)}?`)) {
      return;
    }

    try {
      await deleteAttendance.mutateAsync({
        classId: record.classId,
        recordId: record.id,
      });
      addToast({ type: 'success', message: 'Attendance record deleted successfully', duration: 3000 });
    } catch (error: any) {
      addToast({ type: 'error', message: error?.message || 'Failed to delete attendance record', duration: 5000 });
    }
  };

  const handleExport = (format: 'excel' | 'csv') => {
    if (!recordsResponse?.data || recordsResponse.data.length === 0) {
      addToast({ type: 'error', message: 'No records to export', duration: 3000 });
      return;
    }

    try {
      if (format === 'excel') {
        exportToExcel(recordsResponse.data);
        addToast({ type: 'success', message: 'Export to Excel completed', duration: 3000 });
      } else {
        exportToCSV(recordsResponse.data);
        addToast({ type: 'success', message: 'Export to CSV completed', duration: 3000 });
      }
    } catch (error: any) {
      addToast({ type: 'error', message: error?.message || 'Export failed', duration: 5000 });
    }
  };

  const handleFiltersChange = (newFilters: AttendanceFiltersType) => {
    setFilters({ ...newFilters, page: 1, limit: filters.limit || 20 });
  };

  const handleFiltersReset = () => {
    setFilters({ page: 1, limit: 20 });
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <i className="fas fa-exclamation-circle text-red-500 text-4xl mb-4"></i>
        <p className="text-red-800 font-medium">Failed to load attendance records</p>
        <p className="text-sm text-red-600 mt-1">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <AttendanceFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleFiltersReset}
      />

      {/* Export and Actions */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600">
            {recordsResponse ? `Showing ${sortedRecords.length} of ${recordsResponse.count} records` : 'Loading...'}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleExport('csv')}
            disabled={isLoading || !recordsResponse?.data || recordsResponse.data.length === 0}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-file-csv mr-2"></i>
            Export CSV
          </button>
          <button
            onClick={() => handleExport('excel')}
            disabled={isLoading || !recordsResponse?.data || recordsResponse.data.length === 0}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-file-excel mr-2"></i>
            Export Excel
          </button>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      ) : sortedRecords.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <i className="fas fa-inbox text-gray-400 text-4xl mb-4"></i>
          <p className="text-gray-600 font-medium">No attendance records found</p>
          <p className="text-sm text-gray-500 mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    onClick={() => handleSort('date')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Date
                    {sortField === 'date' && (
                      <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'} ml-2`}></i>
                    )}
                  </th>
                  <th
                    onClick={() => handleSort('className')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Class
                    {sortField === 'className' && (
                      <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'} ml-2`}></i>
                    )}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Students
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status Breakdown
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedRecords.map((record) => {
                  const statusCounts = record.students.reduce(
                    (acc, student) => {
                      acc[student.status] = (acc[student.status] || 0) + 1;
                      return acc;
                    },
                    {} as Record<string, number>
                  );

                  return (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatAttendanceDate(record.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.className}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          record.type === 'lecture' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {record.type === 'lecture' ? 'Lecture' : 'Date'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.students.length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {ATTENDANCE_STATUS_OPTIONS.map((option) => {
                            const count = statusCounts[option.value] || 0;
                            if (count === 0) return null;
                            return (
                              <span
                                key={option.value}
                                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${option.bgColor} ${option.textColor}`}
                              >
                                {option.label}: {count}
                              </span>
                            );
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {onView && (
                            <button
                              onClick={() => onView(record)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                          )}
                          {onEdit && !record.isLocked && (
                            <button
                              onClick={() => onEdit(record)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                          )}
                          {!record.isLocked && (
                            <button
                              onClick={() => handleDelete(record)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          )}
                          {record.isLocked && (
                            <span className="text-gray-400" title="Record is locked">
                              <i className="fas fa-lock"></i>
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {recordsResponse && recordsResponse.totalPages > 1 && (
            <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
                  disabled={filters.page === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
                  disabled={filters.page === recordsResponse.totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing page <span className="font-medium">{recordsResponse.page}</span> of{' '}
                    <span className="font-medium">{recordsResponse.totalPages}</span>
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
                      disabled={filters.page === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      {recordsResponse.page} / {recordsResponse.totalPages}
                    </span>
                    <button
                      onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
                      disabled={filters.page === recordsResponse.totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

