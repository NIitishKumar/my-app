/**
 * ClassExamsList Component
 * Exams filtered by specific class
 */

import React from 'react';
import { ExamScheduleList } from '../../../student/exams/components/ExamScheduleList';
import type { Exam } from '../../../student/exams/types/exam.types';

interface ClassExamsListProps {
  exams: Exam[];
  className: string;
  isLoading?: boolean;
  onExamClick?: (exam: Exam) => void;
}

export const ClassExamsList: React.FC<ClassExamsListProps> = ({
  exams,
  className,
  isLoading = false,
  onExamClick,
}) => {
  const upcomingCount = exams.filter(
    (exam) => exam.status === 'upcoming' || exam.status === 'scheduled'
  ).length;
  const completedCount = exams.filter((exam) => exam.status === 'completed').length;

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{className}</h3>
        <div className="flex gap-4 text-sm text-gray-600">
          <span>Upcoming: {upcomingCount}</span>
          <span>Completed: {completedCount}</span>
          <span>Total: {exams.length}</span>
        </div>
      </div>
      <ExamScheduleList
        exams={exams}
        isLoading={isLoading}
        onExamClick={onExamClick}
        groupByDate={true}
      />
    </div>
  );
};


