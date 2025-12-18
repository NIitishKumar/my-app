/**
 * useClasses Hook - GET list
 */

import { useQuery } from '@tanstack/react-query';
import { classesApi } from '../api/classes.api';
import { classesQueryKeys } from '../constants/classes.constants';

export const useClasses = () => {
  return useQuery({
    queryKey: classesQueryKeys.lists(),
    queryFn: () => classesApi.getAll(),
  });
};


