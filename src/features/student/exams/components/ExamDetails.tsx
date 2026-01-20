/**
 * ExamDetails Component
 * Detailed view of a single exam
 */

import React from 'react';
import { ExamStatusBadge } from '../../../../shared/components/exams/ExamStatusBadge';
import { ExamCountdown } from '../../../../shared/components/exams/ExamCountdown';
import { formatDate, formatTimeRange, formatDuration, formatDateTime } from '../../../../shared/utils/exams/exam.formatters';
import { formatPercentage } from '../../../../shared/utils/exams/exam.formatters';
import type { ExamDetails as ExamDetailsType } from '../types/exam.types';

interface ExamDetailsProps {
  exam: ExamDetailsType;
  onClose?: () => void;
  className?: string;
}

export const ExamDetails: React.FC<ExamDetailsProps> = ({
  exam,
  onClose,
  className = '',
}) => {
  const isUpcoming = exam.status === 'upcoming' || exam.status === 'scheduled';

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
      {onClose && (
        <div className="flex justify-end mb-4">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{exam.title}</h2>
          <div className="flex items-center gap-3 flex-wrap">
            <ExamStatusBadge status={exam.status} size="md" />
            {exam.examType && (
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium capitalize">
                {exam.examType}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Countdown for upcoming exams */}
      {isUpcoming && (
        <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
          <ExamCountdown examDate={exam.date} startTime={exam.startTime} />
        </div>
      )}

      {/* Exam Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-600 mb-1">Subject</div>
          <div className="text-lg font-semibold text-gray-900">{exam.subject}</div>
          {exam.subjectCode && (
            <div className="text-sm text-gray-600 mt-1">Code: {exam.subjectCode}</div>
          )}
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-600 mb-1">Class</div>
          <div className="text-lg font-semibold text-gray-900">{exam.className}</div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-600 mb-1">Date & Time</div>
          <div className="text-lg font-semibold text-gray-900">
            {formatDateTime(exam.date, exam.startTime)}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {formatTimeRange(exam.startTime, exam.endTime)}
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-600 mb-1">Duration</div>
          <div className="text-lg font-semibold text-gray-900">
            {formatDuration(exam.duration)}
          </div>
        </div>

        {exam.room && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-600 mb-1">Room</div>
            <div className="text-lg font-semibold text-gray-900">{exam.room}</div>
          </div>
        )}

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-600 mb-1">Total Marks</div>
          <div className="text-lg font-semibold text-gray-900">{exam.totalMarks}</div>
        </div>

        {exam.teacher && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-600 mb-1">Teacher</div>
            <div className="text-lg font-semibold text-gray-900">{exam.teacher.name}</div>
            {exam.teacher.email && (
              <div className="text-sm text-gray-600 mt-1">{exam.teacher.email}</div>
            )}
          </div>
        )}
      </div>

      {/* Instructions */}
      {exam.instructions && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Instructions</h3>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-gray-700 whitespace-pre-line">{exam.instructions}</p>
          </div>
        </div>
      )}

      {/* Results */}
      {exam.results && (
        <div className="p-6 bg-gradient-to-br from-green-500 to-green-600 rounded-lg text-white">
          <h3 className="text-lg font-semibold mb-4">Exam Results</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs opacity-90 mb-1">Obtained Marks</div>
              <div className="text-2xl font-bold">{exam.results.obtainedMarks}</div>
              <div className="text-xs opacity-90">out of {exam.totalMarks}</div>
            </div>
            <div>
              <div className="text-xs opacity-90 mb-1">Percentage</div>
              <div className="text-2xl font-bold">{formatPercentage(exam.results.percentage)}</div>
            </div>
            <div>
              <div className="text-xs opacity-90 mb-1">Grade</div>
              <div className="text-2xl font-bold">{exam.results.grade}</div>
            </div>
            <div>
              <div className="text-xs opacity-90 mb-1">Published</div>
              <div className="text-sm font-medium">
                {formatDate(exam.results.publishedAt)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

