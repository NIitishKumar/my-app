/**
 * Shared Store Types
 * Common types used across Zustand stores
 */

import type { UserRole } from '../shared/constants';

// User type for auth store
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

// Modal types for UI store
export type ModalType =
  | 'addStudent'
  | 'addTeacher'
  | 'addClass'
  | 'addExam'
  | 'createNotice'
  | 'settings'
  | 'profile'
  | 'confirm'
  | null;

// Theme type
export type Theme = 'light' | 'dark' | 'system';

// Toast notification type
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}


