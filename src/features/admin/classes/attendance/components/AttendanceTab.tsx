/**
 * AttendanceTab Component
 * Tab component for ClassDetailsPage with summary and quick actions
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClassAttendance } from '../hooks/useClassAttendance';
import { useAttendanceStats } from '../hooks/useAttendanceStats';
import { AttendanceStats } from './AttendanceStats';
import { AttendanceList } from './AttendanceList';
import { formatAttendanceDate, sortByDate } from '../utils/attendance.utils';

interface AttendanceTabProps {
  classId: string;
  className?: string;
}

export const AttendanceTab = ({ classId }: AttendanceTabProps) => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'summary' | 'records'>('summary');
  const { data: allRecords = [], isLoading } = useClassAttendance(classId);
  useAttendanceStats(classId);

  // Get recent records (last 5)
  const recentRecords = sortByDate(allRecords, false).slice(0, 5);

  const handleMarkAttendance = () => {
    navigate(`/admin/classes/${classId}/attendance?action=mark`);
  };

  const handleViewAll = () => {
    navigate(`/admin/classes/${classId}/attendance`);
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <p className="mt-2 text-gray-600">Loading attendance data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2 sm:space-x-3 overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0">
          <button
            onClick={() => setActiveView('summary')}
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap shrink-0 ${
              activeView === 'summary'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <i className="fas fa-chart-bar mr-1.5 sm:mr-2"></i>
            Summary
          </button>
          <button
            onClick={() => setActiveView('records')}
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap shrink-0 ${
              activeView === 'records'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <i className="fas fa-list mr-1.5 sm:mr-2"></i>
            Records
          </button>
        </div>
        <div className="flex items-center gap-2 sm:space-x-3 overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0">
          <button
            onClick={handleMarkAttendance}
            className="px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium text-sm hover:bg-indigo-700 transition-colors flex items-center space-x-2 whitespace-nowrap shrink-0"
          >
            <i className="fas fa-plus"></i>
            <span>Mark Attendance</span>
          </button>
          <button
            onClick={handleViewAll}
            className="px-3 sm:px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors flex items-center space-x-2 whitespace-nowrap shrink-0"
          >
            <i className="fas fa-external-link-alt"></i>
            <span>View All</span>
          </button>
        </div>
      </div>

      {/* Summary View */}
      {activeView === 'summary' && (
        <div className="space-y-6">
          <AttendanceStats classId={classId} />

          {/* Recent Records */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Attendance</h3>
              <button
                onClick={handleViewAll}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                View All →
              </button>
            </div>
            {recentRecords.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <i className="fas fa-inbox text-4xl mb-3 text-gray-400"></i>
                <p>No attendance records yet</p>
                <button
                  onClick={handleMarkAttendance}
                  className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Mark First Attendance
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentRecords.map((record) => {
                  const presentCount = record.students.filter((s) => s.status === 'present').length;
                  const absentCount = record.students.filter((s) => s.status === 'absent').length;
                  return (
                    <div
                      key={record.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-semibold text-gray-900">
                              {formatAttendanceDate(record.date)}
                            </span>
                            {record.lectureTitle && (
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                {record.lectureTitle}
                              </span>
                            )}
                          </div>
                          <div className="mt-2 flex items-center space-x-4 text-xs text-gray-600">
                            <span className="text-green-600">
                              <i className="fas fa-check-circle mr-1"></i>
                              {presentCount} Present
                            </span>
                            <span className="text-red-600">
                              <i className="fas fa-times-circle mr-1"></i>
                              {absentCount} Absent
                            </span>
                            <span className="text-gray-500">
                              {record.students.length} Total
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => navigate(`/admin/classes/${classId}/attendance?record=${record.id}`)}
                          className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                        >
                          View →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Records View */}
      {activeView === 'records' && (
        <AttendanceList classId={classId} />
      )}
    </div>
  );
};

