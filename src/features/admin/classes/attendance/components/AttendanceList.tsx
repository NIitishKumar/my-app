/**
 * AttendanceList Component
 * Table/list view of attendance records
 */

import { useState, useMemo } from 'react';
import { useClassAttendance } from '../hooks/useClassAttendance';
import { useDeleteAttendance } from '../hooks/useMarkAttendance';
import { formatAttendanceDate, sortByDate, filterByDateRange, filterByLecture } from '../utils/attendance.utils';
import { useUIStore } from '../../../../../store/ui.store';
import type { AttendanceRecord, AttendanceStatus } from '../types/attendance.types';

interface AttendanceListProps {
  classId: string;
  onEdit?: (record: AttendanceRecord) => void;
}

export const AttendanceList = ({ classId, onEdit }: AttendanceListProps) => {
  const [dateFilter, setDateFilter] = useState<'all' | 'week' | 'month' | 'custom'>('month');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [lectureFilter, setLectureFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<AttendanceStatus | 'all'>('all');
  const [sortAscending, setSortAscending] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: allRecords = [], isLoading, error } = useClassAttendance(classId);
  const deleteAttendance = useDeleteAttendance();
  const addToast = useUIStore((state) => state.addToast);

  const ITEMS_PER_PAGE = 10;

  // Apply filters
  const filteredRecords = useMemo(() => {
    let filtered = [...allRecords];

    // Date filter
    if (dateFilter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filterByDateRange(filtered, weekAgo, new Date());
    } else if (dateFilter === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filtered = filterByDateRange(filtered, monthAgo, new Date());
    } else if (dateFilter === 'custom' && startDate && endDate) {
      filtered = filterByDateRange(
        filtered,
        new Date(startDate),
        new Date(endDate)
      );
    }

    // Lecture filter
    if (lectureFilter) {
      filtered = filterByLecture(filtered, lectureFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((record) =>
        record.students.some((student) => student.status === statusFilter)
      );
    }

    // Sort
    filtered = sortByDate(filtered, sortAscending);

    return filtered;
  }, [allRecords, dateFilter, startDate, endDate, lectureFilter, statusFilter, sortAscending]);

  // Pagination
  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRecords.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredRecords, currentPage]);

  const totalPages = Math.ceil(filteredRecords.length / ITEMS_PER_PAGE);

  // Get unique lectures for filter
  const uniqueLectures = useMemo(() => {
    const lectures = new Set<string>();
    allRecords.forEach((record) => {
      if (record.lectureId && record.lectureTitle) {
        lectures.add(record.lectureId);
      }
    });
    return Array.from(lectures).map((id) => {
      const record = allRecords.find((r) => r.lectureId === id);
      return { id, title: record?.lectureTitle || id };
    });
  }, [allRecords]);

  const handleDelete = async (record: AttendanceRecord) => {
    if (!confirm(`Are you sure you want to delete attendance record for ${formatAttendanceDate(record.date)}?`)) {
      return;
    }

    try {
      await deleteAttendance.mutateAsync({
        classId: record.classId,
        recordId: record.id,
      });
      addToast({
        type: 'success',
        message: 'Attendance record deleted successfully',
        duration: 3000,
      });
    } catch (error) {
      addToast({
        type: 'error',
        message: `Error: ${error instanceof Error ? error.message : 'Failed to delete record'}`,
        duration: 5000,
      });
    }
  };

  const getStatusCounts = (record: AttendanceRecord) => {
    const counts = {
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
    };
    record.students.forEach((student) => {
      counts[student.status]++;
    });
    return counts;
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <p className="mt-2 text-gray-600">Loading attendance records...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        Error loading attendance: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900">Attendance Records</h3>
        <p className="text-sm text-gray-600 mt-1">
          {filteredRecords.length} record(s) found
        </p>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <select
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value as typeof dateFilter);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Time</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {dateFilter === 'custom' && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </>
          )}

          {uniqueLectures.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Lecture
              </label>
              <select
                value={lectureFilter}
                onChange={(e) => {
                  setLectureFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Lectures</option>
                {uniqueLectures.map((lecture) => (
                  <option key={lecture.id} value={lecture.id}>
                    {lecture.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as typeof statusFilter);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="excused">Excused</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setSortAscending(!sortAscending)}
            className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
          >
            <i className={`fas fa-sort-${sortAscending ? 'amount-up' : 'amount-down'}`}></i>
            <span>Sort: {sortAscending ? 'Oldest First' : 'Newest First'}</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {paginatedRecords.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <i className="fas fa-inbox text-4xl mb-3 text-gray-400"></i>
            <p>No attendance records found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lecture
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Students
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted By
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedRecords.map((record) => {
                const counts = getStatusCounts(record);
                return (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatAttendanceDate(record.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.lectureTitle || (
                        <span className="text-gray-400 italic">Daily</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-green-600 font-medium">
                          {counts.present}P
                        </span>
                        <span className="text-red-600 font-medium">
                          {counts.absent}A
                        </span>
                        {counts.late > 0 && (
                          <span className="text-yellow-600 font-medium">
                            {counts.late}L
                          </span>
                        )}
                        {counts.excused > 0 && (
                          <span className="text-blue-600 font-medium">
                            {counts.excused}E
                          </span>
                        )}
                        <span className="text-gray-500">
                          ({record.students.length} total)
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.submittedBy || (
                        <span className="text-gray-400">N/A</span>
                      )}
                      {record.submittedAt && (
                        <div className="text-xs text-gray-400">
                          {new Date(record.submittedAt).toLocaleTimeString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(record)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Edit"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(record)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                          disabled={deleteAttendance.isPending}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to{' '}
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredRecords.length)} of{' '}
            {filteredRecords.length} results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <span className="px-3 py-2 text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium ${
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

