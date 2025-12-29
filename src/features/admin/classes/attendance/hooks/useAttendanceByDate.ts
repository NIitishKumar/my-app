/**
 * useAttendanceByDate Hook - Get attendance for a specific date
 */

import { useQuery } from '@tanstack/react-query';
import { attendanceApi } from '../api/attendance.api';
import { attendanceQueryKeys } from '../constants/attendance.constants';

export const useAttendanceByDate = (classId: string, date: string) => {
  return useQuery({
    queryKey: attendanceQueryKeys.byDate(classId, date),
    queryFn: () => attendanceApi.getByDate(classId, date),
    enabled: !!classId && !!date,
  });
};

