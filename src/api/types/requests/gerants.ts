import { BaseFilter, ID } from '../common';

export interface CreateGerantRequest {
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  adresse?: string;
  status?: 'active' | 'inactive';
  role?: 'gérant';
}

export interface UpdateGerantRequest {
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  status?: 'active' | 'inactive';
}

export interface AssignBarquesRequest {
  barqueIds: ID[];
}

// Filter Types
export interface GerantFilter extends BaseFilter {
  status?: 'active' | 'inactive';
  hasBarques?: boolean;
}

// Password Management
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface SetNewPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}
