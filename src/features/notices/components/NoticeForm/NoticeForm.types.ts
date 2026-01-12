/**
 * NoticeForm Types
 */

import type { CreateNoticeData, Notice } from '../../types/notices.types';

export interface NoticeFormProps {
  initialData?: Notice;
  onSubmit: (data: CreateNoticeData) => void;
  onSaveDraft?: (data: CreateNoticeData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  onFormDataChange?: (data: Partial<CreateNoticeData>) => void;
}

export interface NoticeFormValues extends Partial<CreateNoticeData> {
  title: string;
  description: string;
  audience: CreateNoticeData['audience'];
  classIds: string[];
  priority: CreateNoticeData['priority'];
  publishType: CreateNoticeData['publishType'];
  publishAt?: Date;
  expiresAt?: Date;
}
