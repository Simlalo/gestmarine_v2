import { apiClient } from '../../client';
import { API_ENDPOINTS } from '../../constants';
import { PortFilter } from '../../types/requests/ports';
import { 
  PortResponse,
  PortStatsResponse 
} from '../../types/responses/ports';
import { ApiListResponse, PaginationParams } from '../../types/common';

export const portQueries = {
  /**
   * Get all ports with optional filtering and pagination
   */
  getPorts: async (
    filter?: PortFilter,
    pagination?: PaginationParams
  ): Promise<ApiListResponse<PortResponse>> => {
    return apiClient.get(API_ENDPOINTS.PORTS.BASE, {
      params: { ...filter, ...pagination },
    });
  },

  /**
   * Get a single port by ID
   */
  getPortById: async (id: string): Promise<PortResponse> => {
    return apiClient.get(API_ENDPOINTS.PORTS.BY_ID(id));
  },

  /**
   * Get port statistics
   */
  getPortStats: async (id: string): Promise<PortStatsResponse> => {
    return apiClient.get(`${API_ENDPOINTS.PORTS.BY_ID(id)}/stats`);
  },

  /**
   * Search ports by name or region
   */
  searchPorts: async (
    query: string,
    pagination?: PaginationParams
  ): Promise<ApiListResponse<PortResponse>> => {
    return apiClient.get(API_ENDPOINTS.PORTS.BASE, {
      params: { 
        search: query,
        ...pagination 
      },
    });
  },

  /**
   * Get ports with available capacity
   */
  getPortsWithCapacity: async (
    minCapacity?: number,
    pagination?: PaginationParams
  ): Promise<ApiListResponse<PortResponse>> => {
    return apiClient.get(API_ENDPOINTS.PORTS.BASE, {
      params: { 
        hasCapacity: true,
        minCapacity,
        ...pagination 
      },
    });
  },
};
