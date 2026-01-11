/**
 * useStudentAttendanceHistory Hook
 * Get student attendance history
 */

import { useQuery } from '@tanstack/react-query';
import { attendanceApi } from '../api/attendance.api';
import { attendanceQueryKeys } from '../constants/attendance.constants';
import type { StudentHistoryQueryParams } from '../types/attendance.types';

export const useStudentAttendanceHistory = (
  studentId: string,
  params?: StudentHistoryQueryParams
) => {
  return useQuery({
    queryKey: attendanceQueryKeys.studentHistory(studentId, JSON.stringify(params)),
    queryFn: () => attendanceApi.getStudentHistory(studentId, params),
    enabled: !!studentId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

