import { Barque, Gerant } from '../../../types';

export const mockBarques: Barque[] = [
  {
    id: '1',
    name: 'Barque 1',
    registrationNumber: 'REG001',
    capacity: 100,
    status: 'active',
    gerantId: '1',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Barque 2',
    registrationNumber: 'REG002',
    capacity: 150,
    status: 'inactive',
    gerantId: '2',
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z',
  },
];

export const mockGerants: Gerant[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    status: 'active',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '+0987654321',
    status: 'inactive',
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z',
  },
];

export const mockBarqueHistory = [
  {
    id: '1',
    barqueId: '1',
    action: 'CREATE',
    changes: { name: 'Barque 1', status: 'active' },
    timestamp: '2023-01-01T00:00:00Z',
    userId: '1',
  },
  {
    id: '2',
    barqueId: '1',
    action: 'UPDATE',
    changes: { status: 'inactive' },
    timestamp: '2023-01-02T00:00:00Z',
    userId: '1',
  },
];

export const mockGerantAssignments = [
  {
    id: '1',
    gerantId: '1',
    barqueId: '1',
    startDate: '2023-01-01T00:00:00Z',
    endDate: null,
    status: 'active',
  },
  {
    id: '2',
    gerantId: '2',
    barqueId: '2',
    startDate: '2023-01-02T00:00:00Z',
    endDate: '2023-02-02T00:00:00Z',
    status: 'completed',
  },
];

export const mockErrors = {
  validation: {
    status: 400,
    message: 'Validation Error',
    errors: {
      name: ['Name is required'],
      email: ['Invalid email format'],
    },
  },
  auth: {
    status: 401,
    message: 'Unauthorized',
    error: 'Invalid or expired token',
  },
  forbidden: {
    status: 403,
    message: 'Forbidden',
    error: 'Insufficient permissions',
  },
  notFound: {
    status: 404,
    message: 'Not Found',
    error: 'Resource not found',
  },
  network: {
    status: 503,
    message: 'Service Unavailable',
    error: 'Network error occurred',
  },
};
