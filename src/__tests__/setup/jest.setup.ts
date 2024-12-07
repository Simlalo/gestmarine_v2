import '@testing-library/jest-dom';
import 'whatwg-fetch';

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockImplementation(() => ({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
}));
window.IntersectionObserver = mockIntersectionObserver;

// Mock process.env
process.env.VITE_API_URL = 'http://localhost:3001/api';
