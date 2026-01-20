/**
 * MyExamsList Component
 * List of exams for teacher's classes
 */

import React, { useMemo } from 'react';
import { ExamScheduleList } from '../../../student/exams/components/ExamScheduleList';
import type { Exam } from '../../../student/exams/types/exam.types';

interface MyExamsListProps {
  exams: Exam[];
  isLoading?: boolean;
  onExamClick?: (exam: Exam) => void;
  onEdit?: (exam: Exam) => void;
  groupByClass?: boolean;
  className?: string;
}

export const MyExamsList: React.FC<MyExamsListProps> = ({
  exams,
  isLoading = false,
  onExamClick,
  onEdit,
  groupByClass = false,
  className = '',
}) => {
  const groupedByClass = useMemo(() => {
    if (!groupByClass) return null;
    return exams.reduce((acc, exam) => {
      if (!acc[exam.className]) {
        acc[exam.className] = [];
      }
      acc[exam.className].push(exam);
      return acc;
    }, {} as Record<string, Exam[]>);
  }, [exams, groupByClass]);

  if (groupByClass && groupedByClass) {
    return (
      <div className={`space-y-6 ${className}`}>
        {Object.entries(groupedByClass).map(([className, classExams]) => (
          <div key={className}>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 sticky top-0 bg-white py-2 z-10">
              {className}
            </h3>
            <ExamScheduleList
              exams={classExams}
              isLoading={isLoading}
              onExamClick={onExamClick}
              groupByDate={true}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <ExamScheduleList
      exams={exams}
      isLoading={isLoading}
      onExamClick={onExamClick}
      groupByDate={true}
      className={className}
    />
  );
};

