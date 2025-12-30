/**
 * RecentActivity Component
 * Shows recent attendance records and activity
 */

import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTeacherClasses } from '../../classes/hooks/useTeacherClasses';
import { useClassAttendance } from '../../../admin/classes/attendance/hooks/useClassAttendance';
import { formatAttendanceDate, sortByDate } from '../../../admin/classes/attendance/utils/attendance.utils';

export const RecentActivity = () => {
  const navigate = useNavigate();
  const { data: classes = [] } = useTeacherClasses();

  // Get attendance records from all classes
  const allAttendanceRecords = useMemo(() => {
    const records: Array<{ record: any; className: string; classId: string }> = [];
    // For now, we'll show a simplified version
    // In a real implementation, you'd fetch attendance for all classes
    return records;
  }, [classes]);

  // Sort by date and get recent 5
  const recentRecords = useMemo(() => {
    return sortByDate(
      allAttendanceRecords.map((r) => r.record),
      false
    ).slice(0, 5);
  }, [allAttendanceRecords]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <i className="fas fa-history text-indigo-600"></i>
          <span>Recent Activity</span>
        </h2>
      </div>

      {recentRecords.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <i className="fas fa-inbox text-4xl mb-3 text-gray-400"></i>
          <p>No recent activity</p>
          <p className="text-xs text-gray-400 mt-1">Attendance records will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentRecords.map((record) => {
            const presentCount = record.students.filter((s: any) => s.status === 'present').length;
            const classInfo = allAttendanceRecords.find((r) => r.record.id === record.id);
            return (
              <div
                key={record.id}
                className="p-3 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer"
                onClick={() => {
                  if (classInfo) {
                    navigate(`/teacher/classes/${classInfo.classId}/attendance?record=${record.id}`);
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {classInfo?.className || 'Class'}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {formatAttendanceDate(record.date)} • {presentCount} present
                    </div>
                  </div>
                  <i className="fas fa-chevron-right text-gray-400"></i>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

