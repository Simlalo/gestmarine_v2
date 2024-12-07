import { ApiError } from '@api/errors';
import { apiClient } from '@api/client';

// Verify imports are working
console.log('ApiError imported:', ApiError.name);
console.log('apiClient imported:', apiClient.defaults.baseURL);
