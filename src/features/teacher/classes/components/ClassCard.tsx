/**
 * ClassCard Component
 * Card display for a class with quick stats
 */

import { useNavigate } from 'react-router-dom';
import type { TeacherClass, ClassSummary } from '../types/teacher-classes.types';

interface ClassCardProps {
  classData: TeacherClass | ClassSummary;
  onClick?: () => void;
}

export const ClassCard = ({ classData, onClick }: ClassCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/teacher/classes/${classData.id}`);
    }
  };

  const attendanceRate = 'attendanceRate' in classData ? classData.attendanceRate : undefined;
  const studentCount = 'studentCount' in classData ? classData.studentCount : ('enrolled' in classData ? classData.enrolled : 0);
  const subject = 'subject' in classData ? classData.subject : undefined;
  const lastAttendanceDate = 'lastAttendanceDate' in classData ? classData.lastAttendanceDate : undefined;

  const getAttendanceColor = (rate?: number | null) => {
    if (rate == null || isNaN(rate)) return 'text-gray-500';
    if (rate >= 90) return 'text-green-600';
    if (rate >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatLastAttendance = (date?: Date) => {
    if (!date) return 'Never';
    const today = new Date();
    const diffTime = today.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {classData.className}
          </h3>
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <span className="flex items-center space-x-1">
              <i className="fas fa-graduation-cap text-xs"></i>
              <span>Grade {classData.grade}</span>
            </span>
            {subject && (
              <span className="flex items-center space-x-1">
                <i className="fas fa-book text-xs"></i>
                <span>{subject}</span>
              </span>
            )}
            {'roomNo' in classData && classData.roomNo && (
              <span className="flex items-center space-x-1">
                <i className="fas fa-door-open text-xs"></i>
                <span>{classData.roomNo}</span>
              </span>
            )}
          </div>
        </div>
        <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${
          classData.isActive
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {classData.isActive ? 'Active' : 'Inactive'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-600 mb-1">Students</div>
          <div className="text-lg font-semibold text-gray-900 flex items-center space-x-1">
            <i className="fas fa-user-graduate text-indigo-600"></i>
            <span>{studentCount}</span>
          </div>
        </div>
        {attendanceRate != null && !isNaN(attendanceRate) && (
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-600 mb-1">Attendance</div>
            <div className={`text-lg font-semibold flex items-center space-x-1 ${getAttendanceColor(attendanceRate)}`}>
              <i className="fas fa-chart-line"></i>
              <span>{attendanceRate.toFixed(1)}%</span>
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span className="flex items-center space-x-1">
            <i className="fas fa-calendar-check"></i>
            <span>Last marked: {formatLastAttendance(lastAttendanceDate)}</span>
          </span>
          <span className="text-indigo-600 hover:text-indigo-700 font-medium">
            View Details →
          </span>
        </div>
      </div>
    </div>
  );
};

