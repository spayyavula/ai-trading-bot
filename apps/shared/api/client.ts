import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  API_BASE_URL,
  API_TIMEOUT,
  API_RETRY_ATTEMPTS,
  API_RETRY_DELAY,
  AUTH_TOKEN_KEY,
} from '../constants';
import { ApiResponse, AppError } from '../types';
import { handleError } from '../utils';

class ApiClient {
  private client: AxiosInstance;
  private retryCount: number = 0;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (this.shouldRetry(error) && this.retryCount < API_RETRY_ATTEMPTS) {
          this.retryCount++;
          await this.delay(API_RETRY_DELAY);
          return this.client(error.config);
        }

        this.retryCount = 0;
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private shouldRetry(error: any): boolean {
    return (
      error.response?.status >= 500 ||
      error.code === 'ECONNABORTED' ||
      error.code === 'ETIMEDOUT'
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private handleError(error: any): AppError {
    if (error.response) {
      const { status, data } = error.response;
      return new AppError(
        data.message || 'An error occurred',
        data.code || 'UNKNOWN_ERROR',
        status
      );
    }

    if (error.request) {
      return new AppError(
        'No response received from server',
        'NETWORK_ERROR',
        0
      );
    }

    return new AppError(
      error.message || 'An error occurred',
      'UNKNOWN_ERROR',
      500
    );
  }

  private async request<T>(
    config: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client(config);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  }

  // HTTP Methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PATCH', url, data });
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }

  // File Upload
  async uploadFile<T>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.request<T>({
      method: 'POST',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          onProgress(progress);
        }
      },
    });
  }

  // WebSocket Support
  createWebSocket(url: string): WebSocket {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const wsUrl = `${API_BASE_URL.replace('http', 'ws')}${url}?token=${token}`;
    return new WebSocket(wsUrl);
  }

  // Batch Requests
  async batch<T>(
    requests: Array<{
      method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
      url: string;
      data?: any;
    }>
  ): Promise<ApiResponse<T>[]> {
    return Promise.all(
      requests.map(({ method, url, data }) =>
        this.request<T>({ method, url, data })
      )
    );
  }

  // Cancel Request
  cancelRequest(requestId: string): void {
    // Implementation depends on the specific use case
    // This is a placeholder for the actual implementation
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();

// Export the class for testing purposes
export default ApiClient; 