/**
 * Today's Schedule Component
 * Shows today's classes/schedule for student dashboard
 */

import { useMemo } from 'react';
import { useTodaysSchedule } from '../hooks/useDashboard';
import { DashboardStatsSkeleton } from '../../../../shared/components/skeletons';

const formatTimeRange = (startTime: string, endTime: string): string => {
  return `${startTime} - ${endTime}`;
};

const getCurrentTimeSlot = (schedule: Array<{ startTime: string; endTime: string; id: string }>): string | null => {
  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTime = currentHours * 60 + currentMinutes;

  for (const item of schedule) {
    const [startHour, startMin] = item.startTime.split(':').map(Number);
    const [endHour, endMin] = item.endTime.split(':').map(Number);
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    if (currentTime >= startTime && currentTime <= endTime) {
      return item.id;
    }
  }

  return null;
};

export const TodaysSchedule = () => {
  const { data: schedule = [], isLoading } = useTodaysSchedule();

  const currentSlotId = useMemo(() => {
    return getCurrentTimeSlot(schedule);
  }, [schedule]);

  // Check if today is weekend (simplified - in real app, check actual day)
  const isWeekend = useMemo(() => {
    const today = new Date().getDay();
    return today === 0 || today === 6;
  }, []);

  // Calculate which schedule items are past (all at once, outside map)
  const pastSlotIds = useMemo(() => {
    const now = new Date();
    const past: Set<string> = new Set();
    schedule.forEach((item) => {
      const [endHour, endMin] = item.endTime.split(':').map(Number);
      const endTime = new Date();
      endTime.setHours(endHour, endMin, 0, 0);
      if (now > endTime) {
        past.add(item.id);
      }
    });
    return past;
  }, [schedule]);

  if (isLoading) {
    return <DashboardStatsSkeleton />;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center space-x-2">
        <i className="fas fa-calendar-day text-indigo-600 flex-shrink-0"></i>
        <span className="truncate">Today's Schedule</span>
      </h2>

      {isWeekend ? (
        <div className="text-center py-8 text-gray-500">
          <i className="fas fa-calendar-times text-4xl mb-3 text-gray-400"></i>
          <p>No classes scheduled</p>
          <p className="text-xs text-gray-400 mt-1">Enjoy your weekend!</p>
        </div>
      ) : schedule.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <i className="fas fa-calendar-check text-4xl mb-3 text-gray-400"></i>
          <p>No classes scheduled for today</p>
        </div>
      ) : (
        <div className="space-y-3">
          {schedule.map((item) => {
            const isCurrent = currentSlotId === item.id;
            const isPast = pastSlotIds.has(item.id);

            return (
              <div
                key={item.id}
                className={`p-3 sm:p-4 border rounded-lg transition-all ${
                  isCurrent
                    ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-200'
                    : isPast
                    ? 'bg-gray-50 border-gray-200 opacity-60'
                    : 'border-gray-200 hover:border-indigo-300 hover:shadow-sm'
                }`}
              >
                {isCurrent && (
                  <div className="mb-2">
                    <span className="px-2 py-0.5 bg-indigo-600 text-white text-xs font-semibold rounded">
                      CURRENT
                    </span>
                  </div>
                )}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1 truncate">{item.subject}</h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <i className="fas fa-user text-gray-400"></i>
                        <span className="truncate">{item.teacher}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <i className="fas fa-clock text-gray-400"></i>
                        <span>{formatTimeRange(item.startTime, item.endTime)}</span>
                      </span>
                      {item.room && (
                        <span className="flex items-center space-x-1">
                          <i className="fas fa-door-open text-gray-400"></i>
                          <span>{item.room}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

