/**
 * Student React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentService } from '../api/student.service';
import { queryKeys } from '../../../shared/hooks/useApi';

// Exams
export const useExams = () => {
  return useQuery({
    queryKey: queryKeys.student.exams,
    queryFn: () => studentService.getExams(),
  });
};

export const useExam = (id: string) => {
  return useQuery({
    queryKey: [...queryKeys.student.exams, id],
    queryFn: () => studentService.getExam(id),
    enabled: !!id,
  });
};

// Notifications
export const useNotifications = () => {
  return useQuery({
    queryKey: queryKeys.student.notifications,
    queryFn: () => studentService.getNotifications(),
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => studentService.markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.student.notifications });
    },
  });
};

// Academic Records
export const useAcademicRecords = () => {
  return useQuery({
    queryKey: queryKeys.student.records,
    queryFn: () => studentService.getAcademicRecords(),
  });
};

// Teachers
export const useTeachers = () => {
  return useQuery({
    queryKey: queryKeys.student.teachers,
    queryFn: () => studentService.getTeachers(),
  });
};


