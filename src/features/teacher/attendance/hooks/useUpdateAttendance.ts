/**
 * useUpdateAttendance Hook
 * Update attendance record with version check and optimistic updates
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceApi } from '../api/attendance.api';
import { attendanceQueryKeys } from '../constants/attendance.constants';
import { formatDateForInput } from '../utils/attendance.utils';
import type { UpdateAttendanceData, AttendanceRecord } from '../types/attendance.types';

export const useUpdateAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateAttendanceData) => attendanceApi.update(data),
    onMutate: async (updatedData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: attendanceQueryKeys.all });

      // Snapshot previous values
      const previousRecord = queryClient.getQueryData<AttendanceRecord>(
        attendanceQueryKeys.byDate(updatedData.classId, updatedData.date || '')
      );

      // Optimistically update cache
      if (previousRecord && updatedData.date) {
        const optimisticRecord: AttendanceRecord = {
          ...previousRecord,
          id: updatedData.recordId,
          date: updatedData.date ? new Date(updatedData.date) : previousRecord.date,
          lectureId: updatedData.lectureId ?? previousRecord.lectureId,
          students: updatedData.students
            ? updatedData.students.map((s) => ({
                studentId: s.studentId,
                studentName: previousRecord.students.find((st) => st.studentId === s.studentId)?.studentName || '',
                status: s.status,
                remarks: s.remarks,
              }))
            : previousRecord.students,
          updatedAt: new Date(),
          version: (previousRecord.version || 0) + 1,
        };

        queryClient.setQueryData(
          attendanceQueryKeys.byDate(updatedData.classId, updatedData.date),
          optimisticRecord
        );
      }

      return { previousRecord };
    },
    onError: (_error, updatedData, context) => {
      // Rollback on error
      if (context?.previousRecord && updatedData.date) {
        queryClient.setQueryData(
          attendanceQueryKeys.byDate(updatedData.classId, updatedData.date),
          context.previousRecord
        );
      }
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: attendanceQueryKeys.dashboard() });
      queryClient.invalidateQueries({ queryKey: attendanceQueryKeys.list() });
      if (variables.date) {
        queryClient.invalidateQueries({ 
          queryKey: attendanceQueryKeys.byDate(variables.classId, variables.date) 
        });
      }
      queryClient.invalidateQueries({ 
        queryKey: attendanceQueryKeys.stats(variables.classId) 
      });

      // Update cache with server response
      if (data.date) {
        queryClient.setQueryData(
          attendanceQueryKeys.byDate(data.classId, formatDateForInput(data.date)),
          data
        );
      }
    },
  });
};

