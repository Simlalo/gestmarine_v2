// Renamed file to UserModel.ts
export type UserRole = 'administrateur' | 'gérant';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  password?: string; // Only used when creating/updating
  createdAt: Date;
  updatedAt: Date;
}

export interface Gerant extends User {
  nom: string;
  prenom: string;
  telephone: string;
  role: 'gérant';
  assignedBarques: string[];
}

export interface Admin extends User {
  role: 'administrateur';
}

export interface CreateGerantDTO {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  assignedBarques?: string[];
  password?: string;
}

export interface UpdateGerantDTO extends Partial<Omit<Gerant, 'id' | 'role'>> {
  password?: string;
}
