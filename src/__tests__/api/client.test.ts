import axios from 'axios';
import { apiClient } from '../../api/client';
import { server } from './mocks/server';
import { apiTestUtils } from './utils/testUtils';
import { mockErrors } from './fixtures/mockData';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('base configuration', () => {
    it('creates axios instance with correct config', () => {
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: expect.any(String),
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
        timeout: expect.any(Number),
      });
    });

    it('adds auth headers when token exists', () => {
      const token = 'test-token';
      localStorage.setItem('auth_token', token);
      
      const client = apiClient.getInstance();
      expect(client.defaults.headers.common['Authorization']).toBe(`Bearer ${token}`);
    });

    it('handles base URL configuration from environment', () => {
      const originalEnv = process.env.REACT_APP_API_URL;
      process.env.REACT_APP_API_URL = 'http://test-api.com';
      
      const client = apiClient.getInstance();
      expect(client.defaults.baseURL).toBe('http://test-api.com');
      
      process.env.REACT_APP_API_URL = originalEnv;
    });
  });

  describe('interceptors', () => {
    it('adds authentication token to requests', async () => {
      const token = 'test-token';
      localStorage.setItem('auth_token', token);
      
      const client = apiClient.getInstance();
      const config = await client.interceptors.request.handlers[0].fulfilled({
        headers: {},
      });

      expect(config.headers['Authorization']).toBe(`Bearer ${token}`);
    });

    it('handles token refresh on 401 response', async () => {
      const originalToken = 'original-token';
      const newToken = 'new-token';
      localStorage.setItem('auth_token', originalToken);

      // Mock refresh token endpoint
      apiTestUtils.mockEndpointResponse('post', '/auth/refresh', 200, {
        token: newToken,
      });

      // Simulate 401 response followed by successful retry
      const client = apiClient.getInstance();
      await client.interceptors.response.handlers[0].rejected({
        response: { status: 401 },
        config: { _retry: false },
      });

      expect(localStorage.getItem('auth_token')).toBe(newToken);
    });

    it('transforms request data correctly', async () => {
      const client = apiClient.getInstance();
      const testData = { test: 'data', nullField: null, undefinedField: undefined };
      
      const config = await client.interceptors.request.handlers[0].fulfilled({
        data: testData,
        headers: {},
      });

      expect(config.data).toEqual({ test: 'data' }); // Null and undefined fields should be removed
    });

    it('processes response data correctly', async () => {
      const client = apiClient.getInstance();
      const response = {
        data: {
          data: { test: 'value' },
          meta: { page: 1 },
        },
      };

      const result = await client.interceptors.response.handlers[0].fulfilled(response);
      expect(result.data).toEqual({ test: 'value' });
      expect(result.meta).toEqual({ page: 1 });
    });
  });

  describe('error handling', () => {
    it('handles network errors with retry logic', async () => {
      const client = apiClient.getInstance();
      const retryCount = 3;
      let attempts = 0;

      // Simulate network error with retry
      apiTestUtils.mockEndpointResponse('get', '/test', 503, mockErrors.network);
      
      try {
        await client.get('/test', { 
          _retry: false,
          _retryCount: retryCount,
          _onRetry: () => { attempts++; }
        });
      } catch (error) {
        expect(attempts).toBe(retryCount);
        expect(error.response.status).toBe(503);
      }
    });

    it('manages authentication errors', async () => {
      const client = apiClient.getInstance();
      
      // Simulate auth error that can't be recovered
      apiTestUtils.simulateAuthError('get', '/test');
      
      try {
        await client.get('/test');
      } catch (error) {
        expect(error.response.status).toBe(401);
        expect(localStorage.getItem('auth_token')).toBeNull();
      }
    });

    it('processes validation errors', async () => {
      const client = apiClient.getInstance();
      const validationFields = {
        name: ['Name is required'],
        email: ['Invalid email format'],
      };

      apiTestUtils.simulateValidationError('post', '/test', validationFields);

      try {
        await client.post('/test', { name: '', email: 'invalid' });
      } catch (error) {
        expect(error.response.status).toBe(400);
        apiTestUtils.verifyValidationErrors(error.response.data, ['name', 'email']);
      }
    });

    it('implements exponential backoff for retries', async () => {
      const client = apiClient.getInstance();
      const startTime = Date.now();
      let attempts = 0;

      // Simulate network error with exponential backoff
      apiTestUtils.simulateNetworkError('get', '/test');

      try {
        await client.get('/test', {
          _retry: false,
          _retryCount: 2,
          _onRetry: () => { attempts++; }
        });
      } catch (error) {
        const duration = Date.now() - startTime;
        expect(attempts).toBe(2);
        expect(duration).toBeGreaterThan(300); // Minimum time for exponential backoff
      }
    });
  });
});
