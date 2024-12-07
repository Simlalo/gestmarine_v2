# Error State Component

## ErrorState

A flexible error display component that provides consistent error visualization and retry functionality across the application.

### Props API Reference

```typescript
interface ErrorStateProps {
  // Required Props
  error: Error | string;          // Error object or message
  
  // Optional Props
  title?: string;                 // Custom error title
  retry?: () => void;            // Retry callback function
  className?: string;            // Additional CSS classes
  variant?: 'default' | 'inline' | 'card'; // Display variant
  icon?: ReactNode;              // Custom error icon
  actions?: ReactNode;           // Additional action buttons
}
```

### Usage Examples

#### Basic Error Display
```tsx
import { ErrorState } from '@/components/ui/ErrorState';

function BasicError() {
  return (
    <ErrorState
      error="Failed to load data"
    />
  );
}
```

#### Error with Retry
```tsx
function RetryableError() {
  const handleRetry = async () => {
    try {
      await fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ErrorState
      error={error}
      retry={handleRetry}
    />
  );
}
```

### Customization Options

#### Custom Error Display
```tsx
function CustomError() {
  return (
    <ErrorState
      error={error}
      title="Custom Error Title"
      icon={<CustomErrorIcon />}
      actions={
        <Button
          variant="contained"
          onClick={handleAction}
        >
          Custom Action
        </Button>
      }
    />
  );
}
```

#### Styled Error State
```tsx
import { styled } from '@mui/material/styles';

const StyledErrorState = styled(ErrorState)(({ theme }) => ({
  backgroundColor: theme.palette.error.light,
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(3),
}));
```

### Best Practices

1. **Error Handling**
```tsx
function ErrorBoundary() {
  const [error, setError] = useState<Error | null>(null);

  if (error) {
    return (
      <ErrorState
        error={error}
        retry={() => {
          setError(null);
          // Retry logic
        }}
      />
    );
  }

  return children;
}
```

2. **Network Error Handling**
```tsx
function NetworkError() {
  const handleRetry = async () => {
    try {
      await checkConnection();
      await refetchData();
    } catch (error) {
      // Handle persistent network issues
    }
  };

  return (
    <ErrorState
      error="Network connection lost"
      retry={handleRetry}
      icon={<NetworkErrorIcon />}
    />
  );
}
```

3. **Form Error Display**
```tsx
function FormError() {
  return (
    <Form onSubmit={handleSubmit}>
      {error && (
        <ErrorState
          error={error}
          variant="inline"
          retry={() => form.reset()}
        />
      )}
      {/* Form fields */}
    </Form>
  );
}
```

### Common Pitfalls

1. **Error Messages**
   - Use clear and actionable error messages
   - Provide context when possible
   - Consider i18n requirements

2. **Retry Logic**
   - Implement exponential backoff
   - Handle persistent failures
   - Provide feedback during retry

3. **Error Recovery**
   - Clear error state appropriately
   - Restore previous state if needed
   - Handle partial recovery

### Advanced Usage

#### Error with Details
```tsx
function DetailedError() {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <ErrorState
      error={error}
      actions={
        <>
          <Button onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? 'Hide' : 'Show'} Details
          </Button>
          {showDetails && (
            <Typography variant="body2">
              {error.stack}
            </Typography>
          )}
        </>
      }
    />
  );
}
```

#### Contextual Error
```tsx
function ContextualError() {
  const getErrorContext = (error: Error) => {
    switch (error.code) {
      case 'NETWORK_ERROR':
        return {
          title: 'Connection Lost',
          icon: <NetworkErrorIcon />,
          retry: checkConnection,
        };
      case 'AUTH_ERROR':
        return {
          title: 'Authentication Failed',
          icon: <LockIcon />,
          retry: () => navigate('/login'),
        };
      default:
        return {
          title: 'Unknown Error',
          icon: <ErrorIcon />,
        };
    }
  };

  const context = getErrorContext(error);

  return (
    <ErrorState
      error={error}
      {...context}
    />
  );
}
```

### Integration Examples

#### Error in Dialog
```tsx
function DialogError() {
  return (
    <BaseDialog
      open={open}
      onClose={handleClose}
      title="Error"
    >
      <ErrorState
        error={error}
        variant="card"
        retry={handleRetry}
      />
    </BaseDialog>
  );
}
```

#### Error in Loading State
```tsx
function LoadingError() {
  const { data, error, isLoading, refetch } = useQuery('data', fetchData);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorState
        error={error}
        retry={() => refetch()}
      />
    );
  }

  return <DataDisplay data={data} />;
}
```

#### Error with Fallback Content
```tsx
function ErrorWithFallback() {
  return (
    <div>
      {error ? (
        <ErrorState
          error={error}
          retry={handleRetry}
          actions={
            <Button onClick={() => setShowFallback(true)}>
              Show Cached Data
            </Button>
          }
        />
      ) : (
        <DataDisplay data={data} />
      )}
      {showFallback && (
        <FallbackContent data={cachedData} />
      )}
    </div>
  );
}
```
