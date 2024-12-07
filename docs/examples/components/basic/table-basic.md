# Table Component Examples

## Basic Implementation

### Simple Table
```tsx
import { useTable } from '@/hooks/common/useTable';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';

interface User {
  id: string;
  name: string;
  email: string;
}

const SimpleTable = () => {
  const table = useTable<User>({
    data: [
      { id: '1', name: 'John Doe', email: 'john@example.com' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com' }
    ]
  });

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Email</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {table.rows.map((row) => (
          <TableRow key={row.id}>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.email}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
```

### Sortable Table
```tsx
const SortableTable = () => {
  const table = useTable<User>({
    data: users,
    sortable: true,
    defaultSort: {
      field: 'name',
      direction: 'asc'
    }
  });

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell onClick={() => table.handleSort('name')}>
            Name {table.sortField === 'name' && (
              table.sortDirection === 'asc' ? '↑' : '↓'
            )}
          </TableCell>
          <TableCell onClick={() => table.handleSort('email')}>
            Email {table.sortField === 'email' && (
              table.sortDirection === 'asc' ? '↑' : '↓'
            )}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {table.rows.map((row) => (
          <TableRow key={row.id}>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.email}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
```

### Table with Pagination
```tsx
const PaginatedTable = () => {
  const table = useTable<User>({
    data: users,
    pagination: {
      pageSize: 10,
      defaultPage: 1
    }
  });

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {table.paginatedRows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <TablePagination
        component="div"
        count={table.totalRows}
        page={table.page - 1}
        rowsPerPage={table.pageSize}
        onPageChange={(_, page) => table.setPage(page + 1)}
        onRowsPerPageChange={(event) => {
          table.setPageSize(parseInt(event.target.value, 10));
          table.setPage(1);
        }}
      />
    </>
  );
};
```

## Common Use Cases

### Table with Selection
```tsx
const SelectableTable = () => {
  const table = useTable<User>({
    data: users,
    selection: {
      enabled: true,
      type: 'multiple'
    }
  });

  return (
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
          <TableCell>Email</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {table.rows.map((row) => (
          <TableRow key={row.id}>
            <TableCell padding="checkbox">
              <Checkbox
                checked={table.isSelected(row.id)}
                onChange={() => table.handleSelect(row.id)}
              />
            </TableCell>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.email}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
```

### Table with Filtering
```tsx
const FilterableTable = () => {
  const table = useTable<User>({
    data: users,
    filter: {
      enabled: true,
      defaultFilters: {}
    }
  });

  return (
    <>
      <TextField
        label="Search"
        value={table.filters.search || ''}
        onChange={(e) => table.setFilter('search', e.target.value)}
      />
      
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {table.filteredRows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
```

## Tips and Best Practices

### 1. Performance Optimization
```tsx
// Good Practice
const OptimizedTable = () => {
  const table = useTable<User>({
    data: users,
    // Memoize filter function for better performance
    filterFn: useCallback((row, filters) => {
      if (!filters.search) return true;
      return row.name.toLowerCase().includes(filters.search.toLowerCase());
    }, [])
  });

  // Memoize row rendering for large datasets
  const renderRow = useCallback((row: User) => (
    <TableRow key={row.id}>
      <TableCell>{row.name}</TableCell>
      <TableCell>{row.email}</TableCell>
    </TableRow>
  ), []);

  return (
    <Table>
      {/* Table implementation */}
    </Table>
  );
};
```

### 2. Error Handling
```tsx
const TableWithErrorHandling = () => {
  const table = useTable<User>({
    data: users,
    onError: (error) => {
      console.error('Table error:', error);
      // Handle error appropriately
    }
  });

  if (table.error) {
    return <ErrorDisplay error={table.error} />;
  }

  return (
    <Table>
      {/* Table implementation */}
    </Table>
  );
};
```

### 3. Loading States
```tsx
const TableWithLoading = () => {
  const table = useTable<User>({
    data: users,
    loading: isLoading
  });

  return (
    <>
      {table.loading ? (
        <TableSkeleton />
      ) : (
        <Table>
          {/* Table implementation */}
        </Table>
      )}
    </>
  );
};
```

### 4. Common Pitfalls to Avoid
- Don't mutate table data directly
- Implement proper error boundaries
- Handle empty states appropriately
- Consider mobile responsiveness
- Optimize for large datasets

### 5. Testing Considerations
```tsx
describe('Table Component', () => {
  it('should handle sorting correctly', () => {
    const { getByText } = render(<MyTable data={testData} />);
    
    fireEvent.click(getByText('Name'));
    
    // Verify sort order
    const cells = screen.getAllByRole('cell');
    expect(cells[0]).toHaveTextContent('Alice');
    expect(cells[2]).toHaveTextContent('Bob');
  });
  
  it('should handle pagination correctly', () => {
    const { getByLabelText } = render(
      <MyTable data={testData} />
    );
    
    fireEvent.click(getByLabelText('Next page'));
    
    // Verify page content
    expect(screen.getByText('Page 2')).toBeInTheDocument();
  });
});
