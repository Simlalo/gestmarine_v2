import { http, HttpResponse, delay } from 'msw';
import type { Barque } from '@/types/Barque';
import { barquesHandlers } from '@/features/barques/handlers';

// Sample data
const mockBarques: Barque[] = [
  {
    id: '1',
    nomBarque: 'Barque 1',
    immatriculation: '10/1-001',
    portAttache: 'Boujdour',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    nomBarque: 'Barque 2',
    immatriculation: '10/2-002',
    portAttache: 'Aghti El Ghazi',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
];

// Utility function to parse CSV data
const parseCSVData = async (formData: FormData): Promise<Partial<Barque>[]> => {
  const file = formData.get('file') as File;
  if (!file) throw new Error('No file provided');

  const text = await file.text();
  const lines = text.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());

  return lines.slice(1)
    .filter(line => line.trim())
    .map(line => {
      const values = line.split(',').map(v => v.trim());
      const barque: Partial<Barque> = {};
      
      headers.forEach((header, index) => {
        if (values[index]) {
          switch(header.toLowerCase()) {
            case 'nom':
            case 'nombarque':
              barque.nomBarque = values[index];
              break;
            case 'immatriculation':
              barque.immatriculation = values[index];
              break;
            case 'port':
            case 'portattache':
              barque.portAttache = values[index];
              break;
          }
        }
      });
      
      return barque;
    });
};

const globalHandlers = [
  // Fallback handler for unhandled requests
  http.all('*', async ({ request }) => {
    console.warn(`Unhandled request: ${request.method} ${request.url}`);
    return new HttpResponse(null, { status: 404 });
  })
];

export const handlers = [
  // Get all barques
  http.get('*/api/barques', async () => {
    await delay(500);

    // Simulate random errors (10% chance)
    if (Math.random() < 0.1) {
      return new HttpResponse(null, { 
        status: 500,
        statusText: 'Internal Server Error'
      });
    }

    return HttpResponse.json(mockBarques);
  }),

  // Get barque by ID
  http.get('*/api/barques/:id', async ({ params }) => {
    await delay(200);

    const { id } = params;
    const barque = mockBarques.find(b => b.id === id);
    
    if (!barque) {
      return new HttpResponse(null, { 
        status: 404,
        statusText: 'Barque not found'
      });
    }
    
    return HttpResponse.json(barque);
  }),

  // Create barque
  http.post('*/api/barques', async ({ request }) => {
    await delay(300);

    const body = await request.json();
    const newBarque: Barque = {
      ...body,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    mockBarques.push(newBarque);
    return HttpResponse.json(newBarque, { status: 201 });
  }),

  // Update barque
  http.put('*/api/barques/:id', async ({ params, request }) => {
    await delay(300);

    const { id } = params;
    const body = await request.json();
    const index = mockBarques.findIndex(b => b.id === id);

    if (index === -1) {
      return new HttpResponse(null, { 
        status: 404,
        statusText: 'Barque not found'
      });
    }

    mockBarques[index] = {
      ...mockBarques[index],
      ...body,
      updatedAt: new Date().toISOString()
    };

    return HttpResponse.json(mockBarques[index]);
  }),

  // Delete barque
  http.delete('*/api/barques/:id', async ({ params }) => {
    await delay(300);

    const { id } = params;
    const index = mockBarques.findIndex(b => b.id === id);

    if (index === -1) {
      return new HttpResponse(null, { 
        status: 404,
        statusText: 'Barque not found'
      });
    }

    mockBarques.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  }),

  // File upload handler
  http.post('*/api/barques/upload', async ({ request }) => {
    await delay(1000); // Simulate longer processing time for file upload

    try {
      const formData = await request.formData();
      const file = formData.get('file') as File;

      if (!file) {
        return new HttpResponse(
          JSON.stringify({ message: 'No file provided' }), 
          { status: 400 }
        );
      }

      // Validate file type
      const validTypes = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      if (!validTypes.includes(file.type)) {
        return new HttpResponse(
          JSON.stringify({ message: 'Invalid file type. Only CSV and XLSX files are supported.' }), 
          { status: 400 }
        );
      }

      // Parse the file (simplified for demo - only handling CSV)
      const barques = await parseCSVData(formData);

      // Validate and create barques
      const createdBarques = barques.map(barqueData => ({
        ...barqueData,
        id: Math.random().toString(36).substr(2, 9),
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));

      // Add to mock database
      mockBarques.push(...createdBarques);

      return HttpResponse.json({
        barques: createdBarques,
        message: `Successfully processed ${createdBarques.length} barques`
      }, { status: 201 });

    } catch (error) {
      console.error('File upload error:', error);
      return new HttpResponse(
        JSON.stringify({ message: 'Failed to process file' }), 
        { status: 500 }
      );
    }
  }),
  ...barquesHandlers,
  ...globalHandlers
];
