import axios, { AxiosInstance, AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios';
import { handleApiError } from './errors';

// In development, use MSW's base URL
const baseURL = process.env.NODE_ENV === 'development' 
  ? '/api'  // MSW will intercept requests to /api
  : import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const TIMEOUT = 15000; // 15 seconds
const RETRY_DELAY = 1000; // 1 second
const MAX_RETRIES = 3;

interface RetryConfig {
  retryCount: number;
  lastError?: Error;
}

export class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      validateStatus: (status) => status >= 200 && status < 300,
      timeout: TIMEOUT,
    });

    this.setupInterceptors();
  }

  private shouldRetry(error: AxiosError, config: RetryConfig): boolean {
    // Don't retry if we've hit the max retries
    if (config.retryCount >= MAX_RETRIES) {
      return false;
    }

    // Only retry on network errors or 5xx errors
    if (error.response) {
      return error.response.status >= 500;
    }

    // Retry on network errors and timeouts
    return error.code === 'ECONNABORTED' || !error.response;
  }

  private async retryRequest(config: any, retryConfig: RetryConfig) {
    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    return this.instance.request(config);
  }

  private setupInterceptors() {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => response.data,
      async (error: AxiosError) => {
        const config = error.config as AxiosRequestConfig & RetryConfig;
        
        // Initialize retry count if not present
        if (config.retryCount === undefined) {
          config.retryCount = 0;
        }

        if (this.shouldRetry(error, { retryCount: config.retryCount })) {
          config.retryCount++;
          return this.retryRequest(config, { retryCount: config.retryCount });
        }

        return Promise.reject(handleApiError(error));
      }
    );
  }

  // HTTP methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get(url, config);
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post(url, data, config);
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.put(url, data, config);
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.patch(url, data, config);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete(url, config);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
