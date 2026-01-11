/**
 * QuickMarkCard Component
 * Card for quick attendance marking for a class
 */

import { Link } from 'react-router-dom';
import type { UpcomingClassItem } from '../types/attendance.types';

interface QuickMarkCardProps {
  classItem: UpcomingClassItem;
  onQuickMark?: (classId: string) => void;
}

export const QuickMarkCard = ({ classItem, onQuickMark }: QuickMarkCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{classItem.className}</h3>
          <p className="text-sm text-gray-600 mb-2">
            <i className="fas fa-clock mr-2"></i>
            {classItem.scheduledTime}
          </p>
          <div className="flex items-center">
            {classItem.hasAttendance ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <i className="fas fa-check-circle mr-1"></i>
                Marked
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <i className="fas fa-exclamation-circle mr-1"></i>
                Pending
              </span>
            )}
          </div>
        </div>
        <div className="ml-4">
          {!classItem.hasAttendance && (
            <button
              onClick={() => onQuickMark?.(classItem.classId)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <i className="fas fa-check mr-2"></i>
              Mark Now
            </button>
          )}
          <Link
            to={`/teacher/classes/${classItem.classId}/attendance`}
            className="ml-2 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <i className="fas fa-eye mr-2"></i>
            View
          </Link>
        </div>
      </div>
    </div>
  );
};

