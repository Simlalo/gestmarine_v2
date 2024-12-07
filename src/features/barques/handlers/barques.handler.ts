import { http, HttpResponse, delay } from 'msw';
import type { Barque } from '@/types/Barque';
import { ApiError } from '@/api/errors';

// In-memory store
let mockBarques: Barque[] = [
  {
    id: '1',
    nomBarque: 'Barque 1',
    immatriculation: '10/1-001',
    portAttache: 'Boujdour',
    affiliation: 'Affiliation 1',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    nomBarque: 'Barque 2',
    immatriculation: '10/2-002',
    portAttache: 'Aghti El Ghazi',
    affiliation: 'Affiliation 2',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
];

// Validation functions
const validateBarqueData = (data: any): string[] => {
  const errors: string[] = [];
  
  if (!data.nomBarque?.trim()) {
    errors.push('Le nom de la barque est requis');
  }
  
  if (!data.immatriculation?.trim()) {
    errors.push('L\'immatriculation est requise');
  } else if (!/^\d{2}\/\d{1,2}-\d{3}$/.test(data.immatriculation)) {
    errors.push('Format d\'immatriculation invalide (ex: 12/3-456)');
  }
  
  if (!data.affiliation?.trim()) {
    errors.push('L\'affiliation est requise');
  }
  
  if (!data.portAttache?.trim()) {
    errors.push('Le port d\'attache est requis');
  }
  
  // Check for duplicate immatriculation
  if (data.immatriculation && mockBarques.some(b => 
    b.immatriculation === data.immatriculation && b.id !== data.id
  )) {
    errors.push('Cette immatriculation existe déjà');
  }
  
  return errors;
};

// Response helpers
const createErrorResponse = (message: string, status = 400) => {
  return new HttpResponse(
    JSON.stringify({ message, status }),
    { status, headers: { 'Content-Type': 'application/json' } }
  );
};

export const barquesHandlers = [
  // Get all barques with optional filtering
  http.get('*/api/barques', async ({ request }) => {
    await delay(300);

    try {
      const url = new URL(request.url);
      const searchTerm = url.searchParams.get('search')?.toLowerCase();
      const port = url.searchParams.get('port');
      const status = url.searchParams.get('status');

      let filteredBarques = [...mockBarques];

      if (searchTerm) {
        filteredBarques = filteredBarques.filter(b => 
          b.nomBarque.toLowerCase().includes(searchTerm) ||
          b.immatriculation.toLowerCase().includes(searchTerm) ||
          b.portAttache.toLowerCase().includes(searchTerm) ||
          b.affiliation.toLowerCase().includes(searchTerm)
        );
      }

      if (port) {
        filteredBarques = filteredBarques.filter(b => b.portAttache === port);
      }

      if (status) {
        const isActive = status === 'active';
        filteredBarques = filteredBarques.filter(b => b.isActive === isActive);
      }

      return HttpResponse.json(filteredBarques);
    } catch (error) {
      console.error('Error fetching barques:', error);
      return createErrorResponse('Erreur lors de la récupération des barques', 500);
    }
  }),

  // Get barque by ID
  http.get('*/api/barques/:id', async ({ params }) => {
    await delay(200);

    try {
      const { id } = params;
      const barque = mockBarques.find(b => b.id === id);
      
      if (!barque) {
        return createErrorResponse('Barque non trouvée', 404);
      }
      
      return HttpResponse.json(barque);
    } catch (error) {
      console.error('Error fetching barque:', error);
      return createErrorResponse('Erreur lors de la récupération de la barque', 500);
    }
  }),

  // Create barque
  http.post('*/api/barques', async ({ request }) => {
    await delay(300);

    try {
      const body = await request.json();
      
      // Validate request data
      const validationErrors = validateBarqueData(body);
      if (validationErrors.length > 0) {
        return createErrorResponse(validationErrors.join(', '));
      }

      const newBarque: Barque = {
        ...body,
        id: Math.random().toString(36).substr(2, 9),
        isActive: body.isActive ?? true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      mockBarques.push(newBarque);
      
      return HttpResponse.json(newBarque, { 
        status: 201,
        headers: {
          'Location': `/api/barques/${newBarque.id}`
        }
      });
    } catch (error) {
      console.error('Error creating barque:', error);
      return createErrorResponse('Erreur lors de la création de la barque', 500);
    }
  }),

  // Update barque
  http.put('*/api/barques/:id', async ({ params, request }) => {
    await delay(300);

    try {
      const { id } = params;
      const body = await request.json();
      const index = mockBarques.findIndex(b => b.id === id);

      if (index === -1) {
        return createErrorResponse('Barque non trouvée', 404);
      }

      // Validate update data
      const validationErrors = validateBarqueData({ ...body, id });
      if (validationErrors.length > 0) {
        return createErrorResponse(validationErrors.join(', '));
      }

      mockBarques[index] = {
        ...mockBarques[index],
        ...body,
        updatedAt: new Date().toISOString()
      };

      return HttpResponse.json(mockBarques[index]);
    } catch (error) {
      console.error('Error updating barque:', error);
      return createErrorResponse('Erreur lors de la mise à jour de la barque', 500);
    }
  }),

  // Delete barque
  http.delete('*/api/barques/:id', async ({ params }) => {
    await delay(300);

    try {
      const { id } = params;
      const index = mockBarques.findIndex(b => b.id === id);

      if (index === -1) {
        return createErrorResponse('Barque non trouvée', 404);
      }

      mockBarques.splice(index, 1);
      return new HttpResponse(null, { status: 204 });
    } catch (error) {
      console.error('Error deleting barque:', error);
      return createErrorResponse('Erreur lors de la suppression de la barque', 500);
    }
  })
];
