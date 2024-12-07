import { apiClient } from '../../client';
import { API_ENDPOINTS } from '../../constants';
import { GerantFilter } from '../../types/requests/gerants';
import { 
  GerantResponse, 
  GerantStatsResponse 
} from '../../types/responses/gerants';
import { ApiListResponse, PaginationParams } from '../../types/common';
import { BarqueResponse } from '../../types/responses/barques';

export const gerantQueries = {
  /**
   * Get all gerants with optional filtering and pagination
   */
  getGerants: async (
    filter?: GerantFilter,
    pagination?: PaginationParams
  ): Promise<ApiListResponse<GerantResponse>> => {
    return apiClient.get(API_ENDPOINTS.GERANTS.BASE, {
      params: { ...filter, ...pagination },
    });
  },

  /**
   * Get a single gerant by ID
   */
  getGerantById: async (id: string): Promise<GerantResponse> => {
    return apiClient.get(API_ENDPOINTS.GERANTS.BY_ID(id));
  },

  /**
   * Get barques assigned to a gerant
   */
  getGerantBarques: async (id: string): Promise<BarqueResponse[]> => {
    return apiClient.get(API_ENDPOINTS.GERANTS.BARQUES(id));
  },

  /**
   * Get gerant statistics
   */
  getGerantStats: async (id: string): Promise<GerantStatsResponse> => {
    return apiClient.get(`${API_ENDPOINTS.GERANTS.BY_ID(id)}/stats`);
  },

  /**
   * Search gerants by name or email
   */
  searchGerants: async (
    query: string,
    pagination?: PaginationParams
  ): Promise<ApiListResponse<GerantResponse>> => {
    return apiClient.get(API_ENDPOINTS.GERANTS.BASE, {
      params: { 
        search: query,
        ...pagination 
      },
    });
  },
};
