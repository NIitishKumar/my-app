/**
 * CreateNoticePage Component
 */

import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { NoticeForm } from '../components/NoticeForm';
import { NoticePreview } from '../components/NoticePreview';
import { useCreateNotice } from '../hooks/useCreateNotice';
import { useUpdateNotice } from '../hooks/useUpdateNotice';
import { useNoticeDetails } from '../hooks/useNoticeDetails';
import { useNoticeDraft } from '../hooks/useNoticeDraft';
import { useNoticesStore } from '../../../store/notices.store';
import { ROUTES } from '../../../shared/constants';
import { useState, useEffect } from 'react';
import type { CreateNoticeData } from '../types/notices.types';

export const CreateNoticePage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const isEditMode = !!id;
  
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<Partial<CreateNoticeData>>({});

  const { data: notice, isLoading: isLoadingNotice } = useNoticeDetails(id || '');
  const createNotice = useCreateNotice();
  const updateNotice = useUpdateNotice();
  const { saveDraft, getDraft, syncAllDrafts } = useNoticeDraft();
  const getAllDrafts = useNoticesStore((state) => state.getAllDrafts);

  // Load draft from URL params or store
  const [draftNotice, setDraftNotice] = useState<Notice | undefined>();
  
  useEffect(() => {
    const draftId = (location.state as any)?.draftId;
    if (draftId && !isEditMode) {
      const draft = getDraft(draftId);
      if (draft) {
        // Convert draft to Notice format for initialData
        const notice: Notice = {
          id: draft.id,
          title: draft.title,
          description: draft.description,
          audience: draft.audience,
          classIds: draft.classIds,
          priority: draft.priority,
          status: 'DRAFT',
          publishAt: draft.publishAt || new Date(),
          expiresAt: draft.expiresAt,
          createdBy: '',
          createdAt: draft.createdAt,
          updatedAt: draft.updatedAt,
        };
        setDraftNotice(notice);
      }
    }
  }, [location.state, getDraft, isEditMode]);

  // Auto-sync drafts when coming online
  useEffect(() => {
    const handleOnline = () => {
      syncAllDrafts();
    };

    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [syncAllDrafts]);

  // Check for drafts on mount and sync if online
  useEffect(() => {
    if (navigator.onLine) {
      const drafts = getAllDrafts();
      if (drafts.length > 0) {
        syncAllDrafts();
      }
    }
  }, [getAllDrafts, syncAllDrafts]);

  const handleSubmit = async (data: CreateNoticeData) => {
    try {
      if (isEditMode && id) {
        await updateNotice.mutateAsync({ id, ...data });
      } else {
        await createNotice.mutateAsync(data);
      }
      navigate(ROUTES.ADMIN_NOTICES);
    } catch (error) {
      console.error('Error saving notice:', error);
    }
  };

  const handleSaveDraft = (data: CreateNoticeData) => {
    saveDraft(data);
  };

  const handleCancel = () => {
    navigate(ROUTES.ADMIN_NOTICES);
  };

  if (isEditMode && isLoadingNotice) {
    return (
      <div className="p-4 lg:p-6">
        <div className="text-center">Loading notice...</div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
          {isEditMode ? 'Edit Notice' : 'Create Notice'}
        </h1>
        <p className="text-sm text-gray-600">
          {isEditMode ? 'Update notice information' : 'Create a new notice or announcement'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <NoticeForm
            initialData={isEditMode ? notice : draftNotice}
            onSubmit={handleSubmit}
            onSaveDraft={handleSaveDraft}
            onCancel={handleCancel}
            isLoading={createNotice.isPending || updateNotice.isPending}
            onFormDataChange={setFormData}
          />
        </div>

        {/* Preview */}
        <div className="lg:col-span-1">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">Preview</h3>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="lg:hidden text-sm text-indigo-600 hover:text-indigo-700"
            >
              {showPreview ? 'Hide' : 'Show'} Preview
            </button>
          </div>
          {(showPreview || window.innerWidth >= 1024) && (
            <NoticePreview data={formData} />
          )}
        </div>
      </div>
    </div>
  );
};
