/**
 * Upcoming Exams Component
 * List of upcoming exams for student dashboard
 */

import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUpcomingExams } from '../hooks/useDashboard';
import { ROUTES } from '../../../../shared/constants';
import { DashboardStatsSkeleton } from '../../../../shared/components/skeletons';

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const getDaysUntil = (date: Date): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const examDate = new Date(date);
  examDate.setHours(0, 0, 0, 0);
  const diffTime = examDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const getExamUrgency = (daysUntil: number): { color: string; label: string } => {
  if (daysUntil <= 1) return { color: 'text-red-600 bg-red-50 border-red-200', label: 'Urgent' };
  if (daysUntil <= 3) return { color: 'text-orange-600 bg-orange-50 border-orange-200', label: 'Soon' };
  return { color: 'text-blue-600 bg-blue-50 border-blue-200', label: 'Upcoming' };
};

export const UpcomingExams = () => {
  const navigate = useNavigate();
  const { data: exams = [], isLoading } = useUpcomingExams();

  const sortedExams = useMemo(() => {
    return [...exams].sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [exams]);

  if (isLoading) {
    return <DashboardStatsSkeleton />;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <i className="fas fa-file-alt text-indigo-600 flex-shrink-0"></i>
          <span className="truncate">Upcoming Exams</span>
        </h2>
        {sortedExams.length > 0 && (
          <button
            onClick={() => navigate(ROUTES.STUDENT_EXAMS)}
            className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-700 font-medium whitespace-nowrap flex-shrink-0"
          >
            View All →
          </button>
        )}
      </div>

      {sortedExams.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <i className="fas fa-calendar-check text-4xl mb-3 text-gray-400"></i>
          <p>No upcoming exams</p>
          <p className="text-xs text-gray-400 mt-1">Your exam schedule will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedExams.slice(0, 5).map((exam) => {
            const daysUntil = getDaysUntil(exam.date);
            const urgency = getExamUrgency(daysUntil);
            const isToday = daysUntil === 0;

            return (
              <div
                key={exam.id}
                className={`p-3 sm:p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer ${urgency.color}`}
                onClick={() => navigate(ROUTES.STUDENT_EXAMS)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">{exam.title}</h3>
                      {isToday && (
                        <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-semibold rounded">
                          TODAY
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <i className="fas fa-book text-gray-400"></i>
                        <span>{exam.subject}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <i className="fas fa-calendar text-gray-400"></i>
                        <span>{formatDate(exam.date)}</span>
                      </span>
                      {exam.room && (
                        <span className="flex items-center space-x-1">
                          <i className="fas fa-door-open text-gray-400"></i>
                          <span>{exam.room}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`px-2 py-1 rounded text-xs font-medium border ${urgency.color}`}>
                      {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

