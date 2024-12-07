# Error Handling Patterns

This guide outlines the error handling patterns and best practices used throughout the GestMarine application.

## Error Types

### 1. API Errors
```typescript
// types/errors.ts
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  status: number;
}

export class GestMarineError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'GestMarineError';
  }
}
```

### 2. Validation Errors
```typescript
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface FormValidationError {
  errors: ValidationError[];
  message: string;
}
```

## Error Handling Patterns

### 1. API Error Handling

```typescript
// utils/api.ts
export const handleApiError = (error: unknown): GestMarineError => {
  if (error instanceof GestMarineError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 500;
    const data = error.response?.data;

    return new GestMarineError(
      data?.message ?? 'An unexpected error occurred',
      data?.code ?? 'UNKNOWN_ERROR',
      status,
      data?.details
    );
  }

  return new GestMarineError(
    'An unexpected error occurred',
    'UNKNOWN_ERROR',
    500
  );
};
```

### 2. Component Error Boundaries

```typescript
// components/common/ErrorBoundary.tsx
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  state = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to monitoring service
    logError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}
```

### 3. Hook Error Handling

```typescript
// hooks/common/useAsyncOperation.ts
export const useAsyncOperation = <T, E = Error>(
  operation: () => Promise<T>,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: E) => void;
  }
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<E | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await operation();
      setData(result);
      options?.onSuccess?.(result);
    } catch (err) {
      const error = handleApiError(err) as E;
      setError(error);
      options?.onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { execute, isLoading, error, data };
};
```

## Error Display Components

### 1. Error Alert

```typescript
// components/common/ErrorAlert.tsx
export const ErrorAlert: React.FC<{
  error: GestMarineError | null;
  onClose?: () => void;
}> = ({ error, onClose }) => {
  if (!error) return null;

  return (
    <Alert
      severity="error"
      onClose={onClose}
      sx={{ mb: 2 }}
    >
      <AlertTitle>{error.code}</AlertTitle>
      {error.message}
      {error.details && (
        <pre>{JSON.stringify(error.details, null, 2)}</pre>
      )}
    </Alert>
  );
};
```

### 2. Form Error Display

```typescript
// components/common/FormErrors.tsx
export const FormErrors: React.FC<{
  errors: ValidationError[];
}> = ({ errors }) => {
  if (errors.length === 0) return null;

  return (
    <Box sx={{ mb: 2 }}>
      {errors.map((error, index) => (
        <Alert key={index} severity="error" sx={{ mb: 1 }}>
          {error.field}: {error.message}
        </Alert>
      ))}
    </Box>
  );
};
```

## Error Handling in Forms

```typescript
// hooks/common/useForm.ts
export const useForm = <T extends Record<string, any>>({
  initialValues,
  validate,
  onSubmit
}: FormConfig<T>) => {
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: T) => {
    try {
      setIsSubmitting(true);
      setErrors([]);

      // Validate form
      const validationErrors = await validate(values);
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        return;
      }

      // Submit form
      await onSubmit(values);
    } catch (error) {
      const gestError = handleApiError(error);
      setErrors([
        {
          field: 'form',
          message: gestError.message,
          code: gestError.code
        }
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { errors, isSubmitting, handleSubmit };
};
```

## Error Monitoring and Logging

```typescript
// utils/monitoring.ts
export const logError = (
  error: Error,
  context?: Record<string, any>
) => {
  // Integration with error monitoring service (e.g., Sentry)
  Sentry.captureException(error, {
    extra: context
  });

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', error);
    if (context) {
      console.error('Context:', context);
    }
  }
};
```

## Best Practices

1. **Consistent Error Structure**
   - Use standardized error types
   - Include error codes for identification
   - Provide meaningful error messages

2. **Graceful Degradation**
   - Always provide fallback UI
   - Handle offline scenarios
   - Preserve user data when possible

3. **User-Friendly Messages**
   - Display technical details only in development
   - Provide actionable error messages
   - Support internationalization

4. **Error Recovery**
   - Implement retry mechanisms
   - Preserve form data
   - Provide clear recovery paths

5. **Error Boundaries**
   - Use at strategic points
   - Prevent cascading failures
   - Log errors for debugging

## Implementation Examples

### 1. Form with Error Handling

```typescript
const UserForm = () => {
  const form = useForm({
    initialValues: { name: '', email: '' },
    validate: async (values) => {
      const errors: ValidationError[] = [];
      
      if (!values.name) {
        errors.push({
          field: 'name',
          message: 'Name is required',
          code: 'REQUIRED'
        });
      }
      
      if (!values.email) {
        errors.push({
          field: 'email',
          message: 'Email is required',
          code: 'REQUIRED'
        });
      }
      
      return errors;
    },
    onSubmit: async (values) => {
      await api.createUser(values);
    }
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <FormErrors errors={form.errors} />
      {/* Form fields */}
    </form>
  );
};
```

### 2. API Call with Error Handling

```typescript
const useBarques = () => {
  const { execute, isLoading, error, data } = useAsyncOperation(
    () => api.getBarques(),
    {
      onError: (error) => {
        // Handle specific error cases
        if (error.code === 'UNAUTHORIZED') {
          // Redirect to login
        }
      }
    }
  );

  return { loadBarques: execute, isLoading, error, barques: data };
};
```

Remember to:
- Handle all possible error scenarios
- Provide meaningful error messages
- Log errors appropriately
- Implement proper error recovery
- Use type-safe error handling
