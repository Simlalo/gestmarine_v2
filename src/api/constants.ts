// API version
export const API_VERSION = 'v1';

// API endpoints configuration
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },
  BARQUES: {
    BASE: '/barques',
    BY_ID: (id: string) => `/barques/${id}`,
    ASSIGNMENTS: (id: string) => `/barques/${id}/assignments`,
    IMPORT: '/barques/import',
    EXPORT: '/barques/export',
  },
  GERANTS: {
    BASE: '/gerants',
    BY_ID: (id: string) => `/gerants/${id}`,
    BARQUES: (id: string) => `/gerants/${id}/barques`,
  },
  PORTS: {
    BASE: '/ports',
    BY_ID: (id: string) => `/ports/${id}`,
  },
} as const;

// API configuration
export const API_CONFIG = {
  TIMEOUT: 15000, // 15 seconds
  RETRY: {
    MAX_RETRIES: 3,
    DELAY: 1000, // 1 second
  },
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
  },
} as const;

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection.',
  UNAUTHORIZED: 'Authentication required. Please log in.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Invalid data provided. Please check your input.',
  SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
  DEFAULT: 'Something went wrong. Please try again.',
} as const;
