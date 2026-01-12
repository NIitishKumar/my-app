/**
 * Notices Utility Functions
 */

import type { Notice, CreateNoticeData } from '../types/notices.types';
import { VALIDATION } from '../constants/notices.constants';

/**
 * Validation errors interface
 */
export interface ValidationErrors {
  title?: string;
  description?: string;
  audience?: string;
  classIds?: string;
  priority?: string;
  publishType?: string;
  publishAt?: string;
  expiresAt?: string;
}

/**
 * Validate notice form data
 */
export const validateNoticeForm = (data: Partial<CreateNoticeData>): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Title validation
  if (!data.title || data.title.trim().length === 0) {
    errors.title = 'Title is required';
  } else if (data.title.length < VALIDATION.TITLE_MIN_LENGTH) {
    errors.title = `Title must be at least ${VALIDATION.TITLE_MIN_LENGTH} characters`;
  } else if (data.title.length > VALIDATION.TITLE_MAX_LENGTH) {
    errors.title = `Title must not exceed ${VALIDATION.TITLE_MAX_LENGTH} characters`;
  }

  // Description validation
  if (!data.description || data.description.trim().length === 0) {
    errors.description = 'Description is required';
  } else if (data.description.length < VALIDATION.DESCRIPTION_MIN_LENGTH) {
    errors.description = `Description must be at least ${VALIDATION.DESCRIPTION_MIN_LENGTH} characters`;
  } else if (data.description.length > VALIDATION.DESCRIPTION_MAX_LENGTH) {
    errors.description = `Description must not exceed ${VALIDATION.DESCRIPTION_MAX_LENGTH} characters`;
  }

  // Audience validation
  if (!data.audience) {
    errors.audience = 'Audience is required';
  }

  // ClassIds validation (required if audience is not ALL)
  if (data.audience && data.audience !== 'ALL') {
    if (!data.classIds || data.classIds.length === 0) {
      errors.classIds = 'At least one class must be selected';
    }
  }

  // Priority validation
  if (!data.priority) {
    errors.priority = 'Priority is required';
  }

  // Publish type validation
  if (!data.publishType) {
    errors.publishType = 'Publish type is required';
  }

  // PublishAt validation (required if scheduled)
  if (data.publishType === 'SCHEDULED') {
    if (!data.publishAt) {
      errors.publishAt = 'Publish date and time is required for scheduled notices';
    } else {
      const publishDate = data.publishAt instanceof Date ? data.publishAt : new Date(data.publishAt);
      const now = new Date();
      if (publishDate <= now) {
        errors.publishAt = 'Publish date must be in the future';
      }
    }
  }

  // ExpiresAt validation (optional, but must be after publishAt if provided)
  if (data.expiresAt) {
    const expiresDate = data.expiresAt instanceof Date ? data.expiresAt : new Date(data.expiresAt);
    const publishDate = data.publishAt
      ? (data.publishAt instanceof Date ? data.publishAt : new Date(data.publishAt))
      : new Date();

    if (expiresDate <= publishDate) {
      errors.expiresAt = 'Expiry date must be after publish date';
    }
  }

  return errors;
};

/**
 * Format date to YYYY-MM-DDTHH:mm for datetime-local input
 */
export const formatDateTimeForInput = (date: Date | string | undefined): string => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

/**
 * Format date to YYYY-MM-DD for date input
 */
export const formatDateForInput = (date: Date | string | undefined): string => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
};

/**
 * Parse datetime string to Date object
 */
export const parseDateTimeFromInput = (dateTimeString: string): Date | undefined => {
  if (!dateTimeString) return undefined;
  const date = new Date(dateTimeString);
  return isNaN(date.getTime()) ? undefined : date;
};

/**
 * Get default form values
 */
export const getDefaultNoticeFormData = (): Partial<CreateNoticeData> => {
  return {
    title: '',
    description: '',
    audience: 'ALL',
    classIds: [],
    priority: 'NORMAL',
    publishType: 'NOW',
    publishAt: undefined,
    expiresAt: undefined,
  };
};

/**
 * Format notice priority badge color
 */
export const getPriorityBadgeColor = (priority: string): string => {
  switch (priority) {
    case 'URGENT':
      return 'bg-red-100 text-red-800';
    case 'IMPORTANT':
      return 'bg-orange-100 text-orange-800';
    case 'NORMAL':
    default:
      return 'bg-blue-100 text-blue-800';
  }
};

/**
 * Format notice audience badge color
 */
export const getAudienceBadgeColor = (audience: string): string => {
  switch (audience) {
    case 'ALL':
      return 'bg-purple-100 text-purple-800';
    case 'TEACHERS':
      return 'bg-indigo-100 text-indigo-800';
    case 'STUDENTS':
      return 'bg-green-100 text-green-800';
    case 'PARENTS':
      return 'bg-cyan-100 text-cyan-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Filter notices by search term
 */
export const filterNotices = (notices: Notice[], searchTerm: string): Notice[] => {
  const term = searchTerm.toLowerCase();
  return notices.filter((notice) =>
    notice.title.toLowerCase().includes(term) ||
    notice.description.toLowerCase().includes(term)
  );
};
