import { ID, Timestamps, AuditInfo } from '../common';

export interface BarqueResponse {
  id: ID;
  nomBarque: string;
  immatriculation: string;
  portAttache: string;
  affiliation: string;
  isActive: boolean;
  gerantId?: ID;
  metadata?: {
    lastInspection?: string;
    licenseExpiry?: string;
    notes?: string;
  };
  timestamps: Timestamps;
  audit: AuditInfo;
}

export interface BulkImportBarquesResponse {
  successful: number;
  failed: number;
  errors?: Array<{
    row: number;
    message: string;
    data?: any;
  }>;
  importedBarques: BarqueResponse[];
}

export interface BarqueAssignmentResponse {
  barqueId: ID;
  gerantId: ID;
  assignedAt: string;
  assignedBy: ID;
}
