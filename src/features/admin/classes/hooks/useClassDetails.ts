/**
 * useClassDetails Hook - GET by id
 */

import { useQuery } from '@tanstack/react-query';
import { classesApi } from '../api/classes.api';
import { classesQueryKeys } from '../constants/classes.constants';

export const useClassDetails = (id: string) => {
  return useQuery({
    queryKey: classesQueryKeys.detail(id),
    queryFn: () => classesApi.getById(id),
    enabled: !!id,
  });
};


