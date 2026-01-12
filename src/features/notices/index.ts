/**
 * Notices Feature Exports
 */

// Pages
export { NoticesListPage } from './pages/NoticesListPage';
export { CreateNoticePage } from './pages/CreateNoticePage';

// Components
export { NoticeForm } from './components/NoticeForm';
export { NoticePreview } from './components/NoticePreview';
export { NoticeTable } from './components/NoticeTable';
export { ClassSelector } from './components/ClassSelector';

// Hooks
export { useNotices } from './hooks/useNotices';
export { useNoticeDetails } from './hooks/useNoticeDetails';
export { useCreateNotice } from './hooks/useCreateNotice';
export { useUpdateNotice } from './hooks/useUpdateNotice';
export { useDeleteNotice } from './hooks/useDeleteNotice';
export { useNoticeDraft } from './hooks/useNoticeDraft';

// Types
export type {
  Notice,
  CreateNoticeData,
  UpdateNoticeData,
  NoticeAudience,
  NoticePriority,
  NoticeStatus,
  PublishType,
} from './types/notices.types';

// Constants
export {
  NOTICE_AUDIENCE,
  NOTICE_PRIORITY,
  NOTICE_STATUS,
  PUBLISH_TYPE,
  AUDIENCE_OPTIONS,
  PRIORITY_OPTIONS,
} from './constants/notices.constants';
