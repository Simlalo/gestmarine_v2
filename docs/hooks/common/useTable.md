# useTable Hook

## Overview
The `useTable` hook provides comprehensive table management functionality for React applications, handling sorting, filtering, pagination, and row selection.

- **Purpose**: Manage complex table state and operations
- **Key Features**:
  - Row selection (single/multiple)
  - Sorting capabilities
  - Filtering
  - Pagination
  - Type-safe implementation

## API Reference

### Input Parameters
```typescript
interface UseTableOptions<T> {
  data: T[];                          // Table data
  getRowId: (row: T) => string;      // Function to get unique row identifier
  defaultSort?: SortModel;           // Initial sort configuration
  defaultPageSize?: number;          // Initial page size
}

interface SortModel {
  field: string;
  direction: 'asc' | 'desc';
}
```

### Return Values
```typescript
interface UseTableReturn<T> {
  // Data
  rows: T[];                         // Current visible rows
  selectedRows: T[];                 // Selected rows
  
  // Selection
  selectedIds: string[];            // Selected row IDs
  setSelectedIds: (ids: string[]) => void;
  toggleSelection: (id: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  
  // Sorting
  sortModel: SortModel | null;
  setSortModel: (model: SortModel | null) => void;
  
  // Pagination
  page: number;
  pageSize: number;
  totalRows: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
}
```

### Examples

```typescript
// Basic Usage
const MyTable = () => {
  const table = useTable({
    data: myData,
    getRowId: (row) => row.id,
  });

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>
            <Checkbox
              checked={table.selectedIds.length === table.rows.length}
              onChange={table.selectAll}
            />
          </TableCell>
          <TableCell
            onClick={() => table.setSortModel({ field: 'name', direction: 'asc' })}
          >
            Name
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {table.rows.map((row) => (
          <TableRow
            key={row.id}
            selected={table.selectedIds.includes(row.id)}
          >
            <TableCell>
              <Checkbox
                checked={table.selectedIds.includes(row.id)}
                onChange={() => table.toggleSelection(row.id)}
              />
            </TableCell>
            <TableCell>{row.name}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
```

## Implementation Details

### Core Functionality
- Row selection management
- Sorting implementation
- Pagination handling
- Data filtering
- Memoized computations

### State Management
```typescript
interface TableState {
  selectedIds: string[];
  sortModel: SortModel | null;
  page: number;
  pageSize: number;
}
```

### Performance Considerations
- Memoized row calculations
- Efficient selection handling
- Optimized sorting algorithms
- Pagination performance
- Type-safe operations

### Error Handling
- Invalid sort field validation
- Page bounds checking
- Selection state validation
- Type checking

## Best Practices

### Recommended Usage
1. Initialize with proper types:
   ```typescript
   interface TableData {
     id: string;
     name: string;
     // other fields
   }
   
   const table = useTable<TableData>({
     data: tableData,
     getRowId: (row) => row.id,
   });
   ```

2. Implement sorting:
   ```typescript
   <TableCell
     onClick={() => table.setSortModel({
       field: 'name',
       direction: table.sortModel?.direction === 'asc' ? 'desc' : 'asc'
     })}
   >
     Name {table.sortModel?.field === 'name' && (
       table.sortModel.direction === 'asc' ? '↑' : '↓'
     )}
   </TableCell>
   ```

3. Handle selection:
   ```typescript
   const handleBulkAction = () => {
     const selectedRows = table.selectedRows;
     // Process selected rows
   };
   ```

### Common Pitfalls
- Not memoizing row data transformations
- Inefficient selection handling
- Incorrect sort field names
- Missing key props in mapped elements

### Tips and Tricks
1. Custom row selection:
   ```typescript
   const handleRowClick = (row: TableData) => {
     if (event.ctrlKey) {
       table.toggleSelection(row.id);
     } else {
       table.setSelectedIds([row.id]);
     }
   };
   ```

2. Controlled pagination:
   ```typescript
   const handlePageChange = (newPage: number) => {
     if (newPage >= 0 && newPage < table.totalPages) {
       table.setPage(newPage);
     }
   };
   ```

3. Custom sorting:
   ```typescript
   const customSort = (a: TableData, b: TableData) => {
     if (table.sortModel?.field === 'custom') {
       // Custom sorting logic
       return customCompare(a, b);
     }
     return defaultSort(a, b);
   };
   ```
