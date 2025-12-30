/**
 * useTeacherClasses Hook - GET assigned classes
 */

import { useQuery } from '@tanstack/react-query';
import { teacherClassesApi } from '../api/teacher-classes.api';

export const useTeacherClasses = () => {
  return useQuery({
    queryKey: ['teacher', 'classes'],
    queryFn: () => teacherClassesApi.getAssignedClasses(),
  });
};

export const useTeacherClassSummaries = () => {
  return useQuery({
    queryKey: ['teacher', 'classes', 'summaries'],
    queryFn: () => teacherClassesApi.getClassSummaries(),
  });
};

