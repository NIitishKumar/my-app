/**
 * useAttendanceCalendar Hook
 * Get attendance calendar for a specific month
 */

import { useQuery } from '@tanstack/react-query';
import { studentAttendanceService } from '../api/attendance.service';
import { attendanceQueryKeys } from './useStudentAttendance';
import type { AttendanceCalendar } from '../types/attendance.types';

export const useAttendanceCalendar = (
  year: number,
  month: number,
  classId?: string
) => {
  return useQuery<AttendanceCalendar>({
    queryKey: attendanceQueryKeys.calendarWithParams(year, month, classId),
    queryFn: () => studentAttendanceService.getAttendanceCalendar(year, month, classId),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

