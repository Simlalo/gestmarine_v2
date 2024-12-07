import { barquesApi } from '../../../api/endpoints/barques';
import { apiTestUtils } from '../utils/testUtils';
import { mockBarques, mockBarqueHistory, mockErrors } from '../fixtures/mockData';
import { server } from '../mocks/server';

describe('Barques API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    server.resetHandlers();
  });

  describe('queries', () => {
    it('fetches barques list with pagination', async () => {
      const response = await barquesApi.getBarques({ page: 1, limit: 10 });
      
      expect(response.data).toHaveLength(2);
      expect(response.meta).toBeDefined();
      apiTestUtils.verifyPaginationMeta(response.meta, 2, 1, 10);
    });

    it('applies filters to barques list', async () => {
      const response = await barquesApi.getBarques({ 
        page: 1, 
        limit: 10,
        filters: { status: 'active' }
      });

      expect(response.data).toHaveLength(1);
      expect(response.data[0].status).toBe('active');
    });

    it('fetches single barque by id', async () => {
      const barqueId = '1';
      const response = await barquesApi.getBarqueById(barqueId);

      expect(response).toEqual(mockBarques[0]);
    });

    it('handles not found error for invalid barque id', async () => {
      const invalidId = 'invalid-id';
      
      try {
        await barquesApi.getBarqueById(invalidId);
      } catch (error) {
        apiTestUtils.verifyErrorResponse(
          error.response.data,
          404,
          mockErrors.notFound.message
        );
      }
    });

    it('fetches barque history', async () => {
      const barqueId = '1';
      const response = await barquesApi.getBarqueHistory(barqueId);

      expect(response).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            barqueId: barqueId,
            action: expect.any(String),
          })
        ])
      );
    });
  });

  describe('mutations', () => {
    it('creates new barque', async () => {
      const newBarque = {
        name: 'New Barque',
        registrationNumber: 'REG003',
        capacity: 200,
        status: 'active',
      };

      const response = await barquesApi.createBarque(newBarque);

      expect(response).toEqual(expect.objectContaining({
        ...newBarque,
        id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }));
    });

    it('validates required fields on create', async () => {
      const invalidBarque = {
        capacity: 200,
        status: 'active',
      };

      try {
        await barquesApi.createBarque(invalidBarque);
      } catch (error) {
        apiTestUtils.verifyValidationErrors(
          error.response.data,
          ['name', 'registrationNumber']
        );
      }
    });

    it('updates existing barque', async () => {
      const barqueId = '1';
      const updates = {
        name: 'Updated Barque',
        status: 'inactive',
      };

      const response = await barquesApi.updateBarque(barqueId, updates);

      expect(response).toEqual(expect.objectContaining({
        ...updates,
        id: barqueId,
        updatedAt: expect.any(String),
      }));
    });

    it('handles not found error on update', async () => {
      const invalidId = 'invalid-id';
      const updates = { name: 'Updated Barque' };

      try {
        await barquesApi.updateBarque(invalidId, updates);
      } catch (error) {
        apiTestUtils.verifyErrorResponse(
          error.response.data,
          404,
          mockErrors.notFound.message
        );
      }
    });

    it('assigns barque to gerant', async () => {
      const assignment = {
        barqueId: '1',
        gerantId: '1',
      };

      const response = await barquesApi.assignBarque(assignment);

      expect(response).toEqual(expect.objectContaining({
        ...assignment,
        id: expect.any(String),
        startDate: expect.any(String),
        status: 'active',
      }));
    });
  });

  describe('error scenarios', () => {
    it('handles network errors with retry', async () => {
      apiTestUtils.simulateNetworkError('get', '/barques');
      let attempts = 0;

      try {
        await barquesApi.getBarques({ 
          page: 1, 
          limit: 10,
          _retryCount: 2,
          _onRetry: () => { attempts++; }
        });
      } catch (error) {
        expect(attempts).toBe(2);
        expect(error.response.status).toBe(503);
      }
    });

    it('handles timeout errors', async () => {
      apiTestUtils.simulateDelay('get', '/barques', 5000); // 5 second delay

      try {
        await barquesApi.getBarques({ 
          page: 1, 
          limit: 10,
          timeout: 1000 // 1 second timeout
        });
      } catch (error) {
        expect(error.code).toBe('ECONNABORTED');
      }
    });

    it('handles validation errors with detailed messages', async () => {
      const invalidBarque = {
        name: '',
        registrationNumber: 'invalid',
        capacity: -1,
      };

      try {
        await barquesApi.createBarque(invalidBarque);
      } catch (error) {
        expect(error.response.status).toBe(400);
        expect(error.response.data.errors).toEqual(
          expect.objectContaining({
            name: expect.any(Array),
            registrationNumber: expect.any(Array),
            capacity: expect.any(Array),
          })
        );
      }
    });

    it('handles unauthorized access', async () => {
      apiTestUtils.simulateAuthError('get', '/barques');

      try {
        await barquesApi.getBarques({ page: 1, limit: 10 });
      } catch (error) {
        expect(error.response.status).toBe(401);
        expect(error.response.data).toEqual(mockErrors.auth);
      }
    });
  });
});
