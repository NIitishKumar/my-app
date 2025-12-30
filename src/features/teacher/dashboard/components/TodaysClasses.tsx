/**
 * TodaysClasses Component
 * Shows today's scheduled classes with quick actions
 */

import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTeacherClasses } from '../../classes/hooks/useTeacherClasses';
import { ClassCard } from '../../classes/components/ClassCard';

export const TodaysClasses = () => {
  const navigate = useNavigate();
  const { data: classes = [], isLoading } = useTeacherClasses();

  // Filter classes for today (simplified - in real app, check schedule)
  // For now, show all active classes as "today's classes"
  const todaysClasses = useMemo(() => {
    return classes.filter((cls) => cls.isActive).slice(0, 3); // Show first 3 active classes
  }, [classes]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <i className="fas fa-calendar-day text-indigo-600"></i>
          <span>Today's Classes</span>
        </h2>
        {classes.length > 3 && (
          <button
            onClick={() => navigate('/teacher/classes')}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            View All →
          </button>
        )}
      </div>

      {todaysClasses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <i className="fas fa-calendar-times text-4xl mb-3 text-gray-400"></i>
          <p>No classes scheduled for today</p>
        </div>
      ) : (
        <div className="space-y-4">
          {todaysClasses.map((classData) => (
            <div
              key={classData.id}
              className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    {classData.className}
                  </h3>
                  <div className="flex items-center space-x-4 text-xs text-gray-600">
                    <span className="flex items-center space-x-1">
                      <i className="fas fa-graduation-cap"></i>
                      <span>Grade {classData.grade}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <i className="fas fa-user-graduate"></i>
                      <span>{classData.enrolled} students</span>
                    </span>
                    {classData.subject && (
                      <span className="flex items-center space-x-1">
                        <i className="fas fa-book"></i>
                        <span>{classData.subject}</span>
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => navigate(`/teacher/classes/${classData.id}/attendance?action=mark`)}
                    className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Mark Attendance
                  </button>
                  <button
                    onClick={() => navigate(`/teacher/classes/${classData.id}`)}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

