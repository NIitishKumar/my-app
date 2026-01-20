/**
 * ExamResultsList Component
 * List of exam results
 */

import React from 'react';
import { formatDate, formatPercentage } from '../../../../shared/utils/exams/exam.formatters';
import type { ExamResult } from '../types/exam.types';

interface ExamResultsListProps {
  results: ExamResult[];
  isLoading?: boolean;
  onResultClick?: (result: ExamResult) => void;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  totalPages?: number;
  className?: string;
}

const getGradeColor = (grade: string): string => {
  if (grade.startsWith('A')) return 'text-green-600 bg-green-50 border-green-200';
  if (grade.startsWith('B')) return 'text-blue-600 bg-blue-50 border-blue-200';
  if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  if (grade.startsWith('D')) return 'text-orange-600 bg-orange-50 border-orange-200';
  return 'text-red-600 bg-red-50 border-red-200';
};

export const ExamResultsList: React.FC<ExamResultsListProps> = ({
  results,
  isLoading = false,
  onResultClick,
  onPageChange,
  currentPage = 1,
  totalPages = 1,
  className = '',
}) => {
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

  if (!results || results.length === 0) {
    return (
      <div className={`bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500 ${className}`}>
        <i className="fas fa-clipboard-list text-4xl mb-3 text-gray-400"></i>
        <p className="text-lg font-semibold">No exam results available</p>
        <p className="text-sm mt-2">Your exam results will appear here once published</p>
      </div>
    );
  }

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
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Marks
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Grade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Percentage
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.map((result) => (
              <tr
                key={result.examId}
                onClick={() => onResultClick?.(result)}
                className="hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{result.examTitle}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {result.subject}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(result.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {result.obtainedMarks} / {result.totalMarks}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold border ${getGradeColor(
                      result.grade
                    )}`}
                  >
                    {result.grade}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {formatPercentage(result.percentage)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {results.map((result) => (
          <div
            key={result.examId}
            onClick={() => onResultClick?.(result)}
            className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{result.examTitle}</h3>
                <p className="text-sm text-gray-600">{result.subject}</p>
                <p className="text-xs text-gray-500 mt-1">{formatDate(result.date)}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold border ${getGradeColor(
                  result.grade
                )}`}
              >
                {result.grade}
              </span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <div>
                <p className="text-xs text-gray-600">Marks</p>
                <p className="text-sm font-semibold text-gray-900">
                  {result.obtainedMarks} / {result.totalMarks}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-600">Percentage</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatPercentage(result.percentage)}
                </p>
              </div>
            </div>
          </div>
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


