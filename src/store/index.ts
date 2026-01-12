/**
 * Store Exports
 * Central export point for all Zustand stores
 */

// UI Store
export {
  useUIStore,
  selectIsSidebarOpen,
  selectActiveModal,
  selectModalData,
  selectTheme,
  selectToasts,
  selectIsLoading,
} from './ui.store';

// Auth Store
export {
  useAuthStore,
  selectUser,
  selectToken,
  selectIsAuthenticated,
  selectIsHydrated,
  selectUserRole,
  selectUserName,
  useIsAuthenticated,
  useCurrentUser,
  useUserRole,
} from './auth.store';

// Notices Store
export {
  useNoticesStore,
  selectDrafts,
  selectDraftById,
} from './notices.store';
export type { NoticeDraft } from './notices.store';

// Types
export type { User, ModalType, Theme, Toast } from './types';


