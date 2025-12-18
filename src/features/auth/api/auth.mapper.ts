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
      name: dto.name,
      role: dto.role as UserRole,
      avatar: dto.avatar,
      createdAt: dto.created_at || dto.createdAt
        ? new Date(dto.created_at || dto.createdAt!)
        : undefined,
    };
  }

  /**
   * Map AuthResponseDTO to AuthSession domain model
   */
  static authResponseToDomain(dto: AuthResponseDTO): AuthSession {
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


