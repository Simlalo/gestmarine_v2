// Page exports
export { default as LoginPage } from './pages/LoginPage';
// Types
export interface AuthUser {
  id: string;
  role: 'administrateur' | 'gerant' | 'user';
  name: string;
}

// Constants
export const AUTH_ROUTES = {
  LOGIN: '/login',
  LOGOUT: '/logout',
} as const;