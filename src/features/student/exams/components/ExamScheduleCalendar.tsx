/**
 * ExamScheduleCalendar Component
 * Month view calendar with exam dates
 */

import React, { useState } from 'react';
import { ExamStatusBadge } from '../../../../shared/components/exams/ExamStatusBadge';
import { formatDate } from '../../../../shared/utils/exams/exam.formatters';
import type { Exam } from '../types/exam.types';

interface ExamScheduleCalendarProps {
  year: number;
  month: number;
  exams: Exam[];
  onMonthChange?: (year: number, month: number) => void;
  onExamClick?: (exam: Exam) => void;
  className?: string;
}

const getExamColor = (examCount: number): string => {
  if (examCount === 0) return 'bg-gray-50 border-gray-200';
  if (examCount === 1) return 'bg-blue-50 border-blue-300';
  if (examCount === 2) return 'bg-indigo-50 border-indigo-300';
  return 'bg-purple-50 border-purple-300';
};

export const ExamScheduleCalendar: React.FC<ExamScheduleCalendarProps> = ({
  year,
  month,
  exams,
  onMonthChange,
  onExamClick,
  className = '',
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthName = new Date(year, month - 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  const navigateMonth = (direction: 'prev' | 'next') => {
    let newYear = year;
    let newMonth = month;

    if (direction === 'prev') {
      newMonth--;
      if (newMonth < 1) {
        newMonth = 12;
        newYear--;
      }
    } else {
      newMonth++;
      if (newMonth > 12) {
        newMonth = 1;
        newYear++;
      }
    }

    onMonthChange?.(newYear, newMonth);
  };

  const getExamsForDay = (day: number): Exam[] => {
    const date = new Date(year, month - 1, day);
    return exams.filter((exam) => {
      const examDate = typeof exam.date === 'string' ? new Date(exam.date) : exam.date;
      return (
        examDate.getDate() === date.getDate() &&
        examDate.getMonth() === date.getMonth() &&
        examDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const selectedDayExams = selectedDate ? getExamsForDay(selectedDate.getDate()) : [];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Previous month"
        >
          <i className="fas fa-chevron-left text-gray-600"></i>
        </button>
        <h3 className="text-lg font-semibold text-gray-900">{monthName}</h3>
        <button
          onClick={() => navigateMonth('next')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Next month"
        >
          <i className="fas fa-chevron-right text-gray-600"></i>
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-600 py-2"
          >
            {day}
          </div>
        ))}

        {/* Empty cells for days before month starts */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="p-2"></div>
        ))}

        {/* Calendar days */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dayExams = getExamsForDay(day);
          const isToday =
            day === new Date().getDate() &&
            month === new Date().getMonth() + 1 &&
            year === new Date().getFullYear();
          const isSelected =
            selectedDate &&
            day === selectedDate.getDate() &&
            month === selectedDate.getMonth() + 1 &&
            year === selectedDate.getFullYear();

          const colors = getExamColor(dayExams.length);

          return (
            <button
              key={day}
              onClick={() => setSelectedDate(new Date(year, month - 1, day))}
              className={`
                p-2 rounded-lg border text-sm transition-all
                ${colors}
                ${isToday ? 'ring-2 ring-indigo-500' : ''}
                ${isSelected ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}
                hover:shadow-md
              `}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="font-medium">{day}</span>
                {dayExams.length > 0 && (
                  <span className="text-xs font-semibold">{dayExams.length}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Exams */}
      {selectedDate && selectedDayExams.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">
            Exams on {formatDate(selectedDate)}
          </h4>
          <div className="space-y-2">
            {selectedDayExams.map((exam) => (
              <div
                key={exam.id}
                onClick={() => onExamClick?.(exam)}
                className="p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900">{exam.title}</h5>
                    <p className="text-sm text-gray-600 mt-1">
                      {exam.subject} • {exam.startTime} - {exam.endTime}
                    </p>
                    {exam.room && (
                      <p className="text-xs text-gray-500 mt-1">Room: {exam.room}</p>
                    )}
                  </div>
                  <ExamStatusBadge status={exam.status} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedDate && selectedDayExams.length === 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 text-center text-gray-500 text-sm">
          No exams scheduled for {formatDate(selectedDate)}
        </div>
      )}
    </div>
  );
};


