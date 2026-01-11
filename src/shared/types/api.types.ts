/**
 * Common API Types
 * Shared types used across all API services
 */

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
  originalMessage?: string; // Original error message for debugging
  details?: Array<{
    field: string;
    message: string;
  }>;
}

/**
 * Backend Error Response Format
 * Matches the backend API error structure
 */
export interface BackendErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Array<{
      field: string;
      message: string;
    }>;
  };
}

/**
 * Backend Success Response Format
 */
export interface BackendSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface IdParam {
  id: string;
}


