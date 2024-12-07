// Pagination Types
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Filter Types
export interface BaseFilter {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiListResponse<T> extends ApiResponse<T[]> {
  pagination?: PaginationParams;
}

// Error Types
export interface ApiErrorResponse {
  message: string;
  code?: string;
  details?: Record<string, any>;
}

// Common Status Types
export type Status = 'active' | 'inactive' | 'pending' | 'archived';

// Common ID Types
export type ID = string;

// Timestamp Types
export interface Timestamps {
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

// Audit Types
export interface AuditInfo {
  createdBy: ID;
  updatedBy?: ID;
  deletedBy?: ID;
}
