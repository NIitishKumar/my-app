/**
 * useNoticeDraft Hook - Draft management
 */

import { useCallback } from 'react';
import { useNoticesStore } from '../../../store/notices.store';
import { useCreateNotice } from './useCreateNotice';
import { useUIStore } from '../../../store';
import type { CreateNoticeData } from '../types/notices.types';

export const useNoticeDraft = () => {
  const saveDraft = useNoticesStore((state) => state.saveDraft);
  const getDraft = useNoticesStore((state) => state.getDraft);
  const deleteDraft = useNoticesStore((state) => state.deleteDraft);
  const clearDrafts = useNoticesStore((state) => state.clearDrafts);
  const getAllDrafts = useNoticesStore((state) => state.getAllDrafts);
  const createNotice = useCreateNotice();
  const addToast = useUIStore((state) => state.addToast);

  const saveDraftNotice = useCallback((data: CreateNoticeData): string => {
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
      type: 'success',
      message: 'Draft saved successfully!',
      duration: 3000,
    });

    return draftId;
  }, [saveDraft, addToast]);

  const syncDraft = useCallback(async (draftId: string): Promise<boolean> => {
    const draft = getDraft(draftId);
    if (!draft) return false;

    try {
      const noticeData: CreateNoticeData = {
        title: draft.title,
        description: draft.description,
        audience: draft.audience,
        classIds: draft.classIds,
        priority: draft.priority,
        publishType: draft.publishType,
        publishAt: draft.publishAt instanceof Date ? draft.publishAt : (draft.publishAt ? new Date(draft.publishAt) : undefined),
        expiresAt: draft.expiresAt instanceof Date ? draft.expiresAt : (draft.expiresAt ? new Date(draft.expiresAt) : undefined),
      };

      await createNotice.mutateAsync(noticeData);
      deleteDraft(draftId);
      return true;
    } catch (error) {
      console.error('Failed to sync draft:', error);
      return false;
    }
  }, [getDraft, createNotice, deleteDraft]);

  const syncAllDrafts = useCallback(async (): Promise<void> => {
    if (!navigator.onLine) return;

    const drafts = getAllDrafts();
    if (drafts.length === 0) return;

    addToast({
      type: 'info',
      message: `Syncing ${drafts.length} draft(s)...`,
      duration: 3000,
    });

    const results = await Promise.allSettled(
      drafts.map((draft) => syncDraft(draft.id))
    );

    const successCount = results.filter((r) => r.status === 'fulfilled' && r.value).length;
    const failCount = results.length - successCount;

    if (successCount > 0) {
      addToast({
        type: 'success',
        message: `Successfully synced ${successCount} draft(s)!`,
        duration: 3000,
      });
    }

    if (failCount > 0) {
      addToast({
        type: 'error',
        message: `Failed to sync ${failCount} draft(s). Please try again.`,
        duration: 5000,
      });
    }
  }, [getAllDrafts, syncDraft, addToast]);

  return {
    saveDraft: saveDraftNotice,
    getDraft,
    deleteDraft,
    clearDrafts,
    getAllDrafts,
    syncDraft,
    syncAllDrafts,
  };
};
