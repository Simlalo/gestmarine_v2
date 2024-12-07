import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

// API Response Types
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export interface ApiErrorResponse {
  message: string;
  code?: string;
  details?: Record<string, any>;
}

// API Configuration Types
export interface ApiClientConfig extends AxiosRequestConfig {
  baseURL?: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

export interface ApiRequestConfig extends AxiosRequestConfig {
  skipRetry?: boolean;
  skipAuth?: boolean;
}

// Error Types
export interface ApiErrorOptions {
  status?: number;
  code?: string;
  details?: Record<string, any>;
  originalError?: Error | AxiosError;
}

// Type Guards
export function isApiErrorResponse(error: unknown): error is ApiErrorResponse {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as ApiErrorResponse).message === 'string'
  );
}

export function isAxiosError(error: unknown): error is AxiosError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error &&
    (error as AxiosError).isAxiosError === true
  );
}

// Pagination Types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
