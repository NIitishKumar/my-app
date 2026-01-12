/**
 * Notices Store
 * Manages draft notices for offline support
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CreateNoticeData } from '../features/notices/types/notices.types';

export interface NoticeDraft {
  id: string;
  title: string;
  description: string;
  audience: CreateNoticeData['audience'];
  classIds: string[];
  priority: CreateNoticeData['priority'];
  publishType: CreateNoticeData['publishType'];
  publishAt?: string; // ISO string for persistence
  expiresAt?: string; // ISO string for persistence
  createdAt: string; // ISO string for persistence
  updatedAt: string; // ISO string for persistence
}

// Helper type for draft with Date objects (for internal use)
export interface NoticeDraftWithDates extends Omit<NoticeDraft, 'publishAt' | 'expiresAt' | 'createdAt' | 'updatedAt'> {
  publishAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface NoticesState {
  drafts: NoticeDraft[];
}

interface NoticesActions {
  saveDraft: (draft: Omit<NoticeDraft, 'id' | 'createdAt' | 'updatedAt' | 'publishAt' | 'expiresAt'> & { publishAt?: Date; expiresAt?: Date }) => string;
  getDraft: (id: string) => NoticeDraftWithDates | undefined;
  deleteDraft: (id: string) => void;
  clearDrafts: () => void;
  getAllDrafts: () => NoticeDraftWithDates[];
}

type NoticesStore = NoticesState & NoticesActions;

// Generate unique ID for drafts
const generateDraftId = () => `draft-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

export const useNoticesStore = create<NoticesStore>()(
  persist(
    (set, get) => ({
      drafts: [],

      saveDraft: (draftData) => {
        const id = generateDraftId();
        const now = new Date();
        const draft: NoticeDraft = {
          id,
          title: draftData.title,
          description: draftData.description,
          audience: draftData.audience,
          classIds: draftData.classIds,
          priority: draftData.priority,
          publishType: draftData.publishType,
          publishAt: draftData.publishAt?.toISOString(),
          expiresAt: draftData.expiresAt?.toISOString(),
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        };

        set((state) => ({
          drafts: [...state.drafts, draft],
        }));

        return id;
      },

      getDraft: (id) => {
        const draft = get().drafts.find((draft) => draft.id === id);
        if (!draft) return undefined;
        
        return {
          ...draft,
          publishAt: draft.publishAt ? new Date(draft.publishAt) : undefined,
          expiresAt: draft.expiresAt ? new Date(draft.expiresAt) : undefined,
          createdAt: new Date(draft.createdAt),
          updatedAt: new Date(draft.updatedAt),
        };
      },

      deleteDraft: (id) => {
        set((state) => ({
          drafts: state.drafts.filter((draft) => draft.id !== id),
        }));
      },

      clearDrafts: () => {
        set({ drafts: [] });
      },

      getAllDrafts: () => {
        return get().drafts.map((draft) => ({
          ...draft,
          publishAt: draft.publishAt ? new Date(draft.publishAt) : undefined,
          expiresAt: draft.expiresAt ? new Date(draft.expiresAt) : undefined,
          createdAt: new Date(draft.createdAt),
          updatedAt: new Date(draft.updatedAt),
        }));
      },
    }),
    {
      name: 'notices-drafts-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Selectors for optimized re-renders
export const selectDrafts = (state: NoticesStore) => state.drafts;
export const selectDraftById = (id: string) => (state: NoticesStore) => state.getDraft(id);
