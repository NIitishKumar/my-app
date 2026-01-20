/**
 * ExamScheduleList Component
 * List/table view of exam schedule
 */

import React, { useMemo } from 'react';
import { ExamCard } from '../../../../shared/components/exams/ExamCard';
import { ExamStatusBadge } from '../../../../shared/components/exams/ExamStatusBadge';
import { formatDate, formatTimeRange } from '../../../../shared/utils/exams/exam.formatters';
import { sortExamsByDate, groupExamsByDate } from '../utils/exam.utils';
import type { Exam } from '../types/exam.types';

interface ExamScheduleListProps {
  exams: Exam[];
  isLoading?: boolean;
  onExamClick?: (exam: Exam) => void;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  totalPages?: number;
  groupByDate?: boolean;
  className?: string;
}

export const ExamScheduleList: React.FC<ExamScheduleListProps> = ({
  exams,
  isLoading = false,
  onExamClick,
  onPageChange,
  currentPage = 1,
  totalPages = 1,
  groupByDate = false,
  className = '',
}) => {
  const sortedExams = useMemo(() => sortExamsByDate(exams), [exams]);
  const groupedExams = useMemo(() => {
    if (!groupByDate) return null;
    return groupExamsByDate(sortedExams);
  }, [sortedExams, groupByDate]);

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!exams || exams.length === 0) {
    return (
      <div className={`bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500 ${className}`}>
        <i className="fas fa-calendar-times text-4xl mb-3 text-gray-400"></i>
        <p className="text-lg font-semibold">No exams found</p>
        <p className="text-sm mt-2">Your exam schedule will appear here</p>
      </div>
    );
  }

  // Grouped by date view
  if (groupByDate && groupedExams) {
    return (
      <div className={`space-y-6 ${className}`}>
        {Object.entries(groupedExams)
          .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
          .map(([date, dateExams]) => (
            <div key={date}>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 sticky top-0 bg-white py-2 z-10">
                {formatDate(new Date(date))}
              </h3>
              <div className="space-y-3">
                {dateExams.map((exam) => (
                  <ExamCard
                    key={exam.id}
                    exam={exam}
                    onClick={() => onExamClick?.(exam)}
                    showCountdown={true}
                  />
                ))}
              </div>
            </div>
          ))}
      </div>
    );
  }

  // Regular list view
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Exam
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Room
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedExams.map((exam) => (
              <tr
                key={exam.id}
                onClick={() => onExamClick?.(exam)}
                className="hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{exam.title}</div>
                  {exam.examType && (
                    <div className="text-xs text-gray-500 capitalize">{exam.examType}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {exam.subject}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatDate(exam.date)}</div>
                  <div className="text-xs text-gray-500">{formatTimeRange(exam.startTime, exam.endTime)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {exam.room || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <ExamStatusBadge status={exam.status} size="sm" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {sortedExams.map((exam) => (
          <ExamCard
            key={exam.id}
            exam={exam}
            onClick={() => onExamClick?.(exam)}
            showCountdown={true}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && onPageChange && (
        <div className="bg-white rounded-xl border border-gray-200 px-6 py-3 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


