# Data Fetching and Caching

This guide outlines the data fetching and caching patterns used in the GestMarine application.

## API Client Setup

### 1. Base API Client

```typescript
// utils/api/client.ts
export class APIClient {
  private static instance: AxiosInstance;

  static getInstance(): AxiosInstance {
    if (!this.instance) {
      this.instance = axios.create({
        baseURL: process.env.REACT_APP_API_URL,
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      this.setupInterceptors();
    }
    
    return this.instance;
  }

  private static setupInterceptors(): void {
    this.instance.interceptors.request.use(
      (config) => {
        const token = TokenManager.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      }
    );

    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await this.handleUnauthorized();
        }
        return Promise.reject(error);
      }
    );
  }
}
```

### 2. API Service Base Class

```typescript
// utils/api/baseService.ts
export abstract class BaseAPIService {
  protected client: AxiosInstance;
  protected endpoint: string;

  constructor(endpoint: string) {
    this.client = APIClient.getInstance();
    this.endpoint = endpoint;
  }

  protected async get<T>(path: string = '', params?: object): Promise<T> {
    const response = await this.client.get(`${this.endpoint}${path}`, { params });
    return response.data;
  }

  protected async post<T>(path: string = '', data?: any): Promise<T> {
    const response = await this.client.post(`${this.endpoint}${path}`, data);
    return response.data;
  }

  protected async put<T>(path: string = '', data?: any): Promise<T> {
    const response = await this.client.put(`${this.endpoint}${path}`, data);
    return response.data;
  }

  protected async delete<T>(path: string = ''): Promise<T> {
    const response = await this.client.delete(`${this.endpoint}${path}`);
    return response.data;
  }
}
```

## Feature Services

### 1. Barque Service

```typescript
// services/barques/BarqueService.ts
export class BarqueService extends BaseAPIService {
  constructor() {
    super('/barques');
  }

  async getBarques(params?: BarqueQueryParams): Promise<Barque[]> {
    return this.get<Barque[]>('', params);
  }

  async getBarque(id: string): Promise<Barque> {
    return this.get<Barque>(`/${id}`);
  }

  async createBarque(data: CreateBarqueDto): Promise<Barque> {
    return this.post<Barque>('', data);
  }

  async updateBarque(id: string, data: UpdateBarqueDto): Promise<Barque> {
    return this.put<Barque>(`/${id}`, data);
  }

  async deleteBarque(id: string): Promise<void> {
    return this.delete(`/${id}`);
  }
}
```

## Caching Layer

### 1. Cache Manager

```typescript
// utils/cache/cacheManager.ts
export class CacheManager {
  private static cache = new Map<string, {
    data: any;
    timestamp: number;
    ttl: number;
  }>();

  static set(key: string, data: any, ttlMinutes: number = 5): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000
    });
  }

  static get<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > cached.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data as T;
  }

  static invalidate(key: string): void {
    this.cache.delete(key);
  }

  static invalidatePattern(pattern: RegExp): void {
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.cache.delete(key);
      }
    }
  }
}
```

### 2. Query Cache Hook

```typescript
// hooks/common/useQuery.ts
export const useQuery = <T>(
  key: string,
  fetcher: () => Promise<T>,
  options: {
    ttl?: number;
    enabled?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
  } = {}
) => {
  const [data, setData] = useState<T | null>(() => CacheManager.get<T>(key));
  const [isLoading, setIsLoading] = useState(!data);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      setData(result);
      CacheManager.set(key, result, options.ttl);
      options.onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      options.onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [key, fetcher, options]);

  useEffect(() => {
    if (options.enabled !== false) {
      fetch();
    }
  }, [fetch, options.enabled]);

  return {
    data,
    isLoading,
    error,
    refetch: fetch
  };
};
```

## Optimistic Updates

### 1. Mutation Hook

```typescript
// hooks/common/useMutation.ts
export const useMutation = <TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: {
    onSuccess?: (data: TData, variables: TVariables) => void;
    onError?: (error: Error, variables: TVariables) => void;
    onSettled?: (
      data: TData | undefined,
      error: Error | null,
      variables: TVariables
    ) => void;
  } = {}
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (variables: TVariables) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await mutationFn(variables);
      options.onSuccess?.(data, variables);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      options.onError?.(error, variables);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mutate,
    isLoading,
    error
  };
};
```

## Implementation Examples

### 1. Using Query Hook

```typescript
// features/barques/hooks/useBarques.ts
export const useBarques = (params?: BarqueQueryParams) => {
  const barqueService = useMemo(() => new BarqueService(), []);
  const queryKey = `barques?${new URLSearchParams(params).toString()}`;

  return useQuery(
    queryKey,
    () => barqueService.getBarques(params),
    {
      ttl: 5, // 5 minutes cache
      onError: (error) => {
        console.error('Failed to fetch barques:', error);
      }
    }
  );
};
```

### 2. Using Mutation Hook

```typescript
// features/barques/hooks/useBarqueMutation.ts
export const useBarqueMutation = () => {
  const barqueService = useMemo(() => new BarqueService(), []);
  
  const createBarque = useMutation(
    (data: CreateBarqueDto) => barqueService.createBarque(data),
    {
      onSuccess: () => {
        CacheManager.invalidatePattern(/^barques/);
      }
    }
  );

  const updateBarque = useMutation(
    ({ id, data }: { id: string; data: UpdateBarqueDto }) =>
      barqueService.updateBarque(id, data),
    {
      onSuccess: () => {
        CacheManager.invalidatePattern(/^barques/);
      }
    }
  );

  return {
    createBarque,
    updateBarque
  };
};
```

## Best Practices

1. **Caching Strategy**
   - Use appropriate TTL values
   - Implement cache invalidation
   - Handle stale data

2. **Error Handling**
   - Implement retry logic
   - Handle network errors
   - Show loading states

3. **Performance**
   - Use request deduplication
   - Implement pagination
   - Cache responses

4. **Data Consistency**
   - Handle optimistic updates
   - Manage cache invalidation
   - Sync client state

Remember to:
- Handle loading states
- Implement error boundaries
- Use proper TypeScript types
- Document API endpoints
- Test error scenarios
