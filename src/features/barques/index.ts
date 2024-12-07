// Page exports
export { default as BarquesPage } from './pages/BarquesPage';

// Types
export interface Barque {
  id: string;
  name: string;
  matricule: string;
  status: 'active' | 'inactive' | 'maintenance';
  gerantId?: string;
}

// Constants
export const BARQUES_ROUTES = {
  LIST: '/barques',
  DETAILS: (id: string) => `/barques/${id}`,
  CREATE: '/barques/create',
  EDIT: (id: string) => `/barques/${id}/edit`,
} as const;