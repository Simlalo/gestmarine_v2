import { ID, Timestamps, AuditInfo } from '../common';

export interface PortResponse {
  id: ID;
  nom: string;
  region: string;
  capacite: number;
  coordonnees?: {
    latitude: number;
    longitude: number;
  };
  contact?: {
    telephone?: string;
    email?: string;
  };
  metadata?: {
    barquesCount: number;
    disponible: number;
    lastUpdated: string;
  };
  timestamps: Timestamps;
  audit: AuditInfo;
}

export interface PortStatsResponse {
  totalBarques: number;
  capaciteUtilisee: number;
  capaciteDisponible: number;
  tauxOccupation: number;
  barquesParGerant: {
    gerantId: ID;
    count: number;
  }[];
}
