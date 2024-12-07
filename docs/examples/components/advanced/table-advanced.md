# Advanced Table Examples

## Server-Side Operations

### Server-Side Pagination and Sorting
```tsx
interface ServerTableState {
  page: number;
  pageSize: number;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  totalRows: number;
}

const ServerSideTable = () => {
  const [state, setState] = useState<ServerTableState>({
    page: 1,
    pageSize: 10,
    totalRows: 0
  });
  
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.fetchTableData({
        page: state.page,
        pageSize: state.pageSize,
        sortBy: state.sortField,
        sortDirection: state.sortDirection
      });
      
      setData(response.data);
      setState(prev => ({
        ...prev,
        totalRows: response.total
      }));
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }, [state.page, state.pageSize, state.sortField, state.sortDirection]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const table = useTable({
    data,
    pagination: {
      page: state.page,
      pageSize: state.pageSize,
      totalRows: state.totalRows,
      onPageChange: (page) => setState(prev => ({ ...prev, page })),
      onPageSizeChange: (pageSize) => setState(prev => ({ ...prev, pageSize, page: 1 }))
    },
    sorting: {
      sortField: state.sortField,
      sortDirection: state.sortDirection,
      onSort: (field, direction) => setState(prev => ({
        ...prev,
        sortField: field,
        sortDirection: direction
      }))
    }
  });

  return (
    <>
      {loading && <LinearProgress />}
      <Table>
        <TableHead>
          <TableRow>
            {columns.map(column => (
              <TableCell
                key={column.field}
                onClick={() => table.handleSort(column.field)}
              >
                {column.label}
                {table.sortField === column.field && (
                  <SortIcon direction={table.sortDirection} />
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {table.rows.map(row => (
            <TableRow key={row.id}>
              {columns.map(column => (
                <TableCell key={column.field}>
                  {row[column.field]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <TablePagination
        component="div"
        count={state.totalRows}
        page={state.page - 1}
        rowsPerPage={state.pageSize}
        onPageChange={(_, page) => table.handlePageChange(page + 1)}
        onRowsPerPageChange={(e) => table.handlePageSizeChange(parseInt(e.target.value, 10))}
      />
    </>
  );
};
```

## Advanced Filtering

### Complex Filter System
```tsx
interface FilterConfig {
  field: string;
  type: 'text' | 'number' | 'select' | 'date' | 'boolean';
  label: string;
  options?: Array<{ label: string; value: any }>;
}

interface FilterState {
  [key: string]: {
    value: any;
    operator: 'equals' | 'contains' | 'gt' | 'lt' | 'between';
  };
}

const AdvancedFilterTable = () => {
  const [filters, setFilters] = useState<FilterState>({});
  
  const filterConfig: FilterConfig[] = [
    { field: 'name', type: 'text', label: 'Name' },
    { 
      field: 'status',
      type: 'select',
      label: 'Status',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' }
      ]
    },
    { field: 'createdAt', type: 'date', label: 'Created Date' }
  ];

  const table = useTable({
    data,
    filter: {
      filters,
      filterFn: (row, filters) => {
        return Object.entries(filters).every(([field, config]) => {
          const value = row[field];
          const filterValue = config.value;
          
          switch (config.operator) {
            case 'contains':
              return value.toLowerCase().includes(filterValue.toLowerCase());
            case 'equals':
              return value === filterValue;
            case 'gt':
              return value > filterValue;
            case 'lt':
              return value < filterValue;
            case 'between':
              return value >= filterValue[0] && value <= filterValue[1];
            default:
              return true;
          }
        });
      }
    }
  });

  const handleFilterChange = (field: string, value: any, operator: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: { value, operator }
    }));
  };

  return (
    <>
      <FilterPanel>
        {filterConfig.map(config => (
          <FilterField
            key={config.field}
            config={config}
            value={filters[config.field]?.value}
            operator={filters[config.field]?.operator}
            onChange={handleFilterChange}
          />
        ))}
      </FilterPanel>
      
      <Table>
        {/* Table implementation */}
      </Table>
    </>
  );
};
```

## Editable Table

