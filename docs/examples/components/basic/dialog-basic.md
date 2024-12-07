# Dialog Component Examples

## Basic Implementation

### Simple Modal Dialog
```tsx
import { Dialog } from '@/components/common/Dialog';
import { useDialog } from '@/hooks/common/useDialog';

const SimpleDialog = () => {
  const dialog = useDialog();

  return (
    <>
      <Button onClick={dialog.open}>
        Open Dialog
      </Button>

      <Dialog
        open={dialog.isOpen}
        onClose={dialog.close}
        title="Simple Dialog"
      >
        <DialogContent>
          <Typography>
            This is a basic dialog example.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={dialog.close}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
```

### Confirmation Dialog
```tsx
const ConfirmationDialog = () => {
  const dialog = useDialog();
  
  const handleConfirm = () => {
    // Perform action
    console.log('Confirmed');
    dialog.close();
  };

  return (
    <Dialog
      open={dialog.isOpen}
      onClose={dialog.close}
      title="Confirm Action"
    >
      <DialogContent>
        <Typography>
          Are you sure you want to proceed?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={dialog.close} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};
```

### Dialog with Data
```tsx
interface DataDialogProps {
  data?: {
    title: string;
    content: string;
  };
}

const DataDialog: React.FC<DataDialogProps> = ({ data }) => {
  const dialog = useDialog();

  return (
    <Dialog
      open={dialog.isOpen}
      onClose={dialog.close}
      title={data?.title || 'Information'}
    >
      <DialogContent>
        <Typography>
          {data?.content || 'No content available'}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={dialog.close}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
```

## Common Use Cases

### Loading Dialog
```tsx
const LoadingDialog = () => {
  const dialog = useDialog();
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async () => {
    setIsLoading(true);
    try {
      await someAsyncOperation();
    } finally {
      setIsLoading(false);
      dialog.close();
    }
  };

  return (
    <Dialog
      open={dialog.isOpen}
      onClose={dialog.close}
      title="Processing"
    >
      <DialogContent>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <Typography>Operation complete!</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={dialog.close}
          disabled={isLoading}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
```

### Error Dialog
```tsx
interface ErrorDialogProps {
  error?: Error;
}

const ErrorDialog: React.FC<ErrorDialogProps> = ({ error }) => {
  const dialog = useDialog();

  return (
    <Dialog
      open={dialog.isOpen}
      onClose={dialog.close}
      title="Error"
    >
      <DialogContent>
        <Alert severity="error">
          {error?.message || 'An unexpected error occurred'}
        </Alert>
      </DialogContent>
      <DialogActions>
        <Button onClick={dialog.close}>
          Close
        </Button>
        <Button 
          onClick={() => {
            // Retry logic
            dialog.close();
          }}
          color="primary"
        >
          Retry
        </Button>
      </DialogActions>
    </Dialog>
  );
};
```

## Tips and Best Practices

### 1. Dialog State Management
- Use the `useDialog` hook for consistent dialog state management
- Keep dialog state local unless needed globally
- Handle dialog data separately from dialog visibility

```tsx
// Good Practice
const MyComponent = () => {
  const dialog = useDialog();
  const [dialogData, setDialogData] = useState(null);

  const openWithData = (data) => {
    setDialogData(data);
    dialog.open();
  };

  return (
    <Dialog
      open={dialog.isOpen}
      onClose={() => {
        setDialogData(null);
        dialog.close();
      }}
    >
      {dialogData && <DialogContent />}
    </Dialog>
  );
};
```

### 2. Performance Considerations
- Avoid rendering dialog content when closed
- Use proper cleanup in useEffect hooks
- Implement proper loading states

```tsx
// Good Practice
const OptimizedDialog = () => {
  const dialog = useDialog();

  return (
    <Dialog open={dialog.isOpen} onClose={dialog.close}>
      {dialog.isOpen && (
        <DialogContent>
          <HeavyComponent />
        </DialogContent>
      )}
    </Dialog>
  );
};
```

### 3. Accessibility
- Use proper ARIA labels
- Handle keyboard events
- Manage focus properly

```tsx
const AccessibleDialog = () => {
  const dialog = useDialog();

  return (
    <Dialog
      open={dialog.isOpen}
      onClose={dialog.close}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <DialogTitle id="dialog-title">
        Accessible Dialog
      </DialogTitle>
      <DialogContent>
        <Typography id="dialog-description">
          This dialog follows accessibility best practices.
        </Typography>
      </DialogContent>
    </Dialog>
  );
};
```

### 4. Common Pitfalls to Avoid
- Don't nest dialogs unless absolutely necessary
- Avoid complex state management inside dialogs
- Don't forget to handle loading and error states
- Always provide a way to close the dialog
- Clean up resources when dialog closes

### 5. Testing Considerations
```tsx
// Dialog Test Example
describe('Dialog Component', () => {
  it('should open and close properly', () => {
    const { getByRole, queryByRole } = render(<MyDialog />);
    
    // Dialog should be closed initially
    expect(queryByRole('dialog')).not.toBeInTheDocument();
    
    // Open dialog
    fireEvent.click(getByRole('button', { name: /open/i }));
    expect(getByRole('dialog')).toBeInTheDocument();
    
    // Close dialog
    fireEvent.click(getByRole('button', { name: /close/i }));
    expect(queryByRole('dialog')).not.toBeInTheDocument();
  });
});
