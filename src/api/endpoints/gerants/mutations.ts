import { apiClient } from '../../client';
import { API_ENDPOINTS } from '../../constants';
import { 
  CreateGerantRequest, 
  UpdateGerantRequest,
  AssignBarquesRequest,
  ChangePasswordRequest,
  ResetPasswordRequest,
  SetNewPasswordRequest
} from '../../types/requests/gerants';
import { 
  GerantResponse,
  PasswordChangeResponse,
  PasswordResetResponse
} from '../../types/responses/gerants';

export const gerantMutations = {
  /**
   * Create a new gerant
   */
  createGerant: async (data: CreateGerantRequest): Promise<GerantResponse> => {
    return apiClient.post(API_ENDPOINTS.GERANTS.BASE, data);
  },

  /**
   * Update an existing gerant
   */
  updateGerant: async (
    id: string,
    data: UpdateGerantRequest
  ): Promise<GerantResponse> => {
    return apiClient.put(API_ENDPOINTS.GERANTS.BY_ID(id), data);
  },

  /**
   * Delete a gerant
   */
  deleteGerant: async (id: string): Promise<void> => {
    return apiClient.delete(API_ENDPOINTS.GERANTS.BY_ID(id));
  },

  /**
   * Assign barques to a gerant
   */
  assignBarques: async (
    gerantId: string,
    data: AssignBarquesRequest
  ): Promise<GerantResponse> => {
    return apiClient.post(API_ENDPOINTS.GERANTS.BARQUES(gerantId), data);
  },

  /**
   * Remove barque assignment from a gerant
   */
  removeBarque: async (
    gerantId: string,
    barqueId: string
  ): Promise<void> => {
    return apiClient.delete(API_ENDPOINTS.GERANTS.BARQUES(gerantId), {
      params: { barqueId },
    });
  },

  /**
   * Change gerant password
   */
  changePassword: async (
    id: string,
    data: ChangePasswordRequest
  ): Promise<PasswordChangeResponse> => {
    return apiClient.post(
      `${API_ENDPOINTS.GERANTS.BY_ID(id)}/change-password`,
      data
    );
  },

  /**
   * Request password reset
   */
  requestPasswordReset: async (
    data: ResetPasswordRequest
  ): Promise<PasswordResetResponse> => {
    return apiClient.post(
      `${API_ENDPOINTS.GERANTS.BASE}/reset-password`,
      data
    );
  },

  /**
   * Set new password after reset
   */
  setNewPassword: async (
    data: SetNewPasswordRequest
  ): Promise<PasswordChangeResponse> => {
    return apiClient.post(
      `${API_ENDPOINTS.GERANTS.BASE}/set-password`,
      data
    );
  },

  /**
   * Update gerant status
   */
  updateStatus: async (
    id: string,
    status: 'active' | 'inactive'
  ): Promise<GerantResponse> => {
    return apiClient.patch(API_ENDPOINTS.GERANTS.BY_ID(id), { status });
  },
};
