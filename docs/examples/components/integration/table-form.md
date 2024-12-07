# Table and Form Integration Examples

## Inline Editing Table

### Editable Table with Form Controls
```tsx
interface TableRowData {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
}

const EditableTableRow: React.FC<{
  data: TableRowData;
  onSave: (data: TableRowData) => Promise<void>;
}> = ({ data, onSave }) => {
  const [editing, setEditing] = useState(false);
  
  const form = useForm<TableRowData>({
    initialValues: data,
    onSubmit: async (values) => {
      await onSave(values);
      setEditing(false);
    }
  });

  if (!editing) {
    return (
      <TableRow>
        <TableCell>{data.name}</TableCell>
        <TableCell>{data.email}</TableCell>
        <TableCell>{data.status}</TableCell>
        <TableCell>
          <IconButton onClick={() => setEditing(true)}>
            <EditIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell>
        <TextField
          name="name"
          value={form.values.name}
          onChange={form.handleChange}
          error={!!form.errors.name}
          helperText={form.errors.name}
          size="small"
        />
      </TableCell>
      <TableCell>
        <TextField
          name="email"
          value={form.values.email}
          onChange={form.handleChange}
          error={!!form.errors.email}
          helperText={form.errors.email}
          size="small"
        />
      </TableCell>
      <TableCell>
        <Select
          name="status"
          value={form.values.status}
          onChange={form.handleChange}
          size="small"
        >
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </Select>
      </TableCell>
      <TableCell>
        <IconButton 
          onClick={() => form.handleSubmit()}
          disabled={form.isSubmitting}
        >
          <SaveIcon />
        </IconButton>
        <IconButton 
          onClick={() => setEditing(false)}
          disabled={form.isSubmitting}
        >
          <CancelIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};
```

## Bulk Edit Form

### Table with Bulk Operations
```tsx
interface BulkEditForm {
  status: string;
  category: string;
}

const BulkEditTable = () => {
  const table = useTable<TableRowData>({
    data,
    selection: {
      enabled: true,
      type: 'multiple'
    }
  });
  
  const form = useForm<BulkEditForm>({
    initialValues: {
      status: '',
      category: ''
    },
    onSubmit: async (values) => {
      const selectedIds = table.selectedRows.map(row => row.id);
      await updateMultipleRecords(selectedIds, values);
      table.clearSelection();
    }
  });

  return (
    <>
      {table.hasSelection && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6">
            Bulk Edit ({table.selectedRows.length} items)
          </Typography>
          
          <form onSubmit={form.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Select
                  name="status"
                  label="Status"
                  value={form.values.status}
                  onChange={form.handleChange}
                  fullWidth
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </Grid>
              
              <Grid item xs={4}>
                <Select
                  name="category"
                  label="Category"
                  value={form.values.category}
                  onChange={form.handleChange}
                  fullWidth
                >
                  <MenuItem value="A">Category A</MenuItem>
                  <MenuItem value="B">Category B</MenuItem>
                </Select>
              </Grid>
              
              <Grid item xs={4}>
                <Button 
                  type="submit"
                  variant="contained"
                  disabled={form.isSubmitting}
                >
                  Update Selected
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      )}
      
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                checked={table.isAllSelected}
                onChange={table.handleSelectAll}
                indeterminate={table.hasPartialSelection}
              />
            </TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Category</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {table.rows.map(row => (
            <TableRow key={row.id}>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={table.isSelected(row.id)}
                  onChange={() => table.handleSelect(row.id)}
                />
              </TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.status}</TableCell>
              <TableCell>{row.category}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
```

## Filter Form Integration

### Advanced Table Filtering
```tsx
interface FilterFormValues {
  search: string;
  status: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  categories: string[];
}

const FilterableTable = () => {
  const form = useForm<FilterFormValues>({
    initialValues: {
      search: '',
      status: [],
      dateRange: { start: null, end: null },
      categories: []
    }
  });
  
  const table = useTable<TableRowData>({
    data,
    filter: {
      filterFn: (row) => {
        // Search filter
        if (form.values.search && !row.name.toLowerCase().includes(
          form.values.search.toLowerCase()
        )) {
          return false;
        }
        
        // Status filter
        if (form.values.status.length > 0 && 
            !form.values.status.includes(row.status)) {
          return false;
        }
        
        // Date range filter
        if (form.values.dateRange.start && form.values.dateRange.end) {
          const rowDate = new Date(row.createdAt);
          if (rowDate < form.values.dateRange.start || 
              rowDate > form.values.dateRange.end) {
            return false;
          }
        }
        
        // Category filter
        if (form.values.categories.length > 0 && 
            !form.values.categories.includes(row.category)) {
          return false;
        }
        
        return true;
      }
    }
  });

  // Update table filter when form changes
  useEffect(() => {
    table.applyFilter();
  }, [form.values]);

  return (
    <>
      <Paper sx={{ p: 2, mb: 2 }}>
        <form>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField
                name="search"
                label="Search"
                value={form.values.search}
                onChange={form.handleChange}
                fullWidth
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  multiple
                  name="status"
                  value={form.values.status}
                  onChange={form.handleChange}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <DateRangePicker
                startDate={form.values.dateRange.start}
                endDate={form.values.dateRange.end}
                onChange={({ start, end }) => {
                  form.setFieldValue('dateRange', { start, end });
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Button 
                onClick={() => form.resetForm()}
                variant="outlined"
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      
      <Table>
        {/* Table implementation */}
      </Table>
    </>
  );
};
```

## Best Practices and Tips

### 1. State Management
```tsx
// Use form context for complex integrations
const TableFormContext = createContext<{
  form: ReturnType<typeof useForm>;
  table: ReturnType<typeof useTable>;
} | null>(null);

const TableFormProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const form = useForm({
    // form configuration
  });
  
  const table = useTable({
    // table configuration
  });
  
  return (
    <TableFormContext.Provider value={{ form, table }}>
      {children}
    </TableFormContext.Provider>
  );
};
```

### 2. Performance Optimization
```tsx
// Memoize filter function
const filterFn = useCallback((row: TableRowData) => {
  // Complex filtering logic
}, [/* dependencies */]);

// Memoize form handlers
const handleSubmit = useCallback(async (values: FormValues) => {
  // Submit logic
}, [/* dependencies */]);
```

### 3. Error Handling
```tsx
const handleError = (error: Error) => {
  // Show error message
  console.error('Operation failed:', error);
  
  // Revert optimistic updates
  table.revertChanges();
  
  // Reset form state if needed
  form.resetForm();
};
```

### 4. Testing
```tsx
describe('Table Form Integration', () => {
  it('should handle bulk updates', async () => {
    const { getByRole, getAllByRole } = render(<BulkEditTable />);
    
    // Select items
    const checkboxes = getAllByRole('checkbox');
    await userEvent.click(checkboxes[1]); // Select first row
    await userEvent.click(checkboxes[2]); // Select second row
    
    // Update status
    await userEvent.selectOptions(
      getByRole('combobox', { name: /status/i }),
      'active'
    );
    
    // Submit form
    await userEvent.click(getByRole('button', { name: /update/i }));
    
    // Verify updates
    expect(mockUpdateRecords).toHaveBeenCalledWith(
      ['1', '2'],
      { status: 'active' }
    );
  });
});
