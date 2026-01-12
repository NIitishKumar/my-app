/**
 * useSubjectView Hook - GET by id (for teachers, students, parents)
 */

import { useQuery } from '@tanstack/react-query';
import { subjectsViewApi } from '../api/subjects-view.api';
import { subjectsQueryKeys } from '../constants/subjects.constants';

export const useSubjectView = (id: string) => {
  return useQuery({
    queryKey: subjectsQueryKeys.detail(id),
    queryFn: () => subjectsViewApi.getById(id),
    enabled: !!id,
  });
};

