import { ApiError } from '@/api/errors';
import type { Barque } from '@/types/Barque';

interface BarqueResponse {
  data: Barque;
  message?: string;
}

interface BarquesListResponse {
  data: Barque[];
  message?: string;
}

interface BarqueFilters {
  search?: string;
  port?: string;
  status?: 'active' | 'inactive';
}

export class BarquesService {
  private static readonly BASE_URL = '/api/barques';

  static async getAll(filters?: BarqueFilters): Promise<BarquesListResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.search) queryParams.set('search', filters.search);
      if (filters?.port) queryParams.set('port', filters.port);
      if (filters?.status) queryParams.set('status', filters.status);

      const url = `${this.BASE_URL}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await fetch(url);

      if (!response.ok) {
        const error = await response.json();
        throw new ApiError(error.message || 'Failed to fetch barques', response.status);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch barques', 500);
    }
  }

  static async getById(id: string): Promise<BarqueResponse> {
    try {
      const response = await fetch(`${this.BASE_URL}/${id}`);

      if (!response.ok) {
        const error = await response.json();
        throw new ApiError(error.message || 'Failed to fetch barque', response.status);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch barque', 500);
    }
  }

  static async create(barqueData: Partial<Barque>): Promise<BarqueResponse> {
    try {
      const response = await fetch(this.BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(barqueData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new ApiError(error.message || 'Failed to create barque', response.status);
      }

      const data = await response.json();
      return { 
        data,
        message: 'Barque created successfully'
      };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to create barque', 500);
    }
  }

  static async update(id: string, barqueData: Partial<Barque>): Promise<BarqueResponse> {
    try {
      const response = await fetch(`${this.BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(barqueData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new ApiError(error.message || 'Failed to update barque', response.status);
      }

      const data = await response.json();
      return { 
        data,
        message: 'Barque updated successfully'
      };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to update barque', 500);
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new ApiError(error.message || 'Failed to delete barque', response.status);
      }
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to delete barque', 500);
    }
  }
}
