# Table Components

## BaseTable

A powerful and flexible table component built on top of Material-UI's Table components with enhanced functionality for sorting, filtering, pagination, and row selection.

### Props API Reference

```typescript
interface BaseTableProps<T extends Record<string, any>> {
  // Required Props
  columns: TableColumn<T>[];       // Column definitions
  data: T[];                       // Table data
  
  // Optional Props
  loading?: boolean;               // Show loading state
  error?: Error;                   // Error state
  pagination?: boolean;            // Enable pagination
  page?: number;                   // Current page (0-based)
  pageSize?: number;              // Items per page
  totalCount?: number;            // Total number of items
  sortModel?: SortModel;          // Current sort state
  onSort?: (model: SortModel) => void;  // Sort handler
  onPageChange?: (page: number) => void; // Page change handler
  onRowClick?: (row: T) => void;  // Row click handler
  onSelectionChange?: (selectedIds: string[]) => void; // Selection handler
  selectable?: boolean;           // Enable row selection
  actions?: TableAction<T>[];     // Row actions
}

interface TableColumn<T> {
  field: keyof T;                 // Data field
  headerName: string;             // Column header text
  width?: number;                 // Column width
  sortable?: boolean;             // Enable sorting
  filterable?: boolean;           // Enable filtering
  renderCell?: (value: any, row: T) => ReactNode; // Custom cell renderer
}

interface TableAction<T> {
  name: string;                   // Action name
  label: string;                  // Action button label
  icon?: ReactNode;              // Action icon
  onClick: (row: T) => void;     // Action handler
  disabled?: (row: T) => boolean; // Disable condition
}
```

### Usage Examples

#### Basic Table
```tsx
import { BaseTable } from '@/components/ui/Table';

function BasicTable() {
  const columns = [
    { field: 'id', headerName: 'ID' },
    { field: 'name', headerName: 'Name', sortable: true },
    { field: 'status', headerName: 'Status' },
  ];

  const data = [
    { id: '1', name: 'Item 1', status: 'active' },
    { id: '2', name: 'Item 2', status: 'inactive' },
  ];

  return (
    <BaseTable
      columns={columns}
      data={data}
    />
  );
}
```

#### Table with Sorting and Pagination
```tsx
function SortableTable() {
  const [sortModel, setSortModel] = useState<SortModel | null>(null);
  const [page, setPage] = useState(0);
  const [data, setData] = useState<Data[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchData({ page, sortModel });
  }, [page, sortModel]);

  return (
    <BaseTable
      columns={columns}
      data={data}
      pagination
      page={page}
      pageSize={10}
      totalCount={totalCount}
      sortModel={sortModel}
      onSort={setSortModel}
      onPageChange={setPage}
    />
  );
}
```

### Customization Options

#### Custom Cell Renderer
```tsx
const columns = [
  {
    field: 'status',
    headerName: 'Status',
    renderCell: (value: string) => (
      <Chip
        label={value}
        color={value === 'active' ? 'success' : 'default'}
      />
    ),
  },
  {
    field: 'actions',
    headerName: 'Actions',
    renderCell: (_, row) => (
      <ButtonGroup>
        <IconButton onClick={() => handleEdit(row)}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => handleDelete(row)}>
          <DeleteIcon />
        </IconButton>
      </ButtonGroup>
    ),
  },
];
```

#### Styled Table
```tsx
import { styled } from '@mui/material/styles';

const StyledTable = styled(BaseTable)(({ theme }) => ({
  '& .MuiTableCell-head': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  '& .MuiTableRow-root:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover,
  },
}));
```

### Best Practices

1. **Data Loading**
```tsx
function LoadingTable() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchTableData();
      setData(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseTable
      columns={columns}
      data={data}
      loading={loading}
      error={error}
    />
  );
}
```

2. **Selection Management**
```tsx
function SelectableTable() {
  const [selected, setSelected] = useState<string[]>([]);

  const handleSelectionChange = (selectedIds: string[]) => {
    setSelected(selectedIds);
    // Update parent component or trigger actions
  };

  return (
    <>
      <TableToolbar
        selectedCount={selected.length}
        onDelete={() => handleBulkDelete(selected)}
      />
      <BaseTable
        columns={columns}
        data={data}
        selectable
        onSelectionChange={handleSelectionChange}
      />
    </>
  );
}
```

3. **Row Actions**
```tsx
function TableWithActions() {
  const actions: TableAction[] = [
    {
      name: 'edit',
      label: 'Edit',
      icon: <EditIcon />,
      onClick: handleEdit,
      disabled: (row) => row.status === 'locked',
    },
    {
      name: 'delete',
      label: 'Delete',
      icon: <DeleteIcon />,
      onClick: handleDelete,
      disabled: (row) => !row.isDeletable,
    },
  ];

  return (
    <BaseTable
      columns={columns}
      data={data}
      actions={actions}
    />
  );
}
```

### Common Pitfalls

1. **Performance**
   - Use virtualization for large datasets
   - Implement server-side sorting/filtering
   - Optimize render cycles

2. **Data Updates**
   - Handle optimistic updates
   - Manage concurrent modifications
   - Implement proper error recovery

3. **Selection State**
   - Clear selection on page change
   - Handle partial selection
   - Sync selection with external state

### Advanced Usage

#### Virtual Scrolling
```tsx
function VirtualizedTable() {
  return (
    <BaseTable
      columns={columns}
      data={data}
      virtualization={{
        enabled: true,
        rowHeight: 52,
        overscan: 10,
      }}
    />
  );
}
```

#### Custom Filtering
```tsx
function FilterableTable() {
  const [filters, setFilters] = useState<Record<string, any>>({});

  const columns = [
    {
      field: 'status',
      headerName: 'Status',
      filterable: true,
      filterComponent: (props) => (
        <Select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          options={statusOptions}
        />
      ),
    },
  ];

  return (
    <BaseTable
      columns={columns}
      data={data}
      filters={filters}
      onFilterChange={setFilters}
    />
  );
}
```

### Integration Examples

#### Table with Toolbar
```tsx
function TableWithToolbar() {
  const [selected, setSelected] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div>
      <TableToolbar
        selectedCount={selected.length}
        onDelete={() => handleBulkDelete(selected)}
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
        actions={[
          <Button
            startIcon={<AddIcon />}
            onClick={handleAdd}
          >
            Add New
          </Button>,
        ]}
      />
      <BaseTable
        columns={columns}
        data={data}
        selectable
        onSelectionChange={setSelected}
      />
    </div>
  );
}
```

#### Table in Card
```tsx
function TableCard() {
  return (
    <Card>
      <CardHeader
        title="Data Table"
        action={
          <IconButton onClick={handleRefresh}>
            <RefreshIcon />
          </IconButton>
        }
      />
      <CardContent>
        <BaseTable
          columns={columns}
          data={data}
          pagination
        />
      </CardContent>
    </Card>
  );
}
```

#### Export Functionality
```tsx
function ExportableTable() {
  const handleExport = async (format: 'csv' | 'excel') => {
    const exportData = data.map(row => ({
      Name: row.name,
      Status: row.status,
      // Map other fields
    }));

    if (format === 'csv') {
      await exportToCsv(exportData);
    } else {
      await exportToExcel(exportData);
    }
  };

  return (
    <>
      <TableToolbar
        actions={[
          <Button onClick={() => handleExport('csv')}>
            Export CSV
          </Button>,
          <Button onClick={() => handleExport('excel')}>
            Export Excel
          </Button>,
        ]}
      />
      <BaseTable
        columns={columns}
        data={data}
      />
    </>
  );
}
```
