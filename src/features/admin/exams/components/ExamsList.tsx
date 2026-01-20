/**
 * ExamsList Component
 * Comprehensive list with filters and actions
 */

import React from 'react';
import { ExamScheduleList } from '../../../student/exams/components/ExamScheduleList';
import type { Exam } from '../../../student/exams/types/exam.types';

interface ExamsListProps {
  exams: Exam[];
  isLoading?: boolean;
  onExamClick?: (exam: Exam) => void;
  onEdit?: (exam: Exam) => void;
  onDelete?: (exam: Exam) => void;
  className?: string;
}

export const ExamsList: React.FC<ExamsListProps> = ({
  exams,
  isLoading = false,
  onExamClick,
  className = '',
}) => {
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

