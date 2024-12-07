# Button Components

## BaseButton

An enhanced button component built on top of Material-UI's Button with additional features for loading states, icons, and consistent styling across the application.

### Props API Reference

```typescript
interface BaseButtonProps extends ButtonProps {
  // Additional Props
  loading?: boolean;              // Show loading state
  startIcon?: ReactNode;          // Icon before text
  endIcon?: ReactNode;           // Icon after text
  fullWidth?: boolean;           // Take full width
  size?: 'small' | 'medium' | 'large'; // Button size
  variant?: 'text' | 'contained' | 'outlined'; // Button variant
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'; // Button color
}
```

### Usage Examples

#### Basic Button
```tsx
import { BaseButton } from '@/components/ui/Button';

function BasicButton() {
  return (
    <BaseButton
      variant="contained"
      onClick={handleClick}
    >
      Click Me
    </BaseButton>
  );
}
```

#### Loading Button
```tsx
function LoadingButton() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await someAsyncAction();
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseButton
      loading={loading}
      onClick={handleClick}
      disabled={loading}
    >
      Submit
    </BaseButton>
  );
}
```

### Customization Options

#### Icon Button
```tsx
function IconButton() {
  return (
    <BaseButton
      startIcon={<AddIcon />}
      variant="contained"
      color="primary"
    >
      Add Item
    </BaseButton>
  );
}
```

#### Styled Button
```tsx
import { styled } from '@mui/material/styles';

const StyledButton = styled(BaseButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  textTransform: 'none',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));
```

### Best Practices

1. **Loading States**
```tsx
function LoadingStateButton() {
  return (
    <BaseButton
      loading={loading}
      loadingIndicator={
        <CircularProgress size={20} />
      }
      disabled={loading}
    >
      {loading ? 'Processing...' : 'Submit'}
    </BaseButton>
  );
}
```

2. **Action Buttons**
```tsx
function ActionButtons() {
  return (
    <ButtonGroup>
      <BaseButton
        color="primary"
        onClick={handleSave}
      >
        Save
      </BaseButton>
      <BaseButton
        color="error"
        onClick={handleDelete}
      >
        Delete
      </BaseButton>
    </ButtonGroup>
  );
}
```

3. **Form Submission**
```tsx
function FormButton() {
  const form = useForm();

  return (
    <Form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
      <BaseButton
        type="submit"
        disabled={!form.formState.isValid}
        loading={form.formState.isSubmitting}
      >
        Submit
      </BaseButton>
    </Form>
  );
}
```

### Common Patterns

1. **Confirmation Button**
```tsx
function ConfirmButton() {
  const [confirming, setConfirming] = useState(false);

  return (
    <BaseButton
      color={confirming ? 'error' : 'primary'}
      onClick={() => confirming ? handleConfirm() : setConfirming(true)}
    >
      {confirming ? 'Click to Confirm' : 'Delete'}
    </BaseButton>
  );
}
```

2. **Progressive Button**
```tsx
function ProgressButton() {
  const [progress, setProgress] = useState(0);

  return (
    <BaseButton
      loading={progress > 0 && progress < 100}
      loadingIndicator={
        <CircularProgress
          variant="determinate"
          value={progress}
          size={20}
        />
      }
    >
      Upload
    </BaseButton>
  );
}
```

3. **Toggle Button**
```tsx
function ToggleButton() {
  const [active, setActive] = useState(false);

  return (
    <BaseButton
      variant={active ? 'contained' : 'outlined'}
      onClick={() => setActive(!active)}
    >
      {active ? 'Active' : 'Inactive'}
    </BaseButton>
  );
}
```

### Integration Examples

#### Dialog Actions
```tsx
function DialogButtons() {
  return (
    <DialogActions>
      <BaseButton
        onClick={handleClose}
        color="inherit"
      >
        Cancel
      </BaseButton>
      <BaseButton
        onClick={handleConfirm}
        color="primary"
        loading={loading}
      >
        Confirm
      </BaseButton>
    </DialogActions>
  );
}
```

#### Form Actions
```tsx
function FormActions() {
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <BaseButton
        variant="outlined"
        onClick={handleReset}
      >
        Reset
      </BaseButton>
      <BaseButton
        variant="contained"
        type="submit"
        loading={submitting}
      >
        Submit
      </BaseButton>
    </Box>
  );
}
```

#### Toolbar Actions
```tsx
function ToolbarButtons() {
  return (
    <Toolbar>
      <BaseButton
        startIcon={<AddIcon />}
        onClick={handleAdd}
      >
        Add New
      </BaseButton>
      <BaseButton
        startIcon={<FilterIcon />}
        onClick={toggleFilters}
      >
        Filters
      </BaseButton>
      <BaseButton
        startIcon={<ExportIcon />}
        onClick={handleExport}
      >
        Export
      </BaseButton>
    </Toolbar>
  );
}
```

### Accessibility Considerations

1. **ARIA Labels**
```tsx
function AccessibleButton() {
  return (
    <BaseButton
      aria-label="Add new item"
      startIcon={<AddIcon />}
    >
      Add Item
    </BaseButton>
  );
}
```

2. **Keyboard Navigation**
```tsx
function KeyboardButton() {
  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleAction();
    }
  };

  return (
    <BaseButton
      onKeyPress={handleKeyPress}
      tabIndex={0}
    >
      Action
    </BaseButton>
  );
}
```

3. **Focus Management**
```tsx
function FocusButton() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (shouldFocus) {
      buttonRef.current?.focus();
    }
  }, [shouldFocus]);

  return (
    <BaseButton
      ref={buttonRef}
      focusRipple
    >
      Focus Me
    </BaseButton>
  );
}
```