### Inline Editing
```tsx
interface EditableCell {
  row: any;
  field: string;
  value: any;
  onSave: (value: any) => Promise<void>;
}

const EditableCell: React.FC<EditableCell> = ({
  row,
  field,
  value: initialValue,
  onSave
}) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  
  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(value);
      setEditing(false);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setLoading(false);
    }
  };

  if (editing) {
    return (
      <TableCell>
        <TextField
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleSave}
          disabled={loading}
        />
      </TableCell>
    );
  }

  return (
    <TableCell onClick={() => setEditing(true)}>
      {value}
    </TableCell>
  );
};

const EditableTable = () => {
  const handleCellSave = async (row: any, field: string, value: any) => {
    await api.updateRecord(row.id, { [field]: value });
  };

  return (
    <Table>
      <TableBody>
        {rows.map(row => (
          <TableRow key={row.id}>
            {columns.map(column => (
              <EditableCell
                key={column.field}
                row={row}
                field={column.field}
                value={row[column.field]}
                onSave={(value) => handleCellSave(row, column.field, value)}
              />
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
```

## Advanced Selection

### Multi-Level Selection
```tsx
interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
}

const TreeTable = () => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  
  const isSelected = (nodeId: string) => selected.has(nodeId);
  
  const isIndeterminate = (node: TreeNode) => {
    if (!node.children) return false;
    
    const childIds = getAllChildIds(node);
    const selectedChildren = Array.from(selected)
      .filter(id => childIds.includes(id));
    
    return selectedChildren.length > 0 && 
           selectedChildren.length < childIds.length;
  };
  
  const handleSelect = (node: TreeNode) => {
    const newSelected = new Set(selected);
    const childIds = getAllChildIds(node);
    
    if (isSelected(node.id)) {
      // Deselect node and all children
      [node.id, ...childIds].forEach(id => newSelected.delete(id));
    } else {
      // Select node and all children
      [node.id, ...childIds].forEach(id => newSelected.add(id));
    }
    
    setSelected(newSelected);
  };

  const renderTreeNode = (node: TreeNode, level: number = 0) => (
    <>
      <TableRow>
        <TableCell style={{ paddingLeft: level * 20 }}>
          <Checkbox
            checked={isSelected(node.id)}
            indeterminate={isIndeterminate(node)}
            onChange={() => handleSelect(node)}
          />
          {node.name}
        </TableCell>
      </TableRow>
      {node.children?.map(child => renderTreeNode(child, level + 1))}
    </>
  );

  return (
    <Table>
      <TableBody>
        {data.map(node => renderTreeNode(node))}
      </TableBody>
    </Table>
  );
};
```

## Best Practices and Tips

### 1. Performance Optimization
```tsx
// Virtual scrolling for large datasets
const VirtualizedTable = () => {
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollElementRef.current,
    estimateSize: () => 50, // row height
    overscan: 5
  });

  return (
    <div ref={scrollElementRef} style={{ height: '400px', overflow: 'auto' }}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative'
        }}
      >
        {virtualizer.getVirtualItems().map(virtualRow => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`
            }}
          >
            <TableRow data={rows[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  );
};
```

### 2. Error Handling
```tsx
const TableWithErrorBoundary = () => {
  return (
    <ErrorBoundary
      fallback={({ error, resetErrorBoundary }) => (
        <TableErrorDisplay
          error={error}
          onRetry={resetErrorBoundary}
        />
      )}
    >
      <ComplexTable />
    </ErrorBoundary>
  );
};
```

### 3. Testing Considerations
```tsx
describe('Advanced Table', () => {
  it('should handle server-side operations', async () => {
    const mockData = generateMockData();
    server.use(
      rest.get('/api/data', (req, res, ctx) => {
        const page = parseInt(req.url.searchParams.get('page') || '1');
        const pageSize = parseInt(req.url.searchParams.get('pageSize') || '10');
        return res(ctx.json({
          data: mockData.slice((page - 1) * pageSize, page * pageSize),
          total: mockData.length
        }));
      })
    );

    const { getByText, findByText } = render(<ServerSideTable />);
    
    // Wait for initial load
    expect(await findByText(mockData[0].name)).toBeInTheDocument();
    
    // Test pagination
    fireEvent.click(getByText('Next'));
    expect(await findByText(mockData[10].name)).toBeInTheDocument();
  });
});
