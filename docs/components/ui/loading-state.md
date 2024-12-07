# Loading State Component

## LoadingState

A versatile loading indicator component that provides consistent loading visualization across the application.

### Props API Reference

```typescript
interface LoadingStateProps {
  // Optional Props
  variant?: 'circular' | 'linear' | 'skeleton'; // Loading indicator type
  size?: 'small' | 'medium' | 'large';         // Size of the indicator
  message?: string;                            // Loading message
  overlay?: boolean;                           // Show as overlay
  fullPage?: boolean;                          // Take full page height
  className?: string;                          // Additional CSS classes
  color?: 'primary' | 'secondary';             // Indicator color
}
```

### Usage Examples

#### Basic Loading
```tsx
import { LoadingState } from '@/components/ui/LoadingState';

function BasicLoading() {
  return (
    <LoadingState />
  );
}
```

#### Loading with Message
```tsx
function LoadingWithMessage() {
  return (
    <LoadingState
      message="Loading data..."
      variant="circular"
    />
  );
}
```

### Customization Options

#### Custom Loading Display
```tsx
function CustomLoading() {
  return (
    <LoadingState
      variant="circular"
      size="large"
      message="Please wait..."
      color="secondary"
    />
  );
}
```

#### Styled Loading State
```tsx
import { styled } from '@mui/material/styles';

const StyledLoadingState = styled(LoadingState)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
}));
```

### Best Practices

1. **Content Loading**
```tsx
function ContentLoading() {
  return (
    <div>
      {isLoading ? (
        <LoadingState
          variant="skeleton"
          message="Loading content..."
        />
      ) : (
        <Content data={data} />
      )}
    </div>
  );
}
```

2. **Page Loading**
```tsx
function PageLoading() {
  return (
    <LoadingState
      fullPage
      variant="circular"
      message="Loading page..."
    />
  );
}
```

3. **Progressive Loading**
```tsx
function ProgressiveLoading() {
  return (
    <LoadingState
      variant="linear"
      progress={loadingProgress}
      message={`Loading... ${loadingProgress}%`}
    />
  );
}
```

### Common Patterns

1. **Overlay Loading**
```tsx
function OverlayLoading() {
  return (
    <div>
      <Content />
      {isLoading && (
        <LoadingState
          overlay
          message="Processing..."
        />
      )}
    </div>
  );
}
```

2. **Skeleton Loading**
```tsx
function SkeletonLoading() {
  return (
    <LoadingState
      variant="skeleton"
      items={[
        { width: '100%', height: 40 },
        { width: '60%', height: 20 },
        { width: '80%', height: 20 },
      ]}
    />
  );
}
```

3. **Delayed Loading**
```tsx
function DelayedLoading() {
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setShowLoading(true);
      }, 500);
      return () => clearTimeout(timer);
    }
    setShowLoading(false);
  }, [isLoading]);

  return showLoading && <LoadingState />;
}
```

### Integration Examples

#### Loading in Dialog
```tsx
function DialogLoading() {
  return (
    <BaseDialog
      open={open}
      onClose={handleClose}
    >
      <LoadingState
        message="Loading dialog content..."
        variant="circular"
      />
    </BaseDialog>
  );
}
```

#### Loading in Form
```tsx
function FormLoading() {
  return (
    <Form>
      {isSubmitting && (
        <LoadingState
          overlay
          message="Submitting form..."
        />
      )}
      {/* Form fields */}
    </Form>
  );
}
```

#### Loading in Table
```tsx
function TableLoading() {
  return (
    <div>
      <TableToolbar />
      {isLoading ? (
        <LoadingState
          variant="skeleton"
          items={Array(5).fill({
            width: '100%',
            height: 52,
          })}
        />
      ) : (
        <BaseTable data={data} />
      )}
    </div>
  );
}
```

### Accessibility Considerations

1. **ARIA Attributes**
```tsx
function AccessibleLoading() {
  return (
    <LoadingState
      message="Loading content..."
      aria-label="Loading content"
      role="progressbar"
    />
  );
}
```

2. **Focus Management**
```tsx
function FocusedLoading() {
  const loadingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading) {
      loadingRef.current?.focus();
    }
  }, [isLoading]);

  return (
    <LoadingState
      ref={loadingRef}
      tabIndex={-1}
      message="Loading..."
    />
  );
}
```

3. **Screen Reader Support**
```tsx
function ScreenReaderLoading() {
  return (
    <LoadingState
      message="Loading content..."
      aria-live="polite"
      aria-busy={true}
    />
  );
}
```

### Animation Customization

1. **Custom Animation**
```tsx
function AnimatedLoading() {
  return (
    <LoadingState
      variant="custom"
      animation={{
        keyframes: `
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        `,
        duration: '1s',
        timing: 'linear',
        iterations: 'infinite',
      }}
    />
  );
}
```

2. **Pulse Animation**
```tsx
function PulseLoading() {
  return (
    <LoadingState
      variant="custom"
      animation={{
        keyframes: `
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        `,
        duration: '2s',
        timing: 'ease-in-out',
        iterations: 'infinite',
      }}
    />
  );
}
```

3. **Progress Animation**
```tsx
function ProgressLoading() {
  return (
    <LoadingState
      variant="linear"
      animation={{
        keyframes: `
          0% { width: 0%; }
          100% { width: 100%; }
        `,
        duration: '2s',
        timing: 'ease-out',
      }}
    />
  );
}
```
