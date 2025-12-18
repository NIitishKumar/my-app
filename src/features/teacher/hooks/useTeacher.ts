/**
 * Teacher React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teacherService } from '../api/teacher.service';
import { queryKeys } from '../../../shared/hooks/useApi';
import type { MarkAttendanceData, CreateQueryData } from '../models/teacher.model';

// Classes
export const useAssignedClasses = () => {
  return useQuery({
    queryKey: queryKeys.teacher.classes,
    queryFn: () => teacherService.getAssignedClasses(),
  });
};

// Attendance
export const useAttendanceRecords = () => {
  return useQuery({
    queryKey: queryKeys.teacher.attendance,
    queryFn: () => teacherService.getAttendanceRecords(),
  });
};

export const useMarkAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MarkAttendanceData) => teacherService.markAttendance(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.teacher.attendance });
    },
  });
};

// Queries
export const useQueries = () => {
  return useQuery({
    queryKey: queryKeys.teacher.queries,
    queryFn: () => teacherService.getQueries(),
  });
};

export const useCreateQuery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateQueryData) => teacherService.createQuery(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.teacher.queries });
    },
  });
};


