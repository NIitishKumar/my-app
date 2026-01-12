/**
 * useDeleteNotice Hook - DELETE
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { noticesApi } from '../api/notices.api';
import { noticesQueryKeys } from '../constants/notices.constants';
import { useUIStore } from '../../../store';

export const useDeleteNotice = () => {
  const queryClient = useQueryClient();
  const addToast = useUIStore((state) => state.addToast);

  return useMutation({
    mutationFn: (id: string) => noticesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticesQueryKeys.all });
      addToast({
        type: 'success',
        message: 'Notice deleted successfully!',
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      addToast({
        type: 'error',
        message: `Failed to delete notice: ${error.message}`,
        duration: 5000,
      });
    },
  });
};
