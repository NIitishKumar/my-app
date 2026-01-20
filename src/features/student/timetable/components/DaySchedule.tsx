/**
 * Day Schedule Component
 * Display schedule for a single day
 */

import { useMemo } from 'react';
import type { DaySchedule as DayScheduleType } from '../models/timetable.model';
import { TimetableSlot } from './TimetableSlot';

interface DayScheduleProps {
  daySchedule: DayScheduleType;
  currentTime?: Date;
}

const getCurrentTimeSlot = (slots: DayScheduleType['slots'], currentTime: Date): string | null => {
  const currentHours = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();
  const currentTimeMinutes = currentHours * 60 + currentMinutes;

  for (const slot of slots) {
    const [startHour, startMin] = slot.startTime.split(':').map(Number);
    const [endHour, endMin] = slot.endTime.split(':').map(Number);
    const startTimeMinutes = startHour * 60 + startMin;
    const endTimeMinutes = endHour * 60 + endMin;

    if (currentTimeMinutes >= startTimeMinutes && currentTimeMinutes <= endTimeMinutes) {
      return slot.id;
    }
  }

  return null;
};

const getPastSlots = (slots: DayScheduleType['slots'], currentTime: Date): Set<string> => {
  const past: Set<string> = new Set();
  const currentHours = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();
  const currentTimeMinutes = currentHours * 60 + currentMinutes;

  slots.forEach((slot) => {
    const [endHour, endMin] = slot.endTime.split(':').map(Number);
    const endTimeMinutes = endHour * 60 + endMin;
    if (currentTimeMinutes > endTimeMinutes) {
      past.add(slot.id);
    }
  });

  return past;
};

export const DaySchedule = ({ daySchedule, currentTime = new Date() }: DayScheduleProps) => {
  const currentSlotId = useMemo(() => {
    // Only check if it's today
    const today = new Date();
    const scheduleDate = new Date(daySchedule.date);
    const isToday =
      scheduleDate.toDateString() === today.toDateString();

    if (!isToday) return null;
    return getCurrentTimeSlot(daySchedule.slots, currentTime);
  }, [daySchedule, currentTime]);

  const pastSlotIds = useMemo(() => {
    const today = new Date();
    const scheduleDate = new Date(daySchedule.date);
    const isToday = scheduleDate.toDateString() === today.toDateString();
    const isPast = scheduleDate < today && !isToday;

    if (isPast) {
      // All slots are past if the day itself is past
      return new Set(daySchedule.slots.map((s) => s.id));
    }

    if (!isToday) return new Set<string>();

    return getPastSlots(daySchedule.slots, currentTime);
  }, [daySchedule, currentTime]);

  if (daySchedule.slots.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <i className="fas fa-calendar-times text-4xl mb-3 text-gray-400"></i>
        <p className="text-sm">No classes scheduled</p>
        <p className="text-xs text-gray-400 mt-1">Enjoy your free time!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {daySchedule.slots.map((slot) => {
        const isCurrent = currentSlotId === slot.id;
        const isPast = pastSlotIds.has(slot.id);

        return (
          <TimetableSlot
            key={slot.id}
            slot={slot}
            isCurrent={isCurrent}
            isPast={isPast}
          />
        );
      })}
    </div>
  );
};

