import { apiClient } from '../../client';
import { API_ENDPOINTS } from '../../constants';
import { 
  CreatePortRequest, 
  UpdatePortRequest 
} from '../../types/requests/ports';
import { PortResponse } from '../../types/responses/ports';

export const portMutations = {
  /**
   * Create a new port
   */
  createPort: async (data: CreatePortRequest): Promise<PortResponse> => {
    return apiClient.post(API_ENDPOINTS.PORTS.BASE, data);
  },

  /**
   * Update an existing port
   */
  updatePort: async (
    id: string,
    data: UpdatePortRequest
  ): Promise<PortResponse> => {
    return apiClient.put(API_ENDPOINTS.PORTS.BY_ID(id), data);
  },

  /**
   * Delete a port
   */
  deletePort: async (id: string): Promise<void> => {
    return apiClient.delete(API_ENDPOINTS.PORTS.BY_ID(id));
  },

  /**
   * Update port capacity
   */
  updateCapacity: async (
    id: string,
    capacity: number
  ): Promise<PortResponse> => {
    return apiClient.patch(API_ENDPOINTS.PORTS.BY_ID(id), {
      capacite: capacity,
    });
  },

  /**
   * Update port contact information
   */
  updateContact: async (
    id: string,
    contact: {
      telephone?: string;
      email?: string;
    }
  ): Promise<PortResponse> => {
    return apiClient.patch(API_ENDPOINTS.PORTS.BY_ID(id), {
      contact,
    });
  },

  /**
   * Update port coordinates
   */
  updateCoordinates: async (
    id: string,
    coordinates: {
      latitude: number;
      longitude: number;
    }
  ): Promise<PortResponse> => {
    return apiClient.patch(API_ENDPOINTS.PORTS.BY_ID(id), {
      coordonnees: coordinates,
    });
  },
};
