import { BaseFilter, ID } from '../common';

// Request Types
export interface CreateBarqueRequest {
  nomBarque: string;
  immatriculation: string;
  portAttache: string;
  affiliation: string;
  isActive?: boolean;
}

export interface UpdateBarqueRequest {
  nomBarque?: string;
  immatriculation?: string;
  portAttache?: string;
  affiliation?: string;
  isActive?: boolean;
}

export interface AssignBarqueRequest {
  gerantId: ID;
}

// Filter Types
export interface BarqueFilter extends BaseFilter {
  portAttache?: string;
  affiliation?: string;
  isActive?: boolean;
  gerantId?: ID;
}

// Bulk Import Types
export interface BulkImportBarquesRequest {
  file: File;
  options?: {
    skipErrors?: boolean;
    updateExisting?: boolean;
  };
}
