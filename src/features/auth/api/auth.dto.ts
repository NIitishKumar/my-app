/**
 * Auth API DTOs
 * Data Transfer Objects representing raw API responses
 */

export interface UserDTO {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name: string;
  role: string;
  employeeId?: string;
  department?: string;
  avatar?: string;
  created_at?: string;
  createdAt?: string; // Support both formats
}

export interface AuthResponseDTO {
  success: boolean;
  token: string;
  user: UserDTO;
  expires_at?: string;
  expiresAt?: string; // Support both formats
}

export interface LoginRequestDTO {
  email: string;
  password: string;
}


