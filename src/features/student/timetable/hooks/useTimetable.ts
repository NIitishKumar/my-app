/**
 * Timetable Hooks
 * React Query hooks for timetable data fetching
 */

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { timetableService } from '../api/timetable.service';
import type { WeeklyTimetable } from '../models/timetable.model';

// Helper to get start of week (Monday)
const getStartOfWeek = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

/**
 * Hook to manage week navigation state and fetch timetable
 */
export const useTimetable = (initialDate?: Date) => {
  const [currentWeek, setCurrentWeek] = useState<Date>(() => {
    return initialDate ? getStartOfWeek(initialDate) : getStartOfWeek(new Date());
  });

  const weekStart = useMemo(() => getStartOfWeek(currentWeek), [currentWeek]);

  const { data, isLoading, error, refetch } = useQuery<WeeklyTimetable>({
    queryKey: ['student-timetable', 'week', weekStart.toISOString().split('T')[0]],
    queryFn: async () => {
      return timetableService.getWeeklyTimetable(weekStart);
    },
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  const goToPreviousWeek = () => {
    const prevWeek = new Date(currentWeek);
    prevWeek.setDate(prevWeek.getDate() - 7);
    setCurrentWeek(prevWeek);
  };

  const goToNextWeek = () => {
    const nextWeek = new Date(currentWeek);
    nextWeek.setDate(nextWeek.getDate() + 7);
    setCurrentWeek(nextWeek);
  };

  const goToCurrentWeek = () => {
    setCurrentWeek(getStartOfWeek(new Date()));
  };

  const goToWeek = (date: Date) => {
    setCurrentWeek(getStartOfWeek(date));
  };

  const isCurrentWeek = useMemo(() => {
    const today = getStartOfWeek(new Date());
    return weekStart.toDateString() === today.toDateString();
  }, [weekStart]);

  return {
    timetable: data,
    isLoading,
    error,
    refetch,
    currentWeek: weekStart,
    goToPreviousWeek,
    goToNextWeek,
    goToCurrentWeek,
    goToWeek,
    isCurrentWeek,
  };
};

