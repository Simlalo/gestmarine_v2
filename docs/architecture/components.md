# Component Patterns

This guide outlines component patterns and best practices used in the GestMarine application.

## Component Organization

### 1. Feature-First Structure

```
src/
  features/
    barques/
      components/
        BarqueList.tsx
        BarqueCard.tsx
        dialogs/
          CreateBarqueDialog.tsx
          AssignBarqueDialog.tsx
      hooks/
        useBarques.ts
        useBarqueMutations.ts
      types/
        barque.types.ts
      utils/
        barque.utils.ts
      index.tsx
```

### 2. Shared Components

```
src/
  components/
    common/
      Button/
        Button.tsx
        Button.styles.ts
        Button.types.ts
        Button.test.tsx
        index.ts
    layout/
      AppLayout/
      AuthLayout/
    feedback/
      Alert/
      Snackbar/
    data-display/
      Table/
      Card/
    inputs/
      TextField/
      Select/
```

## Component Patterns

### 1. Base Component Template

```typescript
// components/common/Button/Button.tsx
import { ButtonProps } from './Button.types';
import { useStyles } from './Button.styles';

export const Button: React.FC<ButtonProps> = ({
  variant = 'contained',
  size = 'medium',
  color = 'primary',
  disabled = false,
  loading = false,
  children,
  onClick,
  ...props
}) => {
  const styles = useStyles();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !loading && onClick) {
      onClick(event);
    }
  };

  return (
    <button
      className={styles.root}
      disabled={disabled || loading}
      onClick={handleClick}
      data-testid="button"
      {...props}
    >
      {loading ? <CircularProgress size={16} /> : children}
    </button>
  );
};
```

### 2. Compound Components

```typescript
// components/data-display/Table/Table.tsx
interface TableContextValue {
  selectedRows: string[];
  onSelectRow: (id: string) => void;
}

const TableContext = createContext<TableContextValue>({
  selectedRows: [],
  onSelectRow: () => {}
});

export const Table = {
  Root: ({ children }: { children: React.ReactNode }) => {
    const [selectedRows, setSelectedRows] = useState<string[]>([]);

    const handleSelectRow = (id: string) => {
      setSelectedRows(prev =>
        prev.includes(id)
          ? prev.filter(rowId => rowId !== id)
          : [...prev, id]
      );
    };

    return (
      <TableContext.Provider
        value={{ selectedRows, onSelectRow: handleSelectRow }}
      >
        <table className="table-root">{children}</table>
      </TableContext.Provider>
    );
  },

  Header: ({ children }: { children: React.ReactNode }) => (
    <thead className="table-header">{children}</thead>
  ),

  Body: ({ children }: { children: React.ReactNode }) => (
    <tbody className="table-body">{children}</tbody>
  ),

  Row: ({
    id,
    children,
    selectable = true
  }: {
    id: string;
    children: React.ReactNode;
    selectable?: boolean;
  }) => {
    const { selectedRows, onSelectRow } = useContext(TableContext);
    const isSelected = selectedRows.includes(id);

    return (
      <tr
        className={`table-row ${isSelected ? 'selected' : ''}`}
        onClick={() => selectable && onSelectRow(id)}
      >
        {children}
      </tr>
    );
  }
};
```

### 3. Higher-Order Components

```typescript
// components/hoc/withErrorBoundary.tsx
export const withErrorBoundary = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallback?: React.ReactNode
) => {
  return class WithErrorBoundary extends React.Component<
    P,
    { hasError: boolean }
  > {
    constructor(props: P) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
      return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
    }

    render() {
      if (this.state.hasError) {
        return fallback || <div>Something went wrong</div>;
      }

      return <WrappedComponent {...this.props} />;
    }
  };
};
```

### 4. Custom Hooks Integration

```typescript
// features/barques/components/BarqueList.tsx
export const BarqueList: React.FC = () => {
  const { data: barques, isLoading, error } = useBarques();
  const { mutate: deleteBarque } = useDeleteBarque({
    onSuccess: () => {
      showNotification('Barque deleted successfully');
    }
  });

  const handleDelete = async (id: string) => {
    await deleteBarque(id);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!barques?.length) return <EmptyState />;

  return (
    <Table.Root>
      <Table.Header>
        <tr>
          <th>Name</th>
          <th>Registration</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </Table.Header>
      <Table.Body>
        {barques.map(barque => (
          <Table.Row key={barque.id} id={barque.id}>
            <td>{barque.name}</td>
            <td>{barque.registrationNumber}</td>
            <td>{barque.status}</td>
            <td>
              <IconButton
                icon={<DeleteIcon />}
                onClick={() => handleDelete(barque.id)}
              />
            </td>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};
```

## Dialog Components

### 1. Base Dialog

```typescript
// components/common/Dialog/Dialog.tsx
interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  title,
  children,
  actions
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="dialog-root">
        <div className="dialog-header">
          <Typography variant="h6">{title}</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <div className="dialog-content">{children}</div>
        {actions && (
          <div className="dialog-actions">{actions}</div>
        )}
      </div>
    </Modal>
  );
};
```

### 2. Feature Dialog

```typescript
// features/barques/components/dialogs/AssignBarqueDialog.tsx
export const AssignBarqueDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  barqueId: string;
}> = ({ open, onClose, barqueId }) => {
  const { data: gerants } = useGerants();
  const { mutate: assignGerant, isLoading } = useAssignGerant({
    onSuccess: () => {
      showNotification('Gerant assigned successfully');
      onClose();
    }
  });

  const handleSubmit = async (values: { gerantId: string }) => {
    await assignGerant({ barqueId, gerantId: values.gerantId });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Assign Gerant"
    >
      <Form onSubmit={handleSubmit}>
        <Select
          name="gerantId"
          label="Select Gerant"
          options={gerants?.map(gerant => ({
            value: gerant.id,
            label: gerant.name
          }))}
        />
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            loading={isLoading}
          >
            Assign
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
};
```

## Best Practices

1. **Component Organization**
   - Use feature-first architecture
   - Create reusable shared components
   - Implement proper component composition

2. **Component Design**
   - Keep components focused and small
   - Use proper prop types
   - Implement error boundaries

3. **State Management**
   - Use hooks for state management
   - Implement proper data fetching
   - Handle loading and error states

4. **Performance**
   - Implement proper memoization
   - Use lazy loading
   - Optimize re-renders

5. **Testing**
   - Write unit tests
   - Test component integration
   - Test error scenarios

Remember to:
- Follow consistent naming conventions
- Document component props
- Handle edge cases
- Implement proper error handling
- Write comprehensive tests
