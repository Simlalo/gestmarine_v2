import { BaseFilter } from '../common';

export interface CreatePortRequest {
  nom: string;
  region: string;
  capacite?: number;
  coordonnees?: {
    latitude: number;
    longitude: number;
  };
  contact?: {
    telephone?: string;
    email?: string;
  };
}

export interface UpdatePortRequest {
  nom?: string;
  region?: string;
  capacite?: number;
  coordonnees?: {
    latitude: number;
    longitude: number;
  };
  contact?: {
    telephone?: string;
    email?: string;
  };
}

export interface PortFilter extends BaseFilter {
  region?: string;
  hasCapacity?: boolean;
}
