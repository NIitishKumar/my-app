/**
 * useMarkAttendance Hook
 * Create attendance record with optimistic updates
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceApi } from '../api/attendance.api';
import { attendanceQueryKeys } from '../constants/attendance.constants';
import type { MarkAttendanceData, AttendanceRecord } from '../types/attendance.types';

export const useMarkAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MarkAttendanceData) => attendanceApi.mark(data),
    onMutate: async (newData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: attendanceQueryKeys.all });

      // Snapshot previous value
      const previousRecords = queryClient.getQueryData(attendanceQueryKeys.list());

      // Optimistically update cache
      const optimisticRecord: AttendanceRecord = {
        id: `temp-${Date.now()}`,
        classId: newData.classId,
        className: '', // Will be updated from server response
        date: new Date(newData.date),
        type: newData.type || 'date',
        lectureId: newData.lectureId,
        lectureTitle: undefined,
        students: newData.students.map((s) => ({
          studentId: s.studentId,
          studentName: '', // Will be updated from server response
          status: s.status,
          remarks: s.remarks,
        })),
        isLocked: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Update list cache
      queryClient.setQueryData(
        attendanceQueryKeys.list(JSON.stringify({ classId: newData.classId })),
        (old: any) => {
          if (!old) return { success: true, count: 1, page: 1, totalPages: 1, data: [optimisticRecord] };
          return {
            ...old,
            count: old.count + 1,
            data: [optimisticRecord, ...old.data],
          };
        }
      );

      // Update byDate cache
      queryClient.setQueryData(
        attendanceQueryKeys.byDate(newData.classId, newData.date),
        optimisticRecord
      );

      return { previousRecords };
    },
    onError: (error, newData, context) => {
      // Rollback on error
      if (context?.previousRecords) {
        queryClient.setQueryData(attendanceQueryKeys.list(), context.previousRecords);
      }
      queryClient.removeQueries({ queryKey: attendanceQueryKeys.byDate(newData.classId, newData.date) });
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: attendanceQueryKeys.dashboard() });
      queryClient.invalidateQueries({ queryKey: attendanceQueryKeys.list() });
      queryClient.invalidateQueries({ 
        queryKey: attendanceQueryKeys.byDate(variables.classId, variables.date) 
      });
      queryClient.invalidateQueries({ 
        queryKey: attendanceQueryKeys.stats(variables.classId) 
      });
      
      // Update cache with server response
      queryClient.setQueryData(
        attendanceQueryKeys.byDate(data.classId, variables.date),
        data
      );
    },
  });
};

