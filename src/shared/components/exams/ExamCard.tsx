/**
 * ExamCard Component
 * Reusable exam card component
 */

import React from 'react';
import { ExamStatusBadge } from './ExamStatusBadge';
import { ExamCountdown } from './ExamCountdown';
import { formatDate, formatTimeRange, formatDuration } from '../../utils/exams/exam.formatters';
import { getDaysUntil, getExamUrgency, isToday } from '../../utils/exams/exam.calculations';
import type { Exam } from '../../../features/student/exams/types/exam.types';

interface ExamCardProps {
  exam: Exam;
  onClick?: () => void;
  showCountdown?: boolean;
  className?: string;
}

const isUpcoming = (exam: Exam): boolean => {
  // Trust the API status if it's marked as upcoming or scheduled
  if (exam.status === 'upcoming' || exam.status === 'scheduled') {
    return true;
  }
  
  // If status is completed or cancelled, it's not upcoming
  if (exam.status === 'completed' || exam.status === 'cancelled') {
    return false;
  }
  
  // For other statuses, check the date
  const examDate = typeof exam.date === 'string' ? new Date(exam.date) : exam.date;
  const now = new Date();
  return examDate > now;
};

export const ExamCard: React.FC<ExamCardProps> = ({
  exam,
  onClick,
  showCountdown = true,
  className = '',
}) => {
  const daysUntil = getDaysUntil(exam.date);
  const urgency = getExamUrgency(daysUntil);
  const isExamToday = isToday(exam.date);

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border-2 p-4 sm:p-6 hover:shadow-lg transition-all cursor-pointer ${
        isExamToday ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-200'
      } ${className}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{exam.title}</h3>
            {isExamToday && (
              <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-semibold rounded whitespace-nowrap">
                TODAY
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600 mb-3">
            <span className="flex items-center gap-1.5">
              <i className="fas fa-book text-gray-400"></i>
              <span>{exam.subject}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <i className="fas fa-calendar text-gray-400"></i>
              <span>{formatDate(exam.date)}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <i className="fas fa-clock text-gray-400"></i>
              <span>{formatTimeRange(exam.startTime, exam.endTime)}</span>
            </span>
            {exam.room && (
              <span className="flex items-center gap-1.5">
                <i className="fas fa-door-open text-gray-400"></i>
                <span>{exam.room}</span>
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <i className="fas fa-hourglass-half text-gray-400"></i>
              <span>{formatDuration(exam.duration)}</span>
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 ml-4">
          <ExamStatusBadge status={exam.status} size="sm" />
          {showCountdown && daysUntil >= 0 && (
            <div className={`px-2 py-1 rounded text-xs font-medium border ${urgency.color}`}>
              {daysUntil === 0
                ? 'Today'
                : daysUntil === 1
                ? 'Tomorrow'
                : `${daysUntil} days`}
            </div>
          )}
        </div>
      </div>

      {showCountdown && isUpcoming(exam) && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <ExamCountdown examDate={exam.date} startTime={exam.startTime} />
        </div>
      )}

      {exam.instructions && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-600 line-clamp-2">{exam.instructions}</p>
        </div>
      )}
    </div>
  );
};


