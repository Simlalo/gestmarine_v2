import { ID, Timestamps, AuditInfo } from '../common';

export interface GerantResponse {
  id: ID;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  adresse?: string;
  status: 'active' | 'inactive';
  role: 'gérant';
  assignedBarques: ID[];
  metadata?: {
    lastLogin?: string;
    loginCount?: number;
    preferences?: Record<string, any>;
  };
  timestamps: Timestamps;
  audit: AuditInfo;
}

export interface GerantStatsResponse {
  totalBarques: number;
  activeBarques: number;
  lastAssignment?: {
    barqueId: ID;
    assignedAt: string;
  };
  activitySummary?: {
    lastMonth: {
      assignedBarques: number;
      removedBarques: number;
    };
  };
}

export interface PasswordChangeResponse {
  message: string;
  changedAt: string;
}

export interface PasswordResetResponse {
  message: string;
  expiresAt: string;
}
