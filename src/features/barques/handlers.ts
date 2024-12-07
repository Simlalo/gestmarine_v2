import { http, HttpResponse, delay } from 'msw';
import type { Barque, CreateBarquePayload } from '@/types/Barque';

// Sample data
let mockBarques: Barque[] = [
  {
    id: '1',
    nomBarque: 'Barque 1',
    immatriculation: '10/1-001',
    portAttache: 'Boujdour',
    status: 'active',
    gerantId: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    nomBarque: 'Barque 2',
    immatriculation: '10/2-002',
    portAttache: 'Aghti El Ghazi',
    status: 'active',
    gerantId: '2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
];

export const barquesHandlers = [
  // GET /api/barques
  http.get('/api/barques', async () => {
    await delay(500); // Simulate network delay
    return HttpResponse.json(mockBarques);
  }),

  // POST /api/barques
  http.post('/api/barques', async ({ request }) => {
    await delay(500);
    const data = await request.json() as CreateBarquePayload;
    
    const newBarque: Barque = {
      id: (mockBarques.length + 1).toString(),
      ...data,
      status: 'active', // Default status is active
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockBarques.push(newBarque);
    return HttpResponse.json(newBarque, { status: 201 });
  }),

  // PUT /api/barques/:id
  http.put('/api/barques/:id', async ({ params, request }) => {
    await delay(500);
    const { id } = params;
    const updates = await request.json() as Partial<Barque>;
    
    const index = mockBarques.findIndex(b => b.id === id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    
    mockBarques[index] = {
      ...mockBarques[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return HttpResponse.json(mockBarques[index]);
  }),

  // DELETE /api/barques/:id
  http.delete('/api/barques/:id', async ({ params }) => {
    await delay(500);
    const { id } = params;
    
    const index = mockBarques.findIndex(b => b.id === id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    
    mockBarques = mockBarques.filter(b => b.id !== id);
    return new HttpResponse(null, { status: 204 });
  }),

  // PUT /api/barques/:id/gerant
  http.put('/api/barques/:id/gerant', async ({ params, request }) => {
    await delay(500);
    const { id } = params;
    const { gerantId } = await request.json() as { gerantId: string };
    
    const index = mockBarques.findIndex(b => b.id === id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    
    mockBarques[index] = {
      ...mockBarques[index],
      gerantId,
      updatedAt: new Date().toISOString()
    };
    
    return HttpResponse.json(mockBarques[index]);
  }),

  // PUT /api/barques/:id/status
  http.put('/api/barques/:id/status', async ({ params, request }) => {
    await delay(500);
    const { id } = params;
    const { status } = await request.json() as { status: 'active' | 'inactive' };
    
    const index = mockBarques.findIndex(b => b.id === id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    
    mockBarques[index] = {
      ...mockBarques[index],
      status,
      updatedAt: new Date().toISOString()
    };
    
    return HttpResponse.json(mockBarques[index]);
  }),

  // POST /api/barques/bulk
  http.post('/api/barques/bulk', async ({ request }) => {
    await delay(1000);
    const { barques } = await request.json() as { barques: CreateBarquePayload[] };
    
    const newBarques = barques.map((barque, index) => ({
      id: (mockBarques.length + index + 1).toString(),
      ...barque,
      status: 'active', // Default status is active
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
    
    mockBarques = [...mockBarques, ...newBarques];
    return HttpResponse.json(newBarques, { status: 201 });
  })
];
