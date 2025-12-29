/**
 * useClassAttendance Hook - GET attendance records for a class
 */

import { useQuery } from '@tanstack/react-query';
import { attendanceApi } from '../api/attendance.api';
import { attendanceQueryKeys } from '../constants/attendance.constants';
import type { AttendanceFilters } from '../types/attendance.types';

export const useClassAttendance = (
  classId: string,
  filters?: AttendanceFilters
) => {
  return useQuery({
    queryKey: attendanceQueryKeys.list(classId, JSON.stringify(filters)),
    queryFn: () => attendanceApi.getByClass(classId, filters),
    enabled: !!classId,
  });
};

