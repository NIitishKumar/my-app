/**
 * Timetable Page Component
 * Main timetable page with week navigation and view options
 */

import { useState } from 'react';
import { useTimetable } from '../hooks/useTimetable';
import { WeekNavigation } from '../components/WeekNavigation';
import { WeeklyTimetable } from '../components/WeeklyTimetable';
import { DaySchedule } from '../components/DaySchedule';
import { DashboardStatsSkeleton } from '../../../../shared/components/skeletons';

type ViewMode = 'week' | 'day';

export const TimetablePage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [selectedDay, setSelectedDay] = useState<number>(1); // Monday by default

  const {
    timetable,
    isLoading,
    error,
    currentWeek,
    goToPreviousWeek,
    goToNextWeek,
    goToCurrentWeek,
    isCurrentWeek,
  } = useTimetable();

  if (isLoading) {
    return (
      <div className="p-3 sm:p-4 lg:p-6">
        <DashboardStatsSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3 sm:p-4 lg:p-6">
        <div className="text-center py-12">
          <i className="fas fa-exclamation-triangle text-red-500 text-4xl mb-3"></i>
          <p className="text-red-600 font-medium">Error loading timetable</p>
          <p className="text-sm text-gray-600 mt-2">
            {error instanceof Error ? error.message : 'An error occurred while loading your timetable'}
          </p>
        </div>
      </div>
    );
  }

  if (!timetable || !timetable.days || timetable.days.length === 0) {
    return (
      <div className="p-3 sm:p-4 lg:p-6">
        <div className="text-center py-12">
          <i className="fas fa-calendar-times text-4xl mb-3 text-gray-400"></i>
          <p className="text-gray-600">No timetable data available</p>
          <p className="text-sm text-gray-500 mt-2">Please contact your administrator if you believe this is an error.</p>
        </div>
      </div>
    );
  }

  const weekEnd = new Date(currentWeek);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const weekdays = timetable.days.filter((day) => day.day >= 1 && day.day <= 5);
  const selectedDaySchedule = weekdays.find((day) => day.day === selectedDay) || weekdays[0];

  return (
    <div className="p-3 sm:p-4 lg:p-6 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          My Timetable
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">View your weekly class schedule</p>
      </div>

      {/* Week Navigation */}
      <WeekNavigation
        weekStart={currentWeek}
        weekEnd={weekEnd}
        isCurrentWeek={isCurrentWeek}
        onPreviousWeek={goToPreviousWeek}
        onNextWeek={goToNextWeek}
        onCurrentWeek={goToCurrentWeek}
      />

      {/* View Mode Toggle (Mobile) */}
      <div className="lg:hidden mb-4">
        <div className="bg-white rounded-lg border border-gray-200 p-1 inline-flex">
          <button
            onClick={() => setViewMode('week')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'week'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setViewMode('day')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'day'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Day
          </button>
        </div>
      </div>

      {/* Day Selector Tabs (for Day View) */}
      {viewMode === 'day' && (
        <div className="lg:hidden mb-4 overflow-x-auto">
          <div className="flex gap-2">
            {weekdays.map((day) => (
              <button
                key={day.day}
                onClick={() => setSelectedDay(day.day)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedDay === day.day
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div>{day.dayName.substring(0, 3)}</div>
                <div className="text-xs mt-0.5">
                  {day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Timetable Content */}
      {viewMode === 'week' ? (
        <WeeklyTimetable timetable={timetable} />
      ) : (
        <div className="lg:hidden bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{selectedDaySchedule.dayName}</h2>
            <p className="text-sm text-gray-600">
              {selectedDaySchedule.date.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
          <DaySchedule daySchedule={selectedDaySchedule} />
        </div>
      )}

      {/* Desktop always shows week view */}
      <div className="hidden lg:block">
        <WeeklyTimetable timetable={timetable} />
      </div>
    </div>
  );
};

