// Page exports
export { default as GerantsPage } from './pages/GerantsPage';

// Component exports
export * from './components';

// Types
export interface Gerant {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'active' | 'inactive';
}

// Routes
export const ROUTES = {
  LIST: '/gerants',
  DETAILS: (id: string) => `/gerants/${id}`,
  CREATE: '/gerants/create',
  EDIT: (id: string) => `/gerants/${id}/edit`,
} as const;