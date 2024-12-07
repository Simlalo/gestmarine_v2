// Page exports
export { default as PaiementsPage } from './pages/PaiementsPage';

// Types
export interface Paiement {
  id: string;
  amount: number;
  date: string;
  status: 'pending' | 'completed' | 'failed';
  barqueId: string;
  gerantId: string;
}

// Constants
export const PAIEMENTS_ROUTES = {
  LIST: '/paiements',
  DETAILS: (id: string) => `/paiements/${id}`,
  CREATE: '/paiements/create',
  EDIT: (id: string) => `/paiements/${id}/edit`,
} as const;