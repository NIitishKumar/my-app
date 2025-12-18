/**
 * Auth Domain Models
 * Clean domain models separated from API DTOs
 */

import type { UserRole } from '../../../shared/constants';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt?: Date;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt?: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}


