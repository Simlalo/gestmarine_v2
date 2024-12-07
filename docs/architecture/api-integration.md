# API Integration

This guide outlines API integration patterns used in the GestMarine application.

## API Client

### 1. Base API Client

```typescript
// api/client.ts
export class ApiClient {
  private baseURL: string;
  private headers: Record<string, string>;

  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || '';
    this.headers = {
      'Content-Type': 'application/json'
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = { ...this.headers, ...options.headers };
    
    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
      throw new ApiError(response.statusText, response.status);
    }

    return response.json();
  }

  public async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint);
  }

  public async post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  public async put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  public async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE'
    });
  }
}
```

### 2. Authentication Interceptor

```typescript
// api/interceptors/auth.ts
export class AuthInterceptor {
  private tokenManager: TokenManager;

  constructor() {
    this.tokenManager = new TokenManager();
  }

  public intercept(headers: Record<string, string>): Record<string, string> {
    const token = this.tokenManager.getToken();
    
    if (token) {
      return {
        ...headers,
        Authorization: `Bearer ${token}`
      };
    }

    return headers;
  }
}
```

### 3. Error Handling

```typescript
// api/errors.ts
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }

  public isUnauthorized(): boolean {
    return this.statusCode === 401;
  }

  public isForbidden(): boolean {
    return this.statusCode === 403;
  }

  public isNotFound(): boolean {
    return this.statusCode === 404;
  }
}
```

## Service Layer

### 1. Base Service

```typescript
// services/base.service.ts
export abstract class BaseService<T> {
  protected client: ApiClient;
  protected endpoint: string;

  constructor(endpoint: string) {
    this.client = new ApiClient();
    this.endpoint = endpoint;
  }

  public async getAll(): Promise<T[]> {
    return this.client.get<T[]>(this.endpoint);
  }

  public async getById(id: string): Promise<T> {
    return this.client.get<T>(`${this.endpoint}/${id}`);
  }

  public async create(data: Partial<T>): Promise<T> {
    return this.client.post<T>(this.endpoint, data);
  }

  public async update(id: string, data: Partial<T>): Promise<T> {
    return this.client.put<T>(`${this.endpoint}/${id}`, data);
  }

  public async delete(id: string): Promise<void> {
    return this.client.delete(`${this.endpoint}/${id}`);
  }
}
```

### 2. Feature Service

```typescript
// services/barque.service.ts
export class BarqueService extends BaseService<Barque> {
  constructor() {
    super('/barques');
  }

  public async assignGerant(
    barqueId: string,
    gerantId: string
  ): Promise<Barque> {
    return this.client.post<Barque>(
      `${this.endpoint}/${barqueId}/assign`,
      { gerantId }
    );
  }

  public async getAvailableBarques(): Promise<Barque[]> {
    return this.client.get<Barque[]>(`${this.endpoint}/available`);
  }
}
```

## API Hooks

### 1. Query Hook

```typescript
// hooks/api/useQuery.ts
export interface QueryOptions<T> {
  enabled?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
}

export const useQuery = <T>(
  key: string,
  fetcher: () => Promise<T>,
  options: QueryOptions<T> = {}
) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetch = async () => {
    try {
      setIsLoading(true);
      const result = await fetcher();
      setData(result);
      options.onSuccess?.(result);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      options.onError?.(apiError);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (options.enabled !== false) {
      fetch();
    }
  }, [key]);

  return { data, error, isLoading, refetch: fetch };
};
```

### 2. Mutation Hook

```typescript
// hooks/api/useMutation.ts
export interface MutationOptions<T, V> {
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
  onSettled?: () => void;
}

export const useMutation = <T, V>(
  mutationFn: (variables: V) => Promise<T>,
  options: MutationOptions<T, V> = {}
) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const mutate = async (variables: V) => {
    try {
      setIsLoading(true);
      const result = await mutationFn(variables);
      setData(result);
      options.onSuccess?.(result);
      return result;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      options.onError?.(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
      options.onSettled?.();
    }
  };

  return { mutate, data, error, isLoading };
};
```

## Feature Hooks

### 1. Resource Hook

```typescript
// features/barques/hooks/useBarques.ts
export const useBarques = (options: QueryOptions<Barque[]> = {}) => {
  const service = new BarqueService();
  
  return useQuery(
    'barques',
    () => service.getAll(),
    options
  );
};

export const useBarque = (
  id: string,
  options: QueryOptions<Barque> = {}
) => {
  const service = new BarqueService();
  
  return useQuery(
    `barque-${id}`,
    () => service.getById(id),
    options
  );
};
```

### 2. Mutation Hook

```typescript
// features/barques/hooks/useBarqueMutations.ts
export const useCreateBarque = (
  options: MutationOptions<Barque, Partial<Barque>> = {}
) => {
  const service = new BarqueService();
  
  return useMutation(
    (data: Partial<Barque>) => service.create(data),
    options
  );
};

export const useAssignGerant = (
  options: MutationOptions<Barque, { barqueId: string; gerantId: string }> = {}
) => {
  const service = new BarqueService();
  
  return useMutation(
    ({ barqueId, gerantId }) => service.assignGerant(barqueId, gerantId),
    options
  );
};
```

## Best Practices

1. **API Client**
   - Implement proper error handling
   - Use interceptors for common modifications
   - Handle authentication properly

2. **Service Layer**
   - Create reusable base services
   - Implement feature-specific methods
   - Handle data transformation

3. **API Hooks**
   - Implement caching
   - Handle loading states
   - Provide error handling

4. **Type Safety**
   - Type API responses
   - Type request payloads
   - Use proper error types

Remember to:
- Handle API errors gracefully
- Implement proper caching
- Use TypeScript for type safety
- Document API endpoints
- Test API integration
