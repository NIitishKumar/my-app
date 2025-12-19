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

// Types
export type { User, ModalType, Theme, Toast } from './types';

