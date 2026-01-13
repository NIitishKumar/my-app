/**
 * TodaysClasses Component
 * Shows today's scheduled classes with quick actions
 */

import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTeacherClasses } from '../../classes/hooks/useTeacherClasses';
import { TodaysClassesSkeleton } from '../../../../shared/components/skeletons';

export const TodaysClasses = () => {
  const navigate = useNavigate();
  const { data: classes = [], isLoading } = useTeacherClasses();

  // Filter classes for today (simplified - in real app, check schedule)
  // For now, show all active classes as "today's classes"
  const todaysClasses = useMemo(() => {
    return classes.filter((cls) => cls.isActive).slice(0, 3); // Show first 3 active classes
  }, [classes]);

  if (isLoading) {
    return <TodaysClassesSkeleton />;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center space-x-2 min-w-0">
          <i className="fas fa-calendar-day text-indigo-600 flex-shrink-0"></i>
          <span className="truncate">Today's Classes</span>
        </h2>
        {classes.length > 3 && (
          <button
            onClick={() => navigate('/teacher/classes')}
            className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-700 font-medium whitespace-nowrap flex-shrink-0"
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
              className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 sm:mb-1 truncate">
                    {classData.className}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600">
                    <span className="flex items-center space-x-1 flex-shrink-0">
                      <i className="fas fa-graduation-cap"></i>
                      <span>Grade {classData.grade}</span>
                    </span>
                    <span className="flex items-center space-x-1 flex-shrink-0">
                      <i className="fas fa-user-graduate"></i>
                      <span>{classData.enrolled} students</span>
                    </span>
                    {classData.subject && (
                      <span className="flex items-center space-x-1 flex-shrink-0">
                        <i className="fas fa-book"></i>
                        <span className="truncate">{classData.subject}</span>
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => navigate(`/teacher/classes/${classData.id}/attendance?action=mark`)}
                    className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap"
                  >
                    Mark Attendance
                  </button>
                  <button
                    onClick={() => navigate(`/teacher/classes/${classData.id}`)}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
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

