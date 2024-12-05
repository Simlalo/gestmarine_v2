import { Barque } from '../types/Barque';
import { User, Gerant, CreateGerantDTO, UpdateGerantDTO } from '../types/User';

// Mock data
const mockBarques: Barque[] = [
  {
    id: '1',
    affiliation: '9809283',
    immatriculation: '10/1-5256',
    nomBarque: 'RAFIQ',
    portAttache: '10/1',
    isActive: true
  },
  {
    id: '2',
    affiliation: '9380817',
    immatriculation: '10/1-5261',
    nomBarque: 'HABIBIA',
    portAttache: '10/1',
    isActive: true
  },
];

const mockUsers: { [key: string]: (User | Gerant) & { password: string } } = {
  'admin@admin.com': {
    id: '1',
    email: 'admin@admin.com',
    role: 'administrateur',
    password: '456456',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  'jean.dupont@example.com': {
    id: '2',
    email: 'jean.dupont@example.com',
    nom: 'Dupont',
    prenom: 'Jean',
    telephone: '0612345678',
    role: 'gérant',
    assignedBarques: [],
    password: '123456',
    createdAt: new Date(),
    updatedAt: new Date()
  }
};

let mockGerants: Gerant[] = [
  {
    id: '1',
    email: 'jean.dupont@example.com',
    nom: 'Dupont',
    prenom: 'Jean',
    telephone: '0612345678',
    role: 'gérant',
    assignedBarques: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    email: 'marie.martin@example.com',
    nom: 'Martin',
    prenom: 'Marie',
    telephone: '0687654321',
    role: 'gérant',
    assignedBarques: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    email: 'pierre.dubois@example.com',
    nom: 'Dubois',
    prenom: 'Pierre',
    telephone: '0654321987',
    role: 'gérant',
    assignedBarques: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Mock API functions
export const mockApi = {
  login: async (email: string, password: string): Promise<User | Gerant> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = mockUsers[email];
    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (user.password !== password) {
      throw new Error('Invalid credentials');
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  // Gerant operations
  getGerants: async (): Promise<Gerant[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockGerants;
  },

  getGerant: async (id: string): Promise<Gerant> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const gerant = mockGerants.find(g => g.id === id);
    if (!gerant) {
      throw new Error('Gerant not found');
    }
    return gerant;
  },

  addGerant: async (data: CreateGerantDTO): Promise<Gerant> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Create new gérant
    const newGerant: Gerant = {
      id: String(mockGerants.length + 1),
      ...data,
      role: 'gérant',
      assignedBarques: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Add to mockGerants array
    mockGerants.push(newGerant);

    // Add to mockUsers for authentication
    if (data.password) {
      mockUsers[data.email] = {
        ...newGerant,
        password: data.password
      };
    }

    return newGerant;
  },

  updateGerant: async (id: string, data: UpdateGerantDTO): Promise<Gerant> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockGerants.findIndex(g => g.id === id);
    if (index === -1) {
      throw new Error('Gerant not found');
    }

    const updatedGerant = {
      ...mockGerants[index],
      ...data,
      updatedAt: new Date()
    };

    // Update in mockGerants array
    mockGerants[index] = updatedGerant;

    // Update in mockUsers if exists
    const existingUser = Object.values(mockUsers).find(u => u.id === id);
    if (existingUser) {
      mockUsers[updatedGerant.email] = {
        ...updatedGerant,
        password: data.password || existingUser.password
      };

      // If email was changed, remove old entry
      if (existingUser.email !== updatedGerant.email) {
        delete mockUsers[existingUser.email];
      }
    }

    return updatedGerant;
  },

  deleteGerant: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const gerant = mockGerants.find(g => g.id === id);
    if (!gerant) {
      throw new Error('Gerant not found');
    }

    // Remove from mockGerants array
    mockGerants = mockGerants.filter(g => g.id !== id);

    // Remove from mockUsers if exists
    const userEntry = Object.entries(mockUsers).find(([_, u]) => u.id === id);
    if (userEntry) {
      delete mockUsers[userEntry[0]];
    }
  },

  // Barque operations
  getBarques: async (): Promise<Barque[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockBarques;
  },

  getBarque: async (id: string): Promise<Barque> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const barque = mockBarques.find(b => b.id === id);
    if (!barque) {
      throw new Error('Barque not found');
    }
    return { ...barque };
  },

  addBarque: async (data: Omit<Barque, 'id'>): Promise<Barque> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newBarque: Barque = {
      id: String(mockBarques.length + 1),
      ...data,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockBarques.push(newBarque);
    return newBarque;
  },

  importBarques: async (barques: Omit<Barque, 'id'>[]): Promise<Barque[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Starting barque import with:', barques);

    // Check for duplicates within the imported data
    const uniqueBarques = barques.filter((barque, index, self) =>
      index === self.findIndex((b) => b.immatriculation === barque.immatriculation)
    );

    // Check for duplicates with existing barques
    const newBarques = uniqueBarques.filter(barque => 
      !mockBarques.some(existing => existing.immatriculation === barque.immatriculation)
    ).map((barque, index) => {
      const newId = String(Date.now() + index);
      const newBarque: Barque = {
        ...barque,
        id: newId,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      console.log('Created new barque:', newBarque);
      return newBarque;
    });

    if (newBarques.length === 0) {
      throw new Error('Aucune nouvelle barque à importer. Vérifiez les doublons d\'immatriculation.');
    }

    mockBarques.push(...newBarques);
    console.log('Updated mockBarques. Total count:', mockBarques.length);
    console.log('Skipped duplicates:', barques.length - newBarques.length);
    
    return [...newBarques];
  },

  deleteBarque: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockBarques.findIndex(b => b.id === id);
    if (index === -1) {
      throw new Error('Barque not found');
    }
    mockBarques.splice(index, 1);
  },

  updateBarque: async (id: string, updates: Partial<Barque>): Promise<Barque> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockBarques.findIndex(b => b.id === id);
    if (index === -1) {
      throw new Error('Barque not found');
    }
    mockBarques[index] = { ...mockBarques[index], ...updates };
    return { ...mockBarques[index] };
  },

  assignBarqueToGerant: async (barqueId: string, gerantId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const gerant = mockGerants.find(g => g.id === gerantId);
    if (!gerant) {
      throw new Error('Gérant not found');
    }

    const barque = mockBarques.find(b => b.id === barqueId);
    if (!barque) {
      throw new Error('Barque not found');
    }

    // Add barque to gérant's assignments if not already assigned
    if (!gerant.assignedBarques.includes(barqueId)) {
      gerant.assignedBarques.push(barqueId);
    }

    // Update the gérant in mockUsers as well
    const userEntry = Object.entries(mockUsers).find(([_, u]) => u.id === gerantId);
    if (userEntry) {
      mockUsers[userEntry[0]] = {
        ...mockUsers[userEntry[0]],
        assignedBarques: gerant.assignedBarques
      };
    }
  },

  unassignBarqueFromGerant: async (barqueId: string, gerantId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const gerant = mockGerants.find(g => g.id === gerantId);
    if (!gerant) {
      throw new Error('Gérant not found');
    }

    // Remove barque from gérant's assignments
    gerant.assignedBarques = gerant.assignedBarques.filter(id => id !== barqueId);

    // Update the gérant in mockUsers as well
    const userEntry = Object.entries(mockUsers).find(([_, u]) => u.id === gerantId);
    if (userEntry) {
      mockUsers[userEntry[0]] = {
        ...mockUsers[userEntry[0]],
        assignedBarques: gerant.assignedBarques
      };
    }
  }
};
