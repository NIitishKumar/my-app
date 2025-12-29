/**
 * useMarkAttendance Hook - POST/PUT attendance
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceApi } from '../api/attendance.api';
import { attendanceQueryKeys } from '../constants/attendance.constants';
import type { MarkAttendanceData, UpdateAttendanceData } from '../types/attendance.types';

export const useMarkAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MarkAttendanceData) => attendanceApi.mark(data),
    onSuccess: (data) => {
      // Invalidate all attendance queries for this class
      queryClient.invalidateQueries({
        queryKey: attendanceQueryKeys.all,
      });
      // Also invalidate the specific class attendance list
      queryClient.invalidateQueries({
        queryKey: attendanceQueryKeys.list(data.classId),
      });
      // Invalidate stats
      queryClient.invalidateQueries({
        queryKey: attendanceQueryKeys.stats(data.classId),
      });
    },
  });
};

export const useUpdateAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateAttendanceData) => attendanceApi.update(data),
    onSuccess: (data) => {
      // Invalidate all attendance queries for this class
      queryClient.invalidateQueries({
        queryKey: attendanceQueryKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: attendanceQueryKeys.list(data.classId),
      });
      queryClient.invalidateQueries({
        queryKey: attendanceQueryKeys.stats(data.classId),
      });
    },
  });
};

export const useDeleteAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ classId, recordId }: { classId: string; recordId: string }) =>
      attendanceApi.delete(classId, recordId),
    onSuccess: (_, variables) => {
      // Invalidate all attendance queries for this class
      queryClient.invalidateQueries({
        queryKey: attendanceQueryKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: attendanceQueryKeys.list(variables.classId),
      });
      queryClient.invalidateQueries({
        queryKey: attendanceQueryKeys.stats(variables.classId),
      });
    },
  });
};

