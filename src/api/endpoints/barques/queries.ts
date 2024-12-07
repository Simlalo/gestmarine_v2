import { apiClient } from '../../client';
import { API_ENDPOINTS } from '../../constants';
import { BarqueFilter } from '../../types/requests/barques';
import { 
  BarqueResponse, 
  BarqueAssignmentResponse 
} from '../../types/responses/barques';
import { ApiListResponse, PaginationParams } from '../../types/common';

export const barqueQueries = {
  /**
   * Get all barques with optional filtering and pagination
   */
  getBarques: async (
    filter?: BarqueFilter,
    pagination?: PaginationParams
  ): Promise<ApiListResponse<BarqueResponse>> => {
    return apiClient.get(API_ENDPOINTS.BARQUES.BASE, {
      params: { ...filter, ...pagination },
    });
  },

  /**
   * Get a single barque by ID
   */
  getBarqueById: async (id: string): Promise<BarqueResponse> => {
    return apiClient.get(API_ENDPOINTS.BARQUES.BY_ID(id));
  },

  /**
   * Get barques assigned to a specific gerant
   */
  getBarquesByGerant: async (gerantId: string): Promise<BarqueResponse[]> => {
    return apiClient.get(API_ENDPOINTS.GERANTS.BARQUES(gerantId));
  },

  /**
   * Get barque assignment history
   */
  getBarqueAssignments: async (
    barqueId: string
  ): Promise<BarqueAssignmentResponse[]> => {
    return apiClient.get(API_ENDPOINTS.BARQUES.ASSIGNMENTS(barqueId));
  },

  /**
   * Export barques data
   */
  exportBarques: async (filter?: BarqueFilter): Promise<Blob> => {
    return apiClient.get(API_ENDPOINTS.BARQUES.EXPORT, {
      params: filter,
      responseType: 'blob',
    });
  },
};
