/**
 * UpcomingExamsList Component
 * List of upcoming exams with countdown
 */

import React, { useMemo } from 'react';
import { ExamCard } from '../../../../shared/components/exams/ExamCard';
import { sortExamsByDate, isUpcoming } from '../utils/exam.utils';
import type { Exam } from '../types/exam.types';

interface UpcomingExamsListProps {
  exams: Exam[];
  isLoading?: boolean;
  onExamClick?: (exam: Exam) => void;
  limit?: number;
  className?: string;
}

export const UpcomingExamsList: React.FC<UpcomingExamsListProps> = ({
  exams,
  isLoading = false,
  onExamClick,
  limit,
  className = '',
}) => {
  const upcomingExams = useMemo(() => {
    const filtered = exams.filter(isUpcoming);
    const sorted = sortExamsByDate(filtered);
    return limit ? sorted.slice(0, limit) : sorted;
  }, [exams, limit]);

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (upcomingExams.length === 0) {
    return (
      <div className={`bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500 ${className}`}>
        <i className="fas fa-calendar-check text-4xl mb-3 text-gray-400"></i>
        <p className="text-lg font-semibold">No upcoming exams</p>
        <p className="text-sm mt-2">Your upcoming exam schedule will appear here</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {upcomingExams.map((exam) => (
        <ExamCard
          key={exam.id}
          exam={exam}
          onClick={() => onExamClick?.(exam)}
          showCountdown={true}
        />
      ))}
    </div>
  );
};


