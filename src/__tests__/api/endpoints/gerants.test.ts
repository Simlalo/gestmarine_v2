import { gerantsApi } from '../../../api/endpoints/gerants';
import { apiTestUtils } from '../utils/testUtils';
import { mockGerants, mockGerantAssignments, mockErrors } from '../fixtures/mockData';
import { server } from '../mocks/server';

describe('Gerants API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    server.resetHandlers();
  });

  describe('queries', () => {
    it('fetches gerants list with pagination', async () => {
      const response = await gerantsApi.getGerants({ page: 1, limit: 10 });
      
      expect(response.data).toHaveLength(2);
      expect(response.meta).toBeDefined();
      apiTestUtils.verifyPaginationMeta(response.meta, 2, 1, 10);
    });

    it('applies filters to gerants list', async () => {
      const response = await gerantsApi.getGerants({ 
        page: 1, 
        limit: 10,
        filters: { status: 'active' }
      });

      expect(response.data).toHaveLength(1);
      expect(response.data[0].status).toBe('active');
    });

    it('supports search by name', async () => {
      const response = await gerantsApi.getGerants({
        page: 1,
        limit: 10,
        search: 'John'
      });

      expect(response.data).toHaveLength(1);
      expect(response.data[0].firstName).toBe('John');
    });

    it('fetches single gerant by id', async () => {
      const gerantId = '1';
      const response = await gerantsApi.getGerantById(gerantId);

      expect(response).toEqual(mockGerants[0]);
    });

    it('handles not found error for invalid gerant id', async () => {
      const invalidId = 'invalid-id';
      
      try {
        await gerantsApi.getGerantById(invalidId);
      } catch (error) {
        apiTestUtils.verifyErrorResponse(
          error.response.data,
          404,
          mockErrors.notFound.message
        );
      }
    });

    it('fetches gerant assignments', async () => {
      const gerantId = '1';
      const response = await gerantsApi.getGerantAssignments(gerantId);

      expect(response).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            gerantId: gerantId,
            barqueId: expect.any(String),
          })
        ])
      );
    });

    it('filters assignments by status', async () => {
      const gerantId = '1';
      const response = await gerantsApi.getGerantAssignments(gerantId, { status: 'active' });

      expect(response).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            status: 'active'
          })
        ])
      );
    });
  });

  describe('mutations', () => {
    it('creates new gerant', async () => {
      const newGerant = {
        firstName: 'New',
        lastName: 'Gerant',
        email: 'new.gerant@example.com',
        phone: '+1234567890',
        status: 'active',
      };

      const response = await gerantsApi.createGerant(newGerant);

      expect(response).toEqual(expect.objectContaining({
        ...newGerant,
        id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }));
    });

    it('validates required fields on create', async () => {
      const invalidGerant = {
        firstName: 'New',
        status: 'active',
      };

      try {
        await gerantsApi.createGerant(invalidGerant);
      } catch (error) {
        apiTestUtils.verifyValidationErrors(
          error.response.data,
          ['lastName', 'email']
        );
      }
    });

    it('validates email format', async () => {
      const invalidGerant = {
        firstName: 'New',
        lastName: 'Gerant',
        email: 'invalid-email',
        status: 'active',
      };

      try {
        await gerantsApi.createGerant(invalidGerant);
      } catch (error) {
        expect(error.response.data.errors.email).toBeDefined();
      }
    });

    it('updates existing gerant', async () => {
      const gerantId = '1';
      const updates = {
        firstName: 'Updated',
        lastName: 'Gerant',
        status: 'inactive',
      };

      const response = await gerantsApi.updateGerant(gerantId, updates);

      expect(response).toEqual(expect.objectContaining({
        ...updates,
        id: gerantId,
        updatedAt: expect.any(String),
      }));
    });

    it('handles not found error on update', async () => {
      const invalidId = 'invalid-id';
      const updates = { firstName: 'Updated' };

      try {
        await gerantsApi.updateGerant(invalidId, updates);
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
        gerantId: '1',
        barqueId: '1',
      };

      const response = await gerantsApi.assignBarque(assignment);

      expect(response).toEqual(expect.objectContaining({
        ...assignment,
        id: expect.any(String),
        startDate: expect.any(String),
        status: 'active',
      }));
    });

    it('validates assignment constraints', async () => {
      const invalidAssignment = {
        gerantId: '1',
        barqueId: '2', // Already assigned to another gerant
      };

      try {
        await gerantsApi.assignBarque(invalidAssignment);
      } catch (error) {
        expect(error.response.status).toBe(400);
        expect(error.response.data.message).toContain('already assigned');
      }
    });
  });

  describe('error scenarios', () => {
    it('handles duplicate email error', async () => {
      const existingGerant = mockGerants[0];
      const newGerant = {
        firstName: 'New',
        lastName: 'Gerant',
        email: existingGerant.email,
        status: 'active',
      };

      try {
        await gerantsApi.createGerant(newGerant);
      } catch (error) {
        expect(error.response.status).toBe(400);
        expect(error.response.data.message).toContain('email already exists');
      }
    });

    it('handles concurrent assignment conflicts', async () => {
      const assignment1 = {
        gerantId: '1',
        barqueId: '1',
      };

      const assignment2 = {
        gerantId: '2',
        barqueId: '1',
      };

      await gerantsApi.assignBarque(assignment1);

      try {
        await gerantsApi.assignBarque(assignment2);
      } catch (error) {
        expect(error.response.status).toBe(409);
        expect(error.response.data.message).toContain('conflict');
      }
    });

    it('handles server errors with retry', async () => {
      apiTestUtils.simulateNetworkError('get', '/gerants');
      let attempts = 0;

      try {
        await gerantsApi.getGerants({ 
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

    it('handles authorization errors', async () => {
      apiTestUtils.simulateAuthError('post', '/gerants');

      try {
        await gerantsApi.createGerant({
          firstName: 'New',
          lastName: 'Gerant',
          email: 'new@example.com',
          status: 'active',
        });
      } catch (error) {
        expect(error.response.status).toBe(401);
        expect(error.response.data).toEqual(mockErrors.auth);
      }
    });
  });
});
