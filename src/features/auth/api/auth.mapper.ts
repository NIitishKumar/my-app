/**
 * Auth Mappers
 * Transform DTOs to Domain Models
 */

import type { UserRole } from '../../../shared/constants';
import type { User, AuthSession, LoginCredentials } from '../models/auth.model';
import type { UserDTO, AuthResponseDTO, LoginRequestDTO } from './auth.dto';

export class AuthMapper {
  /**
   * Map UserDTO to User domain model
   */
  static userToDomain(dto: UserDTO): User {
    return {
      id: dto.id,
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      name: dto.name,
      role: dto.role as UserRole,
      employeeId: dto.employeeId,
      department: dto.department,
      avatar: dto.avatar,
      createdAt: dto.created_at || dto.createdAt
        ? new Date(dto.created_at || dto.createdAt!)
        : undefined,
    };
  }

  /**
   * Map AuthResponseDTO to AuthSession domain model
   * Handles the {success, token, user} response format
   */
  static authResponseToDomain(dto: AuthResponseDTO): AuthSession {
    // Validate that the response was successful
    if (!dto.success) {
      throw new Error('Authentication failed: API returned success=false');
    }

    return {
      token: dto.token,
      user: this.userToDomain(dto.user),
      expiresAt: dto.expires_at || dto.expiresAt
        ? new Date(dto.expires_at || dto.expiresAt!)
        : undefined,
    };
  }

  /**
   * Map LoginCredentials to LoginRequestDTO
   */
  static loginToDTO(credentials: LoginCredentials): LoginRequestDTO {
    return {
      email: credentials.email,
      password: credentials.password,
    };
  }
}


