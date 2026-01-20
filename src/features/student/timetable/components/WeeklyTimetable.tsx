/**
 * Weekly Timetable Component
 * Grid layout for week view
 */

import { useMemo } from 'react';
import type { WeeklyTimetable as WeeklyTimetableType } from '../models/timetable.model';
import { DaySchedule } from './DaySchedule';

interface WeeklyTimetableProps {
  timetable: WeeklyTimetableType;
  currentTime?: Date;
}

const getTimeSlots = (timetable: WeeklyTimetableType): string[] => {
  const allTimes = new Set<string>();

  timetable.days.forEach((day) => {
    day.slots.forEach((slot) => {
      allTimes.add(slot.startTime);
      allTimes.add(slot.endTime);
    });
  });

  return Array.from(allTimes).sort();
};

const getSlotsForTime = (day: WeeklyTimetableType['days'][0], time: string) => {
  return day.slots.filter((slot) => {
    const [slotStartHour, slotStartMin] = slot.startTime.split(':').map(Number);
    const [slotEndHour, slotEndMin] = slot.endTime.split(':').map(Number);
    const [timeHour, timeMin] = time.split(':').map(Number);

    const slotStart = slotStartHour * 60 + slotStartMin;
    const slotEnd = slotEndHour * 60 + slotEndMin;
    const timeMinutes = timeHour * 60 + timeMin;

    return timeMinutes >= slotStart && timeMinutes < slotEnd;
  });
};

export const WeeklyTimetable = ({ timetable, currentTime = new Date() }: WeeklyTimetableProps) => {
  // Filter to show only weekdays (Monday-Friday)
  const weekdays = useMemo(() => {
    return timetable.days.filter((day) => day.day >= 1 && day.day <= 5); // Monday to Friday
  }, [timetable]);

  const timeSlots = useMemo(() => {
    return getTimeSlots(timetable);
  }, [timetable]);

  // Check if there are any slots in any day
  const hasSlots = useMemo(() => {
    return weekdays.some((day) => day.slots && day.slots.length > 0);
  }, [weekdays]);

  if (weekdays.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <i className="fas fa-calendar-times text-4xl mb-3 text-gray-400"></i>
        <p className="text-sm">No schedule available for this week</p>
      </div>
    );
  }

  if (!hasSlots) {
    return (
      <div className="text-center py-12 text-gray-500">
        <i className="fas fa-calendar-times text-4xl mb-3 text-gray-400"></i>
        <p className="text-sm">No classes scheduled for this week</p>
        <p className="text-xs text-gray-400 mt-1">Enjoy your free time!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Desktop View - Grid Layout */}
      <div className="hidden lg:block overflow-x-auto">
        <div className="min-w-full">
          {/* Header Row */}
          <div className="grid grid-cols-6 border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
            <div className="p-3 font-semibold text-sm text-gray-700">Time</div>
            {weekdays.map((day) => (
              <div key={day.day} className="p-3 border-l border-gray-200">
                <div className="font-semibold text-sm text-gray-900">{day.dayName}</div>
                <div className="text-xs text-gray-600 mt-1">
                  {day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            ))}
          </div>

          {/* Time Slot Rows */}
          <div className="divide-y divide-gray-200">
            {timeSlots.map((time, idx) => {
              if (idx === timeSlots.length - 1) return null; // Skip last time (end time)
              return (
                <div key={time} className="grid grid-cols-6">
                  <div className="p-3 text-xs text-gray-600 font-medium border-r border-gray-200">
                    {time}
                  </div>
                  {weekdays.map((day) => {
                    const slots = getSlotsForTime(day, time);
                    return (
                      <div
                        key={day.day}
                        className="p-2 border-l border-gray-200 min-h-[80px]"
                      >
                        {slots.map((slot) => (
                          <div
                            key={slot.id}
                            className={`mb-1 p-2 rounded text-xs ${
                              slot.type === 'lab'
                                ? 'bg-purple-100 border border-purple-300'
                                : slot.type === 'tutorial'
                                ? 'bg-blue-100 border border-blue-300'
                                : 'bg-indigo-100 border border-indigo-300'
                            }`}
                          >
                            <div className="font-semibold truncate">{slot.subject}</div>
                            <div className="text-gray-600 truncate">{slot.teacher.name}</div>
                            <div className="text-gray-600">{slot.room}</div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile View - Day Tabs */}
      <div className="lg:hidden">
        {/* Day Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200 bg-gray-50">
          {weekdays.map((day) => (
            <button
              key={day.day}
              className="flex-shrink-0 px-4 py-3 text-sm font-medium text-gray-700 hover:text-indigo-600 border-b-2 border-transparent hover:border-indigo-300"
            >
              {day.dayName.substring(0, 3)}
            </button>
          ))}
        </div>

        {/* Day Schedule - Show first day by default (can be enhanced with tabs later) */}
        <div className="p-4">
          <DaySchedule daySchedule={weekdays[0]} currentTime={currentTime} />
        </div>
      </div>
    </div>
  );
};

