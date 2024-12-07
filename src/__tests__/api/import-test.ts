import { ApiError, ErrorType } from '@api/errors';
import { ApiClient, apiClient } from '@api/client';

describe('API Import Tests', () => {
  test('ApiError is properly imported', () => {
    expect(ApiError).toBeDefined();
    const error = new ApiError('test error', 404, ErrorType.UNKNOWN, { message: 'Not Found' });
    expect(error.name).toBe('ApiError');
    expect(error.status).toBe(404);
    expect(error.type).toBe(ErrorType.UNKNOWN);
    expect(error.data).toEqual({ message: 'Not Found' });
  });

  test('apiClient is properly imported and configured', () => {
    expect(apiClient).toBeDefined();
    // Test that it's an instance of ApiClient
    expect(apiClient instanceof ApiClient).toBe(true);
    // Test instance configuration
    const axiosInstance = (apiClient as ApiClient).getAxiosInstance();
    expect(axiosInstance.defaults.baseURL).toBe('/api');
    expect(axiosInstance.defaults.headers['Content-Type']).toBe('application/json');
  });
});
