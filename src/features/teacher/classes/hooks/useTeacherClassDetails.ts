/**
 * useTeacherClassDetails Hook - GET class details by id
 */

import { useQuery } from '@tanstack/react-query';
import { teacherClassesApi } from '../api/teacher-classes.api';

export const useTeacherClassDetails = (classId: string) => {
  return useQuery({
    queryKey: ['teacher', 'classes', 'detail', classId],
    queryFn: () => teacherClassesApi.getClassDetails(classId),
    enabled: !!classId,
  });
};

