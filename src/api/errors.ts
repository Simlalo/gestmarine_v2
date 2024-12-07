import { AxiosError } from 'axios';

export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTH = 'AUTH',
  VALIDATION = 'VALIDATION',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN'
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public type: ErrorType = ErrorType.UNKNOWN,
    public data?: any,
    public originalError?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static fromAxiosError(error: AxiosError): ApiError {
    const status = error.response?.status;
    let type = ErrorType.UNKNOWN;
    let message = error.message;
    let data = error.response?.data;

    if (!error.response) {
      type = ErrorType.NETWORK;
      message = 'Network error occurred';
    } else if (status === 401 || status === 403) {
      type = ErrorType.AUTH;
      message = 'Authentication error';
    } else if (status === 400 || status === 422) {
      type = ErrorType.VALIDATION;
      message = 'Validation error';
    } else if (status && status >= 500) {
      type = ErrorType.SERVER;
      message = 'Server error occurred';
    }

    return new ApiError(message, status, type, data, error);
  }

  public isType(type: ErrorType): boolean {
    return this.type === type;
  }
}

export const handleApiError = (error: any): never => {
  if (process.env.NODE_ENV === 'development') {
    console.group('API Error');
    console.error('Error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: error.config,
    });
    console.groupEnd();
  }

  if (error instanceof ApiError) {
    throw error;
  }

  if (error.isAxiosError) {
    throw ApiError.fromAxiosError(error);
  }

  // Handle non-Axios errors
  throw new ApiError(
    error.message || 'Une erreur inconnue est survenue',
    500,
    ErrorType.UNKNOWN,
    null,
    error
  );
}
