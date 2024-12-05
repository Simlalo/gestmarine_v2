import { Barque } from '../types/Barque';
import { Gerant } from '../types/User';
import { mockApi } from '../services/mockApi';

const API_URL = 'http://localhost:3001/api';

// Use mockApi for development
export const barqueApi = {
  getBarques: async (): Promise<Barque[]> => {
    return mockApi.getBarques();
  },

  getBarque: async (id: string): Promise<Barque> => {
    return mockApi.getBarque(id);
  },

  addBarque: async (barque: Omit<Barque, 'id'>): Promise<Barque> => {
    return mockApi.addBarque(barque);
  },

  updateBarque: async (id: string, updates: Partial<Barque>): Promise<Barque> => {
    return mockApi.updateBarque(id, updates);
  },

  deleteBarque: async (id: string): Promise<void> => {
    return mockApi.deleteBarque(id);
  },

  importBarques: async (barques: Omit<Barque, 'id'>[]): Promise<Barque[]> => {
    return mockApi.importBarques(barques);
  },

  assignBarqueToGerant: async (barqueId: string, gerantId: string): Promise<void> => {
    return mockApi.assignBarqueToGerant(barqueId, gerantId);
  },

  unassignBarqueFromGerant: async (barqueId: string, gerantId: string): Promise<void> => {
    return mockApi.unassignBarqueFromGerant(barqueId, gerantId);
  },

  getGerants: async (): Promise<Gerant[]> => {
    return mockApi.getGerants();
  }
};
