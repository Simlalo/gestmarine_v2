import { apiClient } from '../../client';
import { API_ENDPOINTS } from '../../constants';
import { 
  CreateBarqueRequest, 
  UpdateBarqueRequest, 
  BulkImportBarquesRequest 
} from '../../types/requests/barques';
import { 
  BarqueResponse, 
  BulkImportBarquesResponse 
} from '../../types/responses/barques';

export const barqueMutations = {
  /**
   * Create a new barque
   */
  createBarque: async (data: CreateBarqueRequest): Promise<BarqueResponse> => {
    return apiClient.post(API_ENDPOINTS.BARQUES.BASE, data);
  },

  /**
   * Update an existing barque
   */
  updateBarque: async (
    id: string,
    data: UpdateBarqueRequest
  ): Promise<BarqueResponse> => {
    return apiClient.put(API_ENDPOINTS.BARQUES.BY_ID(id), data);
  },

  /**
   * Delete a barque
   */
  deleteBarque: async (id: string): Promise<void> => {
    return apiClient.delete(API_ENDPOINTS.BARQUES.BY_ID(id));
  },

  /**
   * Import barques from file
   */
  importBarques: async (
    data: BulkImportBarquesRequest
  ): Promise<BulkImportBarquesResponse> => {
    const formData = new FormData();
    formData.append('file', data.file);
    if (data.options) {
      formData.append('options', JSON.stringify(data.options));
    }

    return apiClient.post(API_ENDPOINTS.BARQUES.IMPORT, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Assign a barque to a gerant
   */
  assignBarque: async (
    barqueId: string,
    gerantId: string
  ): Promise<BarqueResponse> => {
    return apiClient.post(API_ENDPOINTS.BARQUES.ASSIGNMENTS(barqueId), {
      gerantId,
    });
  },

  /**
   * Remove a barque assignment
   */
  removeAssignment: async (
    barqueId: string,
    gerantId: string
  ): Promise<void> => {
    return apiClient.delete(API_ENDPOINTS.BARQUES.ASSIGNMENTS(barqueId), {
      params: { gerantId },
    });
  },
};
