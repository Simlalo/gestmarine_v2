# useBarqueManagement Hook

## Business Logic
The `useBarqueManagement` hook provides comprehensive management functionality for boats (barques) in the GestMarine application. It handles CRUD operations, gerant assignments, and integrates with the table management system.

### Core Functionality
- CRUD operations for boats
- Gerant assignment management
- Table state management
- Dialog state handling
- Error handling and loading states

### State Management
```typescript
interface UseBarqueManagementOptions {
  initialBarques?: Barque[];
  onCreateBarque?: (barqueData: Partial<Barque>) => Promise<void>;
  onUpdateBarque?: (id: string, barqueData: Partial<Barque>) => Promise<void>;
  onDeleteBarque?: (id: string) => Promise<void>;
  onAssignGerant?: (barqueId: string, gerantId: string) => Promise<void>;
}

interface UseBarqueManagementReturn {
  // State
  barques: Barque[];
  loading: boolean;
  error: string | null;
  
  // Dialog states
  createDialog: UseDialogReturn;
  editDialog: UseDialogReturn;
  deleteDialog: UseDialogReturn;
  assignGerantDialog: UseDialogReturn;
  
  // Table management
  table: UseTableReturn<Barque>;
  
  // CRUD operations
  handleCreateBarque: (barqueData: Partial<Barque>) => Promise<void>;
  handleUpdateBarque: (id: string, barqueData: Partial<Barque>) => Promise<void>;
  handleDeleteBarque: (id: string) => Promise<void>;
  handleAssignGerant: (barqueId: string, gerantId: string) => Promise<void>;
}
```

## Usage Patterns

### Basic Operations

```typescript
// Component Implementation
const BarquesManagement = () => {
  const {
    barques,
    loading,
    error,
    createDialog,
    editDialog,
    deleteDialog,
    assignGerantDialog,
    table,
    handleCreateBarque,
    handleUpdateBarque,
    handleDeleteBarque,
    handleAssignGerant,
  } = useBarqueManagement({
    onCreateBarque: async (data) => {
      // API call to create barque
    },
    onUpdateBarque: async (id, data) => {
      // API call to update barque
    },
    onDeleteBarque: async (id) => {
      // API call to delete barque
    },
    onAssignGerant: async (barqueId, gerantId) => {
      // API call to assign gerant
    },
  });

  return (
    <>
      <Button onClick={() => createDialog.open()}>
        Add New Boat
      </Button>
      
      <Table>
        <TableHead>
          {/* Table headers */}
        </TableHead>
        <TableBody>
          {table.rows.map((barque) => (
            <TableRow key={barque.id}>
              {/* Table cells */}
              <TableCell>
                <IconButton onClick={() => editDialog.open(barque)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => deleteDialog.open(barque)}>
                  <DeleteIcon />
                </IconButton>
                <IconButton onClick={() => assignGerantDialog.open(barque)}>
                  <AssignmentIndIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* Dialogs */}
      <CreateBarqueDialog
        open={createDialog.isOpen}
        onClose={createDialog.close}
        onSubmit={handleCreateBarque}
      />
      
      <EditBarqueDialog
        open={editDialog.isOpen}
        barque={editDialog.data}
        onClose={editDialog.close}
        onSubmit={handleUpdateBarque}
      />
      
      {/* Other dialogs */}
    </>
  );
};
```

### Advanced Features

```typescript
// Custom Filtering
const filterBarques = (barques: Barque[], filters: BarqueFilters) => {
  return barques.filter(barque => {
    const matchesSearch = !filters.search || 
      barque.nomBarque.toLowerCase().includes(filters.search.toLowerCase());
    const matchesPort = !filters.port || 
      barque.portAttache === filters.port;
    return matchesSearch && matchesPort;
  });
};

// Usage with Filters
const BarquesWithFilters = () => {
  const [filters, setFilters] = useState<BarqueFilters>({});
  const { barques, table } = useBarqueManagement();
  
  useEffect(() => {
    const filteredBarques = filterBarques(barques, filters);
    table.setRows(filteredBarques);
  }, [barques, filters]);
  
  // Component implementation
};
```

## Integration Examples

### Redux Integration
```typescript
const BarquesContainer = () => {
  const dispatch = useAppDispatch();
  const barques = useSelector(selectBarques);
  
  const barqueManagement = useBarqueManagement({
    initialBarques: barques,
    onCreateBarque: async (data) => {
      await dispatch(createBarqueThunk(data)).unwrap();
    },
    onUpdateBarque: async (id, data) => {
      await dispatch(updateBarqueThunk({ id, ...data })).unwrap();
    },
    // Other handlers
  });
  
  return <BarquesManagement {...barqueManagement} />;
};
```

### API Interactions
```typescript
const useBarquesWithApi = () => {
  const { mutateAsync: createBarque } = useCreateBarqueMutation();
  const { mutateAsync: updateBarque } = useUpdateBarqueMutation();
  
  return useBarqueManagement({
    onCreateBarque: createBarque,
    onUpdateBarque: updateBarque,
    // Other handlers
  });
};
```

### Error Handling
```typescript
const BarquesWithErrorHandling = () => {
  const { error, loading } = useBarqueManagement({
    onCreateBarque: async (data) => {
      try {
        await api.createBarque(data);
      } catch (error) {
        toast.error('Failed to create boat');
        throw error;
      }
    },
  });
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  // Component implementation
};
```
