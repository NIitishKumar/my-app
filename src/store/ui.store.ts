/**
 * UI Store
 * Manages global UI state: sidebar, modals, theme, toasts
 */

import { create } from 'zustand';
import type { ModalType, Theme, Toast } from './types';

interface UIState {
  // Sidebar
  isSidebarOpen: boolean;

  // Modal
  activeModal: ModalType;
  modalData: Record<string, unknown> | null;

  // Theme
  theme: Theme;

  // Toasts
  toasts: Toast[];

  // Loading states
  isLoading: boolean;
}

interface UIActions {
  // Sidebar actions
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;

  // Modal actions
  openModal: (modal: ModalType, data?: Record<string, unknown>) => void;
  closeModal: () => void;

  // Theme actions
  setTheme: (theme: Theme) => void;

  // Toast actions
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;

  // Loading actions
  setLoading: (loading: boolean) => void;
}

type UIStore = UIState & UIActions;

// Generate unique ID for toasts
const generateId = () => Math.random().toString(36).substring(2, 9);

export const useUIStore = create<UIStore>((set) => ({
  // Initial state
  isSidebarOpen: false,
  activeModal: null,
  modalData: null,
  theme: 'light',
  toasts: [],
  isLoading: false,

  // Sidebar actions
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  openSidebar: () => set({ isSidebarOpen: true }),
  closeSidebar: () => set({ isSidebarOpen: false }),

  // Modal actions
  openModal: (modal, data = null) =>
    set({ activeModal: modal, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: null }),

  // Theme actions
  setTheme: (theme) => {
    set({ theme });
    // Persist theme preference
    localStorage.setItem('theme', theme);
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  // Toast actions
  addToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id: generateId() }],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
  clearToasts: () => set({ toasts: [] }),

  // Loading actions
  setLoading: (loading) => set({ isLoading: loading }),
}));

// Selectors for optimized re-renders
export const selectIsSidebarOpen = (state: UIStore) => state.isSidebarOpen;
export const selectActiveModal = (state: UIStore) => state.activeModal;
export const selectModalData = (state: UIStore) => state.modalData;
export const selectTheme = (state: UIStore) => state.theme;
export const selectToasts = (state: UIStore) => state.toasts;
export const selectIsLoading = (state: UIStore) => state.isLoading;

