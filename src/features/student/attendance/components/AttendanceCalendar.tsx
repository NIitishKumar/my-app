/**
 * AttendanceCalendar Component
 * Month view calendar with attendance status
 */

import React, { useState } from 'react';
import { AttendanceStatusBadge } from '../../../../shared/components/attendance/AttendanceStatusBadge';
import type { CalendarDay } from '../types/attendance.types';

interface AttendanceCalendarProps {
  year: number;
  month: number;
  days: CalendarDay[];
  onMonthChange?: (year: number, month: number) => void;
  className?: string;
}

const getStatusColor = (
  status: CalendarDay['status']
): { bg: string; text: string; border: string } => {
  switch (status) {
    case 'present':
      return {
        bg: 'bg-green-50',
        text: 'text-green-700',
        border: 'border-green-300',
      };
    case 'absent':
      return {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-300',
      };
    case 'late':
      return {
        bg: 'bg-yellow-50',
        text: 'text-yellow-700',
        border: 'border-yellow-300',
      };
    case 'excused':
      return {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-300',
      };
    case 'holiday':
      return {
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        border: 'border-purple-300',
      };
    default:
      return {
        bg: 'bg-gray-50',
        text: 'text-gray-700',
        border: 'border-gray-300',
      };
  }
};

export const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({
  year,
  month,
  days,
  onMonthChange,
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

  const getDayStatus = (day: number): CalendarDay | null => {
    const date = new Date(year, month - 1, day);
    return days.find((d) => {
      const dDate = typeof d.date === 'string' ? new Date(d.date) : d.date;
      return (
        dDate.getDate() === date.getDate() &&
        dDate.getMonth() === date.getMonth() &&
        dDate.getFullYear() === date.getFullYear()
      );
    }) || null;
  };

  const selectedDay = selectedDate
    ? getDayStatus(selectedDate.getDate())
    : null;

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
          const dayStatus = getDayStatus(day);
          const isToday =
            day === new Date().getDate() &&
            month === new Date().getMonth() + 1 &&
            year === new Date().getFullYear();
          const isSelected =
            selectedDate &&
            day === selectedDate.getDate() &&
            month === selectedDate.getMonth() + 1 &&
            year === selectedDate.getFullYear();

          const colors = dayStatus
            ? getStatusColor(dayStatus.status)
            : { bg: 'bg-white', text: 'text-gray-900', border: 'border-gray-200' };

          return (
            <button
              key={day}
              onClick={() => setSelectedDate(new Date(year, month - 1, day))}
              className={`
                p-2 rounded-lg border text-sm transition-all
                ${colors.bg} ${colors.text} ${colors.border}
                ${isToday ? 'ring-2 ring-indigo-500' : ''}
                ${isSelected ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}
                hover:shadow-md
              `}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="font-medium">{day}</span>
                {dayStatus && dayStatus.status !== 'no_class' && (
                  <i
                    className={`fas ${
                      dayStatus.status === 'present'
                        ? 'fa-check text-xs'
                        : dayStatus.status === 'absent'
                        ? 'fa-times text-xs'
                        : dayStatus.status === 'late'
                        ? 'fa-clock text-xs'
                        : dayStatus.status === 'excused'
                        ? 'fa-calendar-check text-xs'
                        : ''
                    }`}
                  ></i>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs mb-4">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 bg-green-50 border border-green-300 rounded"></div>
          <span>Present</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 bg-red-50 border border-red-300 rounded"></div>
          <span>Absent</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 bg-yellow-50 border border-yellow-300 rounded"></div>
          <span>Late</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 bg-blue-50 border border-blue-300 rounded"></div>
          <span>Excused</span>
        </div>
      </div>

      {/* Selected Day Details */}
      {selectedDay && selectedDay.status !== 'no_class' && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-gray-900">
              {new Date(selectedDate!).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            {selectedDay.status !== 'holiday' && (
              <AttendanceStatusBadge status={selectedDay.status as any} size="sm" />
            )}
          </div>
          {selectedDay.className && (
            <p className="text-sm text-gray-600 mb-1">Class: {selectedDay.className}</p>
          )}
          {selectedDay.remarks && (
            <p className="text-sm text-gray-600">Remarks: {selectedDay.remarks}</p>
          )}
        </div>
      )}
    </div>
  );
};

