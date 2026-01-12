/**
 * useCreateNotice Hook - POST (with offline support)
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { noticesApi } from '../api/notices.api';
import { noticesQueryKeys } from '../constants/notices.constants';
import { useNoticesStore } from '../../../store/notices.store';
import { useUIStore } from '../../../store';
import type { CreateNoticeData } from '../types/notices.types';

export const useCreateNotice = () => {
  const queryClient = useQueryClient();
  const saveDraft = useNoticesStore((state) => state.saveDraft);
  const addToast = useUIStore((state) => state.addToast);

  return useMutation({
    mutationFn: async (data: CreateNoticeData) => {
      // Check if offline
      if (!navigator.onLine) {
        // Save to draft store
        const draftId = saveDraft({
          title: data.title,
          description: data.description,
          audience: data.audience,
          classIds: data.classIds || [],
          priority: data.priority,
          publishType: data.publishType,
          publishAt: data.publishAt,
          expiresAt: data.expiresAt,
        });

        addToast({
          type: 'info',
          message: 'Notice saved as draft. It will be published when you come back online.',
          duration: 5000,
        });

        // Throw error to prevent mutation from being marked as success
        throw new Error('OFFLINE_DRAFT_SAVED');
      }

      // Online - proceed with API call
      return noticesApi.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticesQueryKeys.all });
      addToast({
        type: 'success',
        message: 'Notice published successfully!',
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      // Don't show error toast for offline draft saves
      if (error.message !== 'OFFLINE_DRAFT_SAVED') {
        addToast({
          type: 'error',
          message: `Failed to publish notice: ${error.message}`,
          duration: 5000,
        });
      }
    },
  });
};
