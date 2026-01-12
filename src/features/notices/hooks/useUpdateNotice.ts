/**
 * useUpdateNotice Hook - PUT
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { noticesApi } from '../api/notices.api';
import { noticesQueryKeys } from '../constants/notices.constants';
import { useUIStore } from '../../../store';
import type { UpdateNoticeData } from '../types/notices.types';

export const useUpdateNotice = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);

  return useMutation({
    mutationFn: (data: UpdateNoticeData) => noticesApi.update(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: noticesQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: noticesQueryKeys.detail(variables.id) });
      addToast({
        type: 'success',
        message: 'Notice updated successfully!',
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      addToast({
        type: 'error',
        message: `Failed to update notice: ${error.message}`,
        duration: 5000,
      });
    },
  });
};
