/**
 * Admin React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../api/admin.service';
import { queryKeys } from '../../../shared/hooks/useApi';
import type {
  CreateClassData,
  UpdateClassData,
  CreateTeacherData,
  UpdateTeacherData,
  CreateLectureData,
  UpdateLectureData,
} from '../models/admin.model';

// Classes
export const useClasses = () => {
  return useQuery({
    queryKey: queryKeys.admin.classes,
    queryFn: () => adminService.getClasses(),
  });
};

export const useClass = (id: string) => {
  return useQuery({
    queryKey: queryKeys.admin.class(id),
    queryFn: () => adminService.getClass(id),
    enabled: !!id,
  });
};

export const useCreateClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateClassData) => adminService.createClass(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.classes });
    },
  });
};

export const useUpdateClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateClassData) => adminService.updateClass(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.classes });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.class(variables.id) });
    },
  });
};

export const useDeleteClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminService.deleteClass(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.classes });
    },
  });
};

// Teachers
export const useTeachers = () => {
  return useQuery({
    queryKey: queryKeys.admin.teachers,
    queryFn: () => adminService.getTeachers(),
  });
};

export const useTeacher = (id: string) => {
  return useQuery({
    queryKey: queryKeys.admin.teacher(id),
    queryFn: () => adminService.getTeacher(id),
    enabled: !!id,
  });
};

export const useCreateTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTeacherData) => adminService.createTeacher(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.teachers });
    },
  });
};

export const useUpdateTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTeacherData) => adminService.updateTeacher(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.teachers });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.teacher(variables.id) });
    },
  });
};

export const useDeleteTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminService.deleteTeacher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.teachers });
    },
  });
};

// Lectures
export const useLectures = () => {
  return useQuery({
    queryKey: queryKeys.admin.lectures,
    queryFn: () => adminService.getLectures(),
  });
};

export const useLecture = (id: string) => {
  return useQuery({
    queryKey: queryKeys.admin.lecture(id),
    queryFn: () => adminService.getLecture(id),
    enabled: !!id,
  });
};

export const useCreateLecture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLectureData) => adminService.createLecture(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.lectures });
    },
  });
};

export const useUpdateLecture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateLectureData) => adminService.updateLecture(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.lectures });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.lecture(variables.id) });
    },
  });
};

export const useDeleteLecture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminService.deleteLecture(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.lectures });
    },
  });
};

// Reports
export const useReports = () => {
  return useQuery({
    queryKey: queryKeys.admin.reports,
    queryFn: () => adminService.getReports(),
  });
};


