/**
 * Notices Domain Types
 */

export type NoticeAudience = 'ALL' | 'TEACHERS' | 'STUDENTS' | 'PARENTS';
export type NoticePriority = 'NORMAL' | 'IMPORTANT' | 'URGENT';
export type NoticeStatus = 'PUBLISHED' | 'SCHEDULED' | 'DRAFT';
export type PublishType = 'NOW' | 'SCHEDULED';

export interface Notice {
  id: string;
  title: string;
  description: string;
  audience: NoticeAudience;
  classIds: string[];
  priority: NoticePriority;
  status: NoticeStatus;
  publishAt: Date;
  expiresAt?: Date;
  attachmentUrl?: string;
  attachmentName?: string;
  createdBy: string; // User ID
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNoticeData {
  title: string;
  description: string;
  audience: NoticeAudience;
  classIds?: string[];
  priority: NoticePriority;
  publishType: PublishType;
  publishAt?: Date;
  expiresAt?: Date;
  attachment?: File;
}

export interface UpdateNoticeData extends Partial<CreateNoticeData> {
  id: string;
}

// API DTOs
export interface NoticeApiDTO {
  _id: string;
  title: string;
  description: string;
  audience: string;
  classIds: string[];
  priority: string;
  status: string;
  publishAt: string;
  expiresAt?: string | null;
  attachmentUrl?: string | null;
  attachmentName?: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoticeApiDTO {
  title: string;
  description: string;
  audience: string;
  classIds?: string[];
  priority: string;
  publishAt?: string;
  expiresAt?: string;
}

export interface NoticesApiResponse {
  success: boolean;
  count: number;
  data: NoticeApiDTO[];
}

export interface NoticeApiResponse {
  success: boolean;
  data: NoticeApiDTO;
}

export interface CreateNoticeApiResponse {
  success: boolean;
  message: string;
  data: NoticeApiDTO;
}

export interface UpdateNoticeApiResponse {
  success: boolean;
  message: string;
  data: NoticeApiDTO;
}
