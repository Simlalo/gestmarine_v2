import DashboardIcon from '@mui/icons-material/Dashboard';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import GroupIcon from '@mui/icons-material/Group';
import SettingsIcon from '@mui/icons-material/Settings';
import { UserRole } from '../hooks/useAuth';

export const ROLES = {
  ADMIN: 'ADMIN',
  GERANT: 'GERANT',
} as const;

export type Role = keyof typeof ROLES;

export interface MenuItem {
  title: string;
  icon: React.ComponentType;
  path: string;
  role?: UserRole[];
}

export const MENU_ITEMS: MenuItem[] = [
  {
    title: 'Tableau de bord',
    icon: DashboardIcon,
    path: '/dashboard'
  },
  {
    title: 'Bateaux',
    icon: DirectionsBoatIcon,
    path: '/boats'
  },
  {
    title: 'Gérants',
    icon: GroupIcon,
    path: '/gerants',
    role: ['administrateur']
  },
  {
    title: 'Paramètres',
    icon: SettingsIcon,
    path: '/settings',
    role: ['administrateur', 'gérant']
  }
];
