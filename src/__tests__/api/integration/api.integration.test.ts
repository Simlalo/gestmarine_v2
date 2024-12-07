import { barquesApi } from '../../../api/endpoints/barques';
import { gerantsApi } from '../../../api/endpoints/gerants';
import { apiTestUtils } from '../utils/testUtils';
import { server } from '../mocks/server';

describe('API Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    server.resetHandlers();
  });

  describe('Barque and Gerant Assignment Flow', () => {
    it('completes full barque-gerant assignment workflow', async () => {
      // 1. Create a new gerant
      const newGerant = await gerantsApi.createGerant({
        firstName: 'Test',
        lastName: 'Gerant',
        email: 'test.gerant@example.com',
        phone: '+1234567890',
        status: 'active',
      });

      expect(newGerant.id).toBeDefined();

      // 2. Create a new barque
      const newBarque = await barquesApi.createBarque({
        name: 'Test Barque',
        registrationNumber: 'TEST001',
        capacity: 100,
        status: 'active',
      });

      expect(newBarque.id).toBeDefined();

      // 3. Assign barque to gerant
      const assignment = await barquesApi.assignBarque({
        barqueId: newBarque.id,
        gerantId: newGerant.id,
      });

      expect(assignment).toEqual(expect.objectContaining({
        barqueId: newBarque.id,
        gerantId: newGerant.id,
        status: 'active',
      }));

      // 4. Verify gerant assignments
      const gerantAssignments = await gerantsApi.getGerantAssignments(newGerant.id);
      expect(gerantAssignments).toContainEqual(
        expect.objectContaining({
          barqueId: newBarque.id,
          status: 'active',
        })
      );

      // 5. Verify barque details include gerant
      const updatedBarque = await barquesApi.getBarqueById(newBarque.id);
      expect(updatedBarque.gerantId).toBe(newGerant.id);
    });

    it('handles reassignment of barques', async () => {
      // 1. Create initial gerant and barque
      const gerant1 = await gerantsApi.createGerant({
        firstName: 'First',
        lastName: 'Gerant',
        email: 'first.gerant@example.com',
        status: 'active',
      });

      const barque = await barquesApi.createBarque({
        name: 'Test Barque',
        registrationNumber: 'TEST002',
        capacity: 100,
        status: 'active',
      });

      // 2. Initial assignment
      await barquesApi.assignBarque({
        barqueId: barque.id,
        gerantId: gerant1.id,
      });

      // 3. Create second gerant
      const gerant2 = await gerantsApi.createGerant({
        firstName: 'Second',
        lastName: 'Gerant',
        email: 'second.gerant@example.com',
        status: 'active',
      });

      // 4. Reassign barque to second gerant
      const newAssignment = await barquesApi.assignBarque({
        barqueId: barque.id,
        gerantId: gerant2.id,
      });

      // 5. Verify assignments
      const gerant1Assignments = await gerantsApi.getGerantAssignments(gerant1.id);
      const gerant2Assignments = await gerantsApi.getGerantAssignments(gerant2.id);

      expect(gerant1Assignments[0].status).toBe('completed');
      expect(gerant2Assignments[0].status).toBe('active');
    });
  });

  describe('Status Updates and History', () => {
    it('tracks barque status changes in history', async () => {
      // 1. Create barque
      const barque = await barquesApi.createBarque({
        name: 'History Test Barque',
        registrationNumber: 'TEST003',
        capacity: 100,
        status: 'active',
      });

      // 2. Update status multiple times
      await barquesApi.updateBarque(barque.id, { status: 'maintenance' });
      await barquesApi.updateBarque(barque.id, { status: 'active' });

      // 3. Verify history
      const history = await barquesApi.getBarqueHistory(barque.id);
      expect(history).toHaveLength(3); // Create + 2 updates
      expect(history.map(h => h.changes.status)).toEqual(
        expect.arrayContaining(['active', 'maintenance', 'active'])
      );
    });
  });

  describe('Error Recovery and Edge Cases', () => {
    it('handles concurrent assignment attempts gracefully', async () => {
      // 1. Create test data
      const gerant = await gerantsApi.createGerant({
        firstName: 'Test',
        lastName: 'Gerant',
        email: 'test.concurrent@example.com',
        status: 'active',
      });

      const barque1 = await barquesApi.createBarque({
        name: 'Barque 1',
        registrationNumber: 'TEST004',
        status: 'active',
      });

      const barque2 = await barquesApi.createBarque({
        name: 'Barque 2',
        registrationNumber: 'TEST005',
        status: 'active',
      });

      // 2. Attempt concurrent assignments
      const assignments = await Promise.allSettled([
        barquesApi.assignBarque({ barqueId: barque1.id, gerantId: gerant.id }),
        barquesApi.assignBarque({ barqueId: barque2.id, gerantId: gerant.id }),
      ]);

      // 3. Verify only one assignment succeeded
      const successfulAssignments = assignments.filter(
        result => result.status === 'fulfilled'
      );
      expect(successfulAssignments).toHaveLength(1);

      // 4. Verify final state
      const gerantAssignments = await gerantsApi.getGerantAssignments(gerant.id);
      expect(gerantAssignments).toHaveLength(1);
    });

    it('maintains data consistency during error scenarios', async () => {
      // 1. Create initial state
      const gerant = await gerantsApi.createGerant({
        firstName: 'Error',
        lastName: 'Test',
        email: 'error.test@example.com',
        status: 'active',
      });

      const barque = await barquesApi.createBarque({
        name: 'Error Test Barque',
        registrationNumber: 'TEST006',
        status: 'active',
      });

      // 2. Simulate network error during assignment
      apiTestUtils.simulateNetworkError('post', '/assignments');

      // 3. Attempt assignment
      try {
        await barquesApi.assignBarque({
          barqueId: barque.id,
          gerantId: gerant.id,
        });
      } catch (error) {
        // Expected error
      }

      // 4. Verify system state remains consistent
      const gerantAssignments = await gerantsApi.getGerantAssignments(gerant.id);
      const updatedBarque = await barquesApi.getBarqueById(barque.id);

      expect(gerantAssignments).toHaveLength(0);
      expect(updatedBarque.gerantId).toBeNull();
    });
  });

  describe('Performance Monitoring', () => {
    it('handles pagination efficiently', async () => {
      const startTime = Date.now();
      
      // Fetch multiple pages
      const pages = await Promise.all([
        gerantsApi.getGerants({ page: 1, limit: 10 }),
        gerantsApi.getGerants({ page: 2, limit: 10 }),
        gerantsApi.getGerants({ page: 3, limit: 10 }),
      ]);

      const duration = Date.now() - startTime;
      
      // Verify response times are reasonable
      expect(duration).toBeLessThan(1000); // Should complete within 1 second
      
      // Verify correct pagination
      pages.forEach((response, index) => {
        expect(response.meta.page).toBe(index + 1);
      });
    });

    it('optimizes batch operations', async () => {
      const startTime = Date.now();
      
      // Create multiple entities in parallel
      const barques = await Promise.all([
        barquesApi.createBarque({
          name: 'Batch 1',
          registrationNumber: 'BATCH001',
          status: 'active',
        }),
        barquesApi.createBarque({
          name: 'Batch 2',
          registrationNumber: 'BATCH002',
          status: 'active',
        }),
      ]);

      const duration = Date.now() - startTime;
      
      // Verify batch operation performance
      expect(duration).toBeLessThan(1000);
      expect(barques).toHaveLength(2);
    });
  });
});
