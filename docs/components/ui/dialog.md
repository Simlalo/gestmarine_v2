# Dialog Components

## BaseDialog

A flexible and reusable dialog component built on top of Material-UI's Dialog component with enhanced functionality and consistent styling.

### Props API Reference

```typescript
interface BaseDialogProps {
  // Required Props
  open: boolean;                    // Controls dialog visibility
  onClose: () => void;             // Handler for dialog close events
  title: string;                   // Dialog title text
  
  // Optional Props
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';  // Dialog max width
  fullWidth?: boolean;             // Whether dialog should take full width
  disableBackdropClick?: boolean;  // Prevent closing on backdrop click
  disableEscapeKeyDown?: boolean;  // Prevent closing on ESC key
  loading?: boolean;               // Show loading state
  actions?: ReactNode;             // Custom action buttons
  children?: ReactNode;            // Dialog content
}
```

### Usage Examples

#### Basic Dialog
```tsx
import { BaseDialog } from '@/components/ui/Dialog';

function ExampleDialog() {
  const [open, setOpen] = useState(false);

  return (
    <BaseDialog
      open={open}
      onClose={() => setOpen(false)}
      title="Example Dialog"
    >
      <div>Dialog content goes here</div>
    </BaseDialog>
  );
}
```

#### Dialog with Custom Actions
```tsx
import { BaseDialog } from '@/components/ui/Dialog';
import { Button } from '@mui/material';

function CustomActionsDialog() {
  const [open, setOpen] = useState(false);

  const actions = (
    <>
      <Button onClick={() => setOpen(false)}>Cancel</Button>
      <Button variant="contained" onClick={handleSubmit}>Submit</Button>
    </>
  );

  return (
    <BaseDialog
      open={open}
      onClose={() => setOpen(false)}
      title="Custom Actions"
      actions={actions}
    >
      <div>Dialog with custom action buttons</div>
    </BaseDialog>
  );
}
```

#### Loading State Dialog
```tsx
import { BaseDialog } from '@/components/ui/Dialog';

function LoadingDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    await submitData();
    setLoading(false);
    setOpen(false);
  };

  return (
    <BaseDialog
      open={open}
      onClose={() => setOpen(false)}
      title="Loading Example"
      loading={loading}
    >
      <div>Dialog with loading state</div>
    </BaseDialog>
  );
}
```

### Customization Options

#### Theme Customization
```tsx
// In your theme configuration
const theme = createTheme({
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '8px',
          padding: '16px',
        },
      },
    },
  },
});
```

#### Custom Styling
```tsx
import { styled } from '@mui/material/styles';

const StyledDialog = styled(BaseDialog)(({ theme }) => ({
  '& .MuiDialogTitle-root': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));
```

### Best Practices

1. **Error Handling**
   ```tsx
   function ErrorHandlingDialog() {
     const [error, setError] = useState<Error | null>(null);

     return (
       <BaseDialog
         open={open}
         onClose={() => {
           setError(null);
           setOpen(false);
         }}
         title="Error Handling"
       >
         {error && <ErrorMessage error={error} />}
         <div>Dialog content</div>
       </BaseDialog>
     );
   }
   ```

2. **Form Integration**
   ```tsx
   function FormDialog() {
     const form = useForm();

     return (
       <BaseDialog
         open={open}
         onClose={() => {
           form.reset();
           setOpen(false);
         }}
         title="Form Dialog"
       >
         <Form onSubmit={form.handleSubmit}>
           {/* Form fields */}
         </Form>
       </BaseDialog>
     );
   }
   ```

3. **Accessibility**
   ```tsx
   function AccessibleDialog() {
     return (
       <BaseDialog
         open={open}
         onClose={handleClose}
         title="Accessible Dialog"
         aria-describedby="dialog-description"
       >
         <div id="dialog-description">
           Detailed description of dialog purpose
         </div>
       </BaseDialog>
     );
   }
   ```

### Common Pitfalls

1. **State Management**
   - Always handle loading states appropriately
   - Clear form state when closing dialog
   - Handle unsaved changes warnings

2. **Performance**
   - Use `React.memo()` for complex dialog content
   - Avoid unnecessary re-renders in dialog content
   - Lazy load dialog content when possible

3. **Error Handling**
   - Always provide error feedback
   - Handle network errors gracefully
   - Prevent dialog close during form submission

### Advanced Usage

#### Nested Dialogs
```tsx
function NestedDialog() {
  const [primaryOpen, setPrimaryOpen] = useState(false);
  const [secondaryOpen, setSecondaryOpen] = useState(false);

  return (
    <>
      <BaseDialog
        open={primaryOpen}
        onClose={() => setPrimaryOpen(false)}
        title="Primary Dialog"
      >
        <Button onClick={() => setSecondaryOpen(true)}>
          Open Secondary
        </Button>
      </BaseDialog>

      <BaseDialog
        open={secondaryOpen}
        onClose={() => setSecondaryOpen(false)}
        title="Secondary Dialog"
      >
        <div>Secondary dialog content</div>
      </BaseDialog>
    </>
  );
}
```

#### Confirmation Dialog
```tsx
function ConfirmationDialog({ 
  open, 
  onClose, 
  onConfirm, 
  message 
}: ConfirmationDialogProps) {
  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      title="Confirm Action"
      maxWidth="xs"
      actions={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={onConfirm}
          >
            Confirm
          </Button>
        </>
      }
    >
      <Typography>{message}</Typography>
    </BaseDialog>
  );
}
```

### Integration with Other Components

#### Dialog with Table
```tsx
function TableDialog() {
  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      title="Data Table"
      maxWidth="lg"
      fullWidth
    >
      <BaseTable
        columns={columns}
        data={data}
        pagination
        onRowClick={handleRowClick}
      />
    </BaseDialog>
  );
}
```

#### Dialog with Tabs
```tsx
function TabDialog() {
  const [tabValue, setTabValue] = useState(0);

  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      title="Tabbed Content"
    >
      <Tabs
        value={tabValue}
        onChange={(_, value) => setTabValue(value)}
      >
        <Tab label="Tab 1" />
        <Tab label="Tab 2" />
      </Tabs>
      <TabPanel value={tabValue} index={0}>
        Tab 1 content
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        Tab 2 content
      </TabPanel>
    </BaseDialog>
  );
}
```
