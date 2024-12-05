import { useAuth as useAuthContext } from '../contexts/AuthContext';

export type UserRole = 'administrateur' | 'gerant' | 'user';

export interface User {
  id: string;
  email: string;
  role: UserRole;
}

export const useAuth = useAuthContext;
