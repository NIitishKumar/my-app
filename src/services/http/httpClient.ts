/**
 * Enhanced HTTP Client
 * Wraps axios with better error handling and type support
 */

import { AxiosError, type AxiosResponse } from 'axios';
import { apiClient } from '../api';
import type { ApiError } from '../../shared/types/api.types';

class HttpClient {
  /**
   * GET request
   */
  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    try {
      const response: AxiosResponse<T> = await apiClient.get(url, { params });
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * POST request
   */
  async post<T, D = any>(url: string, data?: D): Promise<T> {
    try {
      const response: AxiosResponse<T> = await apiClient.post(url, data);
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * PUT request
   */
  async put<T, D = any>(url: string, data?: D): Promise<T> {
    try {
      const response: AxiosResponse<T> = await apiClient.put(url, data);
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * PATCH request
   */
  async patch<T, D = any>(url: string, data?: D): Promise<T> {
    try {
      const response: AxiosResponse<T> = await apiClient.patch(url, data);
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * DELETE request
   */
  async delete<T, D = any>(url: string, data?: D): Promise<T> {
    try {
      const response: AxiosResponse<T> = await apiClient.delete(url, { data });
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle successful response
   */
  private handleResponse<T>(response: AxiosResponse<T>): T {
    return response.data;
  }

  /**
   * Handle error response
   */
  private handleError(error: unknown): ApiError {
    if (error instanceof AxiosError) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || error.message || 'An error occurred';
      const code = error.response?.data?.code || error.code || 'UNKNOWN_ERROR';
      
      // Enhanced error messages based on status code
      let userMessage = message;
      switch (status) {
        case 401:
          userMessage = 'Your session has expired. Please login again.';
          break;
        case 403:
          userMessage = error.response?.data?.message || 'You do not have permission to access this resource.';
          break;
        case 404:
          userMessage = error.response?.data?.message || 'The requested resource was not found.';
          break;
        case 409:
          userMessage = error.response?.data?.message || 'This record already exists.';
          break;
        case 422:
          userMessage = error.response?.data?.message || 'Please check your input data and try again.';
          break;
        case 500:
          userMessage = 'Server error. Please try again later.';
          break;
        case 503:
          userMessage = 'Service temporarily unavailable. Please try again later.';
          break;
      }

      return {
        message: userMessage,
        code,
        status,
        // Include original error for debugging
        originalMessage: message,
      };
    }

    return {
      message: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
      status: 500,
    };
  }
}

export const httpClient = new HttpClient();

