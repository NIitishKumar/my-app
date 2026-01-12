/**
 * NoticeForm Hook
 * Custom hook for form logic
 */

import { useMemo, useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { validateNoticeForm, getDefaultNoticeFormData, formatDateTimeForInput, parseDateTimeFromInput } from '../../utils/notices.utils';
import type { CreateNoticeData, Notice } from '../../types/notices.types';
import type { NoticeFormValues } from './NoticeForm.types';

export const useNoticeForm = (
  initialData: Notice | undefined,
  onSubmit: (data: CreateNoticeData) => void,
  onSaveDraft: ((data: CreateNoticeData) => void) | undefined = undefined,
  _isLoading: boolean | undefined = undefined,
  onFormDataChange: ((data: Partial<CreateNoticeData>) => void) | undefined = undefined
) => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initial values
  const initialValues = useMemo<NoticeFormValues>(() => {
    if (initialData) {
      return {
        title: initialData.title,
        description: initialData.description,
        audience: initialData.audience,
        classIds: initialData.classIds || [],
        priority: initialData.priority,
        publishType: initialData.status === 'SCHEDULED' ? 'SCHEDULED' : 'NOW',
        publishAt: initialData.publishAt,
        expiresAt: initialData.expiresAt,
      };
    }
    return getDefaultNoticeFormData() as NoticeFormValues;
  }, [initialData]);

  const formik = useFormik<NoticeFormValues>({
    initialValues,
    validate: (values) => {
      const errors = validateNoticeForm(values);
      return errors;
    },
    onSubmit: (values) => {
      const noticeData: CreateNoticeData = {
        title: values.title,
        description: values.description,
        audience: values.audience!,
        classIds: values.classIds.length > 0 ? values.classIds : undefined,
        priority: values.priority!,
        publishType: values.publishType!,
        publishAt: values.publishAt,
        expiresAt: values.expiresAt,
      };
      onSubmit(noticeData);
    },
    enableReinitialize: true,
  });

  // Notify parent of form data changes for preview
  useEffect(() => {
    if (onFormDataChange) {
      onFormDataChange({
        title: formik.values.title || '',
        description: formik.values.description || '',
        audience: formik.values.audience,
        classIds: formik.values.classIds || [],
        priority: formik.values.priority,
        publishType: formik.values.publishType,
        publishAt: formik.values.publishAt,
        expiresAt: formik.values.expiresAt,
      });
    }
  }, [formik.values, onFormDataChange]);

  const handleSaveDraft = () => {
    if (onSaveDraft) {
      const noticeData: CreateNoticeData = {
        title: formik.values.title || '',
        description: formik.values.description || '',
        audience: formik.values.audience || 'ALL',
        classIds: formik.values.classIds.length > 0 ? formik.values.classIds : undefined,
        priority: formik.values.priority || 'NORMAL',
        publishType: formik.values.publishType || 'NOW',
        publishAt: formik.values.publishAt,
        expiresAt: formik.values.expiresAt,
      };
      onSaveDraft(noticeData);
    }
  };

  const getFieldError = (field: string): string | undefined => {
    return formik.errors[field as keyof typeof formik.errors] as string | undefined;
  };

  const isFieldInvalid = (field: string): boolean => {
    return !!(formik.touched[field as keyof typeof formik.touched] && formik.errors[field as keyof typeof formik.errors]);
  };

  const titleCharCount = formik.values.title?.length || 0;
  const descriptionCharCount = formik.values.description?.length || 0;

  return {
    formik,
    isOffline,
    handleSaveDraft,
    getFieldError,
    isFieldInvalid,
    titleCharCount,
    descriptionCharCount,
    formatDateTimeForInput,
    parseDateTimeFromInput,
  };
};
