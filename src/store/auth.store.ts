/**
 * Auth Store
 * Manages authentication state: user, token, role, session
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from './types';
import type { UserRole } from '../shared/constants';

interface AuthState {
  // User data
  user: User | null;
  token: string | null;

  // Session state
  isAuthenticated: boolean;
  isHydrated: boolean;
}

interface AuthActions {
  // Auth actions
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;

  // Session management
  setHydrated: (hydrated: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isHydrated: false,

      // Auth actions
      login: (user, token) => {
        // Save to Zustand state (auto-persisted via persist middleware)
        set({
          user,
          token,
          isAuthenticated: true,
        });
        
        // Also save to legacy localStorage keys for backward compatibility
        // with axios interceptors and authService.getSession()
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        // Clear any remaining localStorage items
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      },

      setUser: (user) => set({ user }),
      
      setToken: (token) => set({ token }),

      // Hydration
      setHydrated: (hydrated) => set({ isHydrated: hydrated }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);

// Selectors for optimized re-renders
export const selectUser = (state: AuthStore) => state.user;
export const selectToken = (state: AuthStore) => state.token;
export const selectIsAuthenticated = (state: AuthStore) => state.isAuthenticated;
export const selectIsHydrated = (state: AuthStore) => state.isHydrated;
export const selectUserRole = (state: AuthStore): UserRole | null => state.user?.role ?? null;
export const selectUserName = (state: AuthStore): string | null => state.user?.name ?? null;

// Helper hooks for common patterns
export const useIsAuthenticated = () => useAuthStore(selectIsAuthenticated);
export const useCurrentUser = () => useAuthStore(selectUser);
export const useUserRole = () => useAuthStore(selectUserRole);


