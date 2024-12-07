import { rest } from 'msw';
import { 
  mockBarques, 
  mockGerants, 
  mockBarqueHistory, 
  mockGerantAssignments,
  mockErrors 
} from '../fixtures/mockData';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const handlers = [
  // Barques Endpoints
  rest.get(`${API_URL}/barques`, (req, res, ctx) => {
    const page = Number(req.url.searchParams.get('page')) || 1;
    const limit = Number(req.url.searchParams.get('limit')) || 10;
    const status = req.url.searchParams.get('status');
    
    let filteredBarques = [...mockBarques];
    if (status) {
      filteredBarques = filteredBarques.filter(b => b.status === status);
    }

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedBarques = filteredBarques.slice(start, end);

    return res(
      ctx.status(200),
      ctx.json({
        data: paginatedBarques,
        meta: {
          total: filteredBarques.length,
          page,
          limit,
        },
      })
    );
  }),

  rest.get(`${API_URL}/barques/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const barque = mockBarques.find(b => b.id === id);

    if (!barque) {
      return res(
        ctx.status(404),
        ctx.json(mockErrors.notFound)
      );
    }

    return res(
      ctx.status(200),
      ctx.json(barque)
    );
  }),

  rest.post(`${API_URL}/barques`, async (req, res, ctx) => {
    const body = await req.json();
    
    if (!body.name || !body.registrationNumber) {
      return res(
        ctx.status(400),
        ctx.json(mockErrors.validation)
      );
    }

    const newBarque = {
      id: String(mockBarques.length + 1),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return res(
      ctx.status(201),
      ctx.json(newBarque)
    );
  }),

  rest.put(`${API_URL}/barques/:id`, async (req, res, ctx) => {
    const { id } = req.params;
    const body = await req.json();
    const barqueIndex = mockBarques.findIndex(b => b.id === id);

    if (barqueIndex === -1) {
      return res(
        ctx.status(404),
        ctx.json(mockErrors.notFound)
      );
    }

    const updatedBarque = {
      ...mockBarques[barqueIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    return res(
      ctx.status(200),
      ctx.json(updatedBarque)
    );
  }),

  // Gerants Endpoints
  rest.get(`${API_URL}/gerants`, (req, res, ctx) => {
    const page = Number(req.url.searchParams.get('page')) || 1;
    const limit = Number(req.url.searchParams.get('limit')) || 10;
    const status = req.url.searchParams.get('status');
    
    let filteredGerants = [...mockGerants];
    if (status) {
      filteredGerants = filteredGerants.filter(g => g.status === status);
    }

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedGerants = filteredGerants.slice(start, end);

    return res(
      ctx.status(200),
      ctx.json({
        data: paginatedGerants,
        meta: {
          total: filteredGerants.length,
          page,
          limit,
        },
      })
    );
  }),

  rest.get(`${API_URL}/gerants/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const gerant = mockGerants.find(g => g.id === id);

    if (!gerant) {
      return res(
        ctx.status(404),
        ctx.json(mockErrors.notFound)
      );
    }

    return res(
      ctx.status(200),
      ctx.json(gerant)
    );
  }),

  rest.post(`${API_URL}/gerants`, async (req, res, ctx) => {
    const body = await req.json();
    
    if (!body.firstName || !body.lastName || !body.email) {
      return res(
        ctx.status(400),
        ctx.json(mockErrors.validation)
      );
    }

    const newGerant = {
      id: String(mockGerants.length + 1),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return res(
      ctx.status(201),
      ctx.json(newGerant)
    );
  }),

  // History and Assignments
  rest.get(`${API_URL}/barques/:id/history`, (req, res, ctx) => {
    const { id } = req.params;
    const history = mockBarqueHistory.filter(h => h.barqueId === id);

    return res(
      ctx.status(200),
      ctx.json(history)
    );
  }),

  rest.get(`${API_URL}/gerants/:id/assignments`, (req, res, ctx) => {
    const { id } = req.params;
    const assignments = mockGerantAssignments.filter(a => a.gerantId === id);

    return res(
      ctx.status(200),
      ctx.json(assignments)
    );
  }),

  // Assignment Operations
  rest.post(`${API_URL}/assignments`, async (req, res, ctx) => {
    const body = await req.json();
    
    if (!body.gerantId || !body.barqueId) {
      return res(
        ctx.status(400),
        ctx.json(mockErrors.validation)
      );
    }

    const newAssignment = {
      id: String(mockGerantAssignments.length + 1),
      ...body,
      startDate: new Date().toISOString(),
      status: 'active',
    };

    return res(
      ctx.status(201),
      ctx.json(newAssignment)
    );
  }),
];
