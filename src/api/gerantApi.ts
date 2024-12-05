import { Gerant, CreateGerantDTO, UpdateGerantDTO } from '../types/User';
import { mockApi } from '../services/mockApi';

interface GerantUpdateData extends Partial<Gerant> {
  password?: string;
}

export const gerantApi = {
  getGerants: async (): Promise<Gerant[]> => {
    return mockApi.getGerants();
  },

  getGerant: async (id: string): Promise<Gerant> => {
    return mockApi.getGerant(id);
  },

  createGerant: async (data: CreateGerantDTO, password: string): Promise<Gerant> => {
    // In a real app, password would be hashed before sending to server
    return mockApi.addGerant({
      ...data,
      password: password,
    });
  },

  updateGerant: async (id: string, data: UpdateGerantDTO): Promise<Gerant> => {
    return mockApi.updateGerant(id, data);
  },

  deleteGerant: async (id: string): Promise<void> => {
    return mockApi.deleteGerant(id);
  },

  assignBarques: async (gerantId: string, barqueIds: string[]): Promise<Gerant> => {
    const gerant = await mockApi.getGerant(gerantId);
    return mockApi.updateGerant(gerantId, {
      ...gerant,
      assignedBarques: barqueIds,
    });
  }
};
