# useGerantManagement Hook

## Business Logic
The `useGerantManagement` hook provides comprehensive management functionality for managers (gerants) in the GestMarine application. It handles CRUD operations, boat assignments, and integrates with the table management system.

### Core Functionality
- CRUD operations for managers
- Boat assignment management
- Table state management
- Dialog state handling
- Error handling and loading states
- Utility functions for gerant-barque relationships

### State Management
```typescript
interface UseGerantManagementOptions {
  initialGerants?: Gerant[];
  onCreateGerant?: (gerantData: Partial<Gerant>) => Promise<void>;
  onUpdateGerant?: (id: string, gerantData: Partial<Gerant>) => Promise<void>;
  onDeleteGerant?: (id: string) => Promise<void>;
  onAssignBarques?: (gerantId: string, barqueIds: string[]) => Promise<void>;
}

interface UseGerantManagementReturn {
  // State
  gerants: Gerant[];
  loading: boolean;
  error: string | null;
  
  // Dialog states
  createDialog: UseDialogReturn;
  editDialog: UseDialogReturn;
  deleteDialog: UseDialogReturn;
  assignBarquesDialog: UseDialogReturn;
  
  // Table management
  table: UseTableReturn<Gerant>;
  
  // CRUD operations
  handleCreateGerant: (gerantData: Partial<Gerant>) => Promise<void>;
  handleUpdateGerant: (id: string, gerantData: Partial<Gerant>) => Promise<void>;
  handleDeleteGerant: (id: string) => Promise<void>;
  handleAssignBarques: (gerantId: string, barqueIds: string[]) => Promise<void>;
  
  // Utility functions
  getGerantBarques: (gerantId: string, barques: Barque[]) => Barque[];
  updateGerantsList: (newGerants: Gerant[]) => void;
}
```

## Usage Patterns

### Basic Operations

```typescript
// Component Implementation
const GerantsManagement = () => {
  const {
    gerants,
    loading,
    error,
    createDialog,
    editDialog,
    deleteDialog,
    assignBarquesDialog,
    table,
    handleCreateGerant,
    handleUpdateGerant,
    handleDeleteGerant,
    handleAssignBarques,
  } = useGerantManagement({
    onCreateGerant: async (data) => {
      // API call to create gerant
    },
    onUpdateGerant: async (id, data) => {
      // API call to update gerant
    },
    onDeleteGerant: async (id) => {
      // API call to delete gerant
    },
    onAssignBarques: async (gerantId, barqueIds) => {
      // API call to assign barques
    },
  });

  return (
    <>
      <Button onClick={() => createDialog.open()}>
        Add New Manager
      </Button>
      
      <Table>
        <TableHead>
          {/* Table headers */}
        </TableHead>
        <TableBody>
          {table.rows.map((gerant) => (
            <TableRow key={gerant.id}>
              <TableCell>{gerant.nom}</TableCell>
              <TableCell>{gerant.prenom}</TableCell>
              <TableCell>{gerant.email}</TableCell>
              <TableCell>
                <IconButton onClick={() => editDialog.open(gerant)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => deleteDialog.open(gerant)}>
                  <DeleteIcon />
                </IconButton>
                <IconButton onClick={() => assignBarquesDialog.open(gerant)}>
                  <DirectionsBoatIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* Dialogs */}
      <GerantDialog
        open={createDialog.isOpen}
        onClose={createDialog.close}
        onSave={handleCreateGerant}
        isNew
      />
      
      <GerantDialog
        open={editDialog.isOpen}
        gerant={editDialog.data}
        onClose={editDialog.close}
        onSave={(data) => handleUpdateGerant(editDialog.data?.id, data)}
      />
      
      {/* Other dialogs */}
    </>
  );
};
```

### Advanced Features

```typescript
// Custom Filtering
const filterGerants = (gerants: Gerant[], filters: GerantFilters) => {
  return gerants.filter(gerant => {
    const matchesSearch = !filters.search || 
      `${gerant.nom} ${gerant.prenom}`.toLowerCase().includes(filters.search.toLowerCase()) ||
      gerant.email.toLowerCase().includes(filters.search.toLowerCase());
    return matchesSearch;
  });
};

// Usage with Filters
const GerantsWithFilters = () => {
  const [filters, setFilters] = useState<GerantFilters>({});
  const { gerants, table } = useGerantManagement();
  
  useEffect(() => {
    const filteredGerants = filterGerants(gerants, filters);
    table.setRows(filteredGerants);
  }, [gerants, filters]);
  
  // Component implementation
};
```

## Integration Examples

### Redux Integration
```typescript
const GerantsContainer = () => {
  const dispatch = useAppDispatch();
  const gerants = useSelector(selectGerants);
  
  const gerantManagement = useGerantManagement({
    initialGerants: gerants,
    onCreateGerant: async (data) => {
      await dispatch(createGerantThunk(data)).unwrap();
    },
    onUpdateGerant: async (id, data) => {
      await dispatch(updateGerantThunk({ id, ...data })).unwrap();
    },
    // Other handlers
  });
  
  return <GerantsManagement {...gerantManagement} />;
};
```

### API Interactions
```typescript
const useGerantsWithApi = () => {
  const { mutateAsync: createGerant } = useCreateGerantMutation();
  const { mutateAsync: updateGerant } = useUpdateGerantMutation();
  
  return useGerantManagement({
    onCreateGerant: createGerant,
    onUpdateGerant: updateGerant,
    // Other handlers
  });
};
```

### Error Handling
```typescript
const GerantsWithErrorHandling = () => {
  const { error, loading } = useGerantManagement({
    onCreateGerant: async (data) => {
      try {
        await api.createGerant(data);
      } catch (error) {
        toast.error('Failed to create manager');
        throw error;
      }
    },
  });
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  // Component implementation
};
```
