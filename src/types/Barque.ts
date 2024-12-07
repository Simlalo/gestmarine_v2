import { Gerant } from './User';

export type BarqueStatus = 'active' | 'inactive';

export interface Barque {
  id: string;
  nomBarque: string;
  immatriculation: string;
  portAttache: string;
  isActive: boolean;
  gerantId?: string;
  gerant?: Gerant;
  affiliation: string;
  status: BarqueStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BarqueFilters {
  searchTerm: string;
  port: string;
  status: BarqueStatus | '';
  gerantId: string;
}

export interface BarqueState {
  items: Barque[];
  loading: boolean;
  error: string | null;
  filters: BarqueFilters;
  ports: string[];
  lastUpdated: string | null;
}

export type CreateBarquePayload = Omit<Barque, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateBarquePayload = Partial<Omit<Barque, 'id' | 'createdAt' | 'updatedAt'>>;
