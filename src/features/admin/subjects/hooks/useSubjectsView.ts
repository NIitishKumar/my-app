/**
 * useSubjectsView Hook - GET list (for teachers, students, parents)
 */

import { useQuery } from '@tanstack/react-query';
import { subjectsViewApi } from '../api/subjects-view.api';
import { subjectsQueryKeys } from '../constants/subjects.constants';

export const useSubjectsView = () => {
  return useQuery({
    queryKey: subjectsQueryKeys.lists(),
    queryFn: () => subjectsViewApi.getAll(),
  });
};

