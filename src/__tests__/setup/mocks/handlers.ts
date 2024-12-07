import { http, HttpResponse } from 'msw';
import { API_ENDPOINTS } from '../../../api/constants';

// Mock data
const mockBarque = {
  id: '1',
  nomBarque: 'Test Barque',
  immatriculation: 'TB123',
  portAttache: 'Test Port',
  affiliation: 'Test Affiliation',
  isActive: true,
};

const mockGerant = {
  id: '1',
  nom: 'Test',
  prenom: 'Gerant',
  email: 'test@example.com',
  telephone: '1234567890',
  status: 'active' as const,
  role: 'gérant' as const,
};

export const handlers = [
  // Barques endpoints
  http.get(`${API_ENDPOINTS.BARQUES.BASE}`, () => {
    return HttpResponse.json({
      data: [mockBarque],
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    });
  }),

  http.post(`${API_ENDPOINTS.BARQUES.BASE}`, async (req) => {
    const body = await req.json();
    return HttpResponse.json({
      ...mockBarque,
      ...body,
    });
  }),

  http.put(`${API_ENDPOINTS.BARQUES.BY_ID(':id')}`, async (req) => {
    const body = await req.json();
    return HttpResponse.json({
      ...mockBarque,
      ...body,
    });
  }),

  // Gerants endpoints
  http.get(`${API_ENDPOINTS.GERANTS.BASE}`, () => {
    return HttpResponse.json({
      data: [mockGerant],
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    });
  }),

  http.post(`${API_ENDPOINTS.GERANTS.BASE}`, async (req) => {
    const body = await req.json();
    return HttpResponse.json({
      ...mockGerant,
      ...body,
    });
  }),

  http.put(`${API_ENDPOINTS.GERANTS.BY_ID(':id')}`, async (req) => {
    const body = await req.json();
    return HttpResponse.json({
      ...mockGerant,
      ...body,
    });
  }),

  // Error handlers
  http.get('/error', () => {
    return HttpResponse.json({
      message: 'Internal Server Error',
    }, { status: 500 });
  }),

  http.get('/unauthorized', () => {
    return HttpResponse.json({
      message: 'Unauthorized',
    }, { status: 401 });
  }),
];
