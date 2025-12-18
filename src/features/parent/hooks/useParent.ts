/**
 * Parent React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { parentService } from '../api/parent.service';
import { queryKeys } from '../../../shared/hooks/useApi';
import type { CreateQueryData } from '../models/parent.model';

// Children
export const useChildren = () => {
  return useQuery({
    queryKey: queryKeys.parent.children,
    queryFn: () => parentService.getChildren(),
  });
};

// Attendance
export const useChildAttendance = (childId: string) => {
  return useQuery({
    queryKey: queryKeys.parent.attendance(childId),
    queryFn: () => parentService.getChildAttendance(childId),
    enabled: !!childId,
  });
};

// Academic Records
export const useChildRecords = (childId: string) => {
  return useQuery({
    queryKey: queryKeys.parent.records(childId),
    queryFn: () => parentService.getChildRecords(childId),
    enabled: !!childId,
  });
};

// Teachers
export const useChildTeachers = (childId: string) => {
  return useQuery({
    queryKey: queryKeys.parent.teachers(childId),
    queryFn: () => parentService.getTeachers(childId),
    enabled: !!childId,
  });
};

// Queries
export const useQueries = () => {
  return useQuery({
    queryKey: queryKeys.parent.queries,
    queryFn: () => parentService.getQueries(),
  });
};

export const useCreateQuery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateQueryData) => parentService.createQuery(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.parent.queries });
    },
  });
};

