// Page exports
export { default as ResponsablesPage } from './pages/ResponsablesPage';

// Types
export interface Responsable {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'active' | 'inactive';
}

// Constants
export const RESPONSABLES_ROUTES = {
  LIST: '/responsables',
  DETAILS: (id: string) => `/responsables/${id}`,
  CREATE: '/responsables/create',
  EDIT: (id: string) => `/responsables/${id}/edit`,
} as const;