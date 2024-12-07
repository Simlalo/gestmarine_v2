import { http, HttpResponse, delay } from 'msw';
import { server } from '../mocks/server';
import { mockErrors } from '../fixtures/mockData';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const apiTestUtils = {
  simulateNetworkError: (method: string, path: string) => {
    server.use(
      http[method as keyof typeof http](`${API_URL}${path}`, () => {
        return new HttpResponse(JSON.stringify(mockErrors.network), {
          status: 503,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      })
    );
  },

  simulateAuthError: (method: string, path: string) => {
    server.use(
      http[method as keyof typeof http](`${API_URL}${path}`, () => {
        return new HttpResponse(JSON.stringify(mockErrors.auth), {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      })
    );
  },

  simulateValidationError: (method: string, path: string, fields: Record<string, string[]>) => {
    server.use(
      http[method as keyof typeof http](`${API_URL}${path}`, () => {
        return new HttpResponse(
          JSON.stringify({
            ...mockErrors.validation,
            errors: fields,
          }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      })
    );
  },

  mockEndpointResponse: (method: string, path: string, status: number, data: any) => {
    server.use(
      http[method as keyof typeof http](`${API_URL}${path}`, () => {
        return new HttpResponse(JSON.stringify(data), {
          status,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      })
    );
  },

  createPaginationParams: (page: number = 1, limit: number = 10) => {
    return new URLSearchParams({ page: String(page), limit: String(limit) });
  },

  createFilterParams: (filters: Record<string, string>) => {
    return new URLSearchParams(filters);
  },

  verifyPaginationMeta: (meta: any, expectedTotal: number, expectedPage: number, expectedLimit: number) => {
    return expect(meta).toEqual({
      total: expectedTotal,
      page: expectedPage,
      limit: expectedLimit,
    });
  },

  verifyErrorResponse: (error: any, expectedStatus: number, expectedMessage: string) => {
    expect(error.status).toBe(expectedStatus);
    expect(error.message).toBe(expectedMessage);
  },

  verifyValidationErrors: (error: any, expectedFields: string[]) => {
    expectedFields.forEach(field => {
      expect(error.errors).toHaveProperty(field);
    });
  },

  createAuthenticatedRequest: (token: string = 'mock-token') => {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  },

  simulateDelay: (method: string, path: string, delayMs: number = 1000) => {
    server.use(
      http[method as keyof typeof http](`${API_URL}${path}`, async () => {
        await delay(delayMs);
        return new HttpResponse(
          JSON.stringify({ message: 'Delayed response' }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      })
    );
  },
};