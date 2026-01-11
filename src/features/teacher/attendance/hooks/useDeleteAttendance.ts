/**
 * useDeleteAttendance Hook
 * Delete attendance record with optimistic updates
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceApi } from '../api/attendance.api';
import { attendanceQueryKeys } from '../constants/attendance.constants';
import type { AttendanceRecord } from '../types/attendance.types';

interface DeleteAttendanceParams {
  classId: string;
  recordId: string;
}

export const useDeleteAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ classId, recordId }: DeleteAttendanceParams) =>
      attendanceApi.delete(classId, recordId),
    onMutate: async ({ recordId }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: attendanceQueryKeys.all });

      // Snapshot previous values
      const previousRecords = queryClient.getQueryData(attendanceQueryKeys.list());

      // Optimistically remove from cache
      queryClient.setQueryData(
        attendanceQueryKeys.list(),
        (old: any) => {
          if (!old || !old.data) return old;
          return {
            ...old,
            count: Math.max(0, old.count - 1),
            data: old.data.filter((record: AttendanceRecord) => record.id !== recordId),
          };
        }
      );

      return { previousRecords };
    },
    onError: (_error, _variables, context) => {
      // Rollback on error
      if (context?.previousRecords) {
        queryClient.setQueryData(attendanceQueryKeys.list(), context.previousRecords);
      }
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: attendanceQueryKeys.dashboard() });
      queryClient.invalidateQueries({ queryKey: attendanceQueryKeys.list() });
      queryClient.invalidateQueries({ 
        queryKey: attendanceQueryKeys.stats(variables.classId) 
      });
    },
  });
};

